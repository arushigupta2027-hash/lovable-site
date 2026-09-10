import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Calendar, 
  Clock, 
  Trash2, 
  Copy, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Wand2,
  Bookmark
} from 'lucide-react';
import { DumpProject, TemplateReference } from '../types';
import { REFERENCE_TEMPLATES } from '../data/sampleTemplates';

interface DashboardViewProps {
  projects: DumpProject[];
  onOpenProject: (project: DumpProject) => void;
  onStartNewDump: () => void;
  onDuplicateProject: (project: DumpProject) => void;
  onDeleteProject: (id: string) => void;
  onSelectTemplate: (template: TemplateReference) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  onOpenProject,
  onStartNewDump,
  onDuplicateProject,
  onDeleteProject,
  onSelectTemplate,
}) => {
  const [tab, setTab] = useState<'recent' | 'drafts' | 'saved'>('recent');
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.aesthetic.toLowerCase().includes(search.toLowerCase()) ||
      p.descriptionPrompt.toLowerCase().includes(search.toLowerCase());

    if (tab === 'drafts') return p.isDraft && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-white">
            My Dumps
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your AI-crafted carousels, drafts, and saved aesthetic templates.
          </p>
        </div>

        <button
          id="dashboard-new-dump-btn"
          type="button"
          onClick={onStartNewDump}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Dump</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('recent')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              tab === 'recent'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('drafts')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              tab === 'drafts'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Drafts ({projects.filter((p) => p.isDraft).length})
          </button>
          <button
            type="button"
            onClick={() => setTab('saved')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              tab === 'saved'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            Saved Templates ({REFERENCE_TEMPLATES.length})
          </button>
        </div>

        {tab !== 'saved' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your dumps..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        )}
      </div>

      {/* Content: Projects Grid */}
      {tab !== 'saved' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* "Create New Dump" Card */}
          <button
            type="button"
            onClick={onStartNewDump}
            className="aspect-[4/5] rounded-3xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-rose-400 dark:hover:border-rose-500 bg-white/40 dark:bg-stone-900/40 p-6 flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Wand2 className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 dark:text-white">
              Start New Dump
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-[200px]">
              Dump photos, describe your vibe, and let AI style every slide.
            </p>
          </button>

          {filteredProjects.map((p) => {
            const firstPhoto = p.photos[0]?.url || p.slides[0]?.elements.find(e => e.photoUrl)?.photoUrl;

            return (
              <div
                key={p.id}
                className="group rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Preview Area */}
                <div
                  onClick={() => onOpenProject(p)}
                  className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer"
                >
                  {firstPhoto ? (
                    <img
                      src={firstPhoto}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                      No photo preview
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-stone-900/90 text-[10px] font-bold text-stone-900 dark:text-white">
                    {p.aspect}
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-semibold text-white flex items-center gap-1">
                    <Layers className="w-3 h-3 text-rose-400" />
                    <span>{p.slides.length} slides</span>
                  </div>

                  {/* Bottom Title & Date */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-display font-bold text-base line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-stone-300 line-clamp-1 mt-0.5 opacity-90">
                      {p.descriptionPrompt || 'Effortless photo dump'}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-stone-400 mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-stone-50 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenProject(p)}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    Open Editor →
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDuplicateProject(p)}
                      title="Duplicate project"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(p.id)}
                      title="Delete project"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Saved Reference Templates */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {REFERENCE_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden p-4 flex flex-col justify-between"
            >
              <div>
                <img
                  src={tmpl.coverPhoto}
                  alt={tmpl.title}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover rounded-2xl mb-3"
                />
                <span className="text-[10px] font-bold text-rose-500 uppercase">
                  {tmpl.category}
                </span>
                <h4 className="font-display font-bold text-sm text-stone-900 dark:text-white mt-0.5">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                  {tmpl.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className="mt-4 w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400 dark:text-rose-500" />
                <span>Create with this style</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
