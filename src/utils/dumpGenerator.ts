import { 
  AspectRatio, 
  DumpProject, 
  FrameStyle, 
  LayoutPreset, 
  PhotoItem, 
  Slide, 
  SlideElement 
} from '../types';
import { AESTHETIC_VIBES } from '../data/sampleTemplates';

export interface GenerateDumpOptions {
  prompt: string;
  photos: PhotoItem[];
  photoCount?: number;
  slideCount?: number;
  aspect?: AspectRatio;
  aesthetic?: string;
  preferredLayouts?: LayoutPreset[];
  customTitle?: string;
}

// Helper to create unique IDs
export function createId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

// Distribute photos smartly among slides
function distributePhotos(photos: PhotoItem[], targetPhotoCount: number, slideCount: number): PhotoItem[][] {
  const pool = photos.slice(0, targetPhotoCount || photos.length);
  if (pool.length === 0) return Array.from({ length: slideCount }, () => []);

  const result: PhotoItem[][] = Array.from({ length: slideCount }, () => []);
  let poolIdx = 0;

  // Assign at least 1 photo per slide if possible
  for (let s = 0; s < slideCount; s++) {
    const isFirst = s === 0;
    const isMiddle = s > 0 && s < slideCount - 1;
    // Typical pattern: cover has 1-2, middle has 2-4 collages, last has 1-2
    const countForSlide = isFirst ? 1 : isMiddle ? Math.min(3, Math.max(2, Math.floor(pool.length / slideCount))) : 2;

    for (let i = 0; i < countForSlide; i++) {
      if (pool.length > 0) {
        result[s].push(pool[poolIdx % pool.length]);
        poolIdx++;
      }
    }
  }

  return result;
}

