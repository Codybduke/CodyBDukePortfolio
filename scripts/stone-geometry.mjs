/** Shared GLB reading + pose maths for the stone fitting scripts. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';

/**
 * Reads every POSITION vertex out of a GLB, in scene-world space.
 * Uses gltf-transform so meshopt-compressed / quantized accessors decode
 * the same way the browser's GLTFLoader does.
 */
export async function readGlbVertices(pathOrUrl) {
  const path = typeof pathOrUrl === 'string' ? pathOrUrl : fileURLToPath(pathOrUrl);

  await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
  });
  const document = await io.read(path);
  const vertices = [];
  const scratch = [0, 0, 0];
  const world = new THREE.Matrix4();

  const collect = (node) => {
    const mesh = node.getMesh();
    if (mesh) {
      world.fromArray(node.getWorldMatrix());
      for (const prim of mesh.listPrimitives()) {
        const pos = prim.getAttribute('POSITION');
        if (!pos) continue;
        for (let i = 0; i < pos.getCount(); i += 1) {
          pos.getElement(i, scratch);
          vertices.push(new THREE.Vector3(scratch[0], scratch[1], scratch[2]).applyMatrix4(world));
        }
      }
    }
    for (const child of node.listChildren()) collect(child);
  };

  for (const scene of document.getRoot().listScenes()) {
    for (const root of scene.listChildren()) collect(root);
  }

  return vertices;
}

/**
 * Normalises a point cloud to a unit bounding sphere centred on the origin.
 * useNormalizedStone in StoneHero.tsx derives centre and radius the same way,
 * so the baked hull and the rendered mesh share a coordinate frame.
 */
export function normalize(vertices) {
  const sphere = new THREE.Box3().setFromPoints(vertices).getBoundingSphere(new THREE.Sphere());
  const scale = 1 / sphere.radius;
  return vertices.map((v) => v.clone().sub(sphere.center).multiplyScalar(scale));
}

/** Spin about Y first, then tilt on screen, so the tilt reads constant. */
export function poseMatrix(yaw, tiltRad) {
  return new THREE.Matrix4()
    .makeRotationZ(tiltRad)
    .multiply(new THREE.Matrix4().makeRotationY(yaw));
}

/**
 * Camera distance that just contains an already-posed `cloud`.
 * A point sits inside the frustum once the camera is |x| / tanH + z away
 * (likewise for y) — the `+ z` matters because nearer points project larger.
 */
export function fitDistance(cloud, { aspect, fov, margin, offX, offY }) {
  const tanV = Math.tan(((fov * Math.PI) / 180) / 2);
  const tanH = tanV * aspect;
  let d = 0;
  for (const p of cloud) {
    d = Math.max(d, Math.abs(p.x + offX) / tanH + p.z, Math.abs(p.y + offY) / tanV + p.z);
  }
  return d * margin;
}

/**
 * Camera matching the one StoneModel.placeCamera builds. Near/far only affect
 * projected z, so they are irrelevant to the crop test, but keeping them equal
 * to the runtime keeps this an honest mirror.
 */
export function fitCamera(fov, aspect, distance) {
  const cam = new THREE.PerspectiveCamera(fov, aspect, Math.max(0.01, distance - 1.5), distance + 1.5);
  cam.position.set(0, 0, distance);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  return cam;
}

/** NDC bounds of an already-posed `cloud` seen through `camera`. */
export function projectedBounds(cloud, camera, offX, offY) {
  const v = new THREE.Vector3();
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of cloud) {
    v.set(p.x + offX, p.y + offY, p.z).project(camera);
    x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x);
    y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y);
  }
  return { x0, x1, y0, y1 };
}
