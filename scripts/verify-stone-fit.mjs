/**
 * Proves the hero stone can never be cropped and reports how big it renders.
 *
 * Reproduces StoneHero's per-frame camera fit — which is solved from the baked
 * convex hull — then projects all ~193k real vertices through it at every pose.
 * Any |NDC| > 1 would mean a clipped stone. The duplication with StoneHero.tsx
 * is deliberate: an independent implementation is what makes this a check.
 *
 * Run with: npm run stone:verify
 */
import * as THREE from 'three';
import {
  fitCamera,
  fitDistance,
  normalize,
  poseMatrix,
  projectedBounds,
  readGlbVertices,
} from './stone-geometry.mjs';
import {
  STONE_ASPECT,
  STONE_FIT_MARGIN,
  STONE_FOV,
  STONE_HULL,
  STONE_OFFSET,
  STONE_SPIN_RAD,
  STONE_TILT_DEG,
} from '../src/data/stone-hull.ts';

const TILT_RAD = THREE.MathUtils.degToRad(STONE_TILT_DEG);
const [OFF_X, OFF_Y] = STONE_OFFSET;

const hull = [];
for (let i = 0; i < STONE_HULL.length; i += 3) {
  hull.push(new THREE.Vector3(STONE_HULL[i], STONE_HULL[i + 1], STONE_HULL[i + 2]));
}

const mesh = normalize(await readGlbVertices(new URL('../public/models/stone.glb', import.meta.url)));

console.log(
  `tilt ${STONE_TILT_DEG}deg  spin ${((STONE_SPIN_RAD * 180) / Math.PI).toFixed(0)}deg  ` +
    `hull ${hull.length} pts  mesh ${mesh.length} verts`,
);
console.log('');

const YAW_SAMPLES = 64;

/**
 * Sweeps the full spin at one stage aspect, projecting every mesh vertex.
 * Returns the worst |NDC| seen and the resting silhouette's NDC bounds.
 */
function sweep(aspect) {
  let maxNdc = 0;
  let rest = null;

  for (let i = 0; i <= YAW_SAMPLES; i += 1) {
    const yaw = (i / YAW_SAMPLES) * STONE_SPIN_RAD;
    const pose = poseMatrix(yaw, TILT_RAD);
    const posedHull = hull.map((p) => p.clone().applyMatrix4(pose));
    const distance = fitDistance(posedHull, {
      aspect,
      fov: STONE_FOV,
      margin: STONE_FIT_MARGIN,
      offX: OFF_X,
      offY: OFF_Y,
    });

    const camera = fitCamera(STONE_FOV, aspect, distance);
    const v = new THREE.Vector3();
    for (const p of mesh) {
      v.copy(p).applyMatrix4(pose);
      v.set(v.x + OFF_X, v.y + OFF_Y, v.z).project(camera);
      maxNdc = Math.max(maxNdc, Math.abs(v.x), Math.abs(v.y));
    }

    if (i === 0) {
      const posedMesh = mesh.map((p) => p.clone().applyMatrix4(pose));
      rest = projectedBounds(posedMesh, camera, OFF_X, OFF_Y);
    }
  }

  return { maxNdc, rest };
}

/*
 * The stage always holds --stone-ratio, so there is only one aspect to prove.
 * The neighbours cover the sub-pixel drift from rounding the stage box to
 * whole device pixels, which is the only way the real canvas can deviate.
 */
const aspects = [STONE_ASPECT * 0.99, STONE_ASPECT, STONE_ASPECT * 1.01];
let worstNdc = 0;
let restBounds = null;

for (const aspect of aspects) {
  const { maxNdc, rest } = sweep(aspect);
  if (aspect === STONE_ASPECT) restBounds = rest;
  worstNdc = Math.max(worstNdc, maxNdc);
  console.log(
    `aspect ${aspect.toFixed(5)}  maxNDC ${maxNdc.toFixed(4)}  ${maxNdc <= 1 ? 'fits' : 'CROPPED'}`,
  );
}
console.log('');

/*
 * Size report only — these mirror the clamps in src/styles/global.css. They do
 * not affect the crop proof above, which is aspect-driven and viewport-free.
 */
const rem = 16;
const viewports = [
  [1920, 1080], [1728, 1117], [1512, 982], [1440, 900],
  [1280, 800], [1180, 820], [1024, 768], [960, 1080], [1440, 700],
  [900, 900], [900, 500],
  [820, 1180], [768, 1024], [430, 932], [390, 844], [375, 667], [320, 568],
];

for (const [vw, vh] of viewports) {
  const shell = Math.min(vw - Math.min(Math.max(2 * rem, 0.132 * vw), 8.5 * rem), 90 * rem);
  const sideW = Math.min(Math.max(11 * rem, 0.2 * vw), 22.5 * rem);
  const gutter = Math.min(Math.max(1.25 * rem, 0.025 * vw), 3 * rem);
  const maxH = Math.max(12 * rem, vh - 18 * rem);
  const scale = 1.15; // --stone-scale in global.css

  const fitW = vw >= 900 ? Math.max(12 * rem, shell - 2 * (sideW + gutter)) : shell;
  const stoneW = Math.min(fitW, maxH * STONE_ASPECT) * scale;
  const stoneH = stoneW / STONE_ASPECT;
  const restW = ((restBounds.x1 - restBounds.x0) / 2) * stoneW;
  const restH = ((restBounds.y1 - restBounds.y0) / 2) * stoneH;

  console.log(
    `${String(vw).padStart(4)}x${String(vh).padEnd(5)} stage ${String(Math.round(stoneW)).padStart(4)}x${String(Math.round(stoneH)).padEnd(4)}` +
      `  stone ${String(Math.round(restW)).padStart(4)}x${String(Math.round(restH)).padEnd(4)}px` +
      ` = ${String(Math.round((restW / vh) * 100)).padStart(2)}% x ${String(Math.round((restH / vh) * 100)).padStart(2)}% of vh`,
  );
}

console.log('');
console.log('Figma reference: stone is 53% x 54% of viewport height');
const pass = worstNdc <= 1;
console.log(pass ? `PASS — worst NDC ${worstNdc.toFixed(4)} <= 1` : `FAIL — worst NDC ${worstNdc.toFixed(4)}`);
process.exit(pass ? 0 : 1);
