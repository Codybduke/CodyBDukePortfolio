import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { STONE_FOV, STONE_REST_YAW, STONE_TILT_DEG } from '../data/stone-hull';
import { site } from '../data/site';
import { useHomeVersion } from '../lib/homeVersion';
import { withBase } from '../lib/paths';
import {
  BLEND_MS,
  ChunkDebris,
  DustBurst,
  HAMMER_READY_HOT,
  HAMMER_READY_SRC,
  HAMMER_STRIKE_HOLD_MS,
  HAMMER_STRIKE_HOT,
  HAMMER_STRIKE_SRC,
  POLISHED_SCALE,
  SHAKE_CHIP_MS,
  SHAKE_CRUMBLE_MS,
  SHAKE_STRIKE_MS,
  STONE_SETS,
  StoneMesh,
  easeOutCubic,
  useChipCycle,
  type BurstMode,
  type ShakeKind,
} from './StoneHero';

const TILT_RAD = THREE.MathUtils.degToRad(STONE_TILT_DEG);
const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(STONE_FOV) / 2);
const CAMERA_Z = 8;
const STONE_STILL = withBase('/images/stone-smooth.png');
/** Radians per second with nobody touching anything. */
const IDLE_SPIN = 0.14;
/** Extra spin per pixel scrolled, in radians per second. */
const SCROLL_SPIN_PER_PX = 0.018;
const MAX_BOOST = 6;
const BOOST_DECAY = 2.2;
const DRAG_THRESHOLD_PX = 6;
const DRAG_YAW_PER_PX = 0.012;
const DRAG_PITCH_PER_PX = 0.008;
/** Dither cell edge in CSS pixels; rounded to whole device pixels. */
const DITHER_CELL_CSS_PX = 1.5;
/** 0 is the plain render, 1 is pure two-tone dither. */
const DITHER_MIX = 1;
const noop = () => {};

const links = [
  { href: '/', label: 'Home', current: true },
  { href: '/work', label: 'My work', current: false },
  { href: '/about', label: 'About me', current: false },
] as const;

const quoteLines = [
  '“Man cannot remake himself',
  'without suffering, for he',
  'is both the marble and the',
];

type Motion = {
  yaw: number;
  pitch: number;
  boost: number;
  dragging: boolean;
  still: boolean;
};

type StoneApi = { hits: (clientX: number, clientY: number) => boolean };

/** Where the stone sits, in CSS pixels of the stage. */
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

/** Shared by every stone material; `Knockout` fills in the text mask. */
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
  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform sampler2D uKnockMap;
  uniform vec4 uKnockRect;
  uniform float uKnockOn;
  float ditherBayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
  float ditherBayer4(vec2 a) { return ditherBayer2(0.5 * a) * 0.25 + ditherBayer2(a); }
  float ditherBayer8(vec2 a) { return ditherBayer4(0.5 * a) * 0.25 + ditherBayer2(a); }
`;

/**
 * Runs after lighting and colour encoding, so it works on what you actually
 * see. Text over the stone takes the opposite tone of the stone beneath it:
 * paper over dark stone, ink over bright veins and highlights.
 */
const stoneBody = /* glsl */ `
  float stoneLum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
  float ditherT = ditherBayer8(floor(gl_FragCoord.xy / uDitherCell)) + 0.5 / 64.0;
  vec3 ditherTone = stoneLum > ditherT ? uPaper : uInk;
  vec3 stoneTone = mix(gl_FragColor.rgb, ditherTone, uDitherMix);
  vec2 knockUv = (gl_FragCoord.xy - uKnockRect.xy) / uKnockRect.zw;
  float knock = 0.0;
  if (uKnockOn > 0.5 && knockUv.x >= 0.0 && knockUv.y >= 0.0 && knockUv.x <= 1.0 && knockUv.y <= 1.0) {
    knock = texture2D(uKnockMap, knockUv).a;
  }
  vec3 knockTone = stoneLum > 0.55 ? uInk : uPaper;
  gl_FragColor.rgb = mix(stoneTone, knockTone, knock);
`;

function prepareStone(mat: THREE.MeshStandardMaterial) {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, stoneUniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `${stoneHeader}\nvoid main() {`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>\n${stoneBody}`);
  };
  mat.customProgramCacheKey = () => 'knockout-hero-stone';
  mat.needsUpdate = true;
}

