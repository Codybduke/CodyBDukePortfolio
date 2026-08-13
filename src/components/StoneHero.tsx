import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  STONE_FIT_MARGIN,
  STONE_FOV,
  STONE_HULL,
  STONE_OFFSET,
  STONE_REST_YAW,
  STONE_SPIN_RAD,
  STONE_TILT_DEG,
} from '../data/stone-hull';
import { withBase } from '../lib/paths';

const TILT_RAD = THREE.MathUtils.degToRad(STONE_TILT_DEG);
const TAN_HALF_FOV = Math.tan(((STONE_FOV * Math.PI) / 180) / 2);
const STONE_GLB = withBase('/models/stone.glb');
const STONE_POLISHED_GLB = withBase('/models/stone-polished.glb');
const STONE_CHUNKS_GLB = withBase('/models/stone-chunks.glb');
const STONE_STILL = withBase('/images/stone-smooth.png');
const LOGO_LOCKUP = withBase('/brand/logo-lockup-light.svg');
const HAMMER_CURSOR = `url("${withBase('/brand/hammer.svg')}") 4 8, pointer`;
const CHIPS_TO_POLISH = 3;
const SHAKE_CHIP_MS = 420;
const SHAKE_STRIKE_MS = 780;
const SHAKE_CRUMBLE_MS = 640;
const STRIKE_IMPACT_MS = 170;
const BLEND_MS = 560;
const POLISHED_SCALE = 0.8;
const DRAG_THRESHOLD_PX = 6;
const DRAG_YAW_PER_PX = 0.012;
const DRAG_PITCH_PER_PX = 0.008;
const DUST_COUNT = 150;
const CHUNK_POOL = 18;
const noopRaycast = () => {};

type ShakeKind = 'chip' | 'strike' | 'crumble';
type BurstMode = 'strike' | 'crumble' | 'chip';

function unpackHull(flat: readonly number[]) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < flat.length; i += 3) {
    pts.push(new THREE.Vector3(flat[i], flat[i + 1], flat[i + 2]));
  }
  return pts;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function makeGritTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const glow = ctx.createRadialGradient(32, 32, 1, 32, 32, 28);
  glow.addColorStop(0, 'rgba(255,255,255,0.95)');
  glow.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const GRIT_PALETTE = [
  [0.14, 0.13, 0.12],
  [0.27, 0.25, 0.22],
  [0.42, 0.38, 0.33],
  [0.58, 0.52, 0.45],
] as const;

function applyStoneFade(root: THREE.Object3D, opacity: number, envBoost = 0) {
  const show = opacity > 0.012;
  root.visible = show;
  if (!show) return;
  const writeDepth = opacity > 0.92;
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    for (const mat of [obj.material].flat()) {
      if (!(mat instanceof THREE.MeshStandardMaterial)) continue;
      mat.opacity = opacity;
      mat.depthWrite = writeDepth;
      mat.envMapIntensity = 0.9 + envBoost;
    }
  });
}

/**
 * Centres the stone on the origin and scales it to a unit bounding sphere.
 * scripts/stone-geometry.mjs normalises the baked hull the same way, so the
 * hull and the rendered mesh share a coordinate frame — the camera fit below
 * is only valid because of that.
 */
function useNormalizedStone(url: string) {
  const { scene } = useGLTF(url);

  return useMemo(() => {
    const model = scene.clone(true);
    model.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const patch = (material: THREE.Material) => {
        const next = material.clone();
        if (next instanceof THREE.MeshStandardMaterial) {
          next.envMapIntensity = 0.9;
          next.transparent = true;
        }
        return next;
      };
      obj.material = Array.isArray(obj.material)
        ? obj.material.map(patch)
        : patch(obj.material);
    });

    const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
    model.position.sub(sphere.center);

    const object = new THREE.Group();
    object.add(model);
    object.scale.setScalar(1 / sphere.radius);

    return object;
  }, [scene]);
}

