import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Layout, RefreshCw, Send, Check } from 'lucide-react';
import { LayoutPreset, Slide } from '../../types';

interface AiAssistantPanelProps {
  currentSlide: Slide;
  onApplyLayoutPreset: (preset: LayoutPreset) => void;
  onAiSlideInstruction: (instruction: string) => Promise<void>;
  onRegenerateSlide: () => void;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  currentSlide,
  onApplyLayoutPreset,
  onAiSlideInstruction,
  onRegenerateSlide,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const quickCommands = [
    'Make this slide more minimal',
    'Make it messier & chaotic',
    'Use 3 photos instead',
    'Turn into cute polaroids',
    'Add aesthetic handwriting quote',
    'Add 35mm film borders & grain',
  ];

  const layoutPresets: { id: LayoutPreset; label: string; desc: string }[] = [
    { id: 'full-bleed', label: 'Full Bleed', desc: 'Single hero shot with title' },
    { id: 'polaroids', label: 'Polaroids', desc: 'Overlapping white frames' },
    { id: 'collage-2', label: 'Duo Collage', desc: 'Side-by-side balanced' },
    { id: 'collage-3', label: 'Trio Collage', desc: '3 curated snapshots' },
    { id: 'grid-4', label: 'Grid 4', desc: '2x2 clean square grid' },
    { id: 'scrapbook', label: 'Scrapbook', desc: 'Angled tape & messy stickers' },
    { id: 'minimal-quote', label: 'Minimal Quote', desc: 'Editorial center & caption' },
    { id: 'split', label: 'Split Screen', desc: 'Two panoramic blocks' },
    { id: 'filmstrip', label: '35mm Filmstrip', desc: 'Analog sprocket borders' },
  ];

  const handleSubmit = async (textToRun?: string) => {
    const query = textToRun || instruction;
    if (!query.trim()) return;

    setIsProcessing(true);
    setFeedback(null);
    try {
      await onAiSlideInstruction(query);
      setFeedback(`Applied: "${query}"`);
      setInstruction('');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-white">
            AI Slide Stylist
          </h3>
        </div>
        <button
          type="button"
          onClick={onRegenerateSlide}
          className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Regenerate Slide
        </button>
      </div>

      {/* Natural Language Prompt Box */}
      <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-700">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
          Ask AI to adjust Slide #{currentSlide.slideNumber}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. make it messier, add polaroid tape..."
            className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="button"
            disabled={isProcessing || !instruction.trim()}
            onClick={() => handleSubmit()}
            className="px-3 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 flex items-center justify-center"
          >
            {isProcessing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {feedback && (
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            {feedback}
          </div>
        )}

        {/* Quick Click AI Tweak Pills */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {quickCommands.map((cmd, i) => (
            <button
              key={i}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSubmit(cmd)}
              className="text-[10px] font-medium px-2 py-1 rounded-lg bg-white dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Layout Suggestions (1-Click Switchers) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-stone-500" />
            Smart Layout Suggestions
          </span>
          <span className="text-[10px] text-stone-400">1-click switch</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {layoutPresets.map((preset) => {
            const isCurrent = currentSlide.layoutType === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyLayoutPreset(preset.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-100 truncate">
                  {preset.label}
                </div>
                <div className="text-[9px] text-stone-400 truncate mt-0.5">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
