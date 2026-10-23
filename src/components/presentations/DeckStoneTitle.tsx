import { Suspense, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { STONE_FOV, STONE_REST_YAW, STONE_TILT_DEG } from '../../data/stone-hull';
import { STONE_SETS, StoneMesh } from '../StoneHero';
import { withBase } from '../../lib/paths';

const TILT_RAD = THREE.MathUtils.degToRad(STONE_TILT_DEG);
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(STONE_FOV) / 2);
const CAMERA_Z = 8;
const STONE_STILL = withBase('/images/stone-smooth.png');
/** Radians per second. Matches the homepage idle spin. */
const IDLE_SPIN = 0.14;
const DITHER_CELL_CSS_PX = 1.5;
const DITHER_MIX = 1;
const ROUGH_DITHER_GAIN = 0.52;
const STONE_MULTIPLY = new THREE.Vector3(0.7, 0.69, 0.64);
const ROUGH_CONTRAST = 1.15;

/**
 * Same framing as the homepage: large, and sitting right of centre so the
 * type crosses it.
 */
function frame(w: number, h: number) {
  if (w >= 900) {
    return { cx: w * 0.6, cy: h * 0.5, r: Math.min(h * 0.76, w * 0.48) };
  }
  return { cx: w * 0.64, cy: h * 0.56, r: Math.min(w * 0.82, h * 0.44) };
}