type StoneProps = {
  gem: boolean;
  shakeKind: ShakeKind;
  shakeNonce: number;
  burstMode: BurstMode;
  burstNonce: number;
  /** Read during the frame loop, so scrolling never triggers a React render. */
  scrollProgress: RefObject<number>;
  onChip: () => void;
  onHoverChange: (hovering: boolean) => void;
  onDragChange: (dragging: boolean) => void;
};

function StoneMesh({
  url,
  opacity,
  envBoost,
  renderOrder,
  dragging,
  onHoverChange,
}: {
  url: string;
  opacity: RefObject<number>;
  envBoost: RefObject<number>;
  renderOrder: number;
  dragging: RefObject<boolean>;
  onHoverChange: (hovering: boolean) => void;
}) {
  const object = useNormalizedStone(url);

  useLayoutEffect(() => {
    object.traverse((node) => {
      node.renderOrder = renderOrder;
    });
    applyStoneFade(object, opacity.current, envBoost.current);
  }, [object, opacity, envBoost, renderOrder]);

  useFrame(() => {
    applyStoneFade(object, opacity.current, envBoost.current);
  });

  return (
    <primitive
      object={object}
      onPointerOver={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onHoverChange(true);
      }}
      onPointerOut={() => {
        if (!dragging.current) onHoverChange(false);
      }}
    />
  );
}

function DustBurst({ nonce, mode }: { nonce: number; mode: BurstMode }) {
  const points = useRef<THREE.Points>(null);
  const texture = useMemo(() => makeGritTexture(), []);
  const sim = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const colors = new Float32Array(DUST_COUNT * 3);
    const base = new Float32Array(DUST_COUNT * 3);
    const velocities = new Float32Array(DUST_COUNT * 3);
    const born = new Float32Array(DUST_COUNT);
    const life = new Float32Array(DUST_COUNT);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage),
    );
    return {
      positions,
      colors,
      base,
      velocities,
      born,
      life,
      geometry,
      gravity: -2.2,
      count: DUST_COUNT,
      alive: false,
    };
  }, []);

  useEffect(() => () => {
    sim.geometry.dispose();
    texture?.dispose();
  }, [sim, texture]);

  useEffect(() => {
    if (nonce === 0) return;
    const strike = mode === 'strike';
    const chip = mode === 'chip';
    const count = strike ? DUST_COUNT : chip ? 40 : DUST_COUNT;
    sim.gravity = strike ? -1.9 : chip ? -2.1 : -2.7;
    sim.alive = true;
    sim.count = count;
    for (let i = 0; i < DUST_COUNT; i += 1) {
      if (i >= count) {
        sim.life[i] = 0;
        sim.born[i] = 1;
        sim.colors[i * 3] = 0;
        sim.colors[i * 3 + 1] = 0;
        sim.colors[i * 3 + 2] = 0;
        continue;
      }
      const theta = Math.random() * Math.PI * 2;
      const phi = strike || chip ? Math.acos(2 * Math.random() - 1) : Math.acos(0.15 + Math.random() * 0.85);
      const dirX = Math.sin(phi) * Math.cos(theta);
      const dirY = Math.cos(phi);
      const dirZ = Math.sin(phi) * Math.sin(theta);
      const radius = strike ? 0.28 + Math.random() * 0.3 : chip ? 0.32 + Math.random() * 0.2 : 0.18 + Math.random() * 0.28;
      const i3 = i * 3;
      sim.positions[i3] = dirX * radius;
      sim.positions[i3 + 1] = dirY * radius;
      sim.positions[i3 + 2] = dirZ * radius;
      const speed = strike
        ? 0.85 + Math.random() * 1.55
        : chip
          ? 0.45 + Math.random() * 0.7
          : 0.12 + Math.random() * 0.45;
      sim.velocities[i3] = dirX * speed * (strike || chip ? 1 : 0.45);
      sim.velocities[i3 + 1] = strike || chip
        ? dirY * speed + 0.25 + Math.random() * 0.45
        : -0.35 - Math.random() * 0.7;
      sim.velocities[i3 + 2] = dirZ * speed * (strike || chip ? 1 : 0.45);
      sim.life[i] = strike ? 0.42 + Math.random() * 0.5 : chip ? 0.32 + Math.random() * 0.28 : 0.55 + Math.random() * 0.45;
      sim.born[i] = 0;
      const swatch = GRIT_PALETTE[(Math.random() * GRIT_PALETTE.length) | 0];
      sim.base[i3] = swatch[0];
      sim.base[i3 + 1] = swatch[1];
      sim.base[i3 + 2] = swatch[2];
      sim.colors[i3] = swatch[0];
      sim.colors[i3 + 1] = swatch[1];
      sim.colors[i3 + 2] = swatch[2];
    }
    sim.geometry.attributes.position.needsUpdate = true;
    sim.geometry.attributes.color.needsUpdate = true;
    if (points.current) points.current.visible = true;
  }, [nonce, mode, sim]);

  useFrame((_, dt) => {
    if (!sim.alive || !points.current) return;
    const clamped = Math.min(dt, 0.05);
    let living = 0;
    for (let i = 0; i < DUST_COUNT; i += 1) {
      sim.born[i] += clamped;
      const u = Math.min(sim.born[i] / sim.life[i], 1);
      if (u >= 1) {
        sim.colors[i * 3] = 0;
        sim.colors[i * 3 + 1] = 0;
        sim.colors[i * 3 + 2] = 0;
        continue;
      }
      living += 1;
      const i3 = i * 3;
      sim.velocities[i3] *= 0.985;
      sim.velocities[i3 + 1] = sim.velocities[i3 + 1] * 0.985 + sim.gravity * clamped;
      sim.velocities[i3 + 2] *= 0.985;
      sim.positions[i3] += sim.velocities[i3] * clamped;
      sim.positions[i3 + 1] += sim.velocities[i3 + 1] * clamped;
      sim.positions[i3 + 2] += sim.velocities[i3 + 2] * clamped;
      const fade = u < 0.15 ? u / 0.15 : 1 - (u - 0.15) / 0.85;
      sim.colors[i3] = sim.base[i3] * fade;
      sim.colors[i3 + 1] = sim.base[i3 + 1] * fade;
      sim.colors[i3 + 2] = sim.base[i3 + 2] * fade;
    }
    sim.geometry.attributes.position.needsUpdate = true;
    sim.geometry.attributes.color.needsUpdate = true;
    if (living === 0) {
      sim.alive = false;
      points.current.visible = false;
    }
  });

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.052,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        map: texture ?? undefined,
        alphaTest: 0.06,
        blending: THREE.NormalBlending,
      }),
    [texture],
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <points
      ref={points}
      geometry={sim.geometry}
      material={material}
      visible={false}
      frustumCulled={false}
      renderOrder={2}
    />
  );
}