type StoneProps = {
  motion: RefObject<Motion>;
  api: RefObject<StoneApi | null>;
  gem: boolean;
  shakeKind: ShakeKind;
  shakeNonce: number;
  burstMode: BurstMode;
  burstNonce: number;
};

function Stone({ motion, api, gem, shakeKind, shakeNonce, burstMode, burstNonce }: StoneProps) {
  const place = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pitch = useRef<THREE.Group>(null);
  const shake = useRef<THREE.Group>(null);
  const scaleGroup = useRef<THREE.Group>(null);
  const shakeUntil = useRef(0);
  const shakeDuration = useRef(SHAKE_CHIP_MS);
  const shakeMag = useRef(0.05);
  const blend = useRef(gem ? 1 : 0);
  const roughOpacity = useRef(gem ? 0 : 1);
  const gemOpacity = useRef(gem ? 1 : 0);
  const gemBoost = useRef(0);
  const noBoost = useRef(0);
  const dragging = useRef(false);
  const { camera, size, gl, viewport } = useThree();
  const scratch = useMemo(
    () => ({ raycaster: new THREE.Raycaster(), ndc: new THREE.Vector2() }),
    [],
  );

  useEffect(() => {
    stoneUniforms.uDitherCell.value = Math.max(1, Math.round(viewport.dpr * DITHER_CELL_CSS_PX));
  }, [viewport.dpr]);

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

  useEffect(() => {
    api.current = {
      hits(clientX, clientY) {
        if (!scaleGroup.current) return false;
        const rect = gl.domElement.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        scratch.ndc.set(
          ((clientX - rect.left) / rect.width) * 2 - 1,
          -((clientY - rect.top) / rect.height) * 2 + 1,
        );
        scratch.raycaster.setFromCamera(scratch.ndc, camera);
        return scratch.raycaster.intersectObject(scaleGroup.current, true).length > 0;
      },
    };
    return () => {
      api.current = null;
    };
  }, [api, camera, gl, scratch]);

  useFrame((_, delta) => {
    const m = motion.current;
    if (!m || !spin.current || !pitch.current) return;
    const dt = Math.min(delta, 0.05);
    if (!m.dragging) {
      m.yaw += ((m.still ? 0 : IDLE_SPIN) + m.boost) * dt;
      m.boost *= Math.exp(-BOOST_DECAY * dt);
      m.pitch = THREE.MathUtils.lerp(m.pitch, 0, 1 - Math.exp(-1.6 * dt));
    }
    spin.current.rotation.y = m.yaw;
    pitch.current.rotation.x = m.pitch;

    const target = gem ? 1 : 0;
    const step = dt / (BLEND_MS / 1000);
    if (blend.current < target) blend.current = Math.min(target, blend.current + step);
    else if (blend.current > target) blend.current = Math.max(target, blend.current - step);
    const t = blend.current;
    roughOpacity.current = 1 - t;
    gemOpacity.current = t;
    gemBoost.current = 0.75 * Math.sin(t * Math.PI);
    scaleGroup.current?.scale.setScalar(THREE.MathUtils.lerp(1, POLISHED_SCALE, easeOutCubic(t)));

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
    <group ref={place}>
      <group rotation={[0, 0, TILT_RAD]}>
        <group ref={spin} rotation={[0, STONE_REST_YAW, 0]}>
          <group ref={pitch}>
            <group ref={shake}>
              <group ref={scaleGroup}>
                <Suspense fallback={null}>
                  <StoneMesh
                    url={STONE_SETS.a.rough}
                    opacity={roughOpacity}
                    envBoost={noBoost}
                    renderOrder={0}
                    dragging={dragging}
                    onHoverChange={noop}
                    prepare={prepareStone}
                  />
                </Suspense>
                <Suspense fallback={null}>
                  <StoneMesh
                    url={STONE_SETS.a.polished}
                    opacity={gemOpacity}
                    envBoost={gemBoost}
                    renderOrder={1}
                    dragging={dragging}
                    onHoverChange={noop}
                    prepare={prepareStone}
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

/**
 * Rasterises every `[data-knockout]` line into a mask the stone shader reads,
 * so text crossing the stone is repainted in the stone's opposite tone. The
 * DOM copy underneath stays the real, clickable text.
 */
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

export default function KnockoutHero() {
  const version = useHomeVersion();
  const root = useRef<HTMLElement>(null);
  const api = useRef<StoneApi | null>(null);
  const motion = useRef<Motion>({
    yaw: STONE_REST_YAW,
    pitch: 0,
    boost: 0,
    dragging: false,
    still: false,
  });
  const [webglOk, setWebglOk] = useState(true);
  const [onScreen, setOnScreen] = useState(true);
  const readyHammer = useRef<HTMLImageElement>(null);
  const strikeHammer = useRef<HTMLImageElement>(null);
  const { gem, shakeKind, shakeNonce, burstMode, burstNonce, chip } = useChipCycle(
    STONE_SETS.a.polished,
    noop,
  );
  const chipRef = useRef(chip);
  chipRef.current = chip;
  const active = version === 'a';

  useEffect(() => {
    try {
      setWebglOk(!!document.createElement('canvas').getContext('webgl2'));
    } catch {
      setWebglOk(false);
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      motion.current.still = mq.matches;
    };
    syncMotion();
    mq.addEventListener('change', syncMotion);

    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (motion.current.still) return;
      motion.current.boost = THREE.MathUtils.clamp(
        motion.current.boost + dy * SCROLL_SPIN_PER_PX,
        -MAX_BOOST,
        MAX_BOOST,
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      mq.removeEventListener('change', syncMotion);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !active) return;

    let frameId = 0;
    let releaseTimer = 0;
    const pointer = { x: 0, y: 0 };
    const hammer = { over: false, pressing: false };
    const overLink = (target: EventTarget | null) =>
      target instanceof Element && !!target.closest('a');

    const syncHammer = () => {
      const ready = readyHammer.current;
      const strike = strikeHammer.current;
      if (!ready || !strike) return;
      const show = (hammer.over || hammer.pressing) && !motion.current.dragging;
      ready.style.transform = `translate3d(${pointer.x - HAMMER_READY_HOT.x}px, ${pointer.y - HAMMER_READY_HOT.y}px, 0)`;
      strike.style.transform = `translate3d(${pointer.x - HAMMER_STRIKE_HOT.x}px, ${pointer.y - HAMMER_STRIKE_HOT.y}px, 0)`;
      ready.classList.toggle('is-shown', show && !hammer.pressing);
      strike.classList.toggle('is-shown', show && hammer.pressing);
      el.style.cursor = motion.current.dragging ? 'grabbing' : show ? 'none' : '';
    };

    const onHover = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      syncHammer();
      if (motion.current.dragging) return;
      const target = event.target;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        hammer.over = !overLink(target) && !!api.current?.hits(pointer.x, pointer.y);
        syncHammer();
      });
    };

    const onLeave = () => {
      hammer.over = false;
      syncHammer();
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || overLink(event.target)) return;
      if (!api.current?.hits(event.clientX, event.clientY)) return;

      window.clearTimeout(releaseTimer);
      const pressedAt = performance.now();
      hammer.pressing = true;
      syncHammer();

      const id = event.pointerId;
      let lastX = event.clientX;
      let lastY = event.clientY;
      let lastAt = performance.now();
      let velocity = 0;
      let moved = false;

      const onMove = (move: PointerEvent) => {
        if (move.pointerId !== id) return;
        pointer.x = move.clientX;
        pointer.y = move.clientY;
        const dx = move.clientX - lastX;
        const dy = move.clientY - lastY;
        if (!moved) {
          if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;
          if (move.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) * 1.15) {
            stop();
            return;
          }
          moved = true;
          motion.current.dragging = true;
          motion.current.boost = 0;
          el.classList.add('knockout-hero--dragging');
          syncHammer();
        }
        move.preventDefault();
        const now = performance.now();
        const step = dx * DRAG_YAW_PER_PX;
        velocity = step / Math.max((now - lastAt) / 1000, 1 / 120);
        lastAt = now;
        lastX = move.clientX;
        lastY = move.clientY;
        motion.current.yaw += step;
        motion.current.pitch = THREE.MathUtils.clamp(
          motion.current.pitch + dy * DRAG_PITCH_PER_PX,
          -1.2,
          1.2,
        );
      };

      const stop = () => {
        window.removeEventListener('pointermove', onMove, true);
        window.removeEventListener('pointerup', onUp, true);
        window.removeEventListener('pointercancel', onUp, true);
      };

      const onUp = (up: PointerEvent) => {
        if (up.pointerId !== id) return;
        stop();
        const wait = Math.max(0, HAMMER_STRIKE_HOLD_MS - (performance.now() - pressedAt));
        releaseTimer = window.setTimeout(() => {
          hammer.pressing = false;
          syncHammer();
        }, wait);
        if (!moved) {
          chipRef.current();
          return;
        }
        motion.current.dragging = false;
        const recent = performance.now() - lastAt < 80;
        motion.current.boost = recent
          ? THREE.MathUtils.clamp(velocity - IDLE_SPIN, -MAX_BOOST, MAX_BOOST)
          : 0;
        el.classList.remove('knockout-hero--dragging');
        syncHammer();
      };

      window.addEventListener('pointermove', onMove, { capture: true, passive: false });
      window.addEventListener('pointerup', onUp, { capture: true });
      window.addEventListener('pointercancel', onUp, { capture: true });
    };

    el.addEventListener('pointermove', onHover);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(releaseTimer);
      el.removeEventListener('pointermove', onHover);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      el.style.cursor = '';
      readyHammer.current?.classList.remove('is-shown');
      strikeHammer.current?.classList.remove('is-shown');
    };
  }, [active]);

  return (
    <section className="knockout-hero" data-home-variant="knockout" ref={root} aria-labelledby="knockout-hero-title">
      <div className="knockout-hero__stage" aria-hidden="true">
        {active && webglOk ? (
          <Canvas
            className="knockout-hero__canvas"
            style={{ pointerEvents: 'none' }}
            dpr={[1, 2]}
            frameloop={onScreen ? 'always' : 'never'}
            camera={{ fov: STONE_FOV, position: [0, 0, CAMERA_Z] }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={0.55} />
            <directionalLight position={[3.2, 4.2, 2.4]} intensity={1.35} />
            <directionalLight position={[-2.5, -1.2, -2]} intensity={0.35} />
            <Suspense fallback={null}>
              <Stone
                motion={motion}
                api={api}
                gem={gem}
                shakeKind={shakeKind}
                shakeNonce={shakeNonce}
                burstMode={burstMode}
                burstNonce={burstNonce}
              />
              <Environment preset="studio" />
            </Suspense>
            <Knockout root={root} />
          </Canvas>
        ) : (
          active && <img className="knockout-hero__still" src={STONE_STILL} alt="" decoding="async" />
        )}
      </div>
      <img
        ref={readyHammer}
        className="hero__hammer"
        src={HAMMER_READY_SRC}
        alt=""
        width={27}
        height={30}
        draggable={false}
      />
      <img
        ref={strikeHammer}
        className="hero__hammer"
        src={HAMMER_STRIKE_SRC}
        alt=""
        width={26}
        height={27}
        draggable={false}
      />

      <div className="shell knockout-hero__inner">
        <h1 className="sr-only" id="knockout-hero-title">
          {site.name}, product designer
        </h1>
        <div className="knockout-hero__copy">
          <p className="knockout-hero__headline">{site.headline}</p>
          <p className="knockout-hero__lede">{site.oneLiner}</p>
        </div>

        <nav className="knockout-hero__nav" aria-label="Main menu">
          {links.map((link) => (
            <a
              key={link.href}
              className="knockout-hero__link"
              href={withBase(link.href)}
              aria-current={link.current ? 'page' : undefined}
            >
              <span data-knockout>{link.label}</span>
            </a>
          ))}
        </nav>

        <blockquote className="knockout-hero__quote">
          <p>
            {quoteLines.map((line) => (
              <span key={line}>
                <span className="knockout-hero__quote-line" data-knockout>
                  {line}
                </span>{' '}
              </span>
            ))}
            <span className="knockout-hero__quote-line">
              <span data-knockout>sculptor.” </span>
              <span className="knockout-hero__quote-by" data-knockout>
                – Alexis Carrel
              </span>
            </span>
          </p>
        </blockquote>
      </div>
    </section>
  );
}
