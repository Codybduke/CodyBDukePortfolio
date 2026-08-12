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
  STONE_SPIN_RAD,
  STONE_TILT_DEG,
} from '../data/stone-hull';
import { withBase } from '../lib/paths';

const TILT_RAD = THREE.MathUtils.degToRad(STONE_TILT_DEG);
const TAN_HALF_FOV = Math.tan(((STONE_FOV * Math.PI) / 180) / 2);
const [OFFSET_X, OFFSET_Y] = STONE_OFFSET;
const STONE_GLB = withBase('/models/stone.glb');
const STONE_STILL = withBase('/images/stone-smooth.png');
const LOGO_LOCKUP = withBase('/brand/logo-lockup-light.svg');

/**
 * Centres the stone on the origin and scales it to a unit bounding sphere.
 * scripts/stone-geometry.mjs normalises the baked hull the same way, so the
 * hull and the rendered mesh share a coordinate frame — the camera fit below
 * is only valid because of that.
 */
function useNormalizedStone() {
  const { scene } = useGLTF(STONE_GLB);

  return useMemo(() => {
    const model = scene.clone(true);
    model.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      for (const material of [obj.material].flat()) {
        if (material instanceof THREE.MeshStandardMaterial) material.envMapIntensity = 0.9;
      }
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
  /** Read during the frame loop, so scrolling never triggers a React render. */
  scrollProgress: RefObject<number>;
};

function StoneModel({ scrollProgress }: StoneProps) {
  const spin = useRef<THREE.Group>(null);
  const object = useNormalizedStone();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);

  const hull = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < STONE_HULL.length; i += 3) {
      pts.push(new THREE.Vector3(STONE_HULL[i], STONE_HULL[i + 1], STONE_HULL[i + 2]));
    }
    return pts;
  }, []);

  // Reused across frames to keep the fit allocation-free
  const scratch = useMemo(
    () => ({ pose: new THREE.Matrix4(), yaw: new THREE.Matrix4(), point: new THREE.Vector3() }),
    [],
  );

  /**
   * Distance at which the stone exactly fills the frame at a given spin.
   * A point sits inside the frustum once the camera is |x| / tanH + z away
   * (likewise for y) — the `+ z` matters because nearer points project larger.
   */
  const fitDistance = useCallback(
    (yaw: number) => {
      const tanH = TAN_HALF_FOV * (size.width / Math.max(size.height, 1));

      // Spin about Y first, then tilt on screen, so the 28deg reads constant
      const pose = scratch.pose.makeRotationZ(TILT_RAD).multiply(scratch.yaw.makeRotationY(yaw));

      let distance = 0;
      for (const p of hull) {
        const v = scratch.point.copy(p).applyMatrix4(pose);
        distance = Math.max(
          distance,
          Math.abs(v.x + OFFSET_X) / tanH + v.z,
          Math.abs(v.y + OFFSET_Y) / TAN_HALF_FOV + v.z,
        );
      }
      return distance * STONE_FIT_MARGIN;
    },
    [hull, scratch, size.width, size.height],
  );

  const placeCamera = useCallback(
    (distance: number) => {
      camera.position.set(0, 0, distance);
      // Geometry is normalised inside a unit sphere, so depth spans distance ± 1
      camera.near = Math.max(0.01, distance - 1.5);
      camera.far = distance + 1.5;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    },
    [camera],
  );

  // Snap to the correct framing on mount and whenever the stage resizes
  useLayoutEffect(() => {
    placeCamera(fitDistance(spin.current?.rotation.y ?? 0));
  }, [fitDistance, placeCamera]);

  useFrame(() => {
    if (!spin.current) return;

    const target = scrollProgress.current * STONE_SPIN_RAD;
    spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, target, 0.08);

    const required = fitDistance(spin.current.rotation.y);
    // Pull back immediately so it can never clip; ease back in
    placeCamera(
      required > camera.position.z
        ? required
        : THREE.MathUtils.lerp(camera.position.z, required, 0.1),
    );
  });

  return (
    <group position={[OFFSET_X, OFFSET_Y, 0]}>
      <group rotation={[0, 0, TILT_RAD]}>
        <group ref={spin}>
          <primitive object={object} />
        </group>
      </group>
    </group>
  );
}

export default function StoneHero() {
  const scrollProgress = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(mq.matches);
    syncMotion();
    mq.addEventListener('change', syncMotion);

    try {
      setWebglOk(!!document.createElement('canvas').getContext('webgl'));
    } catch {
      // Some browsers throw rather than return null when they refuse a context
      setWebglOk(false);
    }

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollProgress.current = Math.min(Math.max(window.scrollY / max, 0), 1);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      mq.removeEventListener('change', syncMotion);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const show3d = webglOk && !reducedMotion;

  return (
    <div className="hero__stage" role="img" aria-label="Stone centerpiece">
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
            <StoneModel scrollProgress={scrollProgress} />
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
        width="177"
        height="103"
      />
    </div>
  );
}

useGLTF.preload(STONE_GLB);