// Generate layout elements for a specific layout preset
export function buildSlideElements(
  layout: LayoutPreset,
  photos: PhotoItem[],
  vibeId: string,
  slideIndex: number,
  totalSlides: number,
  options?: { title?: string; caption?: string; isMessy?: boolean }
): SlideElement[] {
  const elements: SlideElement[] = [];
  const vibe = AESTHETIC_VIBES.find(v => v.id === vibeId) || AESTHETIC_VIBES[0];
  const isDark = vibeId === 'dark-moody';
  const textColor = isDark ? '#F4F4F5' : '#1C1917';
  const subtextColor = isDark ? '#A1A1AA' : '#57534E';
  const messy = options?.isMessy ?? (vibeId === 'chaotic-scrapbook');

  const p1 = photos[0]?.url || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80';
  const p2 = photos[1]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
  const p3 = photos[2]?.url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
  const p4 = photos[3]?.url || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80';

  switch (layout) {
    case 'full-bleed': {
      elements.push({
        id: createId('el-img'),
        type: 'image',
        x: 6,
        y: 8,
        width: 88,
        height: 74,
        rotation: 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'rounded-lg'
      });

      if (slideIndex === 0) {
        elements.push({
          id: createId('el-text-title'),
          type: 'text',
          x: 10,
          y: 84,
          width: 80,
          height: 10,
          rotation: 0,
          zIndex: 3,
          text: options?.title || 'SUMMER RECAP',
          fontFamily: vibe.fonts[0] || 'serif',
          fontSize: 26,
          color: textColor,
          letterSpacing: '0.14em',
          textAlign: 'center'
        });
      }

      elements.push({
        id: createId('el-sticker'),
        type: 'sticker',
        x: 82,
        y: 6,
        width: 12,
        height: 12,
        rotation: 10,
        zIndex: 4,
        stickerType: vibe.stickers[0] || 'sparkle'
      });
      break;
    }

    case 'polaroids': {
      // 2 overlapping or stacked polaroids
      const rot1 = messy ? -6 : -3;
      const rot2 = messy ? 7 : 4;
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 10,
        y: 12,
        width: 56,
        height: 52,
        rotation: rot1,
        zIndex: 2,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'polaroid',
        caption: photos[0]?.caption || 'golden hour'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 36,
        y: 38,
        width: 56,
        height: 52,
        rotation: rot2,
        zIndex: 3,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'polaroid',
        caption: photos[1]?.caption || 'unfiltered'
      });

      // Tape sticker
      elements.push({
        id: createId('el-tape'),
        type: 'sticker',
        x: 22,
        y: 8,
        width: 22,
        height: 8,
        rotation: -10,
        zIndex: 5,
        stickerType: 'tape'
      });

      if (messy) {
        elements.push({
          id: createId('el-doodle'),
          type: 'sticker',
          x: 75,
          y: 82,
          width: 14,
          height: 14,
          rotation: 15,
          zIndex: 4,
          stickerType: vibe.stickers[1] || 'star'
        });
      }
      break;
    }

    case 'collage-2': {
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 8,
        y: 12,
        width: 48,
        height: 72,
        rotation: messy ? -3 : 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'film-border'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 48,
        y: 18,
        width: 46,
        height: 64,
        rotation: messy ? 3 : 0,
        zIndex: 2,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-text'),
        type: 'text',
        x: 10,
        y: 88,
        width: 80,
        height: 8,
        rotation: 0,
        zIndex: 4,
        text: options?.caption || 'moments that felt like a film',
        fontFamily: 'handwriting',
        fontSize: 20,
        color: subtextColor,
        textAlign: 'center'
      });
      break;
    }

    case 'collage-3': {
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 8,
        y: 10,
        width: 42,
        height: 40,
        rotation: messy ? -4 : 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'tape-top'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 52,
        y: 12,
        width: 40,
        height: 38,
        rotation: messy ? 4 : 0,
        zIndex: 2,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-img3'),
        type: 'image',
        x: 18,
        y: 52,
        width: 64,
        height: 40,
        rotation: 0,
        zIndex: 3,
        photoUrl: p3,
        photoId: photos[2]?.id,
        frameStyle: 'film-border'
      });

      elements.push({
        id: createId('el-star'),
        type: 'sticker',
        x: 80,
        y: 48,
        width: 14,
        height: 14,
        rotation: -8,
        zIndex: 5,
        stickerType: 'sparkle'
      });
      break;
    }

    case 'grid-4': {
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 8,
        y: 12,
        width: 40,
        height: 36,
        rotation: 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 52,
        y: 12,
        width: 40,
        height: 36,
        rotation: 0,
        zIndex: 1,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-img3'),
        type: 'image',
        x: 8,
        y: 52,
        width: 40,
        height: 36,
        rotation: 0,
        zIndex: 1,
        photoUrl: p3,
        photoId: photos[2]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-img4'),
        type: 'image',
        x: 52,
        y: 52,
        width: 40,
        height: 36,
        rotation: 0,
        zIndex: 1,
        photoUrl: p4,
        photoId: photos[3]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-center-badge'),
        type: 'sticker',
        x: 43,
        y: 45,
        width: 14,
        height: 14,
        rotation: 0,
        zIndex: 4,
        stickerType: 'smiley'
      });
      break;
    }

    case 'scrapbook': {
      // Artistic messy collage with taped photos and doodle
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 8,
        y: 12,
        width: 58,
        height: 50,
        rotation: -6,
        zIndex: 2,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'polaroid',
        caption: 'favorite memory'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 40,
        y: 38,
        width: 52,
        height: 46,
        rotation: 7,
        zIndex: 3,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'tape-corners'
      });

      elements.push({
        id: createId('el-tape1'),
        type: 'sticker',
        x: 18,
        y: 8,
        width: 20,
        height: 7,
        rotation: -8,
        zIndex: 5,
        stickerType: 'tape'
      });

      elements.push({
        id: createId('el-heart'),
        type: 'sticker',
        x: 80,
        y: 30,
        width: 14,
        height: 14,
        rotation: 12,
        zIndex: 4,
        stickerType: 'heart'
      });

      elements.push({
        id: createId('el-note'),
        type: 'text',
        x: 12,
        y: 85,
        width: 76,
        height: 10,
        rotation: -2,
        zIndex: 4,
        text: 'can we please go back? 💭',
        fontFamily: 'handwriting',
        fontSize: 22,
        color: textColor,
        textAlign: 'center'
      });
      break;
    }

    case 'minimal-quote': {
      elements.push({
        id: createId('el-img'),
        type: 'image',
        x: 18,
        y: 14,
        width: 64,
        height: 56,
        rotation: 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-quote'),
        type: 'text',
        x: 10,
        y: 76,
        width: 80,
        height: 14,
        rotation: 0,
        zIndex: 2,
        text: options?.caption || '“keep what is honest, gentle, and real.”',
        fontFamily: 'serif',
        fontSize: 20,
        color: subtextColor,
        textAlign: 'center'
      });
      break;
    }

    case 'split': {
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 8,
        y: 10,
        width: 84,
        height: 40,
        rotation: 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 8,
        y: 52,
        width: 84,
        height: 40,
        rotation: 0,
        zIndex: 2,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'rounded-lg'
      });

      elements.push({
        id: createId('el-tag'),
        type: 'sticker',
        x: 80,
        y: 47,
        width: 14,
        height: 14,
        rotation: 0,
        zIndex: 4,
        stickerType: 'film_stamp'
      });
      break;
    }

    case 'filmstrip':
    default: {
      elements.push({
        id: createId('el-img1'),
        type: 'image',
        x: 12,
        y: 12,
        width: 76,
        height: 38,
        rotation: 0,
        zIndex: 1,
        photoUrl: p1,
        photoId: photos[0]?.id,
        frameStyle: 'film-border'
      });

      elements.push({
        id: createId('el-img2'),
        type: 'image',
        x: 12,
        y: 52,
        width: 76,
        height: 38,
        rotation: 0,
        zIndex: 2,
        photoUrl: p2,
        photoId: photos[1]?.id,
        frameStyle: 'film-border'
      });

      elements.push({
        id: createId('el-stamp'),
        type: 'sticker',
        x: 14,
        y: 91,
        width: 24,
        height: 6,
        rotation: 0,
        zIndex: 3,
        stickerType: 'date_badge'
      });
      break;
    }
  }

  return elements;
}

