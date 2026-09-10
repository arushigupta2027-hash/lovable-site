import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Sliders, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Camera, 
  Palette, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { AspectRatio, DumpProject, LayoutPreset, PhotoItem } from '../types';
import { PhotoUploader } from './PhotoUploader';
import { SAMPLE_PHOTO_PACKS, PhotoPack } from '../data/samplePhotos';
import { AESTHETIC_VIBES } from '../data/sampleTemplates';
import { generateDumpProject } from '../utils/dumpGenerator';

interface GeneratorWizardProps {
  initialPrompt?: string;
  onGenerateSuccess: (project: DumpProject) => void;
  onCancel: () => void;
}

export const GeneratorWizard: React.FC<GeneratorWizardProps> = ({
  initialPrompt = '',
  onGenerateSuccess,
  onCancel,
}) => {
  // Step: 1 = Describe & Photos, 2 = Fine-tune settings, 3 = Generating loader
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      'Create a chaotic but cute Goa trip dump with 18 photos across 5 slides, mixing full-bleed photos, collages, small polaroid-style images, and one text slide.'
  );
  const [photos, setPhotos] = useState<PhotoItem[]>(SAMPLE_PHOTO_PACKS[0].photos);
  const [selectedPackId, setSelectedPackId] = useState<string>(SAMPLE_PHOTO_PACKS[0].id);

  // Configuration options
  const [slideCount, setSlideCount] = useState<number>(5);
  const [photoCount, setPhotoCount] = useState<number>(photos.length);
  const [aspect, setAspect] = useState<AspectRatio>('4:5');
  const [aesthetic, setAesthetic] = useState<string>('cute-pastel');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [preferredLayout, setPreferredLayout] = useState<string>('mix');

  // Loading animation states
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const loadingSteps = [
    'Analyzing vibe & photo palette...',
    'Composing multi-slide layout sequence...',
    'Framing polaroids, film borders & tape...',
    'Styling aesthetic typography & stickers...',
    'Polishing carousel for Instagram...'
  ];

  const handleSelectPack = (pack: PhotoPack) => {
    setSelectedPackId(pack.id);
    setPhotos(pack.photos);
    setPhotoCount(pack.photos.length);
    if (!customTitle) {
      setCustomTitle(pack.name);
    }
  };

  const handleStartGeneration = async () => {
    setStep(3);
    setLoadingStep(0);

    // Simulate progressive creative step updates
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      // Attempt server-side API call first
      let project: DumpProject | null = null;
      try {
        const res = await fetch('/api/generate-dump', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            photoCount,
            slideCount,
            aspect,
            aesthetic,
            photos,
            title: customTitle,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          // Synthesize full project with slides
          project = generateDumpProject({
            prompt,
            photos,
            photoCount,
            slideCount,
            aspect,
            aesthetic,
            customTitle: data.plan?.dumpTitle || customTitle,
          });
        }
      } catch (apiErr) {
        console.warn('Backend API fallback used for dump generation', apiErr);
      }

      if (!project) {
        // Deterministic intelligent client layout engine
        project = generateDumpProject({
          prompt,
          photos,
          photoCount,
          slideCount,
          aspect,
          aesthetic,
          customTitle,
        });
      }

      // Finish loading gracefully
      setTimeout(() => {
        clearInterval(interval);
        onGenerateSuccess(project!);
      }, 2400);
    } catch (err) {
      console.error('Generation error:', err);
      clearInterval(interval);
      // Fallback
      const project = generateDumpProject({
        prompt,
        photos,
        photoCount,
        slideCount,
        aspect,
        aesthetic,
        customTitle,
      });
      onGenerateSuccess(project);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 flex items-center justify-center font-bold text-xs">
              AI
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-stone-900 dark:text-white">
              Create New Photo Dump
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Describe the vibe, pick your photos, and let AI style the entire carousel.
          </p>
        </div>

        {step !== 3 && (
          <button
            onClick={onCancel}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Step 1: Describe & Photos */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Natural Language Prompt */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
            <label
              htmlFor="wizard-prompt"
              className="block text-sm font-bold text-stone-900 dark:text-white mb-1.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              1. Describe your dump vibe in natural language
            </label>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
              Be as detailed or relaxed as you want. Mention the destination, event, mix of polaroids, film grain, or chaotic collages.
            </p>
            <textarea
              id="wizard-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a chaotic but cute Goa trip dump with 18 photos across 5 slides, mixing full-bleed photos, collages, small polaroid-style images, and one text slide."
              className="w-full p-3.5 rounded-xl text-sm text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none leading-relaxed"
            />

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
              <span className="text-stone-400 font-medium">Examples:</span>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    'Create a chaotic but cute Goa trip dump with 18 photos across 5 slides, mixing full-bleed photos, collages, and polaroids'
                  )
                }
                className="text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
              >
                Goa Trip Chaos
              </button>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    '35mm film European summer in Positano with sunset spritz, linen shirts & washi tape notes'
                  )
                }
                className="text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
              >
                Italian Summer 35mm
              </button>
              <button
                type="button"
                onClick={() =>
                  setPrompt(
                    'Tokyo midnight neon walk with high flash ramen closeups, 35mm film borders, and late night captions'
                  )
                }
                className="text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
              >
                Tokyo Midnight
              </button>
            </div>
          </div>

          {/* Photo Uploader Component */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-1.5 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              2. Choose or upload your photos
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Select one of our aesthetic curated photo packs for 1-click testing, or drop in your personal camera roll.
            </p>

            <PhotoUploader
              photos={photos}
              setPhotos={setPhotos}
              selectedPackId={selectedPackId}
              onSelectPack={handleSelectPack}
            />
          </div>

          {/* Continue Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-xs text-stone-500">
              Selected <span className="font-bold text-stone-800 dark:text-stone-200">{photos.length} photos</span> ready for dump styling
            </div>
            <button
              id="wizard-next-step-btn"
              type="button"
              disabled={photos.length === 0}
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Next: Customize Layout & Vibe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Fine-tune Parameters */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aesthetic Selector */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm col-span-full">
              <label className="block text-sm font-bold text-stone-900 dark:text-white mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4 text-rose-500" />
                Overall Aesthetic & Vibe
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {AESTHETIC_VIBES.map((vibe) => {
                  const isSelected = aesthetic === vibe.id;
                  return (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setAesthetic(vibe.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 bg-stone-50/50 dark:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-stone-900 dark:text-white">
                          {vibe.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-500" />}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                        {vibe.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slide Count & Photo Count */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-violet-500" /> Number of Slides
                  </span>
                  <span className="text-rose-500 font-bold text-sm">{slideCount} slides</span>
                </label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSlideCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        slideCount === num
                          ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent shadow-xs'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {num} Slides
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-500" /> Photos to Use
                  </span>
                  <span className="text-stone-500 text-xs">{photoCount} of {photos.length}</span>
                </label>
                <input
                  type="range"
                  min={Math.min(photos.length, slideCount)}
                  max={photos.length}
                  value={photoCount}
                  onChange={(e) => setPhotoCount(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Aspect Ratio & Layouts */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-1.5">
                  Carousel Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '4:5', label: '4:5 Portrait', sub: 'Instagram Feed (Best)' },
                    { id: '1:1', label: '1:1 Square', sub: 'Classic Feed' },
                    { id: '9:16', label: '9:16 Story', sub: 'Stories / Reels' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspect(item.id as AspectRatio)}
                      className={`py-2 px-2 text-center rounded-xl border transition-all ${
                        aspect === item.id
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-300 font-semibold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5 truncate">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-1.5">
                  Optional Cover Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. POSITANO MEMORIES, CHAPTER 24, GOA DIARIES"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              ← Back to Photos & Vibe
            </button>

            <button
              id="wizard-generate-dump-btn"
              type="button"
              onClick={handleStartGeneration}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-violet-600 text-white font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate Dump Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: AI Generation / Loading Screen */}
      {step === 3 && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-stone-800 shadow-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-in zoom-in-95 duration-300">
          {/* Animated Spinner with Glow */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-violet-500 animate-spin blur-xs opacity-75" />
            <div className="relative w-16 h-16 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 dark:text-white mb-2">
            BrainDump AI is styling your carousel
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-sm">
            Turning {photoCount} photos into a cohesive {slideCount}-slide Instagram dump.
          </p>

          {/* Dynamic Progress Steps */}
          <div className="w-full bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200/80 dark:border-stone-700/80 text-left space-y-2.5">
            {loadingSteps.map((stepMsg, idx) => {
              const isDone = idx < loadingStep;
              const isCurrent = idx === loadingStep;
              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {isDone ? (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-600" />
                  )}
                  <span
                    className={`font-medium ${
                      isCurrent
                        ? 'text-stone-900 dark:text-white font-semibold'
                        : isDone
                        ? 'text-stone-500 dark:text-stone-400'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  >
                    {stepMsg}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-[11px] text-stone-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Ready in just a moment...</span>
          </div>
        </div>
      )}
    </div>
  );
};
