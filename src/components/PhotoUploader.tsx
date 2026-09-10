import React, { useRef } from 'react';
import { Upload, Plus, X, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { PhotoItem } from '../types';
import { SAMPLE_PHOTO_PACKS, PhotoPack } from '../data/samplePhotos';
import { createId } from '../utils/dumpGenerator';

interface PhotoUploaderProps {
  photos: PhotoItem[];
  setPhotos: (photos: PhotoItem[]) => void;
  selectedPackId?: string;
  onSelectPack: (pack: PhotoPack) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  setPhotos,
  selectedPackId,
  onSelectPack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: PhotoItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      newItems.push({
        id: createId('upload'),
        url,
        name: file.name,
        caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      });
    });

    setPhotos([...photos, ...newItems]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1-Click Curated Photo Packs (Instant Tryout) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
              Instant Photo Packs (or upload your own)
            </h4>
          </div>
          <span className="text-xs text-stone-400">1-click to test with aesthetic photos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_PHOTO_PACKS.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => onSelectPack(pack)}
                className={`group relative text-left rounded-2xl p-2.5 transition-all border overflow-hidden ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-2 relative">
                  <img
                    src={pack.cover}
                    alt={pack.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                    {pack.photos.length} photos
                  </div>
                </div>
                <h5 className="font-semibold text-xs text-stone-900 dark:text-white truncate">
                  {pack.name}
                </h5>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                  {pack.vibe}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-400 dark:hover:border-rose-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-stone-900/50 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Upload className="w-5 h-5 text-rose-500" />
        </div>
        <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
          Drop your camera roll photos here
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
          or click to browse from device. Supports JPG, PNG, HEIC, WEBP.
        </p>
      </div>

      {/* Uploaded Photos Grid */}
      {photos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Uploaded Photos ({photos.length})
            </span>
            <button
              type="button"
              onClick={() => setPhotos([])}
              className="text-xs text-stone-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800"
              >
                <img
                  src={photo.url}
                  alt={photo.name || `Photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(photo.id);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                  #{idx + 1}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-400 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-medium">Add more</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