// Main generation function
export function generateDumpProject(options: GenerateDumpOptions): DumpProject {
  const {
    prompt,
    photos,
    photoCount = photos.length || 10,
    slideCount = 5,
    aspect = '4:5',
    aesthetic = 'cute-pastel',
    customTitle
  } = options;

  const vibe = AESTHETIC_VIBES.find(v => v.id === aesthetic) || AESTHETIC_VIBES[0];
  const photoBins = distributePhotos(photos, photoCount, slideCount);

  // Determine slide layouts sequence based on prompt & aesthetic
  const lowerPrompt = prompt.toLowerCase();
  const wantsChaotic = lowerPrompt.includes('chaotic') || lowerPrompt.includes('messy') || aesthetic === 'chaotic-scrapbook';
  const wantsMinimal = lowerPrompt.includes('minimal') || aesthetic === 'minimal-editorial';
  const wantsPolaroids = lowerPrompt.includes('polaroid');
  const wantsFilm = lowerPrompt.includes('film') || lowerPrompt.includes('35mm') || aesthetic === 'film-vintage';

  const defaultSequence: LayoutPreset[] = wantsChaotic
    ? ['scrapbook', 'polaroids', 'collage-3', 'grid-4', 'polaroids']
    : wantsMinimal
    ? ['full-bleed', 'split', 'collage-2', 'minimal-quote', 'full-bleed']
    : wantsFilm
    ? ['filmstrip', 'full-bleed', 'polaroids', 'collage-2', 'split']
    : ['full-bleed', 'polaroids', 'collage-3', 'split', 'minimal-quote'];

  // Title deduction from prompt
  let title = customTitle;
  if (!title) {
    if (lowerPrompt.includes('goa')) title = 'GOA TRIP DUMP';
    else if (lowerPrompt.includes('birthday')) title = 'ANOTHER TRIP AROUND THE SUN';
    else if (lowerPrompt.includes('summer')) title = 'ENDLESS SUMMER ‘26';
    else if (lowerPrompt.includes('tokyo')) title = 'TOKYO ON 35MM';
    else if (lowerPrompt.includes('italy') || lowerPrompt.includes('amalfi')) title = 'POSITANO DIARIES';
    else if (lowerPrompt.includes('paris')) title = 'WEEKEND IN PARIS';
    else title = 'MEMORIES & MOMENTS';
  }

  const slides: Slide[] = Array.from({ length: slideCount }, (_, idx) => {
    const layout = defaultSequence[idx % defaultSequence.length];
    const bg = vibe.bgOptions[idx % vibe.bgOptions.length];
    const slidePhotos = photoBins[idx] || [];

    const elements = buildSlideElements(
      layout,
      slidePhotos,
      vibe.id,
      idx,
      slideCount,
      {
        title: idx === 0 ? title : undefined,
        isMessy: wantsChaotic
      }
    );

    return {
      id: createId('slide'),
      slideNumber: idx + 1,
      layoutType: layout,
      background: bg,
      elements
    };
  });

  return {
    id: createId('dump'),
    title,
    descriptionPrompt: prompt,
    aesthetic: vibe.id,
    aspect,
    photos: photos.slice(0, photoCount),
    slides,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
