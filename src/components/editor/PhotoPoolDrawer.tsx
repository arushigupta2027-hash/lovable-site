import React, { useRef } from 'react';
import { Plus, Image as ImageIcon, Upload, Check } from 'lucide-react';
import { PhotoItem } from '../../types';
import { createId } from '../../utils/dumpGenerator';

interface PhotoPoolDrawerProps {
  photos: PhotoItem[];
  onAddPhotoToSlide: (photo: PhotoItem) => void;
  onUploadPhotos: (newPhotos: PhotoItem[]) => void;
  activePhotoIdToSwap?: string | null;
  onSwapConfirm?: (photo: PhotoItem) => void;
}

export const PhotoPoolDrawer: React.FC<PhotoPoolDrawerProps> = ({
  photos,
  onAddPhotoToSlide,
  onUploadPhotos,
  activePhotoIdToSwap,
  onSwapConfirm,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const added: PhotoItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      added.push({
        id: createId('pool-up'),
        url: URL.createObjectURL(file),
        name: file.name,
      });
    });
    onUploadPhotos(added);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            {activePhotoIdToSwap ? 'Select Photo to Swap' : `Project Photos (${photos.length})`}
          </h3>
          <p className="text-[11px] text-stone-400">
            {activePhotoIdToSwap ? 'Click any photo to replace selected' : 'Click to place onto current slide'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              if (activePhotoIdToSwap && onSwapConfirm) {
                onSwapConfirm(photo);
              } else {
                onAddPhotoToSlide(photo);
              }
            }}
            className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-rose-500 bg-stone-100 dark:bg-stone-800 transition-all text-left"
          >
            <img
              src={photo.url}
              alt={`Photo ${i + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
              {activePhotoIdToSwap ? 'Swap with this' : '+ Add to slide'}
            </div>
            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
              #{i + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
