/**
 * Compresses the Meshy source GLBs into the shipped public/models files.
 *
 * Meshy dumps ~2M triangles and 4K JPEGs. The stone never renders wider than
 * ~800px, so we (1) simplify toward ~300k triangles, (2) downsize textures to
 * 1024px WebP, then (3) meshopt-encode the buffers. Hull / verify run against
 * the shipped files, so silhouette is whatever survives this pass.
 *
 * Run with: npm run stone:compress
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, simplify, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/** Longest texture edge to keep. The stone never renders wider than ~800px. */
const TEXTURE_SIZE = 1024;

/**
 * Keep ~15% of triangles (~300k from a 2M Meshy dump). Error is 0.5% of mesh
 * radius so the simplifier can actually reach that ratio on a noisy rock.
 */
const SIMPLIFY_RATIO = 0.15;
const SIMPLIFY_ERROR = 0.005;

const jobs = [
  {
    label: 'rough',
    source: fileURLToPath(new URL('../assets/stone.source.glb', import.meta.url)),
    target: fileURLToPath(new URL('../public/models/stone.glb', import.meta.url)),
  },
  {
    label: 'polished',
    source: fileURLToPath(new URL('../assets/stone-polished.source.glb', import.meta.url)),
    target: fileURLToPath(new URL('../public/models/stone-polished.glb', import.meta.url)),
  },
  {
    label: 'rough-b',
    source: fileURLToPath(new URL('../assets/stone-b.source.glb', import.meta.url)),
    target: fileURLToPath(new URL('../public/models/stone-b.glb', import.meta.url)),
  },
  {
    label: 'polished-b',
    source: fileURLToPath(new URL('../assets/stone-polished-b.source.glb', import.meta.url)),
    target: fileURLToPath(new URL('../public/models/stone-polished-b.glb', import.meta.url)),
  },
];

function meshStats(document) {
  let verts = 0;
  let tris = 0;
  for (const mesh of document.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (pos) verts += pos.getCount();
      const idx = prim.getIndices();
      if (idx) tris += idx.getCount() / 3;
    }
  }
  return { verts, tris: Math.round(tris) };
}

const mb = (url) => (statSync(url).size / 1048576).toFixed(2);

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
});

const filter = process.argv[2];

for (const { label, source, target } of jobs) {
  if (filter && !label.includes(filter)) continue;
  if (!existsSync(source)) {
    console.log(`${label}: skip (no source)`);
    continue;
  }

  const document = await io.read(source);
  const before = meshStats(document);

  await document.transform(
    simplify({ simplifier: MeshoptSimplifier, ratio: SIMPLIFY_RATIO, error: SIMPLIFY_ERROR }),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [TEXTURE_SIZE, TEXTURE_SIZE] }),
    meshopt({ encoder: MeshoptEncoder, level: 'high' }),
  );

  await io.write(target, document);
  const after = meshStats(document);

  console.log(
    `${label}: ${mb(source)} MB -> ${mb(target)} MB  ` +
      `tris ${before.tris.toLocaleString()} -> ${after.tris.toLocaleString()}  ` +
      `verts ${before.verts.toLocaleString()} -> ${after.verts.toLocaleString()}`,
  );
}
