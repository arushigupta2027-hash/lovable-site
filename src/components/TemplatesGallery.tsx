import React, { useState } from 'react';
import { Sparkles, Layers, ArrowRight, Eye, Wand2, Search, Filter } from 'lucide-react';
import { REFERENCE_TEMPLATES } from '../data/sampleTemplates';
import { TemplateReference } from '../types';

interface TemplatesGalleryProps {
  onSelectTemplate: (template: TemplateReference) => void;
  onPreviewTemplate: (template: TemplateReference) => void;
}

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  onSelectTemplate,
  onPreviewTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Travel',
    'Friends',
    'Summer',
    'Night Out',
    'Birthday',
    'Minimal',
    'College',
    'Food',
    'Fashion',
  ];

  const filtered = REFERENCE_TEMPLATES.filter((tmpl) => {
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.aesthetic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Reference Gallery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-stone-900 dark:text-white tracking-tight">
            Reference Dumps & Styles
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Browse aesthetic carousels crafted by top creators. Click "Use This Style" to apply its layout system and vibe to your own photos.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vibes, film, travel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-sm'
                : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Moodboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="group relative rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Cover Image with Aspect Preview */}
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
              <img
                src={tmpl.coverPhoto}
                alt={tmpl.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs text-[11px] font-bold text-stone-900 dark:text-white shadow-xs">
                {tmpl.category}
              </div>

              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-[11px] font-semibold text-white flex items-center gap-1">
                <Layers className="w-3 h-3 text-rose-400" />
                <span>{tmpl.slideCount} Slides</span>
              </div>

              {/* Card Footer Inside Cover */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-display font-bold text-lg leading-tight mb-1">
                  {tmpl.title}
                </h3>
                <p className="text-[11px] text-stone-200 line-clamp-2 leading-relaxed opacity-90">
                  {tmpl.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {tmpl.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-[9px] font-medium text-white/90"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onPreviewTemplate(tmpl)}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400 dark:text-rose-500" />
                <span>Use Style</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
