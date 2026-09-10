import React from 'react';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Slide } from '../../types';

interface SlideFilmstripProps {
  slides: Slide[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onMoveSlide: (fromIndex: number, toIndex: number) => void;
  onRegenerateSlide: (index: number) => void;
}

export const SlideFilmstrip: React.FC<SlideFilmstripProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlide,
  onRegenerateSlide,
}) => {
  return (
    <div className="w-full bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-3 flex items-center justify-between gap-3 overflow-x-auto">
      {/* Slides Timeline */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-1 hidden sm:inline">
          Slides
        </span>

        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          const photoElements = slide.elements.filter(e => e.type === 'image' && e.photoUrl);
          const firstPhoto = photoElements[0]?.photoUrl;

          return (
            <div key={slide.id} className="relative group/slide shrink-0">
              <button
                type="button"
                onClick={() => onSelectSlide(idx)}
                className={`relative w-16 sm:w-20 aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all text-left flex flex-col justify-between p-1.5 shadow-xs ${
                  isActive
                    ? 'border-rose-500 ring-2 ring-rose-500/20 scale-105 z-10'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: slide.background }}
              >
                {/* Micro Thumbnail of photos */}
                {firstPhoto ? (
                  <div className="w-full h-full rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                    <img
                      src={firstPhoto}
                      alt={`Slide ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {photoElements.length > 1 && (
                      <div className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-[8px] font-bold text-white">
                        +{photoElements.length - 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-stone-400 font-medium">
                    Text / Empty
                  </div>
                )}

                {/* Slide Number Badge */}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white font-bold text-[9px] leading-none">
                  {idx + 1}
                </div>
              </button>

              {/* Hover Floating Actions on Slide Thumbnail */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover/slide:flex items-center gap-1 bg-stone-900 text-white px-1.5 py-0.5 rounded-lg shadow-lg text-[10px] z-30">
                {idx > 0 && (
                  <button
                    onClick={() => onMoveSlide(idx, idx - 1)}
                    title="Move Left"
                    className="p-1 hover:text-rose-400"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => onDuplicateSlide(idx)}
                  title="Duplicate Slide"
                  className="p-1 hover:text-rose-400"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    onClick={() => onDeleteSlide(idx)}
                    title="Delete Slide"
                    className="p-1 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {idx < slides.length - 1 && (
                  <button
                    onClick={() => onMoveSlide(idx, idx + 1)}
                    title="Move Right"
                    className="p-1 hover:text-rose-400"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Slide Button */}
        <button
          type="button"
          onClick={onAddSlide}
          className="w-16 sm:w-20 aspect-[4/5] rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-400 text-stone-400 hover:text-rose-500 flex flex-col items-center justify-center gap-1 transition-colors shrink-0"
          title="Add new slide"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-semibold">+ Slide</span>
        </button>
      </div>

      {/* Quick Active Slide Utilities */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onRegenerateSlide(activeSlideIndex)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold transition-colors"
          title="Regenerate this single slide with a fresh composition"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Regenerate Slide</span> #{activeSlideIndex + 1}
        </button>
      </div>
    </div>
  );
};
