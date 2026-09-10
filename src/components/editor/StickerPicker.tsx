import React from 'react';
import { 
  Sparkles, 
  Heart, 
  Smile, 
  Star, 
  Sun, 
  Tag, 
  Type, 
  Palette,
  Check
} from 'lucide-react';
import { SlideElement } from '../../types';
import { createId } from '../../utils/dumpGenerator';

interface StickerPickerProps {
  onAddSticker: (stickerType: string) => void;
  onAddText: (text: string, font: 'serif' | 'sans' | 'handwriting' | 'display', color?: string) => void;
  currentBg: string;
  onChangeBg: (bg: string) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  onAddSticker,
  onAddText,
  currentBg,
  onChangeBg,
}) => {
  const stickers = [
    { type: 'sparkle', label: 'Sparkle' },
    { type: 'star', label: 'Gold Star' },
    { type: 'heart', label: 'Pink Heart' },
    { type: 'tape', label: 'Washi Tape' },
    { type: 'smiley', label: 'Smiley' },
    { type: 'date_badge', label: 'Date Badge' },
    { type: 'flower', label: 'Flower' },
  ];

  const bgColors = [
    { name: 'Warm Cream', hex: '#FAF8F5' },
    { name: 'Soft Linen', hex: '#F5EFEB' },
    { name: 'Blush Pink', hex: '#FFF5F8' },
    { name: 'Lavender Mist', hex: '#F3E8EE' },
    { name: 'Sky Blue', hex: '#EBF4F6' },
    { name: 'Sage Olive', hex: '#F1F5EB' },
    { name: 'Dark Charcoal', hex: '#121214' },
    { name: 'Deep Midnight', hex: '#09090B' },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 overflow-y-auto">
      {/* Background Picker */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-stone-500" />
          Slide Background
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {bgColors.map((bg) => {
            const isSelected = currentBg.toLowerCase() === bg.hex.toLowerCase();
            return (
              <button
                key={bg.hex}
                type="button"
                onClick={() => onChangeBg(bg.hex)}
                className="flex flex-col items-center gap-1 group"
                title={bg.name}
              >
                <div
                  style={{ backgroundColor: bg.hex }}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-rose-500 border-rose-500 scale-105 shadow-md'
                      : 'border-stone-300 dark:border-stone-700 group-hover:scale-105'
                  }`}
                >
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 ${
                        bg.hex.includes('#1') || bg.hex.includes('#0') ? 'text-white' : 'text-stone-900'
                      }`}
                    />
                  )}
                </div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate max-w-[50px]">
                  {bg.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stickers & Doodles */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Stickers & Doodles
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {stickers.map((st) => (
            <button
              key={st.type}
              type="button"
              onClick={() => onAddSticker(st.type)}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-rose-400 bg-stone-50/50 dark:bg-stone-800/50 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-105"
            >
              {st.type === 'heart' ? (
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              ) : st.type === 'smiley' ? (
                <Smile className="w-5 h-5 text-amber-500 fill-amber-200" />
              ) : st.type === 'star' ? (
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              ) : st.type === 'tape' ? (
                <div className="w-8 h-3 bg-amber-200 border border-amber-300 -rotate-6" />
              ) : st.type === 'date_badge' ? (
                <div className="px-1 text-[8px] font-mono bg-white text-red-600 font-bold border border-stone-200">
                  ‘26 08
                </div>
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400" />
              )}
              <span className="text-[10px] font-semibold text-stone-700 dark:text-stone-300">
                {st.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Text Elements */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-violet-500" />
          Add Text & Captions
        </h4>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onAddText('CHAPTER ONE', 'serif')}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <div className="font-serif-editorial text-lg text-stone-900 dark:text-white">
                Editorial Serif Heading
              </div>
              <div className="text-[10px] text-stone-400">Classy magazine title</div>
            </div>
            <span className="text-xs font-bold text-rose-500">+ Add</span>
          </button>

          <button
            type="button"
            onClick={() => onAddText('unfiltered moments 💭', 'handwriting')}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <div className="font-handwriting text-xl text-stone-900 dark:text-white">
                Handwritten Doodle Note
              </div>
              <div className="text-[10px] text-stone-400">Casual candid caption</div>
            </div>
            <span className="text-xs font-bold text-rose-500">+ Add</span>
          </button>

          <button
            type="button"
            onClick={() => onAddText('SUMMER RECAP', 'display')}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-between text-left transition-colors"
          >
            <div>
              <div className="font-display font-bold text-base text-stone-900 dark:text-white tracking-wider">
                BOLD DISPLAY HEADER
              </div>
              <div className="text-[10px] text-stone-400">Modern punchy text</div>
            </div>
            <span className="text-xs font-bold text-rose-500">+ Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
