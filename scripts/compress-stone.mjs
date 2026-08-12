/**
 * Compresses assets/stone.source.glb into the shipped public/models/stone.glb.
 *
 * Geometry is left intact — every triangle survives, so the silhouette the
 * hull and the no-crop proof are built on does not move. The savings come from
 * meshopt encoding the vertex buffers and from downsizing the textures, which
 * are authored far larger than the ~600x790px the stone ever renders at.
 *
 * Run with: npm run stone:compress
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/** Longest texture edge to keep. The stone never renders wider than ~800px. */
const TEXTURE_SIZE = 1024;

const source = fileURLToPath(new URL('../assets/stone.source.glb', import.meta.url));
const target = fileURLToPath(new URL('../public/models/stone.glb', import.meta.url));

await MeshoptEncoder.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
});

const document = await io.read(source);

await document.transform(
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [TEXTURE_SIZE, TEXTURE_SIZE] }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
);

await io.write(target, document);

const mb = (url) => (statSync(url).size / 1048576).toFixed(2);
console.log(`${mb(source)} MB -> ${mb(target)} MB`);
