import { Suspense, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { STONE_FOV, STONE_REST_YAW, STONE_TILT_DEG } from '../../data/stone-hull';
import { STONE_SETS, StoneMesh } from '../StoneHero';

const TILT_RAD = THREE.MathUtils.degToRad(STONE_TILT_DEG);
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(STONE_FOV) / 2);
const CAMERA_Z = 8;
/** Slower than the homepage, so the form reads as an object rather than a spinner. */
const IDLE_SPIN = 0.08;
const DRAG_THRESHOLD_PX = 6;
const DRAG_YAW_PER_PX = 0.012;
const DRAG_PITCH_PER_PX = 0.008;

/**
 * Own uniforms. The Move-In title stone keeps a separate set, and the two
 * decks must not write each other's dither.
 */
function stoneUniforms(gain: number) {
  return {
    uDitherCell: { value: 2 },
    uDitherMix: { value: 1 },
    uDitherGain: { value: gain },
    uInk: { value: new THREE.Vector3(0.04, 0.04, 0.035) },
    uPaper: { value: new THREE.Vector3(0.94, 0.91, 0.84) },
  };
}

/** Each stone keeps its own light and dark. Gain only lifts a dark mesh. */
const roughUniforms = stoneUniforms(1.15);
const polishedUniforms = stoneUniforms(1);

const header = /* glsl */ `
  uniform float uDitherCell;
  uniform float uDitherMix;
  uniform float uDitherGain;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  float ditherBayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
  float ditherBayer4(vec2 a) { return ditherBayer2(0.5 * a) * 0.25 + ditherBayer2(a); }
  float ditherBayer8(vec2 a) { return ditherBayer4(0.5 * a) * 0.25 + ditherBayer2(a); }
`;

const ditherSample = /* glsl */ `
  float stoneLum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float lifted = clamp(stoneLum * uDitherGain + 0.05, 0.0, 1.0);
  float ditherT = ditherBayer8(floor(gl_FragCoord.xy / uDitherCell)) + 0.5 / 64.0;
`;

/** Bright stone stays paper. Dark stone stays ink. */
const naturalBody = /* glsl */ `
  ${ditherSample}
  vec3 ditherTone = lifted > ditherT ? uPaper : uInk;
  gl_FragColor = vec4(mix(gl_FragColor.rgb, ditherTone, uDitherMix), 1.0);
`;

function frame(w: number, h: number) {
  if (w >= 900) return { cx: w * 0.69, cy: h * 0.52, r: Math.min(h * 0.9, w * 0.48) };
  return { cx: w * 0.55, cy: h * 0.36, r: Math.min(w * 0.78, h * 0.36) };
}

