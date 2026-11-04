import { useEffect, useRef } from 'react';

/** Matches the homepage stone in KnockoutHero. */
const CELL_CSS_PX = 1.5;
const CONTRAST = 1.15;
const GAIN = 0.52;
const INK = [0.11, 0.11, 0.1] as const;
const PAPER = [0.98, 0.98, 0.95] as const;
const MULTIPLY = [0.7, 0.69, 0.64] as const;
const BRUSH_CSS_PX = 90;

type Props = {
  src: string;
  alt: string;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function fract(value: number) {
  return value - Math.floor(value);
}

/** Bayer matrix, same recurrence as the stone shader. */
function bayer2(x: number, y: number) {
  const a = Math.floor(x);
  const b = Math.floor(y);
  return fract(a * 0.5 + b * b * 0.75);
}

function bayer4(x: number, y: number) {
  return bayer2(x * 0.5, y * 0.5) * 0.25 + bayer2(x, y);
}

function bayer8(x: number, y: number) {
  return bayer4(x * 0.5, y * 0.5) * 0.25 + bayer2(x, y);
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
}

function paintDither(canvas: HTMLCanvasElement, img: HTMLImageElement, dpr: number) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || !img.naturalWidth) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  coverDraw(ctx, img, width, height);

  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;
  const cell = Math.max(1, Math.round(CELL_CSS_PX * dpr));
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const threshold = new Float32Array(cols * rows);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      threshold[cy * cols + cx] = bayer8(cx, cy) + 0.5 / 64;
    }
  }

  const ink = INK.map((channel, i) => Math.round(clamp01(channel * MULTIPLY[i]) * 255));
  const paper = PAPER.map((channel, i) => Math.round(clamp01(channel * MULTIPLY[i]) * 255));

  for (let y = 0; y < height; y++) {
    const row = Math.floor(y / cell) * cols;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = clamp01((data[i] / 255 - 0.5) * CONTRAST + 0.5);
      const g = clamp01((data[i + 1] / 255 - 0.5) * CONTRAST + 0.5);
      const b = clamp01((data[i + 2] / 255 - 0.5) * CONTRAST + 0.5);
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) * GAIN;
      const tone = lum > threshold[row + Math.floor(x / cell)] ? paper : ink;
      data[i] = tone[0];
      data[i + 1] = tone[1];
      data[i + 2] = tone[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

export default function PortraitReveal({ src, alt }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLImageElement>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const img = colorRef.current;
    const cursor = cursorRef.current;
    const lens = lensRef.current;
    if (!frame || !canvas || !img || !cursor || !lens) return;

    let width = 0;
    let height = 0;
    let dragging = false;

    const redraw = () => {
      if (!img.naturalWidth) return;
      const rect = frame.getBoundingClientRect();
      const nextW = Math.round(rect.width);
      const nextH = Math.round(rect.height);
      if (nextW < 2 || nextH < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bitmapW = Math.round(nextW * dpr);
      const bitmapH = Math.round(nextH * dpr);
      if (nextW === width && nextH === height && canvas.width === bitmapW && canvas.height === bitmapH) {
        return;
      }
      width = nextW;
      height = nextH;
      canvas.width = bitmapW;
      canvas.height = bitmapH;
      lastRef.current = null;
      paintDither(canvas, img, dpr);
      frame.classList.add('is-ready');
    };

    const eraseAt = (x: number, y: number) => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      if (!ctx || rect.width < 1 || rect.height < 1) return;
      const sx = canvas.width / rect.width;
      const sy = canvas.height / rect.height;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x * sx, y * sy, (BRUSH_CSS_PX / 2) * ((sx + sy) / 2), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const eraseTo = (x: number, y: number) => {
      const last = lastRef.current;
      if (!last) {
        eraseAt(x, y);
      } else {
        const dist = Math.hypot(x - last.x, y - last.y);
        const steps = Math.max(1, Math.ceil(dist / (BRUSH_CSS_PX / 4)));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          eraseAt(last.x + (x - last.x) * t, last.y + (y - last.y) * t);
        }
      }
      lastRef.current = { x, y };
    };

    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const placeLens = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      lens.style.width = `${rect.width}px`;
      lens.style.height = `${rect.height}px`;
      lens.style.left = `${BRUSH_CSS_PX / 2 - x}px`;
      lens.style.top = `${BRUSH_CSS_PX / 2 - y}px`;
    };

    const showCursor = (event: PointerEvent, on: boolean) => {
      const mouse = event.pointerType !== 'touch';
      frame.classList.toggle('is-lens', on && mouse);
      cursor.classList.toggle('is-on', on && mouse);
      if (on && mouse) placeLens(event);
    };

    const inside = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    };

    const onPointer = (event: PointerEvent) => {
      const mouse = event.pointerType !== 'touch';
      if (mouse) showCursor(event, true);
      if (!dragging) return;
      const { x, y } = point(event);
      eraseTo(x, y);
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      lastRef.current = null;
      try {
        frame.setPointerCapture(event.pointerId);
      } catch {
        /* The pointer can already be gone. The drag still erases. */
      }
      if (event.pointerType !== 'touch') showCursor(event, true);
      eraseTo(point(event).x, point(event).y);
    };

    const onUp = (event: PointerEvent) => {
      dragging = false;
      lastRef.current = null;
      try {
        if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
      if (event.pointerType === 'touch' || !inside(event)) showCursor(event, false);
    };

    const onLeave = () => {
      if (dragging) return;
      frame.classList.remove('is-lens');
      cursor.classList.remove('is-on');
      lastRef.current = null;
    };

    const observer = new ResizeObserver(redraw);
    observer.observe(frame);
    img.addEventListener('load', redraw);
    frame.addEventListener('pointerdown', onDown);
    frame.addEventListener('pointermove', onPointer);
    frame.addEventListener('pointerup', onUp);
    frame.addEventListener('pointercancel', onUp);
    frame.addEventListener('pointerleave', onLeave);
    if (img.complete) redraw();

    return () => {
      observer.disconnect();
      img.removeEventListener('load', redraw);
      frame.removeEventListener('pointerdown', onDown);
      frame.removeEventListener('pointermove', onPointer);
      frame.removeEventListener('pointerup', onUp);
      frame.removeEventListener('pointercancel', onUp);
      frame.removeEventListener('pointerleave', onLeave);
    };
  }, [src]);

  return (
    <div className="about-portrait" ref={frameRef}>
      <img
        ref={colorRef}
        className="about-portrait__color"
        src={src}
        alt=""
        width={1024}
        height={576}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="about-portrait__dither"
        role="img"
        aria-label={alt}
      />
      <div className="about-portrait__cursor" ref={cursorRef} aria-hidden="true">
        <img ref={lensRef} src={src} alt="" draggable={false} />
      </div>
    </div>
  );
}
