/**
 * Splits the Meshy "pile of chips" GLB into separate, origin-centred meshes
 * and compresses them for the hero debris burst.
 *
 * The source is one primitive with ~140 disconnected islands. We keep the
 * largest chips, recenter each, scale so the biggest is a readable fleck on
 * the unit-sphere stone, then WebP + meshopt the result.
 *
 * Run with: npm run stone:chunks
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, textureCompress } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';
import sharp from 'sharp';

const SOURCE = fileURLToPath(new URL('../assets/stone-chunks.source.glb', import.meta.url));
const TARGET = fileURLToPath(new URL('../public/models/stone-chunks.glb', import.meta.url));

const MIN_VERTS = 10;
const MAX_CHUNKS = 32;
/** Bounding-sphere radius of the largest chip, in the stone's unit-sphere frame. */
const TARGET_MAX_RADIUS = 0.04;
const TEXTURE_SIZE = 256;

await MeshoptDecoder.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder,
});

const document = await io.read(SOURCE);
const root = document.getRoot();
const scene = root.listScenes()[0];
const sourceNode = scene.listChildren()[0];
const sourceMesh = sourceNode.getMesh();
const prim = sourceMesh.listPrimitives()[0];
const material = prim.getMaterial();
const position = prim.getAttribute('POSITION');
const indices = prim.getIndices();
const vertCount = position.getCount();
const indexCount = indices.getCount();
const buffer = root.listBuffers()[0];

const parent = new Int32Array(vertCount);
for (let i = 0; i < vertCount; i += 1) parent[i] = i;
const find = (a) => {
  while (parent[a] !== a) {
    parent[a] = parent[parent[a]];
    a = parent[a];
  }
  return a;
};
const union = (a, b) => {
  a = find(a);
  b = find(b);
  if (a !== b) parent[b] = a;
};

for (let i = 0; i < indexCount; i += 3) {
  union(indices.getScalar(i), indices.getScalar(i + 1));
  union(indices.getScalar(i + 1), indices.getScalar(i + 2));
}

const islandVerts = new Map();
for (let i = 0; i < vertCount; i += 1) {
  const rootId = find(i);
  const list = islandVerts.get(rootId);
  if (list) list.push(i);
  else islandVerts.set(rootId, [i]);
}

const islands = [...islandVerts.values()]
  .filter((verts) => verts.length >= MIN_VERTS)
  .sort((a, b) => b.length - a.length)
  .slice(0, MAX_CHUNKS);

const islandOfVert = new Map();
for (let id = 0; id < islands.length; id += 1) {
  for (const v of islands[id]) islandOfVert.set(v, id);
}

const islandTris = islands.map(() => []);
for (let i = 0; i < indexCount; i += 3) {
  const a = indices.getScalar(i);
  const id = islandOfVert.get(a);
  if (id === undefined) continue;
  islandTris[id].push(a, indices.getScalar(i + 1), indices.getScalar(i + 2));
}

function copyAttribute(attr, vertList) {
  const itemSize = attr.getElementSize();
  const src = attr.getArray();
  const dst = new src.constructor(vertList.length * itemSize);
  for (let i = 0; i < vertList.length; i += 1) {
    const from = vertList[i] * itemSize;
    const to = i * itemSize;
    for (let k = 0; k < itemSize; k += 1) dst[to + k] = src[from + k];
  }
  return document
    .createAccessor()
    .setType(attr.getType())
    .setArray(dst)
    .setBuffer(buffer);
}

const semantics = prim.listSemantics();
const radii = [];

for (let id = 0; id < islands.length; id += 1) {
  const verts = islands[id];
  const oldToNew = new Map(verts.map((v, i) => [v, i]));
  const mesh = document.createMesh(`chunk_${String(id).padStart(2, '0')}`);
  const next = document.createPrimitive().setMode(prim.getMode()).setMaterial(material);

  for (const semantic of semantics) {
    const attr = copyAttribute(prim.getAttribute(semantic), verts);
    if (semantic === 'POSITION') {
      const arr = attr.getArray();
      let cx = 0;
      let cy = 0;
      let cz = 0;
      for (let i = 0; i < verts.length; i += 1) {
        cx += arr[i * 3];
        cy += arr[i * 3 + 1];
        cz += arr[i * 3 + 2];
      }
      cx /= verts.length;
      cy /= verts.length;
      cz /= verts.length;
      let r2 = 0;
      for (let i = 0; i < verts.length; i += 1) {
        arr[i * 3] -= cx;
        arr[i * 3 + 1] -= cy;
        arr[i * 3 + 2] -= cz;
        const dx = arr[i * 3];
        const dy = arr[i * 3 + 1];
        const dz = arr[i * 3 + 2];
        r2 = Math.max(r2, dx * dx + dy * dy + dz * dz);
      }
      radii.push(Math.sqrt(r2));
    }
    next.setAttribute(semantic, attr);
  }

  const remapped = new Uint16Array(islandTris[id].length);
  for (let i = 0; i < islandTris[id].length; i += 1) {
    remapped[i] = oldToNew.get(islandTris[id][i]);
  }
  next.setIndices(document.createAccessor().setType('SCALAR').setArray(remapped).setBuffer(buffer));
  mesh.addPrimitive(next);

  const node = document.createNode(mesh.getName()).setMesh(mesh);
  scene.addChild(node);
}

const maxRadius = Math.max(...radii);
const scale = TARGET_MAX_RADIUS / maxRadius;
for (const mesh of root.listMeshes()) {
  if (!mesh.getName().startsWith('chunk_')) continue;
  const pos = mesh.listPrimitives()[0].getAttribute('POSITION');
  const arr = pos.getArray();
  for (let i = 0; i < arr.length; i += 1) arr[i] *= scale;
}

sourceNode.setMesh(null);
scene.removeChild(sourceNode);
sourceNode.dispose();
sourceMesh.dispose();

await document.transform(
  prune(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [TEXTURE_SIZE, TEXTURE_SIZE] }),
);

await io.write(TARGET, document);
const mb = (url) => (statSync(url).size / 1048576).toFixed(2);
console.log(
  `chunks: ${islands.length} chips  ${mb(SOURCE)} MB -> ${mb(TARGET)} MB  ` +
    `max radius ${TARGET_MAX_RADIUS}`,
);
