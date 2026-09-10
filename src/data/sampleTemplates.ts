import { AestheticVibe, TemplateReference } from '../types';

export const AESTHETIC_VIBES: AestheticVibe[] = [
  {
    id: 'cute-pastel',
    name: 'Cute Pastel & Soft',
    badge: 'Trending',
    description: 'Soft pinks, lilacs, butter yellow, playful stickers & scrapbook vibes',
    samplePrompt: 'Create a super cute and chaotic birthday dump with 12 photos across 5 slides with stickers, doodles, and sweet captions',
    bgOptions: ['#FFF5F8', '#F3E8EE', '#FBF8F2', '#EBF4F6'],
    accentColor: '#F472B6',
    defaultLayouts: ['polaroids', 'scrapbook', 'collage-3', 'split', 'minimal-quote'],
    stickers: ['sparkle', 'heart', 'star', 'flower', 'smiley', 'bow', 'tape'],
    fonts: ['handwriting', 'sans', 'display'],
    previewCover: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'film-vintage',
    name: '35mm Film & Vintage',
    badge: 'Classic',
    description: 'Analog film borders, subtle grain, warm amber tones & date stamps',
    samplePrompt: '35mm disposable camera trip dump, 15 photos in 6 slides, mix of sprocket film borders, double polaroids, and raw snapshots',
    bgOptions: ['#F7F3EB', '#EFE9DE', '#1C1917', '#E5DDD0'],
    accentColor: '#D97706',
    defaultLayouts: ['filmstrip', 'full-bleed', 'polaroids', 'collage-2', 'split'],
    stickers: ['film_stamp', 'date_badge', 'tape', 'barcode', 'star'],
    fonts: ['serif', 'handwriting', 'sans'],
    previewCover: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'minimal-editorial',
    name: 'Minimal Editorial',
    badge: 'Clean',
    description: 'Crisp gallery margins, chic typography, high contrast & quiet luxury',
    samplePrompt: 'Very clean Parisian weekend dump, 8 photos in 4 slides, generous negative space, bold serif headings, 1 quote slide',
    bgOptions: ['#FAF9F6', '#FFFFFF', '#F4F4F5', '#EFEFEF'],
    accentColor: '#18181B',
    defaultLayouts: ['full-bleed', 'minimal-quote', 'split', 'collage-2'],
    stickers: ['star', 'barcode'],
    fonts: ['serif', 'display', 'sans'],
    previewCover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dark-moody',
    name: 'Dark & Moody Night',
    badge: 'Atmospheric',
    description: 'Charcoal canvas, flash photography, neon glow & cinematic contrast',
    samplePrompt: 'Dark moody club & late night food dump, 14 photos across 5 slides, high flash, blurry candid feel with midnight captions',
    bgOptions: ['#121214', '#1A1A1E', '#09090B', '#1E1B18'],
    accentColor: '#E4E4E7',
    defaultLayouts: ['full-bleed', 'collage-3', 'grid-4', 'filmstrip', 'scrapbook'],
    stickers: ['star', 'sparkle', 'barcode', 'smiley'],
    fonts: ['display', 'sans'],
    previewCover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'chaotic-scrapbook',
    name: 'Chaotic Scrapbook',
    badge: 'Popular',
    description: 'Overlapping snapshots, angled washi tape, torn paper & handwritten doodles',
    samplePrompt: 'Chaotic college friends dump with 20 photos across 5 slides, tilted polaroids, taped corners, lots of memes and notes',
    bgOptions: ['#FDFBF7', '#F5EFEB', '#EDE8F5', '#FEF3C7'],
    accentColor: '#EC4899',
    defaultLayouts: ['scrapbook', 'polaroids', 'collage-3', 'grid-4'],
    stickers: ['tape', 'heart', 'star', 'flower', 'smiley', 'sparkle'],
    fonts: ['handwriting', 'sans'],
    previewCover: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'
  }
];

