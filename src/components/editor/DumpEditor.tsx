import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  Share2, 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  Wand2, 
  Smile, 
  Save, 
  Check, 
  SlidersHorizontal,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { AspectRatio, DumpProject, FrameStyle, LayoutPreset, PhotoItem, Slide, SlideElement } from '../../types';
import { SlideCanvas } from './SlideCanvas';
import { SlideFilmstrip } from './SlideFilmstrip';
import { AiAssistantPanel } from './AiAssistantPanel';
import { PhotoPoolDrawer } from './PhotoPoolDrawer';
import { StickerPicker } from './StickerPicker';
import { buildSlideElements, createId } from '../../utils/dumpGenerator';

interface DumpEditorProps {
  project: DumpProject;
  onUpdateProject: (updated: DumpProject) => void;
  onBackToDashboard: () => void;
  onOpenExport: () => void;
}

export const DumpEditor: React.FC<DumpEditorProps> = ({
  project,
  onUpdateProject,
  onBackToDashboard,
  onOpenExport,
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'ai' | 'photos' | 'stickers'>('ai');
  const [swapPhotoElementId, setSwapPhotoElementId] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<DumpProject[]>([project]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync project changes to history
  const pushState = (newProject: DumpProject) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newProject);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    onUpdateProject(newProject);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateProject(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateProject(next);
    }
  };

  // Keyboard shortcut for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const currentSlide = project.slides[activeSlideIndex] || project.slides[0];

  // Aspect Ratio change
  const handleAspectChange = (aspect: AspectRatio) => {
    pushState({
      ...project,
      aspect,
      updatedAt: new Date().toISOString(),
    });
  };

  // Slide element updates
  const handleUpdateElement = (updated: SlideElement) => {
    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: s.elements.map((el) => (el.id === updated.id ? updated : el)),
      };
    });
    pushState({ ...project, slides: updatedSlides });
  };

  const handleDeleteElement = (id: string) => {
    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: s.elements.filter((el) => el.id !== id),
      };
    });
    setSelectedElementId(null);
    pushState({ ...project, slides: updatedSlides });
  };

  // Add Slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: createId('slide'),
      slideNumber: project.slides.length + 1,
      layoutType: 'polaroids',
      background: '#FAF8F5',
      elements: buildSlideElements(
        'polaroids',
        project.photos.slice(0, 2),
        project.aesthetic,
        project.slides.length,
        project.slides.length + 1
      ),
    };
    const updatedSlides = [...project.slides, newSlide];
    pushState({ ...project, slides: updatedSlides });
    setActiveSlideIndex(updatedSlides.length - 1);
  };

  // Duplicate Slide
  const handleDuplicateSlide = (index: number) => {
    const target = project.slides[index];
    if (!target) return;
    const duplicated: Slide = {
      ...target,
      id: createId('slide-copy'),
      slideNumber: index + 2,
      elements: target.elements.map((el) => ({ ...el, id: createId('el-copy') })),
    };
    const updated = [...project.slides];
    updated.splice(index + 1, 0, duplicated);
    // renumber
    const renumbered = updated.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    pushState({ ...project, slides: renumbered });
    setActiveSlideIndex(index + 1);
  };

  // Delete Slide
  const handleDeleteSlide = (index: number) => {
    if (project.slides.length <= 1) return;
    const updated = project.slides.filter((_, i) => i !== index);
    const renumbered = updated.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    pushState({ ...project, slides: renumbered });
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  // Move Slide (Reorder)
  const handleMoveSlide = (from: number, to: number) => {
    if (to < 0 || to >= project.slides.length) return;
    const copy = [...project.slides];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    const renumbered = copy.map((s, i) => ({ ...s, slideNumber: i + 1 }));
    pushState({ ...project, slides: renumbered });
    setActiveSlideIndex(to);
  };

  // Apply layout preset to current slide
  const handleApplyLayoutPreset = (layout: LayoutPreset) => {
    const slidePhotos = project.photos.slice(0, 4);
    const newElements = buildSlideElements(
      layout,
      slidePhotos,
      project.aesthetic,
      activeSlideIndex,
      project.slides.length
    );

    const updatedSlides = project.slides.map((s, i) => {
      if (i !== activeSlideIndex) return s;
      return {
        ...s,
        layoutType: layout,
        elements: newElements,
      };
    });
    pushState({ ...project, slides: updatedSlides });
  };

  // Regenerate single slide with random aesthetic variation
  const handleRegenerateSlide = (indexToRegen?: number) => {
    const idx = indexToRegen ?? activeSlideIndex;
    const presets: LayoutPreset[] = [
      'polaroids',
      'collage-3',
      'scrapbook',
      'split',
      'minimal-quote',
      'filmstrip',
      'full-bleed',
    ];
    const randomLayout = presets[Math.floor(Math.random() * presets.length)];
    // Pick random photos from pool
    const shuffledPhotos = [...project.photos].sort(() => 0.5 - Math.random());
    const newElements = buildSlideElements(
      randomLayout,
      shuffledPhotos.slice(0, 3),
      project.aesthetic,
      idx,
      project.slides.length,
      { isMessy: true }
    );

    const updatedSlides = project.slides.map((s, i) => {
      if (i !== idx) return s;
      return {
        ...s,
        layoutType: randomLayout,
        elements: newElements,
      };
    });
    pushState({ ...project, slides: updatedSlides });
  };

  // AI Assistant command for slide
  const handleAiSlideInstruction = async (instruction: string) => {
    try {
      const res = await fetch('/api/tweak-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          currentSlide,
          aesthetic: project.aesthetic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.tweak?.layoutType) {
          handleApplyLayoutPreset(data.tweak.layoutType as LayoutPreset);
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback layout logic applied for tweak', err);
    }

    // Local fallback
    const lower = instruction.toLowerCase();
    if (lower.includes('minimal')) handleApplyLayoutPreset('minimal-quote');
    else if (lower.includes('mess') || lower.includes('chaotic')) handleApplyLayoutPreset('scrapbook');
    else if (lower.includes('3') || lower.includes('three')) handleApplyLayoutPreset('collage-3');
    else if (lower.includes('polaroid')) handleApplyLayoutPreset('polaroids');
    else if (lower.includes('film')) handleApplyLayoutPreset('filmstrip');
    else handleRegenerateSlide();
  };

  // Add photo from pool to active slide
  const handleAddPhotoToSlide = (photo: PhotoItem) => {
    const newEl: SlideElement = {
      id: createId('img-add'),
      type: 'image',
      x: 20 + Math.random() * 20,
      y: 20 + Math.random() * 20,
      width: 50,
      height: 45,
      rotation: Math.round((Math.random() - 0.5) * 12),
      zIndex: currentSlide.elements.length + 1,
      photoUrl: photo.url,
      photoId: photo.id,
      frameStyle: 'polaroid',
      caption: photo.caption || 'snapshot',
    };

    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: [...s.elements, newEl],
      };
    });
    pushState({ ...project, slides: updatedSlides });
    setSelectedElementId(newEl.id);
  };

  // Swap photo
  const handleSwapConfirm = (newPhoto: PhotoItem) => {
    if (!swapPhotoElementId) return;
    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: s.elements.map((el) => {
          if (el.id === swapPhotoElementId) {
            return {
              ...el,
              photoUrl: newPhoto.url,
              photoId: newPhoto.id,
              caption: newPhoto.caption || el.caption,
            };
          }
          return el;
        }),
      };
    });
    pushState({ ...project, slides: updatedSlides });
    setSwapPhotoElementId(null);
  };

  // Add sticker
  const handleAddSticker = (stickerType: string) => {
    const newSticker: SlideElement = {
      id: createId('st-add'),
      type: 'sticker',
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      width: 16,
      height: 16,
      rotation: Math.round((Math.random() - 0.5) * 20),
      zIndex: currentSlide.elements.length + 2,
      stickerType,
    };

    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: [...s.elements, newSticker],
      };
    });
    pushState({ ...project, slides: updatedSlides });
    setSelectedElementId(newSticker.id);
  };

  // Add text
  const handleAddText = (
    text: string,
    font: 'serif' | 'sans' | 'handwriting' | 'display',
    color = '#1C1917'
  ) => {
    const newText: SlideElement = {
      id: createId('txt-add'),
      type: 'text',
      x: 10,
      y: 75,
      width: 80,
      height: 12,
      rotation: 0,
      zIndex: currentSlide.elements.length + 3,
      text,
      fontFamily: font,
      color,
      textAlign: 'center',
    };

    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return {
        ...s,
        elements: [...s.elements, newText],
      };
    });
    pushState({ ...project, slides: updatedSlides });
    setSelectedElementId(newText.id);
  };

  // Change background color
  const handleChangeBg = (bg: string) => {
    const updatedSlides = project.slides.map((s, idx) => {
      if (idx !== activeSlideIndex) return s;
      return { ...s, background: bg };
    });
    pushState({ ...project, slides: updatedSlides });
  };

  const handleSaveDraft = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-stone-100/70 dark:bg-stone-950 overflow-hidden">
      {/* Top Action Bar */}
      <div className="h-14 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-4 flex items-center justify-between gap-4 z-20 shrink-0">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            title="Back to My Dumps"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <input
              type="text"
              value={project.title}
              onChange={(e) => pushState({ ...project, title: e.target.value })}
              className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-stone-700 focus:border-rose-500 focus:outline-none px-1"
            />
            <div className="text-[10px] text-stone-400 pl-1">
              Slide {activeSlideIndex + 1} of {project.slides.length} • {project.aspect}
            </div>
          </div>
        </div>

        {/* Center: Aspect Ratio & Undo/Redo Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Aspect toggle */}
          <div className="flex items-center rounded-xl bg-stone-100 dark:bg-stone-800 p-1 text-xs">
            {(['4:5', '1:1', '9:16'] as AspectRatio[]).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => handleAspectChange(ar)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  project.aspect === ar
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {ar}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={historyIndex <= 0}
              onClick={handleUndo}
              title="Undo (Ctrl/Cmd+Z)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={handleRedo}
              title="Redo (Ctrl/Cmd+Y)"
              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Save & Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold transition-colors"
          >
            {savedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            id="editor-export-btn"
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs sm:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Dump</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Canvas + Tools Sidebar) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left: Canvas Area */}
        <div className="flex-1 h-full flex flex-col relative overflow-hidden bg-stone-100/60 dark:bg-stone-950">
          
          {/* Quick Carousel Prev/Next Overlay buttons on sides */}
          <button
            onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeSlideIndex === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white text-stone-700 dark:text-stone-200 flex items-center justify-center shadow-md disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            title="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() =>
              setActiveSlideIndex((prev) => Math.min(project.slides.length - 1, prev + 1))
            }
            disabled={activeSlideIndex === project.slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-white text-stone-700 dark:text-stone-200 flex items-center justify-center shadow-md disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            title="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Interactive Canvas */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
            {currentSlide && (
              <SlideCanvas
                slide={currentSlide}
                aspect={project.aspect}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onSwapPhotoRequest={(elId) => {
                  setSwapPhotoElementId(elId);
                  setActiveSidebarTab('photos');
                }}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar: AI Assistant, Photo Pool, Stickers & Design Controls */}
        <div className="w-full lg:w-80 xl:w-96 bg-white dark:bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 flex flex-col shrink-0 h-72 lg:h-full z-10 shadow-lg">
          {/* Sidebar Tab Switcher */}
          <div className="h-11 border-b border-stone-200 dark:border-stone-800 flex items-center px-3 gap-1 shrink-0 bg-stone-50/70 dark:bg-stone-900">
            <button
              type="button"
              onClick={() => setActiveSidebarTab('ai')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeSidebarTab === 'ai'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-rose-500" />
              <span>AI Stylist</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('photos')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeSidebarTab === 'photos'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Photos ({project.photos.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSidebarTab('stickers')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                activeSidebarTab === 'stickers'
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Smile className="w-3.5 h-3.5 text-violet-500" />
              <span>Elements</span>
            </button>
          </div>

          {/* Sidebar Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeSidebarTab === 'ai' && currentSlide && (
              <AiAssistantPanel
                currentSlide={currentSlide}
                onApplyLayoutPreset={handleApplyLayoutPreset}
                onAiSlideInstruction={handleAiSlideInstruction}
                onRegenerateSlide={() => handleRegenerateSlide(activeSlideIndex)}
              />
            )}

            {activeSidebarTab === 'photos' && (
              <PhotoPoolDrawer
                photos={project.photos}
                onAddPhotoToSlide={handleAddPhotoToSlide}
                onUploadPhotos={(newPhotos) =>
                  pushState({ ...project, photos: [...project.photos, ...newPhotos] })
                }
                activePhotoIdToSwap={swapPhotoElementId}
                onSwapConfirm={handleSwapConfirm}
              />
            )}

            {activeSidebarTab === 'stickers' && currentSlide && (
              <StickerPicker
                onAddSticker={handleAddSticker}
                onAddText={handleAddText}
                currentBg={currentSlide.background}
                onChangeBg={handleChangeBg}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Filmstrip Timeline */}
      <SlideFilmstrip
        slides={project.slides}
        activeSlideIndex={activeSlideIndex}
        onSelectSlide={setActiveSlideIndex}
        onAddSlide={handleAddSlide}
        onDuplicateSlide={handleDuplicateSlide}
        onDeleteSlide={handleDeleteSlide}
        onMoveSlide={handleMoveSlide}
        onRegenerateSlide={handleRegenerateSlide}
      />
    </div>
  );
};
