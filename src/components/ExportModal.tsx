import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Instagram, 
  Sparkles, 
  Layers, 
  FileCheck, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { DumpProject, Slide } from '../types';
import { renderSlideToBlob } from '../utils/canvasRenderer';

interface ExportModalProps {
  project: DumpProject | null;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Auto-generate aesthetic Instagram caption based on vibe & title
  const [instagramCaption, setInstagramCaption] = useState('');

  useEffect(() => {
    if (!project) return;
    const title = project.title || 'camera roll scraps';
    const vibe = project.aesthetic;

    let aestheticCaption = '';
    if (vibe === 'vintage-film') {
      aestheticCaption = `analog memories on 35mm film 🎞️\n\n${title.toLowerCase()} scraps & late night walks.\n\nslide 1: the highlight\nslide 2: candid laughter\nslide ${project.slides.length}: until next time`;
    } else if (vibe === 'cute-pastel') {
      aestheticCaption = `a little dump of moments that made me smile 🎀✨\n\n${title.toLowerCase()} diaries.\n\nwhich slide is your favorite? (1-${project.slides.length}) 💌`;
    } else if (vibe === 'dark-moody') {
      aestheticCaption = `flash on, night off. 🖤\n\n${title.toUpperCase()}.\n\nswipe through → 1/${project.slides.length}`;
    } else {
      aestheticCaption = `recent files & unfiltered memories 🍝🍋\n\n${title}\n1-${project.slides.length} in order of chaos.`;
    }
    setInstagramCaption(aestheticCaption);
  }, [project]);

  // Download a single slide as high-res PNG
  const handleDownloadSingleSlide = async (slide: Slide, index: number) => {
    try {
      const blob = await renderSlideToBlob(slide, project.aspect);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-slide-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export slide', err);
    }
  };

  // Download all slides in sequence
  const handleDownloadAll = async () => {
    setIsExporting(true);
    setDownloadProgress({ current: 0, total: project.slides.length });

    for (let i = 0; i < project.slides.length; i++) {
      setDownloadProgress({ current: i + 1, total: project.slides.length });
      await handleDownloadSingleSlide(project.slides[i], i);
      // Small pause between downloads to let browser download stream handle nicely
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsExporting(false);
    setDownloadProgress(null);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(instagramCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-amber-500 to-violet-600 flex items-center justify-center text-white shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white">
                Export Photo Dump
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ready to post directly to Instagram Carousel • {project.aspect} aspect ratio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left: Slides Reel Preview */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Full-Resolution Slide Previews ({project.slides.length})
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Optimized 1080px Width
              </span>
            </div>

            {/* Slides horizontal scroll row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.slides.map((slide, idx) => {
                const isSelected = idx === activeSlideIdx;
                const photoEl = slide.elements.find((e) => e.photoUrl);

                return (
                  <div
                    key={slide.id}
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all p-2 flex flex-col justify-between cursor-pointer group shadow-xs ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                    style={{ backgroundColor: slide.background }}
                  >
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                      {photoEl ? (
                        <img
                          src={photoEl.photoUrl}
                          alt={`Slide ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 font-bold p-2 text-center">
                          {slide.elements.find((e) => e.text)?.text || 'Text slide'}
                        </div>
                      )}
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white font-bold text-[10px]">
                        #{idx + 1}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadSingleSlide(slide, idx);
                      }}
                      className="mt-2 w-full py-1 text-[11px] font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Instagram Posting Guide Card */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
              <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-rose-500" />
                How to post this dump seamlessly on Instagram
              </div>
              <ul className="text-stone-600 dark:text-stone-400 space-y-1 pl-4 list-disc text-[11px]">
                <li>Tap <strong>+</strong> on Instagram, choose <strong>Post</strong>, then tap the multiple photo icon (Select Multiple).</li>
                <li>Pick the downloaded slides in sequence: <strong>#1 through #{project.slides.length}</strong>.</li>
                <li>No cropping needed — BrainDump formats with perfect 4:5 native dimensions.</li>
                <li>Paste the aesthetic caption generated below!</li>
              </ul>
            </div>
          </div>

          {/* Right: Actions & Caption Generator */}
          <div className="md:col-span-5 flex flex-col justify-between gap-5">
            
            {/* Download Action Box */}
            <div className="bg-stone-50 dark:bg-stone-800/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Batch Download
              </h4>

              <button
                id="export-download-all-btn"
                type="button"
                disabled={isExporting}
                onClick={handleDownloadAll}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Exporting Slide {downloadProgress?.current} of {downloadProgress?.total}...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download All {project.slides.length} Slides</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-stone-500 text-center">
                High quality lossless PNG files named sequentially
              </div>
            </div>

            {/* AI-Generated Instagram Caption */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  AI-Crafted Instagram Caption
                </span>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="text-xs font-semibold px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={5}
                value={instagramCaption}
                onChange={(e) => setInstagramCaption(e.target.value)}
                className="w-full flex-1 p-3 text-xs rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 resize-none focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono leading-relaxed"
              />
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
            >
              Done & Return to Editor
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
