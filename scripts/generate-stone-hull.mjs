/**
 * Bakes convex hulls and resting framing into src/data/stone-hull.ts,
 * and the matching stage aspect into src/styles/stone.generated.css.
 *
 * The hull lets StoneHero re-fit the camera every frame from ~1–2k points
 * instead of the full mesh, so the stone fills the frame at whatever pose it
 * is actually in rather than reserving room for its worst pose.
 *
 * Stage aspect is solved from the *rough* stone so the name/quote lockup does
 * not jump when the polished mesh swaps in. The polished stone gets its own
 * hull and centering offset, fitted inside that same stage box.
 *
 * Run with: npm run stone:hull
 */
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull.js';
import {
  fitCamera,
  fitDistance,
  normalize,
  poseMatrix,
  projectedBounds,
  readGlbVertices,
} from './stone-geometry.mjs';

// Pose: a fixed 28deg clockwise tilt, spun about Y as the page scrolls.
// Rest yaw is 180deg so the far side of the stone faces the camera first.
const TILT_DEG = -28;
const TILT_RAD = THREE.MathUtils.degToRad(TILT_DEG);
const REST_YAW = Math.PI;
const SPIN_RAD = Math.PI * 1.15;
const FOV = 34;
const MARGIN = 1.02;
const TAN_V = Math.tan(((FOV * Math.PI) / 180) / 2);

function hullFrom(points) {
  const hull = new ConvexHull().setFromPoints(points);
  const seen = new Set();
  const hullPoints = [];
  for (const face of hull.faces) {
    let edge = face.edge;
    do {
      const p = edge.head().point;
      if (!seen.has(p)) {
        seen.add(p);
        hullPoints.push(p.clone());
      }
      edge = edge.next;
    } while (edge !== face.edge);
  }
  return thinHull(hullPoints);
}

/**
 * A near-convex tumble can produce tens of thousands of hull verts. Keep the
 * farthest point from the origin in each grid cell so the envelope stays
 * conservative enough for the camera fit, without shipping a 600kb data file.
 */
function thinHull(points, cell = 0.04, limit = 2200) {
  if (points.length <= limit) return points;
  const buckets = new Map();
  for (const p of points) {
    const key = `${Math.round(p.x / cell)}|${Math.round(p.y / cell)}|${Math.round(p.z / cell)}`;
    const prev = buckets.get(key);
    if (!prev || p.lengthSq() > prev.lengthSq()) buckets.set(key, p);
  }
  const thinned = [...buckets.values()];
  return thinned.length <= limit ? thinned : thinHull(thinned, cell * 1.35, limit);
}

function restCloudOf(hullPoints) {
  const rest = poseMatrix(REST_YAW, TILT_RAD);
  return hullPoints.map((p) => p.clone().applyMatrix4(rest));
}

function frame(cloud, aspect, offX, offY) {
  const d = fitDistance(cloud, { aspect, fov: FOV, margin: MARGIN, offX, offY });
  return { d, bounds: projectedBounds(cloud, fitCamera(FOV, aspect, d), offX, offY) };
}

function flatten(hullPoints) {
  return hullPoints.flatMap((p) => [p.x, p.y, p.z].map((n) => Number(n.toFixed(4))));
}

/**
 * Solve stage aspect + centering offset so the resting silhouette touches all
 * four edges. Used only for the rough stone — that ratio is the page layout.
 */
function solveStage(hullPoints) {
  const cloud = restCloudOf(hullPoints);
  let aspect = 0.75;
  let offX = 0;
  let offY = 0;
  let converged = false;
  for (let i = 0; i < 200 && !converged; i += 1) {
    const before = aspect;
    const { d, bounds } = frame(cloud, aspect, offX, offY);
    offX -= ((bounds.x0 + bounds.x1) / 2) * d * TAN_V * aspect;
    offY -= ((bounds.y0 + bounds.y1) / 2) * d * TAN_V;
    const centred = frame(cloud, aspect, offX, offY).bounds;
    aspect *= (centred.x1 - centred.x0) / (centred.y1 - centred.y0);
    converged = Math.abs(aspect - before) < 1e-9;
  }
  if (!converged) throw new Error('stage aspect did not converge in 200 iterations');
  return { aspect, offX, offY, bounds: frame(cloud, aspect, offX, offY).bounds };
}

/** Centre a silhouette inside an already-chosen stage aspect. */
function solveOffset(hullPoints, aspect) {
  const cloud = restCloudOf(hullPoints);
  let offX = 0;
  let offY = 0;
  for (let i = 0; i < 200; i += 1) {
    const { d, bounds } = frame(cloud, aspect, offX, offY);
    const dx = ((bounds.x0 + bounds.x1) / 2) * d * TAN_V * aspect;
    const dy = ((bounds.y0 + bounds.y1) / 2) * d * TAN_V;
    offX -= dx;
    offY -= dy;
    if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) break;
  }
  return { offX, offY, bounds: frame(cloud, aspect, offX, offY).bounds };
}

function report(label, verts, hullCount, bounds) {
  console.log(
    `${label}: vertices ${verts} -> hull ${hullCount}  ` +
      `fills ${(((bounds.x1 - bounds.x0) / 2) * 100).toFixed(1)}% x ` +
      `${(((bounds.y1 - bounds.y0) / 2) * 100).toFixed(1)}% of frame`,
  );
}

const bOnly = process.argv.includes('--b-only');
const keepAspect = process.argv.includes('--keep-aspect');
let stageAspect;

