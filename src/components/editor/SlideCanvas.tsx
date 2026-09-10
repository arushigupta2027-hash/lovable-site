import React, { useRef, useState, useEffect } from 'react';
import { 
  Trash2, 
  RotateCw, 
  Maximize2, 
  Sparkles, 
  Heart, 
  Smile, 
  Star, 
  Move,
  Layers,
  Crop,
  Type
} from 'lucide-react';
import { AspectRatio, FrameStyle, Slide, SlideElement } from '../../types';

interface SlideCanvasProps {
  slide: Slide;
  aspect: AspectRatio;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: SlideElement) => void;
  onDeleteElement: (id: string) => void;
  onSwapPhotoRequest?: (elementId: string) => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  aspect,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onSwapPhotoRequest,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);

  // Aspect ratio classes
  const aspectClass =
    aspect === '4:5'
      ? 'aspect-[4/5] max-h-[620px]'
      : aspect === '1:1'
      ? 'aspect-square max-h-[580px]'
      : 'aspect-[9/16] max-h-[660px]';

  // Handle Dragging
  const handlePointerDown = (e: React.PointerEvent, el: SlideElement) => {
    e.stopPropagation();
    onSelectElement(el.id);
    setDraggingId(el.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: el.x,
      elY: el.y,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingId || !dragStart || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

      const currentEl = slide.elements.find((el) => el.id === draggingId);
      if (!currentEl) return;

      const newX = Math.max(0, Math.min(100 - currentEl.width, dragStart.elX + deltaXPercent));
      const newY = Math.max(0, Math.min(100 - currentEl.height, dragStart.elY + deltaYPercent));

      onUpdateElement({
        ...currentEl,
        x: Math.round(newX),
        y: Math.round(newY),
      });
    };

    const handlePointerUp = () => {
      setDraggingId(null);
      setDragStart(null);
    };

    if (draggingId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingId, dragStart, slide.elements, onUpdateElement]);

  const selectedElement = slide.elements.find((el) => el.id === selectedElementId);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Aspect Ratio Canvas Container */}
      <div
        ref={containerRef}
        onClick={() => onSelectElement(null)}
        className={`w-full ${aspectClass} relative rounded-2xl shadow-2xl border-4 border-white dark:border-stone-800 overflow-hidden transition-all duration-200`}
        style={{ backgroundColor: slide.background }}
      >
        {/* Subtle decorative grain */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Elements on the slide */}
        {slide.elements.map((el) => {
          const isSelected = el.id === selectedElementId;

          return (
            <div
              key={el.id}
              onPointerDown={(e) => handlePointerDown(e, el)}
              style={{
                position: 'absolute',
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.width}%`,
                height: `${el.height}%`,
                transform: `rotate(${el.rotation || 0}deg)`,
                zIndex: el.zIndex,
                cursor: draggingId === el.id ? 'grabbing' : 'grab',
              }}
              className={`transition-shadow ${
                isSelected ? 'ring-2 ring-rose-500 shadow-xl' : 'hover:ring-1 hover:ring-stone-400/50'
              }`}
            >
              {/* Image Type Element */}
              {el.type === 'image' && (
                <div
                  className={`w-full h-full relative overflow-hidden flex flex-col ${
                    el.frameStyle === 'polaroid'
                      ? 'bg-white p-2.5 pb-7 shadow-lg rounded-sm'
                      : el.frameStyle === 'film-border'
                      ? 'bg-stone-900 p-2 shadow-lg rounded-md'
                      : el.frameStyle === 'tape-corners' || el.frameStyle === 'tape-top'
                      ? 'bg-white p-1.5 shadow-md rounded-md'
                      : 'rounded-xl shadow-md'
                  }`}
                >
                  {/* Sprocket holes if 35mm film border */}
                  {el.frameStyle === 'film-border' && (
                    <div className="absolute top-0 bottom-0 left-0.5 flex flex-col justify-around py-2 z-10">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-1.5 h-2 bg-white/90 rounded-xs" />
                      ))}
                    </div>
                  )}

                  {/* Tape decoration if frame has tape */}
                  {(el.frameStyle === 'tape-corners' || el.frameStyle === 'tape-top') && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-200/80 border border-amber-300 -rotate-3 z-20 shadow-xs" />
                  )}

                  {/* Image container */}
                  <img
                    src={el.photoUrl}
                    alt="Photo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none rounded-xs"
                  />

                  {/* Polaroid caption */}
                  {el.frameStyle === 'polaroid' && (
                    <div className="text-[11px] font-handwriting text-stone-600 text-center mt-1 truncate">
                      {el.caption || 'moment'}
                    </div>
                  )}
                </div>
              )}

              {/* Text Type Element */}
              {el.type === 'text' && (
                <div
                  style={{
                    color: el.color || '#1C1917',
                    textAlign: el.textAlign || 'center',
                    letterSpacing: el.letterSpacing,
                  }}
                  className={`w-full h-full flex items-center justify-center p-1 font-bold leading-tight ${
                    el.fontFamily === 'serif'
                      ? 'font-serif-editorial text-2xl sm:text-3xl'
                      : el.fontFamily === 'handwriting'
                      ? 'font-handwriting text-2xl sm:text-3xl'
                      : el.fontFamily === 'display'
                      ? 'font-display text-xl sm:text-2xl'
                      : 'text-base sm:text-lg'
                  }`}
                >
                  {el.text}
                </div>
              )}

              {/* Sticker Type Element */}
              {el.type === 'sticker' && (
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                  {el.stickerType === 'tape' ? (
                    <div className="w-14 h-5 bg-amber-200/80 border border-amber-300 -rotate-6 shadow-xs" />
                  ) : el.stickerType === 'heart' ? (
                    <Heart className="w-full h-full text-pink-500 fill-pink-500 drop-shadow-md" />
                  ) : el.stickerType === 'smiley' ? (
                    <Smile className="w-full h-full text-amber-500 fill-amber-200 drop-shadow-md" />
                  ) : el.stickerType === 'star' ? (
                    <Star className="w-full h-full text-amber-400 fill-amber-400 drop-shadow-md" />
                  ) : el.stickerType === 'date_badge' ? (
                    <div className="px-2 py-0.5 rounded bg-white/90 shadow-sm border border-stone-200 text-red-600 font-mono text-[10px] font-bold">
                      ‘26 08 19
                    </div>
                  ) : (
                    <Sparkles className="w-full h-full text-amber-400 fill-amber-200 drop-shadow-md" />
                  )}
                </div>
              )}

              {/* Selected Element Mini Overlay Controls */}
              {isSelected && (
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-stone-900 text-white px-2 py-1 rounded-lg shadow-xl text-xs z-50 whitespace-nowrap"
                >
                  {/* Rotate Button */}
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...el,
                        rotation: ((el.rotation || 0) + 5) % 360,
                      })
                    }
                    title="Rotate +5°"
                    className="p-1 hover:text-rose-400"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Swap Photo Button if image */}
                  {el.type === 'image' && onSwapPhotoRequest && (
                    <button
                      type="button"
                      onClick={() => onSwapPhotoRequest(el.id)}
                      title="Swap Photo"
                      className="p-1 hover:text-rose-400 text-[10px] font-semibold flex items-center gap-0.5"
                    >
                      Swap
                    </button>
                  )}

                  {/* Frame Style toggle if image */}
                  {el.type === 'image' && (
                    <button
                      type="button"
                      onClick={() => {
                        const styles: FrameStyle[] = ['rounded-lg', 'polaroid', 'film-border', 'tape-corners'];
                        const nextIdx = (styles.indexOf(el.frameStyle || 'rounded-lg') + 1) % styles.length;
                        onUpdateElement({
                          ...el,
                          frameStyle: styles[nextIdx],
                        });
                      }}
                      title="Cycle Frame Style"
                      className="p-1 hover:text-rose-400 text-[10px] font-semibold"
                    >
                      Frame
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => onDeleteElement(el.id)}
                    title="Delete Element"
                    className="p-1 hover:text-red-400 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Helper notice */}
      <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-2">
        <Move className="w-3.5 h-3.5" />
        <span>Click any photo or text to drag, rotate, or reframe</span>
      </div>
    </div>
  );
};