function ChunkDebris({ nonce, mode }: { nonce: number; mode: BurstMode }) {
  const { scene } = useGLTF(STONE_CHUNKS_GLB);
  const templates = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.updateMatrixWorld(true);
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const clone = obj.clone();
      clone.position.set(0, 0, 0);
      clone.rotation.set(0, 0, 0);
      clone.scale.set(1, 1, 1);
      clone.frustumCulled = false;
      clone.renderOrder = 3;
      clone.raycast = noopRaycast;
      const mat = Array.isArray(clone.material) ? clone.material[0] : clone.material;
      if (mat instanceof THREE.MeshStandardMaterial) {
        const next = mat.clone();
        next.transparent = true;
        next.depthWrite = false;
        next.envMapIntensity = 0.85;
        clone.material = next;
      }
      meshes.push(clone);
    });
    return meshes;
  }, [scene]);

  const group = useRef<THREE.Group>(null);
  const pool = useRef<THREE.Mesh[]>([]);
  const sim = useRef({
    vx: new Float32Array(CHUNK_POOL),
    vy: new Float32Array(CHUNK_POOL),
    vz: new Float32Array(CHUNK_POOL),
    avx: new Float32Array(CHUNK_POOL),
    avy: new Float32Array(CHUNK_POOL),
    avz: new Float32Array(CHUNK_POOL),
    born: new Float32Array(CHUNK_POOL),
    life: new Float32Array(CHUNK_POOL),
    startScale: new Float32Array(CHUNK_POOL),
    alive: false,
    gravity: -2.4,
    count: 0,
  }).current;

  useLayoutEffect(() => {
    const root = group.current;
    if (!root || templates.length === 0) return;
    const meshes = Array.from({ length: CHUNK_POOL }, (_, i) => {
      const mesh = templates[i % templates.length].clone();
      if (mesh.material instanceof THREE.Material) {
        mesh.material = mesh.material.clone();
      }
      mesh.visible = false;
      mesh.raycast = noopRaycast;
      root.add(mesh);
      return mesh;
    });
    pool.current = meshes;
    return () => {
      for (const mesh of meshes) {
        root.remove(mesh);
        if (mesh.material instanceof THREE.Material) mesh.material.dispose();
      }
      pool.current = [];
    };
  }, [templates]);

  useEffect(() => {
    if (nonce === 0 || pool.current.length === 0 || templates.length === 0) return;
    const strike = mode === 'strike';
    const chip = mode === 'chip';
    const count = strike ? CHUNK_POOL : chip ? 6 : 12;
    sim.gravity = strike ? -2.15 : chip ? -2.3 : -2.8;
    sim.count = count;
    sim.alive = true;

    for (let i = 0; i < CHUNK_POOL; i += 1) {
      const mesh = pool.current[i];
      if (i >= count) {
        mesh.visible = false;
        sim.life[i] = 0;
        continue;
      }
      const src = templates[(Math.random() * templates.length) | 0];
      mesh.geometry = src.geometry;
      const theta = Math.random() * Math.PI * 2;
      const phi = strike || chip ? Math.acos(2 * Math.random() - 1) : Math.acos(0.2 + Math.random() * 0.8);
      const dirX = Math.sin(phi) * Math.cos(theta);
      const dirY = Math.cos(phi);
      const dirZ = Math.sin(phi) * Math.sin(theta);
      const radius = 0.42 + Math.random() * 0.18;
      mesh.position.set(dirX * radius, dirY * radius, dirZ * radius);
      mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      const size = (chip ? 0.45 : 0.55) + Math.random() * 0.5;
      sim.startScale[i] = size;
      mesh.scale.setScalar(size);
      mesh.visible = true;
      if (mesh.material instanceof THREE.MeshStandardMaterial) mesh.material.opacity = 1;

      const speed = strike
        ? 0.55 + Math.random() * 1.05
        : chip
          ? 0.35 + Math.random() * 0.45
          : 0.12 + Math.random() * 0.35;
      sim.vx[i] = dirX * speed * (strike || chip ? 1 : 0.4);
      sim.vy[i] = strike || chip ? dirY * speed + 0.15 + Math.random() * 0.35 : -0.35 - Math.random() * 0.55;
      sim.vz[i] = dirZ * speed * (strike || chip ? 1 : 0.4);
      sim.avx[i] = (Math.random() - 0.5) * (strike ? 8 : 5);
      sim.avy[i] = (Math.random() - 0.5) * (strike ? 8 : 5);
      sim.avz[i] = (Math.random() - 0.5) * (strike ? 8 : 5);
      sim.life[i] = strike ? 0.55 + Math.random() * 0.4 : chip ? 0.4 + Math.random() * 0.25 : 0.65 + Math.random() * 0.35;
      sim.born[i] = 0;
    }
  }, [nonce, mode, templates, sim]);

  useFrame((_, dt) => {
    if (!sim.alive) return;
    const clamped = Math.min(dt, 0.05);
    let living = 0;
    for (let i = 0; i < sim.count; i += 1) {
      const mesh = pool.current[i];
      if (!mesh) continue;
      sim.born[i] += clamped;
      const u = Math.min(sim.born[i] / sim.life[i], 1);
      if (u >= 1) {
        mesh.visible = false;
        continue;
      }
      living += 1;
      sim.vx[i] *= 0.987;
      sim.vy[i] = sim.vy[i] * 0.987 + sim.gravity * clamped;
      sim.vz[i] *= 0.987;
      mesh.position.x += sim.vx[i] * clamped;
      mesh.position.y += sim.vy[i] * clamped;
      mesh.position.z += sim.vz[i] * clamped;
      mesh.rotation.x += sim.avx[i] * clamped;
      mesh.rotation.y += sim.avy[i] * clamped;
      mesh.rotation.z += sim.avz[i] * clamped;
      const fade = u < 0.12 ? 1 : 1 - (u - 0.12) / 0.88;
      mesh.scale.setScalar(sim.startScale[i] * (0.8 + 0.2 * fade));
      if (mesh.material instanceof THREE.MeshStandardMaterial) mesh.material.opacity = fade;
    }
    if (living === 0) sim.alive = false;
  });

  return <group ref={group} />;
}