if (bOnly) {
  ({ STONE_ASPECT: stageAspect } = await import('../src/data/stone-hull.ts'));
  console.log(`b-only: using existing rest aspect ${stageAspect.toFixed(5)}`);
} else {
  const { STONE_ASPECT: existingAspect } = keepAspect
    ? await import('../src/data/stone-hull.ts')
    : { STONE_ASPECT: null };
  const roughRaw = await readGlbVertices(new URL('../public/models/stone.glb', import.meta.url));
  const roughHull = hullFrom(normalize(roughRaw));
  const stage = keepAspect
    ? { aspect: existingAspect, ...solveOffset(roughHull, existingAspect) }
    : solveStage(roughHull);
  stageAspect = stage.aspect;
  report('rough', roughRaw.length, roughHull.length, stage.bounds);
  console.log(`rest aspect ${stage.aspect.toFixed(5)}${keepAspect ? ' (kept)' : ''}`);

  const polishedRaw = await readGlbVertices(
    new URL('../public/models/stone-polished.glb', import.meta.url),
  );
  const polishedHull = hullFrom(normalize(polishedRaw));
  const polished = solveOffset(polishedHull, stage.aspect);
  report('polished', polishedRaw.length, polishedHull.length, polished.bounds);

  writeFileSync(
    new URL('../src/data/stone-hull.ts', import.meta.url),
    `// Generated by scripts/generate-stone-hull.mjs — do not edit by hand.
// Run \`npm run stone:hull\` after changing the model or the resting pose.

/** Fixed clockwise tilt, in degrees. */
export const STONE_TILT_DEG = ${TILT_DEG};

/** Resting yaw, in radians. π shows the far side of the stone first. */
export const STONE_REST_YAW = ${REST_YAW};

/** How far the stone spins about Y across a full page scroll, in radians. */
export const STONE_SPIN_RAD = ${SPIN_RAD};

/** Camera field of view the framing was solved for. */
export const STONE_FOV = ${FOV};

/** Safety margin applied to the fitted camera distance. */
export const STONE_FIT_MARGIN = ${MARGIN};

/**
 * Stage aspect ratio (w / h) at which the resting *rough* stone touches all
 * four edges, so the stage box and the stone's silhouette coincide. Emitted
 * to CSS as --stone-ratio in src/styles/stone.generated.css. Locked to the
 * rough mesh so the name/quote lockup does not jump on polish.
 */
export const STONE_ASPECT = ${stage.aspect.toFixed(5)};

/** World-space offset applied after rotation to centre the resting silhouette. */
export const STONE_OFFSET: readonly [number, number] = [${stage.offX.toFixed(5)}, ${stage.offY.toFixed(5)}];

/** Convex hull of the normalised rough model, as flat xyz triples. */
export const STONE_HULL: readonly number[] = ${JSON.stringify(flatten(roughHull))};

/** Centering offset for the polished stone inside the rough stage box. */
export const STONE_OFFSET_POLISHED: readonly [number, number] = [${polished.offX.toFixed(5)}, ${polished.offY.toFixed(5)}];

/** Convex hull of the normalised polished model, as flat xyz triples. */
export const STONE_HULL_POLISHED: readonly number[] = ${JSON.stringify(flatten(polishedHull))};
`,
  );

  writeFileSync(
    new URL('../src/styles/stone.generated.css', import.meta.url),
    `/* Generated by scripts/generate-stone-hull.mjs — do not edit by hand. */
:root {
  /*
   * Aspect ratio at which the resting rough stone touches all four edges of
   * its stage, so the stage box and the stone's silhouette coincide and the
   * hero name and quote align to the stone itself rather than to empty space.
   */
  --stone-ratio: ${stage.aspect.toFixed(5)};
}
`,
  );

  console.log('wrote src/data/stone-hull.ts and src/styles/stone.generated.css');
}

const roughBUrl = new URL('../public/models/stone-b.glb', import.meta.url);
const polishedBUrl = new URL('../public/models/stone-polished-b.glb', import.meta.url);

if (existsSync(fileURLToPath(roughBUrl)) && existsSync(fileURLToPath(polishedBUrl))) {
  const roughBRaw = await readGlbVertices(roughBUrl);
  const roughBHull = hullFrom(normalize(roughBRaw));
  const roughB = solveOffset(roughBHull, stageAspect);
  report('rough-b', roughBRaw.length, roughBHull.length, roughB.bounds);

  const polishedBRaw = await readGlbVertices(polishedBUrl);
  const polishedBHull = hullFrom(normalize(polishedBRaw));
  const polishedB = solveOffset(polishedBHull, stageAspect);
  report('polished-b', polishedBRaw.length, polishedBHull.length, polishedB.bounds);

  writeFileSync(
    new URL('../src/data/stone-hull-b.ts', import.meta.url),
    `// Generated by scripts/generate-stone-hull.mjs — do not edit by hand.
// Alternate Meshy pair, fitted inside the current rough stage box.
// Dark marble pair. Default on aa; Lunar Granite is the bb set.

/** Centering offset for the B rough stone inside the current stage box. */
export const STONE_OFFSET_B: readonly [number, number] = [${roughB.offX.toFixed(5)}, ${roughB.offY.toFixed(5)}];

/** Convex hull of the normalised B rough model, as flat xyz triples. */
export const STONE_HULL_B: readonly number[] = ${JSON.stringify(flatten(roughBHull))};

/** Centering offset for the B polished stone inside the current stage box. */
export const STONE_OFFSET_POLISHED_B: readonly [number, number] = [${polishedB.offX.toFixed(5)}, ${polishedB.offY.toFixed(5)}];

/** Convex hull of the normalised B polished model, as flat xyz triples. */
export const STONE_HULL_POLISHED_B: readonly number[] = ${JSON.stringify(flatten(polishedBHull))};
`,
  );

  console.log('wrote src/data/stone-hull-b.ts');
}
