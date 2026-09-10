export type AspectRatio = '4:5' | '1:1' | '9:16';

export type FrameStyle = 
  | 'none' 
  | 'polaroid' 
  | 'film-border' 
  | 'rounded-lg' 
  | 'tape-top' 
  | 'tape-corners' 
  | 'torn-edge' 
  | 'double-border' 
  | 'shadow-deep';

export type LayoutPreset = 
  | 'full-bleed' 
  | 'polaroids' 
  | 'collage-2' 
  | 'collage-3' 
  | 'grid-4' 
  | 'scrapbook' 
  | 'minimal-quote' 
  | 'split' 
  | 'filmstrip';

export type ElementType = 'image' | 'text' | 'sticker' | 'shape';

export interface PhotoItem {
  id: string;
  url: string;
  name?: string;
  caption?: string;
  tags?: string[];
  width?: number;
  height?: number;
}

export interface SlideElement {
  id: string;
  type: ElementType;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
  rotation: number; // degrees -45 to 45
  zIndex: number;
  // Image specific
  photoId?: string;
  photoUrl?: string;
  frameStyle?: FrameStyle;
  caption?: string;
  // Text specific
  text?: string;
  fontSize?: number; // scale relative to canvas
  fontFamily?: 'serif' | 'sans' | 'handwriting' | 'display';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: string;
  fontWeight?: 'normal' | 'medium' | 'bold' | 'black';
  // Sticker specific
  stickerType?: string;
  opacity?: number;
}

export interface Slide {
  id: string;
  slideNumber: number;
  layoutType: LayoutPreset;
  background: string; // color hex or gradient or class
  bgPattern?: 'none' | 'dots' | 'grid' | 'film-grain' | 'paper';
  elements: SlideElement[];
  notes?: string;
}

export interface AestheticVibe {
  id: string;
  name: string;
  badge: string;
  description: string;
  samplePrompt: string;
  bgOptions: string[];
  accentColor: string;
  defaultLayouts: LayoutPreset[];
  stickers: string[];
  fonts: ('serif' | 'sans' | 'handwriting' | 'display')[];
  previewCover: string;
}

export interface DumpProject {
  id: string;
  title: string;
  descriptionPrompt: string;
  aesthetic: string;
  aspect: AspectRatio;
  photos: PhotoItem[];
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
  isDraft?: boolean;
}

export interface TemplateReference {
  id: string;
  title: string;
  category: 
    | 'Travel' 
    | 'Birthday' 
    | 'Friends' 
    | 'Summer' 
    | 'Night Out' 
    | 'College' 
    | 'Food' 
    | 'Fashion' 
    | 'Minimal' 
    | 'Chaotic' 
    | 'Cute' 
    | 'Film / Vintage' 
    | 'Dark & Moody';
  aesthetic: string;
  coverPhoto: string;
  slideCount: number;
  photoCount: number;
  description: string;
  promptExample: string;
  slides: Slide[];
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  savedDumpsCount: number;
}
