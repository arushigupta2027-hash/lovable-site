import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Wand2, Sparkles, Layers, Heart } from 'lucide-react';
import { TemplateReference } from '../types';

interface TemplatePreviewModalProps {
  template: TemplateReference | null;
  onClose: () => void;
  onUseStyle: (template: TemplateReference) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onUseStyle,
}) => {
  if (!template) return null;

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slides = template.slides;
  const currentSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col md:flex-row">
        
        {/* Left / Top: Interactive Carousel Preview */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-950 relative">
          <div className="w-full max-w-[320px] aspect-[4/5] rounded-2xl shadow-xl overflow-hidden relative border-4 border-white dark:border-stone-800"
            style={{ backgroundColor: currentSlide?.background || '#FAF8F5' }}
          >
            {/* Elements inside current slide */}
            {currentSlide?.elements.map((el) => {
              if (el.type === 'image') {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation || 0}deg)`,
                      zIndex: el.zIndex,
                    }}
                    className={`overflow-hidden ${
                      el.frameStyle === 'polaroid'
                        ? 'bg-white p-2 pb-5 shadow-lg rounded-xs'
                        : el.frameStyle === 'film-border'
                        ? 'bg-stone-900 p-1.5 shadow-md rounded-md'
                        : 'rounded-xl shadow-md'
                    }`}
                  >
                    <img
                      src={el.photoUrl}
                      alt="Preview item"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {el.caption && (
                      <div className="text-[10px] font-handwriting text-stone-600 text-center mt-1 truncate">
                        {el.caption}
                      </div>
                    )}
                  </div>
                );
              }

              if (el.type === 'text') {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      color: el.color,
                      zIndex: el.zIndex,
                    }}
                    className="font-serif-editorial text-xl font-bold flex items-center justify-center text-center"
                  >
                    {el.text}
                  </div>
                );
              }

              if (el.type === 'sticker') {
                return (
                  <div
                    key={el.id}
                    style={{
                      position: 'absolute',
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: `rotate(${el.rotation || 0}deg)`,
                      zIndex: el.zIndex,
                    }}
                    className="flex items-center justify-center pointer-events-none"
                  >
                    {el.stickerType === 'tape' ? (
                      <div className="w-12 h-3.5 bg-amber-200/80 border border-amber-300 -rotate-6" />
                    ) : el.stickerType === 'heart' ? (
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                );
              }

              return null;
            })}

            {/* Carousel navigation buttons */}
            <button
              onClick={() => setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/60 z-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSlideIndex((prev) => (prev + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/60 z-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlideIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeSlideIndex ? 'w-5 bg-stone-900 dark:bg-white' : 'w-1.5 bg-stone-400/40'
                }`}
              />
            ))}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Slide {activeSlideIndex + 1} of {slides.length}
          </div>
        </div>

        {/* Right / Info Panel */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase">
                  {template.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 dark:text-white mt-1">
                  {template.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
              {template.description}
            </p>

            {/* Vibe & Details */}
            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 mb-4 space-y-2">
              <div className="text-xs text-stone-500 flex justify-between">
                <span>Aesthetic System:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{template.aesthetic}</span>
              </div>
              <div className="text-xs text-stone-500 flex justify-between">
                <span>Slides in Carousel:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{template.slideCount} slides</span>
              </div>
              <div className="text-xs text-stone-500 flex justify-between">
                <span>Suggested Photo Count:</span>
                <span className="font-semibold text-stone-900 dark:text-white">{template.photoCount} photos</span>
              </div>
            </div>

            {/* Sample Natural Language Prompt */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Natural Language Prompt Formula
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 italic bg-stone-100/70 dark:bg-stone-800/80 p-3 rounded-xl mt-1 border border-stone-200 dark:border-stone-700">
                "{template.promptExample}"
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Close
            </button>
            <button
              id="use-style-btn"
              type="button"
              onClick={() => onUseStyle(template)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-amber-400 dark:text-rose-500" />
              <span>Use This Style</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
