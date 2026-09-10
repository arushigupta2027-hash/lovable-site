import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Wand2, 
  Upload, 
  Sliders, 
  Share2, 
  Flame,
  Camera,
  Heart
} from 'lucide-react';
import { REFERENCE_TEMPLATES } from '../data/sampleTemplates';

interface LandingHeroProps {
  onStartWithPrompt?: (promptText: string) => void;
  onStartCreating?: (promptText?: string) => void;
  onExploreTemplates: () => void;
  onOpenSampleEditor?: () => void;
  onOpenProject?: (project?: any) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartWithPrompt,
  onStartCreating,
  onExploreTemplates,
  onOpenSampleEditor,
  onOpenProject,
}) => {
  const handleStart = (text: string) => {
    if (onStartWithPrompt) onStartWithPrompt(text);
    else if (onStartCreating) onStartCreating(text);
  };

  const handleOpenEditor = () => {
    if (onOpenSampleEditor) onOpenSampleEditor();
    else if (onOpenProject) onOpenProject();
  };
  // Interactive demo carousel above the fold
  const demoTemplate = REFERENCE_TEMPLATES[0]; // Italian Riviera Sun
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slides = demoTemplate.slides;

  const quickPrompts = [
    'Chaotic but cute Goa trip dump with 18 photos across 5 slides, mixing collages & polaroids',
    '35mm film European summer in Positano with sunset spritz & washi tape notes',
    'Tokyo midnight neon walk with high-flash ramen closeups and 35mm borders',
    'Cozy Sunday matcha & book club aesthetic with warm cream tones and quiet quotes'
  ];

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Instant Prompt */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Vibe Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Next-Gen Instagram Carousel Creator</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-stone-900 dark:text-white mb-6">
              Your photos. <br />
              Your vibe. <br />
              <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-violet-500 bg-clip-text text-transparent">
                AI-made dumps.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed mb-8 max-w-xl">
              Turn your messy camera roll into stunning, magazine-worthy Instagram photo carousels in seconds. Just describe what you want like texting a friend, and BrainDump arranges the collages, polaroids, and stickers.
            </p>

            {/* Natural Language Prompt Input Bar */}
            <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl p-2 sm:p-2.5 border border-stone-200/90 dark:border-stone-800 shadow-xl shadow-stone-200/40 dark:shadow-none mb-4">
              <div className="flex items-center gap-2.5 px-3 pt-2">
                <Wand2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Describe the dump you want
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <input
                  id="hero-dump-input"
                  type="text"
                  placeholder="e.g. Chaotic but cute Goa trip dump with 16 photos & polaroids..."
                  defaultValue={quickPrompts[0]}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleStart((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm sm:text-base text-stone-800 dark:text-stone-100 bg-transparent focus:outline-none placeholder:text-stone-400"
                />
                <button
                  id="hero-generate-btn"
                  onClick={() => {
                    const input = document.getElementById('hero-dump-input') as HTMLInputElement;
                    handleStart(input?.value || quickPrompts[0]);
                  }}
                  className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Generate Dump</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="w-full max-w-xl flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-stone-400 font-medium mr-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Try vibes:
              </span>
              {quickPrompts.slice(1, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStart(prompt)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors truncate max-w-[240px]"
                >
                  "{prompt.slice(0, 32)}..."
                </button>
              ))}
            </div>

            {/* Secondary actions */}
            <div className="flex items-center gap-4 mt-8">
              <button
                id="hero-explore-templates-btn"
                onClick={onExploreTemplates}
                className="text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white underline underline-offset-4 flex items-center gap-1.5"
              >
                Browse Reference Dumps & Templates
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visually Impressive Interactive Carousel Preview Above The Fold */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[380px] relative">
              {/* Floating Aesthetic Badges */}
              <div className="absolute -top-4 -left-4 z-20 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-stone-900/95 shadow-md border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Carousel Demo
              </div>

              <div className="absolute -bottom-4 -right-2 z-20 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-stone-900/95 shadow-md border border-stone-200/80 dark:border-stone-800 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 backdrop-blur-sm">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                5 Slides • 4:5 Instagram Portrait
              </div>

              {/* Mock Phone / Carousel Frame */}
              <div className="w-full aspect-[4/5] rounded-3xl bg-[#FAF8F5] border-[6px] border-white dark:border-stone-800 shadow-2xl overflow-hidden relative group">
                
                {/* Active Slide Display */}
                {slides[activeSlideIndex] && (
                  <div
                    className="w-full h-full p-4 flex flex-col relative select-none transition-all duration-300"
                    style={{ backgroundColor: slides[activeSlideIndex].background }}
                  >
                    {/* Elements Rendered Inside Interactive Slide */}
                    {slides[activeSlideIndex].elements.map((el) => {
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
                              transform: `rotate(${el.rotation}deg)`,
                              zIndex: el.zIndex,
                            }}
                            className={`transition-transform duration-300 hover:scale-[1.02] ${
                              el.frameStyle === 'polaroid'
                                ? 'bg-white p-2 pb-6 shadow-lg rounded-sm flex flex-col'
                                : el.frameStyle === 'film-border'
                                ? 'bg-stone-900 p-1.5 shadow-md rounded-md'
                                : 'rounded-xl overflow-hidden shadow-md'
                            }`}
                          >
                            <img
                              src={el.photoUrl}
                              alt="Dump item"
                              referrerPolicy="no-referrer"
                              className={`w-full h-full object-cover ${
                                el.frameStyle === 'polaroid' ? 'rounded-xs' : 'rounded-lg'
                              }`}
                            />
                            {el.caption && (
                              <span className="text-[10px] font-handwriting text-stone-600 text-center mt-1 truncate">
                                {el.caption}
                              </span>
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
                              zIndex: el.zIndex,
                              textAlign: el.textAlign || 'center',
                              color: el.color,
                            }}
                            className={`font-serif-editorial font-bold text-lg tracking-wider flex items-center justify-center`}
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
                              transform: `rotate(${el.rotation}deg)`,
                              zIndex: el.zIndex,
                            }}
                            className="flex items-center justify-center pointer-events-none"
                          >
                            {el.stickerType === 'tape' ? (
                              <div className="w-12 h-3.5 bg-amber-200/80 border border-amber-300 -rotate-6 shadow-xs" />
                            ) : el.stickerType === 'heart' ? (
                              <Heart className="w-6 h-6 text-pink-500 fill-pink-500 drop-shadow-sm" />
                            ) : (
                              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-300 drop-shadow-sm animate-pulse" />
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Left/Right Carousel Controls */}
                <button
                  id="hero-prev-slide-btn"
                  onClick={handlePrevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-70 hover:opacity-100 z-30"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  id="hero-next-slide-btn"
                  onClick={handleNextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-70 hover:opacity-100 z-30"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Carousel Dots & Slide Counter */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-30">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlideIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeSlideIndex ? 'w-5 bg-stone-900 dark:bg-white' : 'w-1.5 bg-stone-400/50'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Below Preview Bar */}
              <div className="mt-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-2">
                <span>Slide {activeSlideIndex + 1} of {slides.length} • {demoTemplate.title}</span>
                <button
                  onClick={handleOpenEditor}
                  className="font-semibold text-rose-500 hover:text-rose-600 underline"
                >
                  Open in Visual Editor →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Workflow Section: Describe → Upload → Generate → Edit → Export */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 border-t border-stone-200/60 dark:border-stone-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-white">
            Effortless photo dumps in 5 simple steps
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mt-2 text-sm sm:text-base">
            No graphic design degree required. BrainDump does the creative heavy lifting for your Instagram feed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Step 1: Describe */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-white text-base">Describe</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5 leading-relaxed">
              Text BrainDump the vibe you want: “Chaotic Goa trip with 16 photos & polaroids”.
            </p>
          </div>

          {/* Step 2: Upload */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-white text-base">Upload</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5 leading-relaxed">
              Drop in all your raw photos from your camera roll or pick a curated sample pack.
            </p>
          </div>

          {/* Step 3: Generate */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-white text-base">Generate</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5 leading-relaxed">
              AI crafts a cohesive multi-slide sequence with collages, film borders, and typography.
            </p>
          </div>

          {/* Step 4: Edit */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-white text-base">Edit</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5 leading-relaxed">
              Drag, resize, reorder, swap photos, add stickers, or ask AI to tweak single slides.
            </p>
          </div>

          {/* Step 5: Export */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm mb-4">
              05
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-white text-base">Export</h3>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5 leading-relaxed">
              Download crisp 1080x1350 PNG slides ready for direct Instagram carousel upload.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