export const REFERENCE_TEMPLATES: TemplateReference[] = [
  {
    id: 'tmpl-amalfi-sun',
    title: 'Italian Riviera Sun',
    category: 'Travel',
    aesthetic: 'Film / Vintage',
    coverPhoto: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    photoCount: 14,
    description: 'Sun-drenched coastal escapade with warm cream backgrounds, washi tape corners, and classic 35mm film borders.',
    promptExample: 'Create an Italian holiday dump with 14 photos across 5 slides, mix of cliffside shots, spritz glasses, and polaroid stacks.',
    tags: ['Coastal', 'Warm', 'Aperitivo', 'Film'],
    slides: [
      {
        id: 's1',
        slideNumber: 1,
        layoutType: 'full-bleed',
        background: '#FAF8F5',
        elements: [
          {
            id: 'e1',
            type: 'image',
            x: 5,
            y: 8,
            width: 90,
            height: 72,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'e2',
            type: 'text',
            x: 10,
            y: 83,
            width: 80,
            height: 12,
            rotation: 0,
            zIndex: 3,
            text: 'POSITANO ON FILM',
            fontFamily: 'serif',
            fontSize: 28,
            color: '#1C1917',
            letterSpacing: '0.15em',
            textAlign: 'center'
          },
          {
            id: 'e3',
            type: 'sticker',
            x: 80,
            y: 5,
            width: 15,
            height: 15,
            rotation: 12,
            zIndex: 4,
            stickerType: 'sparkle'
          }
        ]
      },
      {
        id: 's2',
        slideNumber: 2,
        layoutType: 'polaroids',
        background: '#FAF8F5',
        elements: [
          {
            id: 'e4',
            type: 'image',
            x: 10,
            y: 12,
            width: 55,
            height: 48,
            rotation: -4,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'polaroid',
            caption: 'cove discovery'
          },
          {
            id: 'e5',
            type: 'image',
            x: 35,
            y: 42,
            width: 55,
            height: 48,
            rotation: 5,
            zIndex: 3,
            photoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'polaroid',
            caption: 'aperol hour'
          },
          {
            id: 'e6',
            type: 'sticker',
            x: 20,
            y: 8,
            width: 20,
            height: 8,
            rotation: -8,
            zIndex: 5,
            stickerType: 'tape'
          }
        ]
      },
      {
        id: 's3',
        slideNumber: 3,
        layoutType: 'collage-3',
        background: '#FAF8F5',
        elements: [
          {
            id: 'e7',
            type: 'image',
            x: 8,
            y: 10,
            width: 42,
            height: 38,
            rotation: -2,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'tape-top'
          },
          {
            id: 'e8',
            type: 'image',
            x: 52,
            y: 14,
            width: 40,
            height: 36,
            rotation: 3,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'e9',
            type: 'image',
            x: 18,
            y: 52,
            width: 64,
            height: 40,
            rotation: -1,
            zIndex: 3,
            photoUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'film-border'
          }
        ]
      },
      {
        id: 's4',
        slideNumber: 4,
        layoutType: 'split',
        background: '#FAF8F5',
        elements: [
          {
            id: 'e10',
            type: 'image',
            x: 8,
            y: 8,
            width: 84,
            height: 44,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'e11',
            type: 'image',
            x: 8,
            y: 54,
            width: 84,
            height: 38,
            rotation: 0,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          }
        ]
      },
      {
        id: 's5',
        slideNumber: 5,
        layoutType: 'minimal-quote',
        background: '#FAF8F5',
        elements: [
          {
            id: 'e12',
            type: 'image',
            x: 20,
            y: 12,
            width: 60,
            height: 52,
            rotation: 2,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'polaroid'
          },
          {
            id: 'e13',
            type: 'text',
            x: 10,
            y: 72,
            width: 80,
            height: 18,
            rotation: 0,
            zIndex: 2,
            text: '“leave the worries, keep the memories.”',
            fontFamily: 'serif',
            fontSize: 22,
            color: '#44403C',
            textAlign: 'center'
          },
          {
            id: 'e14',
            type: 'sticker',
            x: 45,
            y: 90,
            width: 10,
            height: 10,
            rotation: 0,
            zIndex: 3,
            stickerType: 'flower'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-shinjuku-nights',
    title: 'Tokyo 35mm Flash',
    category: 'Night Out',
    aesthetic: 'Dark & Moody',
    coverPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    photoCount: 12,
    description: 'Flash-heavy late night city walk with neon signs, steaming ramen, and 35mm film borders on dark charcoal canvas.',
    promptExample: 'Tokyo midnight dump, 12 photos in 5 slides with neon highlights, ramen closeups, and dark minimalist captions.',
    tags: ['Night', 'Neon', '35mm', 'Street'],
    slides: [
      {
        id: 'ts1',
        slideNumber: 1,
        layoutType: 'full-bleed',
        background: '#121214',
        elements: [
          {
            id: 'te1',
            type: 'image',
            x: 6,
            y: 8,
            width: 88,
            height: 74,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'te2',
            type: 'text',
            x: 10,
            y: 84,
            width: 80,
            height: 10,
            rotation: 0,
            zIndex: 2,
            text: 'TOKYO 02:45 AM',
            fontFamily: 'display',
            fontSize: 24,
            color: '#F4F4F5',
            letterSpacing: '0.2em',
            textAlign: 'center'
          }
        ]
      },
      {
        id: 'ts2',
        slideNumber: 2,
        layoutType: 'collage-2',
        background: '#121214',
        elements: [
          {
            id: 'te3',
            type: 'image',
            x: 8,
            y: 10,
            width: 48,
            height: 70,
            rotation: -2,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'film-border'
          },
          {
            id: 'te4',
            type: 'image',
            x: 48,
            y: 20,
            width: 46,
            height: 64,
            rotation: 2,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-goa-chaos',
    title: 'Chaotic Beach Weekend',
    category: 'Friends',
    aesthetic: 'Chaotic Scrapbook',
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    photoCount: 16,
    description: 'A messy, energetic scrapbook of beach laughs, scooter chases, sunset swims, and doodle stickers.',
    promptExample: 'Create a chaotic but cute Goa trip dump with 16 photos across 5 slides, mixing full-bleed photos, collages, and taped polaroids.',
    tags: ['Beach', 'Chaotic', 'Polaroids', 'Fun'],
    slides: [
      {
        id: 'gs1',
        slideNumber: 1,
        layoutType: 'scrapbook',
        background: '#FDFBF7',
        elements: [
          {
            id: 'ge1',
            type: 'image',
            x: 8,
            y: 12,
            width: 58,
            height: 52,
            rotation: -5,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'polaroid'
          },
          {
            id: 'ge2',
            type: 'image',
            x: 42,
            y: 36,
            width: 52,
            height: 48,
            rotation: 6,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'tape-corners'
          },
          {
            id: 'ge3',
            type: 'text',
            x: 10,
            y: 84,
            width: 80,
            height: 10,
            rotation: -2,
            zIndex: 3,
            text: 'unfiltered goa dump 🌴',
            fontFamily: 'handwriting',
            fontSize: 26,
            color: '#0F172A',
            textAlign: 'center'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-cozy-sunday',
    title: 'Matcha & Book Club',
    category: 'Minimal',
    aesthetic: 'Minimal Editorial',
    coverPhoto: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    slideCount: 4,
    photoCount: 10,
    description: 'Slow living aesthetics with gentle cream tones, bookstore stacks, and calm editorial typography.',
    promptExample: 'Quiet Sunday dump with 10 photos across 4 slides, matcha cafe vibes, linen sheets, and cozy book quotes.',
    tags: ['Cozy', 'Matcha', 'Books', 'Quiet'],
    slides: [
      {
        id: 'cs1',
        slideNumber: 1,
        layoutType: 'full-bleed',
        background: '#FAF9F6',
        elements: [
          {
            id: 'ce1',
            type: 'image',
            x: 8,
            y: 8,
            width: 84,
            height: 74,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'ce2',
            type: 'text',
            x: 10,
            y: 85,
            width: 80,
            height: 8,
            rotation: 0,
            zIndex: 2,
            text: 'SUNDAY SLOW DOWN',
            fontFamily: 'serif',
            fontSize: 24,
            color: '#27272A',
            letterSpacing: '0.18em',
            textAlign: 'center'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-birthday-confetti',
    title: 'Chapter 24 / Birthday',
    category: 'Birthday',
    aesthetic: 'Cute Pastel & Soft',
    coverPhoto: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    photoCount: 15,
    description: 'Sparkling birthday carousel with cake cutting, party hats, pink bows, and celebratory sticker doodles.',
    promptExample: 'Cute birthday party dump with 15 photos in 5 slides, pink pastel background, cake photos, polaroids, and heart stickers.',
    tags: ['Celebration', 'Party', 'Cute', 'Pink'],
    slides: [
      {
        id: 'bs1',
        slideNumber: 1,
        layoutType: 'scrapbook',
        background: '#FFF5F8',
        elements: [
          {
            id: 'be1',
            type: 'image',
            x: 10,
            y: 10,
            width: 80,
            height: 68,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'be2',
            type: 'text',
            x: 10,
            y: 82,
            width: 80,
            height: 12,
            rotation: -1,
            zIndex: 2,
            text: 'another year bolder 🎂',
            fontFamily: 'handwriting',
            fontSize: 28,
            color: '#BE185D',
            textAlign: 'center'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-summer-golden',
    title: 'Golden Hour Swim',
    category: 'Summer',
    aesthetic: 'Film / Vintage',
    coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    photoCount: 14,
    description: 'Sunburns, ocean spray, and late afternoon light captured with warm grain and double-frame polaroids.',
    promptExample: 'Summer beach dump with 14 photos across 5 slides, warm sunset lighting, waves, and sun-soaked captions.',
    tags: ['Summer', 'Sun', 'Ocean', 'Warm'],
    slides: [
      {
        id: 'ss1',
        slideNumber: 1,
        layoutType: 'full-bleed',
        background: '#FAF8F5',
        elements: [
          {
            id: 'se1',
            type: 'image',
            x: 6,
            y: 8,
            width: 88,
            height: 76,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'se2',
            type: 'text',
            x: 10,
            y: 86,
            width: 80,
            height: 10,
            rotation: 0,
            zIndex: 2,
            text: 'ENDLESS SUMMER ‘26',
            fontFamily: 'serif',
            fontSize: 24,
            color: '#1C1917',
            letterSpacing: '0.16em',
            textAlign: 'center'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-college-dorm',
    title: 'Campus Life & Shenanigans',
    category: 'College',
    aesthetic: 'Chaotic Scrapbook',
    coverPhoto: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    photoCount: 18,
    description: 'Dorm room chaos, library all-nighters, iced coffee tower, and candid friendship polaroids.',
    promptExample: 'College semester dump with 18 photos in 5 slides, taped photos, late night study snacks, and funny candid notes.',
    tags: ['Campus', 'Friends', 'Casual', 'Memories'],
    slides: [
      {
        id: 'cls1',
        slideNumber: 1,
        layoutType: 'polaroids',
        background: '#FAF8F5',
        elements: [
          {
            id: 'cle1',
            type: 'image',
            x: 12,
            y: 12,
            width: 50,
            height: 46,
            rotation: -4,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'polaroid'
          },
          {
            id: 'cle2',
            type: 'image',
            x: 40,
            y: 38,
            width: 48,
            height: 48,
            rotation: 5,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'polaroid'
          },
          {
            id: 'cle3',
            type: 'text',
            x: 10,
            y: 88,
            width: 80,
            height: 8,
            rotation: 0,
            zIndex: 3,
            text: 'survived another semester ✨',
            fontFamily: 'handwriting',
            fontSize: 22,
            color: '#1E293B',
            textAlign: 'center'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-street-food',
    title: 'Foodie Trail / Eats',
    category: 'Food',
    aesthetic: 'Cute Pastel & Soft',
    coverPhoto: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    slideCount: 4,
    photoCount: 12,
    description: 'Pastries, noodle bowls, table spreads, and menu snapshots framed with sweet kitchen stickers.',
    promptExample: 'Weekend foodie dump, 12 photos across 4 slides, close-up pasta and dessert shots with warm bakery palette.',
    tags: ['Foodie', 'Cafe', 'Dining', 'Yum'],
    slides: [
      {
        id: 'fs1',
        slideNumber: 1,
        layoutType: 'collage-3',
        background: '#FAF8F5',
        elements: [
          {
            id: 'fe1',
            type: 'image',
            x: 8,
            y: 10,
            width: 42,
            height: 42,
            rotation: -2,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'fe2',
            type: 'image',
            x: 52,
            y: 12,
            width: 40,
            height: 40,
            rotation: 2,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'fe3',
            type: 'image',
            x: 18,
            y: 54,
            width: 64,
            height: 38,
            rotation: 0,
            zIndex: 3,
            photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'tape-top'
          }
        ]
      }
    ]
  },
  {
    id: 'tmpl-high-fashion',
    title: 'Fit Check / OOTD',
    category: 'Fashion',
    aesthetic: 'Minimal Editorial',
    coverPhoto: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
    slideCount: 4,
    photoCount: 10,
    description: 'Mirror selfies, accessory details, shoes on pavement, and clean magazine layout grids.',
    promptExample: 'Fashion week outfit dump, 10 photos in 4 slides, high contrast editorial borders, minimal text.',
    tags: ['Fashion', 'OOTD', 'Style', 'Editorial'],
    slides: [
      {
        id: 'hfs1',
        slideNumber: 1,
        layoutType: 'split',
        background: '#FAF9F6',
        elements: [
          {
            id: 'hfe1',
            type: 'image',
            x: 8,
            y: 8,
            width: 40,
            height: 80,
            rotation: 0,
            zIndex: 1,
            photoUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'hfe2',
            type: 'image',
            x: 52,
            y: 8,
            width: 40,
            height: 80,
            rotation: 0,
            zIndex: 2,
            photoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
            frameStyle: 'rounded-lg'
          },
          {
            id: 'hfe3',
            type: 'text',
            x: 10,
            y: 90,
            width: 80,
            height: 6,
            rotation: 0,
            zIndex: 3,
            text: 'DETAILS & FITS',
            fontFamily: 'display',
            fontSize: 20,
            color: '#18181B',
            textAlign: 'center'
          }
        ]
      }
    ]
  }
];