function StoneRig({
  gem,
  shakeKind,
  shakeNonce,
  burstMode,
  burstNonce,
  scrollProgress,
  onChip,
  onHoverChange,
  onDragChange,
}: StoneProps) {
  const spin = useRef<THREE.Group>(null);
  const pitch = useRef<THREE.Group>(null);
  const shake = useRef<THREE.Group>(null);
  const scaleGroup = useRef<THREE.Group>(null);
  const hitRoot = useRef<THREE.Group>(null);
  const shakeUntil = useRef(0);
  const shakeDuration = useRef(SHAKE_CHIP_MS);
  const shakeMag = useRef(0.05);
  const blend = useRef(gem ? 1 : 0);
  const roughOpacity = useRef(gem ? 0 : 1);
  const gemOpacity = useRef(gem ? 1 : 0);
  const gemBoost = useRef(0);
  const noBoost = useRef(0);
  const userYaw = useRef(0);
  const userPitch = useRef(0);
  const dragging = useRef(false);
  const drag = useRef<{
    pointerId: number;
    lastX: number;
    lastY: number;
    moved: boolean;
    hit: boolean;
    onMove: ((event: PointerEvent) => void) | null;
    onUp: ((event: PointerEvent) => void) | null;
  }>({ pointerId: -1, lastX: 0, lastY: 0, moved: false, hit: false, onMove: null, onUp: null });
  const onChipRef = useRef(onChip);
  const onDragChangeRef = useRef(onDragChange);
  onChipRef.current = onChip;
  onDragChangeRef.current = onDragChange;

  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);

  const hull = useMemo(() => unpackHull(STONE_HULL), []);
  const [offsetX, offsetY] = STONE_OFFSET;

  const scratch = useMemo(
    () => ({
      pose: new THREE.Matrix4(),
      yaw: new THREE.Matrix4(),
      pitch: new THREE.Matrix4(),
      point: new THREE.Vector3(),
      ndc: new THREE.Vector2(),
      raycaster: new THREE.Raycaster(),
    }),
    [],
  );

  /**
   * Distance at which the stone exactly fills the frame at a given spin.
   * A point sits inside the frustum once the camera is |x| / tanH + z away
   * (likewise for y) — the `+ z` matters because nearer points project larger.
   */
  const fitDistance = useCallback(
    (yaw: number, pitchRad: number) => {
      const tanH = TAN_HALF_FOV * (size.width / Math.max(size.height, 1));
      const pose = scratch.pose
        .makeRotationZ(TILT_RAD)
        .multiply(scratch.yaw.makeRotationY(yaw))
        .multiply(scratch.pitch.makeRotationX(pitchRad));

      let distance = 0;
      for (const p of hull) {
        const v = scratch.point.copy(p).applyMatrix4(pose);
        distance = Math.max(
          distance,
          Math.abs(v.x + offsetX) / tanH + v.z,
          Math.abs(v.y + offsetY) / TAN_HALF_FOV + v.z,
        );
      }
      return distance * STONE_FIT_MARGIN;
    },
    [hull, scratch, size.width, size.height, offsetX, offsetY],
  );

  const placeCamera = useCallback(
    (distance: number) => {
      camera.position.set(0, 0, distance);
      camera.near = Math.max(0.01, distance - 1.5);
      camera.far = distance + 1.5;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    },
    [camera],
  );

  const applySpin = useCallback(() => {
    if (!spin.current) return;
    spin.current.rotation.y =
      STONE_REST_YAW + scrollProgress.current * STONE_SPIN_RAD + userYaw.current;
    if (pitch.current) {
      pitch.current.rotation.x = userPitch.current;
    }
  }, [scrollProgress]);

  const stopDragListeners = useCallback(() => {
    const { onMove, onUp } = drag.current;
    if (onMove) window.removeEventListener('pointermove', onMove, true);
    if (onUp) {
      window.removeEventListener('pointerup', onUp, true);
      window.removeEventListener('pointercancel', onUp, true);
    }
    drag.current.onMove = null;
    drag.current.onUp = null;
  }, []);

  useLayoutEffect(() => {
    placeCamera(
      fitDistance(spin.current?.rotation.y ?? STONE_REST_YAW, pitch.current?.rotation.x ?? 0),
    );
  }, [fitDistance, placeCamera]);

  useEffect(() => {
    if (shakeNonce === 0) return;
    if (shakeKind === 'strike') {
      shakeDuration.current = SHAKE_STRIKE_MS;
      shakeMag.current = 0.13;
    } else if (shakeKind === 'crumble') {
      shakeDuration.current = SHAKE_CRUMBLE_MS;
      shakeMag.current = 0.04;
    } else {
      shakeDuration.current = SHAKE_CHIP_MS;
      shakeMag.current = 0.05;
    }
    shakeUntil.current = performance.now() + shakeDuration.current;
  }, [shakeNonce, shakeKind]);

  useEffect(() => {
    const el = gl.domElement;
    const hitsStone = (clientX: number, clientY: number) => {
      if (!hitRoot.current) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      scratch.ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      scratch.ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      scratch.raycaster.setFromCamera(scratch.ndc, camera);
      return scratch.raycaster.intersectObject(hitRoot.current, true).length > 0;
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;

      stopDragListeners();
      drag.current.pointerId = event.pointerId;
      drag.current.lastX = event.clientX;
      drag.current.lastY = event.clientY;
      drag.current.moved = false;
      drag.current.hit = hitsStone(event.clientX, event.clientY);

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== drag.current.pointerId) return;
        const dx = move.clientX - drag.current.lastX;
        const dy = move.clientY - drag.current.lastY;

        if (!drag.current.moved) {
          if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;
          if (move.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
            stopDragListeners();
            return;
          }
          drag.current.moved = true;
          dragging.current = true;
          onDragChangeRef.current(true);
          try {
            el.setPointerCapture(move.pointerId);
          } catch {
            /* capture is best-effort; window listeners still run */
          }
        }

        move.preventDefault();
        drag.current.lastX = move.clientX;
        drag.current.lastY = move.clientY;
        userYaw.current += dx * DRAG_YAW_PER_PX;
        userPitch.current = THREE.MathUtils.clamp(
          userPitch.current + dy * DRAG_PITCH_PER_PX,
          -Math.PI,
          Math.PI,
        );
        applySpin();
      };

      const onUp = (up: PointerEvent) => {
        if (up.pointerId !== drag.current.pointerId) return;
        stopDragListeners();
        const wasDrag = drag.current.moved;
        dragging.current = false;
        onDragChangeRef.current(false);
        try {
          if (el.hasPointerCapture(up.pointerId)) el.releasePointerCapture(up.pointerId);
        } catch {
          /* already released */
        }
        if (!wasDrag && drag.current.hit) onChipRef.current();
      };

      drag.current.onMove = onMove;
      drag.current.onUp = onUp;
      window.addEventListener('pointermove', onMove, { capture: true, passive: false });
      window.addEventListener('pointerup', onUp, { capture: true });
      window.addEventListener('pointercancel', onUp, { capture: true });
    };

    const source = el.parentElement ?? el;
    source.addEventListener('pointerdown', onDown);
    return () => {
      source.removeEventListener('pointerdown', onDown);
      stopDragListeners();
    };
  }, [applySpin, camera, gl, scratch, stopDragListeners]);

  useFrame((_, dt) => {
    if (!spin.current) return;

    if (!dragging.current) {
      const targetY = STONE_REST_YAW + scrollProgress.current * STONE_SPIN_RAD + userYaw.current;
      spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, targetY, 0.08);
      if (pitch.current) {
        pitch.current.rotation.x = THREE.MathUtils.lerp(
          pitch.current.rotation.x,
          userPitch.current,
          0.08,
        );
      }
    }

    const target = gem ? 1 : 0;
    const step = Math.min(dt, 0.05) / (BLEND_MS / 1000);
    if (blend.current < target) blend.current = Math.min(target, blend.current + step);
    else if (blend.current > target) blend.current = Math.max(target, blend.current - step);

    const t = blend.current;
    const eased = easeOutCubic(t);
    roughOpacity.current = 1 - t;
    gemOpacity.current = t;
    gemBoost.current = 0.75 * Math.sin(t * Math.PI);
    if (scaleGroup.current) {
      const s = THREE.MathUtils.lerp(1, POLISHED_SCALE, eased);
      scaleGroup.current.scale.setScalar(s);
    }

    const required = fitDistance(spin.current.rotation.y, pitch.current?.rotation.x ?? 0);
    placeCamera(
      required > camera.position.z
        ? required
        : THREE.MathUtils.lerp(camera.position.z, required, 0.1),
    );

    if (!shake.current) return;
    const remaining = shakeUntil.current - performance.now();
    if (remaining > 0) {
      const u = remaining / shakeDuration.current;
      const punch = shakeKind === 'strike' && u > 0.72 ? 1.35 : 1;
      const mag = shakeMag.current * u * u * punch;
      const freq = shakeKind === 'strike' ? 0.08 : 0.055;
      shake.current.rotation.z = Math.sin(remaining * freq) * mag;
      shake.current.position.x = Math.cos(remaining * (freq + 0.015)) * mag * 0.45;
      shake.current.position.y = Math.sin(remaining * (freq + 0.01)) * mag * 0.22;
    } else {
      shake.current.rotation.z = 0;
      shake.current.position.x = 0;
      shake.current.position.y = 0;
    }
  });

  return (
    <group ref={hitRoot} position={[offsetX, offsetY, 0]}>
      <group rotation={[0, 0, TILT_RAD]}>
        <group ref={spin} rotation={[0, STONE_REST_YAW, 0]}>
          <group ref={pitch}>
            <group ref={shake}>
              <group ref={scaleGroup}>
                <Suspense fallback={null}>
                  <StoneMesh
                    url={STONE_GLB}
                    opacity={roughOpacity}
                    envBoost={noBoost}
                    renderOrder={0}
                    dragging={dragging}
                    onHoverChange={onHoverChange}
                  />
                </Suspense>
                <Suspense fallback={null}>
                  <StoneMesh
                    url={STONE_POLISHED_GLB}
                    opacity={gemOpacity}
                    envBoost={gemBoost}
                    renderOrder={1}
                    dragging={dragging}
                    onHoverChange={onHoverChange}
                  />
                </Suspense>
              </group>
              <DustBurst nonce={burstNonce} mode={burstMode} />
              <Suspense fallback={null}>
                <ChunkDebris nonce={burstNonce} mode={burstMode} />
              </Suspense>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function StoneHero() {
  const scrollProgress = useRef(0);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [gem, setGem] = useState(false);
  const [chips, setChips] = useState(0);
  const [shakeKind, setShakeKind] = useState<ShakeKind>('chip');
  const [shakeNonce, setShakeNonce] = useState(0);
  const [burstMode, setBurstMode] = useState<BurstMode>('strike');
  const [burstNonce, setBurstNonce] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(mq.matches);
    syncMotion();
    mq.addEventListener('change', syncMotion);

    try {
      setWebglOk(!!document.createElement('canvas').getContext('webgl'));
    } catch {
      setWebglOk(false);
    }

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgress.current = Math.min(Math.max(window.scrollY / max, 0), 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const preload = window.setTimeout(() => {
      void Promise.resolve(useGLTF.preload(STONE_POLISHED_GLB));
      void Promise.resolve(useGLTF.preload(STONE_CHUNKS_GLB));
    }, 400);

    return () => {
      mq.removeEventListener('change', syncMotion);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(preload);
      for (const id of timers.current) window.clearTimeout(id);
    };
  }, []);

  const chip = useCallback(() => {
    if (busy.current) return;

    if (gem) {
      busy.current = true;
      setShakeKind('crumble');
      setShakeNonce((n) => n + 1);
      setBurstMode('crumble');
      setBurstNonce((n) => n + 1);
      setGem(false);
      setChips(0);
      setHovering(false);
      const done = window.setTimeout(() => {
        busy.current = false;
      }, SHAKE_CRUMBLE_MS);
      timers.current.push(done);
      return;
    }

    void Promise.resolve(useGLTF.preload(STONE_POLISHED_GLB));
    setChips((count) => {
      const next = count + 1;
      if (next >= CHIPS_TO_POLISH) {
        busy.current = true;
        setShakeKind('strike');
        setShakeNonce((n) => n + 1);
        const impact = window.setTimeout(() => {
          setBurstMode('strike');
          setBurstNonce((n) => n + 1);
          setGem(true);
          setHovering(false);
        }, STRIKE_IMPACT_MS);
        const done = window.setTimeout(() => {
          busy.current = false;
        }, SHAKE_STRIKE_MS);
        timers.current.push(impact, done);
      } else {
        setShakeKind('chip');
        setShakeNonce((n) => n + 1);
        setBurstMode('chip');
        setBurstNonce((n) => n + 1);
      }
      return next;
    });
  }, [gem]);

  const onKeyDown = (event: { key: string; preventDefault: () => void }) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chip();
    }
  };

  const show3d = webglOk && !reducedMotion;
  const label = gem
    ? 'Polished stone. Activate to restore the rough stone.'
    : chips === 0
      ? 'Rough stone. Activate to chip it.'
      : 'Rough stone. Activate to keep chipping.';

  return (
    <div
      className={dragging ? 'hero__stage hero__stage--dragging' : 'hero__stage'}
      draggable={false}
      role="button"
      tabIndex={show3d ? 0 : undefined}
      aria-label={label}
      aria-pressed={gem}
      onKeyDown={show3d ? onKeyDown : undefined}
      onClick={
        show3d
          ? (event) => {
              // Screen-reader activation clicks the stage itself; mesh clicks
              // hit the canvas and are handled by the R3F raycast instead.
              if (event.target === event.currentTarget) chip();
            }
          : undefined
      }
      style={dragging ? { cursor: 'grabbing' } : hovering ? { cursor: HAMMER_CURSOR } : undefined}
    >
      {show3d ? (
        <Canvas
          className="hero__canvas"
          dpr={[1, 1.75]}
          camera={{ fov: STONE_FOV, position: [0, 0, 4] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={0.55} />
          <directionalLight position={[3.2, 4.2, 2.4]} intensity={1.35} />
          <directionalLight position={[-2.5, -1.2, -2]} intensity={0.35} />
          <Suspense fallback={null}>
            <StoneRig
              gem={gem}
              shakeKind={shakeKind}
              shakeNonce={shakeNonce}
              burstMode={burstMode}
              burstNonce={burstNonce}
              scrollProgress={scrollProgress}
              onChip={chip}
              onHoverChange={setHovering}
              onDragChange={setDragging}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      ) : (
        <img
          className="hero__stone"
          src={STONE_STILL}
          alt=""
          width="528"
          height="528"
          decoding="async"
        />
      )}

      <img
        className="hero__mark"
        src={LOGO_LOCKUP}
        alt=""
        width="175"
        height="74"
      />
    </div>
  );
}

useGLTF.preload(STONE_GLB);
