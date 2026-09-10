import { AspectRatio, Slide, SlideElement } from '../types';

export function getCanvasDimensions(aspect: AspectRatio): { width: number; height: number } {
  switch (aspect) {
    case '4:5':
      return { width: 1080, height: 1350 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '9:16':
      return { width: 1080, height: 1920 };
    default:
      return { width: 1080, height: 1350 };
  }
}

// Load an image safely
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Return a fallback placeholder image
      const fallback = new Image();
      fallback.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23e2e8f0"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" fill="%2394a3b8" dominant-baseline="middle" text-anchor="middle" font-size="20">Photo</text></svg>';
      fallback.onload = () => resolve(fallback);
      fallback.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
  });
}

// Render a single slide to a canvas element
export async function renderSlideToCanvas(
  slide: Slide,
  aspect: AspectRatio,
  targetCanvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  const { width, height } = getCanvasDimensions(aspect);
  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // 1. Draw Background
  ctx.fillStyle = slide.background || '#FAF8F5';
  ctx.fillRect(0, 0, width, height);

  // Subtle paper grain overlay
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
  for (let i = 0; i < 400; i++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    ctx.fillRect(gx, gy, 1.5, 1.5);
  }
  ctx.restore();

  // 2. Sort elements by zIndex
  const sorted = [...slide.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // 3. Render each element
  for (const el of sorted) {
    const elX = (el.x / 100) * width;
    const elY = (el.y / 100) * height;
    const elW = (el.width / 100) * width;
    const elH = (el.height / 100) * height;

    ctx.save();
    // Translate & rotate around element center
    const cx = elX + elW / 2;
    const cy = elY + elH / 2;
    ctx.translate(cx, cy);
    ctx.rotate(((el.rotation || 0) * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    if (el.type === 'image' && el.photoUrl) {
      await drawImageElement(ctx, el, elX, elY, elW, elH);
    } else if (el.type === 'text' && el.text) {
      drawTextElement(ctx, el, elX, elY, elW, elH, width);
    } else if (el.type === 'sticker') {
      drawStickerElement(ctx, el, elX, elY, elW, elH);
    }

    ctx.restore();
  }

  return canvas;
}

// Draw image with frame styles
async function drawImageElement(
  ctx: CanvasRenderingContext2D,
  el: SlideElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  try {
    const img = await loadImage(el.photoUrl!);
    const frame = el.frameStyle || 'none';

    if (frame === 'polaroid') {
      // White polaroid container
      const pad = w * 0.06;
      const bottomPad = h * 0.18;

      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.14)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.restore();

      // Inner photo
      ctx.save();
      const imgX = x + pad;
      const imgY = y + pad;
      const imgW = w - pad * 2;
      const imgH = h - pad - bottomPad;
      roundRect(ctx, imgX, imgY, imgW, imgH, 2);
      ctx.clip();
      drawImageCover(ctx, img, imgX, imgY, imgW, imgH);
      ctx.restore();

      // Optional polaroid caption
      if (el.caption) {
        ctx.save();
        ctx.fillStyle = '#374151';
        ctx.font = `600 ${Math.round(w * 0.065)}px "Caveat", cursive, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(el.caption, x + w / 2, y + h - bottomPad * 0.35);
        ctx.restore();
      }
    } else if (frame === 'film-border') {
      // 35mm film border
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#18181B';
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();

      // Sprocket holes along edges
      ctx.fillStyle = '#FFFFFF';
      const holeW = w * 0.04;
      const holeH = h * 0.05;
      const count = 5;
      for (let i = 1; i <= count; i++) {
        const hy = y + (h / (count + 1)) * i - holeH / 2;
        roundRect(ctx, x + w * 0.02, hy, holeW, holeH, 2);
        ctx.fill();
        roundRect(ctx, x + w - w * 0.02 - holeW, hy, holeW, holeH, 2);
        ctx.fill();
      }
      ctx.restore();

      // Inner image
      ctx.save();
      const margin = w * 0.08;
      roundRect(ctx, x + margin, y + margin * 0.8, w - margin * 2, h - margin * 1.6, 4);
      ctx.clip();
      drawImageCover(ctx, img, x + margin, y + margin * 0.8, w - margin * 2, h - margin * 1.6);
      ctx.restore();
    } else if (frame === 'tape-corners' || frame === 'tape-top') {
      // Clean photo with realistic tape
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.restore();

      ctx.save();
      const border = 6;
      roundRect(ctx, x + border, y + border, w - border * 2, h - border * 2, 4);
      ctx.clip();
      drawImageCover(ctx, img, x + border, y + border, w - border * 2, h - border * 2);
      ctx.restore();

      // Draw tape piece
      drawTape(ctx, x + w / 2 - 30, y - 10, 60, 22, -4);
    } else {
      // Rounded standard frame
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      roundRect(ctx, x, y, w, h, 14);
      ctx.clip();
      drawImageCover(ctx, img, x, y, w, h);
      ctx.restore();
    }
  } catch (err) {
    console.error('Error drawing image element:', err);
  }
}

// Text drawing
function drawTextElement(
  ctx: CanvasRenderingContext2D,
  el: SlideElement,
  x: number,
  y: number,
  w: number,
  h: number,
  _canvasWidth: number
) {
  ctx.save();
  ctx.fillStyle = el.color || '#1C1917';
  const size = Math.round((el.fontSize || 24) * 1.8);
  const fontFam =
    el.fontFamily === 'serif'
      ? '"Instrument Serif", Georgia, serif'
      : el.fontFamily === 'handwriting'
      ? '"Caveat", cursive, sans-serif'
      : el.fontFamily === 'display'
      ? '"Syne", sans-serif'
      : '"Plus Jakarta Sans", sans-serif';

  ctx.font = `600 ${size}px ${fontFam}`;
  ctx.textAlign = el.textAlign || 'center';

  const tx = el.textAlign === 'left' ? x : el.textAlign === 'right' ? x + w : x + w / 2;
  const ty = y + h / 2 + size / 3;

  ctx.fillText(el.text!, tx, ty);
  ctx.restore();
}

// Sticker drawing
function drawStickerElement(
  ctx: CanvasRenderingContext2D,
  el: SlideElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const st = el.stickerType || 'sparkle';

  if (st === 'tape') {
    drawTape(ctx, x, y, w, h, 0);
  } else if (st === 'star' || st === 'sparkle') {
    drawSparkle(ctx, x + w / 2, y + h / 2, w / 2, '#F59E0B');
  } else if (st === 'heart') {
    drawHeart(ctx, x + w / 2, y + h / 2, w / 2, '#EC4899');
  } else if (st === 'date_badge') {
    drawDateBadge(ctx, x, y, w, h);
  } else if (st === 'flower') {
    drawFlower(ctx, x + w / 2, y + h / 2, w / 2.2);
  } else {
    // Default cute doodle star
    drawSparkle(ctx, x + w / 2, y + h / 2, w / 2, '#6366F1');
  }
  ctx.restore();
}

function drawTape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rotationDeg: number
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.fillStyle = 'rgba(254, 240, 138, 0.75)'; // Semi-translucent washi tape
  ctx.fillRect(-w / 2, -h / 2, w, h);

  // Subtle tape zig-zag ends
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  // 4-point star
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy, cx + r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy, cx - r, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - r);
  ctx.fill();
  ctx.restore();
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const d = r * 0.9;
  ctx.moveTo(cx, cy + d * 0.7);
  ctx.bezierCurveTo(cx - d * 1.2, cy - d * 0.2, cx - d * 0.8, cy - d * 1.1, cx, cy - d * 0.5);
  ctx.bezierCurveTo(cx + d * 0.8, cy - d * 1.1, cx + d * 1.2, cy - d * 0.2, cx, cy + d * 0.7);
  ctx.fill();
  ctx.restore();
}

function drawFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();
  ctx.fillStyle = '#F472B6';
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const px = cx + Math.cos(angle) * (r * 0.6);
    const py = cy + Math.sin(angle) * (r * 0.6);
    ctx.beginPath();
    ctx.arc(px, py, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Center
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDateBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  roundRect(ctx, x, y, w, h, 4);
  ctx.fill();
  ctx.fillStyle = '#DC2626';
  ctx.font = `bold ${Math.round(h * 0.65)}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('‘26 08 19', x + w / 2, y + h * 0.72);
  ctx.restore();
}

// Draw image covering box with object-fit: cover logic
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = w / h;
  let sx = 0,
    sy = 0,
    sWidth = img.naturalWidth,
    sHeight = img.naturalHeight;

  if (imgRatio > targetRatio) {
    sWidth = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sWidth) / 2;
  } else {
    sHeight = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Download single slide as PNG
export async function renderSlideToBlob(slide: Slide, aspect: AspectRatio): Promise<Blob> {
  const canvas = await renderSlideToCanvas(slide, aspect);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob from canvas'));
    }, 'image/png');
  });
}

export async function downloadSlideAsPng(slide: Slide, aspect: AspectRatio, filename?: string) {
  const canvas = await renderSlideToCanvas(slide, aspect);
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename || `braindump-slide-${slide.slideNumber}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Download all slides in sequence
export async function downloadAllSlides(slides: Slide[], aspect: AspectRatio, baseTitle = 'braindump') {
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    await downloadSlideAsPng(s, aspect, `${baseTitle}-slide-${i + 1}.png`);
    // brief delay between browser downloads
    await new Promise(res => setTimeout(res, 350));
  }
}