function hexToRgb(hex: string) {
  const value = hex.trim().replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  const n = Number.parseInt(full, 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const stoneUniforms = {
  uDitherCell: { value: 2 },
  uDitherMix: { value: DITHER_MIX },
  uInk: { value: new THREE.Vector3(0.11, 0.11, 0.1) },
  uPaper: { value: new THREE.Vector3(0.98, 0.98, 0.95) },
  uKnockMap: { value: null as THREE.Texture | null },
  uKnockRect: { value: new THREE.Vector4(0, 0, 1, 1) },
  uKnockOn: { value: 0 },
};

const stoneHeader = /* glsl */ `
  uniform float uDitherCell;
  uniform float uDitherMix;
  uniform float uDitherGain;
  uniform float uContrast;
  uniform vec3 uMultiply;
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform sampler2D uKnockMap;
  uniform vec4 uKnockRect;
  uniform float uKnockOn;
  float ditherBayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
  float ditherBayer4(vec2 a) { return ditherBayer2(0.5 * a) * 0.25 + ditherBayer2(a); }
  float ditherBayer8(vec2 a) { return ditherBayer4(0.5 * a) * 0.25 + ditherBayer2(a); }
`;

const stoneBody = /* glsl */ `
  gl_FragColor.rgb = clamp((gl_FragColor.rgb - 0.5) * uContrast + 0.5, 0.0, 1.0);
  float stoneLum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722)) * uDitherGain;
  float ditherT = ditherBayer8(floor(gl_FragCoord.xy / uDitherCell)) + 0.5 / 64.0;
  vec3 ditherTone = stoneLum > ditherT ? uPaper : uInk;
  vec3 stoneTone = mix(gl_FragColor.rgb, ditherTone, uDitherMix) * uMultiply;
  vec2 knockUv = (gl_FragCoord.xy - uKnockRect.xy) / uKnockRect.zw;
  float knock = 0.0;
  if (uKnockOn > 0.5 && knockUv.x >= 0.0 && knockUv.y >= 0.0 && knockUv.x <= 1.0 && knockUv.y <= 1.0) {
    knock = texture2D(uKnockMap, knockUv).a;
  }
  vec3 knockTone = stoneLum > 0.55 ? uInk : uPaper;
  gl_FragColor.rgb = mix(stoneTone, knockTone, knock);
`;

function prepareRough(mat: THREE.MeshStandardMaterial) {
  const locals = {
    uDitherGain: { value: ROUGH_DITHER_GAIN },
    uContrast: { value: ROUGH_CONTRAST },
    uMultiply: { value: STONE_MULTIPLY.clone() },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, stoneUniforms, locals);
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `${stoneHeader}\nvoid main() {`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>\n${stoneBody}`);
  };
  mat.customProgramCacheKey = () => 'deck-stone-title';
  mat.needsUpdate = true;
}

function Stone({ yaw, still }: { yaw: RefObject<number>; still: RefObject<boolean> }) {
  const place = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const opacity = useRef(1);
  const envBoost = useRef(0);
  const dragging = useRef(false);
  const { camera, size, viewport } = useThree();

  useEffect(() => {
    stoneUniforms.uDitherCell.value = Math.max(1, Math.round(viewport.dpr * DITHER_CELL_CSS_PX));
  }, [viewport.dpr]);

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
    const dt = Math.min(delta, 0.05);
    if (!still.current) yaw.current += IDLE_SPIN * dt;
    spin.current.rotation.y = yaw.current;
  });

  return (
    <group ref={place}>
      <group rotation={[0, 0, TILT_RAD]}>
        <group ref={spin} rotation={[0, STONE_REST_YAW, 0]}>
          <Suspense fallback={null}>
            <StoneMesh
              url={STONE_SETS.a.rough}
              opacity={opacity}
              envBoost={envBoost}
              renderOrder={0}
              dragging={dragging}
              onHoverChange={() => {}}
              prepare={prepareRough}
            />
          </Suspense>
        </group>
      </group>
    </group>
  );
}

/** Rasterises each title line into the mask the stone shader knocks out. */
function Knockout({ root }: { root: RefObject<HTMLElement | null> }) {
  const { gl, size } = useThree();
  const [layout, setLayout] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const bump = () => setLayout((n) => n + 1);
    const observer = new ResizeObserver(bump);
    observer.observe(el);
    void document.fonts.ready.then(bump);
    document.fonts.addEventListener('loadingdone', bump);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener('loadingdone', bump);
    };
  }, [root]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = [...el.querySelectorAll<HTMLElement>('[data-knockout]')];
    const canvasRect = gl.domElement.getBoundingClientRect();
    if (lines.length === 0 || canvasRect.width === 0) return;

    const buffer = gl.getDrawingBufferSize(new THREE.Vector2());
    const ratio = buffer.x / canvasRect.width;
    const boxes = lines.map((line) => line.getBoundingClientRect());
    const left = Math.min(...boxes.map((b) => b.left)) - 4;
    const top = Math.min(...boxes.map((b) => b.top)) - 4;
    const right = Math.max(...boxes.map((b) => b.right)) + 4;
    const bottom = Math.max(...boxes.map((b) => b.bottom)) + 4;

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.ceil((right - left) * ratio));
    canvas.height = Math.max(1, Math.ceil((bottom - top) * ratio));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';

    lines.forEach((line, i) => {
      const text = line.textContent ?? '';
      const cs = getComputedStyle(line);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
      const metrics = ctx.measureText(text);
      const ascent = metrics.fontBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent;
      const box = boxes[i];
      const baseline = box.top - top + (box.height - (ascent + descent)) / 2 + ascent;
      ctx.fillText(text, box.left - left, baseline);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    const previous = stoneUniforms.uKnockMap.value;
    stoneUniforms.uKnockMap.value = texture;
    stoneUniforms.uKnockRect.value.set(
      (left - canvasRect.left) * ratio,
      (canvasRect.bottom - bottom) * ratio,
      canvas.width,
      canvas.height,
    );
    stoneUniforms.uKnockOn.value = 1;
    const tokens = getComputedStyle(document.documentElement);
    stoneUniforms.uPaper.value.copy(hexToRgb(tokens.getPropertyValue('--bg') || '#fbfbf1'));
    stoneUniforms.uInk.value.copy(hexToRgb(tokens.getPropertyValue('--ink') || '#1c1c1a'));
    previous?.dispose();
  }, [gl, layout, root, size]);

  useEffect(
    () => () => {
      stoneUniforms.uKnockOn.value = 0;
      stoneUniforms.uKnockMap.value?.dispose();
      stoneUniforms.uKnockMap.value = null;
    },
    [],
  );

  return null;
}

export default function DeckStoneTitle({ title }: { title: string }) {
  const root = useRef<HTMLElement>(null);
  const yaw = useRef(STONE_REST_YAW);
  const still = useRef(false);
  const [webglOk, setWebglOk] = useState(true);
  const lines = title.split('\n').map((line) => line.trim()).filter(Boolean);

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
    <section className="slide slide--stone deck-stone" ref={root} aria-label={lines.join(' ')}>
      <div className="deck-stone__stage" aria-hidden="true">
        {webglOk ? (
          <Canvas
            className="deck-stone__canvas"
            dpr={[1, 2]}
            camera={{ fov: STONE_FOV, position: [0, 0, CAMERA_Z] }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={0.55} />
            <directionalLight position={[3.2, 4.2, 2.4]} intensity={1.35} />
            <directionalLight position={[-2.5, -1.2, -2]} intensity={0.35} />
            <Suspense fallback={null}>
              <Stone yaw={yaw} still={still} />
              <Environment preset="studio" />
            </Suspense>
            <Knockout root={root} />
          </Canvas>
        ) : (
          <img className="deck-stone__still" src={STONE_STILL} alt="" decoding="async" />
        )}
      </div>
      <h1 className="deck-stone__title">
        {lines.map((line) => (
          <span key={line} className="deck-stone__line" data-knockout>
            {line}
          </span>
        ))}
      </h1>
    </section>
  );
}
