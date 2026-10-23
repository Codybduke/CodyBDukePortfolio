import clashUrl from '../assets/fonts/ClashGrotesk-Semibold.otf?url';
import figtreeBoldUrl from '../assets/fonts/Figtree-Bold.ttf?url';
import figtreeMediumUrl from '../assets/fonts/Figtree-Medium.ttf?url';
import figtreeRegularUrl from '../assets/fonts/Figtree-Regular.ttf?url';
import figtreeSemiBoldUrl from '../assets/fonts/Figtree-SemiBold.ttf?url';
import sourceSerifRegularUrl from '../assets/fonts/SourceSerif4-Regular.ttf?url';
import sourceSerifSemiboldUrl from '../assets/fonts/SourceSerif4-Semibold.ttf?url';
import logoSvg from '../../public/brand/stone-logo.svg?raw';

const LOGO_WIDTH = 55;
const LOGO_HEIGHT = 23;

const FONT_FILES = [
  ['Clash Grotesk Semibold', clashUrl],
  ['Figtree', figtreeRegularUrl],
  ['Figtree Medium', figtreeMediumUrl],
  ['Figtree SemiBold', figtreeSemiBoldUrl],
  ['Figtree Bold', figtreeBoldUrl],
  ['Source Serif 4', sourceSerifRegularUrl],
  ['Source Serif 4 Semibold', sourceSerifSemiboldUrl],
] as const;

export async function loadResumeDocAssets() {
  const fonts = await Promise.all(
    FONT_FILES.map(async ([name, url]) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load ${name}`);
      return { name, data: new Uint8Array(await response.arrayBuffer()) };
    }),
  );

  const svg = new TextEncoder().encode(logoSvg);
  const png = await logoPng(logoSvg);
  return { fonts, logo: { svg, png } };
}

async function logoPng(svg: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const image = await loadImage(url);
    const scale = 4;
    const canvas = document.createElement('canvas');
    canvas.width = LOGO_WIDTH * scale;
    canvas.height = LOGO_HEIGHT * scale;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not draw the logo');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('Could not draw the logo'))), 'image/png');
    });
    return new Uint8Array(await png.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not draw the logo'));
    image.src = url;
  });
}