function prepareStone(
  mat: THREE.MeshStandardMaterial,
  uniforms: ReturnType<typeof stoneUniforms>,
  body: string,
  cacheKey: string,
) {
  mat.transparent = false;
  mat.opacity = 1;
  mat.depthWrite = true;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `${header}\nvoid main() {`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>\n${body}`);
  };
  mat.customProgramCacheKey = () => cacheKey;
  mat.needsUpdate = true;
}

const prepareRough = (mat: THREE.MeshStandardMaterial) =>
  prepareStone(mat, roughUniforms, naturalBody, 'bill-stone-rough-v1');
const preparePolished = (mat: THREE.MeshStandardMaterial) =>
  prepareStone(mat, polishedUniforms, naturalBody, 'bill-stone-polished-v1');

function Stone({
  yaw,
  still,
  url,
  polished,
}: {
  yaw: RefObject<number>;
  still: RefObject<boolean>;
  url: string;
  polished: boolean;
}) {
  const place = useRef<THREE.Group>(null);
  const pitch = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const userPitch = useRef(0);
  const opacity = useRef(1);
  const envBoost = useRef(0);
  const dragging = useRef(false);
  const { camera, gl, size, viewport } = useThree();

  useEffect(() => {
    const uniforms = polished ? polishedUniforms : roughUniforms;
    uniforms.uDitherCell.value = Math.max(1, Math.round(viewport.dpr * 1.5));
  }, [polished, viewport.dpr]);

  useEffect(() => {
    const el = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const drag = {
      pointerId: -1,
      lastX: 0,
      lastY: 0,
      moved: false,
      onMove: null as ((event: PointerEvent) => void) | null,
      onUp: null as ((event: PointerEvent) => void) | null,
    };

    const hitsStone = (clientX: number, clientY: number) => {
      const root = spin.current;
      if (!root) return false;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(root, true).length > 0;
    };

    const stopDragListeners = () => {
      if (drag.onMove) window.removeEventListener('pointermove', drag.onMove, true);
      if (drag.onUp) {
        window.removeEventListener('pointerup', drag.onUp, true);
        window.removeEventListener('pointercancel', drag.onUp, true);
      }
      drag.onMove = null;
      drag.onUp = null;
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || !hitsStone(event.clientX, event.clientY)) return;
      stopDragListeners();
      drag.pointerId = event.pointerId;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.moved = false;

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== drag.pointerId) return;
        const dx = move.clientX - drag.lastX;
        const dy = move.clientY - drag.lastY;
        if (!drag.moved) {
          if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;
          drag.moved = true;
          dragging.current = true;
          el.style.cursor = 'grabbing';
        }
        move.preventDefault();
        drag.lastX = move.clientX;
        drag.lastY = move.clientY;
        yaw.current += dx * DRAG_YAW_PER_PX;
        userPitch.current = THREE.MathUtils.clamp(
          userPitch.current + dy * DRAG_PITCH_PER_PX,
          -Math.PI,
          Math.PI,
        );
      };

      const onUp = (up: PointerEvent) => {
        if (up.pointerId !== drag.pointerId) return;
        stopDragListeners();
        dragging.current = false;
        el.style.cursor = hitsStone(up.clientX, up.clientY) ? 'grab' : '';
      };

      drag.onMove = onMove;
      drag.onUp = onUp;
      window.addEventListener('pointermove', onMove, { capture: true, passive: false });
      window.addEventListener('pointerup', onUp, { capture: true });
      window.addEventListener('pointercancel', onUp, { capture: true });
    };

    const onHover = (event: PointerEvent) => {
      if (dragging.current) {
        el.style.cursor = 'grabbing';
        return;
      }
      el.style.cursor = hitsStone(event.clientX, event.clientY) ? 'grab' : '';
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onHover);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onHover);
      stopDragListeners();
      dragging.current = false;
      el.style.cursor = '';
    };
  }, [camera, gl, yaw]);

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, 0, CAMERA_Z);
    cam.near = 0.1;
    cam.far = 50;
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();

    const { cx, cy, r } = frame(size.width, size.height);
    const halfH = CAMERA_Z * TAN_HALF_FOV;
    const halfW = halfH * (size.width / size.height);
    place.current?.position.set(
      (cx / size.width) * 2 * halfW - halfW,
      halfH - (cy / size.height) * 2 * halfH,
      0,
    );
    place.current?.scale.setScalar((r / (size.height / 2)) * halfH);
  }, [camera, size]);

  useFrame((_, delta) => {
    if (!spin.current) return;
    if (!still.current && !dragging.current) yaw.current += IDLE_SPIN * Math.min(delta, 0.05);
    spin.current.rotation.y = yaw.current;
    if (pitch.current) pitch.current.rotation.x = userPitch.current;
  });

  return (
    <group ref={place}>
      <group rotation={[0, 0, TILT_RAD]}>
        <group ref={pitch}>
          <group ref={spin} rotation={[0, STONE_REST_YAW, 0]}>
            <Suspense fallback={null}>
              <StoneMesh
                url={url}
                opacity={opacity}
                envBoost={envBoost}
                renderOrder={0}
                dragging={dragging}
                onHoverChange={() => {}}
                prepare={polished ? preparePolished : prepareRough}
              />
            </Suspense>
          </group>
        </group>
      </group>
    </group>
  );
}

type Props = {
  kicker?: string;
  title: string;
  lead?: string;
  /** Polished model. The opener keeps the rough stone. */
  polished?: boolean;
};

export default function BillOpener({ kicker, title, lead, polished = false }: Props) {
  const yaw = useRef(STONE_REST_YAW);
  const still = useRef(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      setWebglOk(!!document.createElement('canvas').getContext('webgl2'));
    } catch {
      setWebglOk(false);
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      still.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <section
      className={`slide slide--opener${polished ? ' bill-open--close' : ''}`}
      aria-label={`${title}. ${lead ?? ''}`}
    >
      <div className="bill-open__stage" aria-hidden="true">
        {webglOk ? (
          <Canvas
            className="bill-open__canvas"
            dpr={[1, 2]}
            camera={{ fov: STONE_FOV, position: [0, 0, CAMERA_Z] }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor(0x070707, 1)}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[3.2, 4.2, 2.4]} intensity={1.5} />
            <directionalLight position={[-2.4, -1, -2]} intensity={0.45} />
            <Suspense fallback={null}>
              <Stone
                yaw={yaw}
                still={still}
                polished={polished}
                url={polished ? STONE_SETS.a.polished : STONE_SETS.a.rough}
              />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        ) : null}
      </div>
      <div className="bill-open__copy">
        {kicker && <p className="bill-open__kicker">{kicker}</p>}
        <h1 className="bill-open__name">{title}</h1>
        {lead && <p className="bill-open__lead">{lead}</p>}
      </div>
    </section>
  );
}

useGLTF.preload(STONE_SETS.a.polished);
