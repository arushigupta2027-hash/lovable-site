import React, { useState, useEffect } from 'react';
import { DumpProject, TemplateReference } from './types';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { GeneratorWizard } from './components/GeneratorWizard';
import { DumpEditor } from './components/editor/DumpEditor';
import { TemplatesGallery } from './components/TemplatesGallery';
import { TemplatePreviewModal } from './components/TemplatePreviewModal';
import { ExportModal } from './components/ExportModal';
import { SAMPLE_PHOTO_PACKS } from './data/samplePhotos';
import { generateDumpProject } from './utils/dumpGenerator';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'wizard' | 'editor' | 'templates'>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [wizardPrompt, setWizardPrompt] = useState<string>('');
  const [activeProject, setActiveProject] = useState<DumpProject | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateReference | null>(null);

  // Load / Seed Saved Projects
  const [projects, setProjects] = useState<DumpProject[]>(() => {
    try {
      const saved = localStorage.getItem('braindump_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }

    // Default Seed Projects
    const seed1 = generateDumpProject({
      prompt: 'Positano lemon spritz, linen shirts, 35mm film sunset snapshots & boat day',
      photos: SAMPLE_PHOTO_PACKS[0].photos,
      photoCount: 12,
      slideCount: 5,
      aspect: '4:5',
      aesthetic: 'vintage-film',
      customTitle: 'POSITANO ‘26',
    });

    const seed2 = generateDumpProject({
      prompt: 'Tokyo midnight ramen, neon signs, metro tickets & high flash film',
      photos: SAMPLE_PHOTO_PACKS[2].photos,
      photoCount: 10,
      slideCount: 4,
      aspect: '4:5',
      aesthetic: 'dark-moody',
      customTitle: 'TOKYO SCAPES',
    });

    return [seed1, seed2];
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('braindump_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage limit reached for projects', e);
    }
  }, [projects]);

  // Project update handler
  const handleUpdateProject = (updated: DumpProject) => {
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Start generation from Landing or Dashboard
  const handleStartWizard = (initialPrompt = '') => {
    setWizardPrompt(initialPrompt);
    setCurrentView('wizard');
  };

  // When AI generates a project successfully
  const handleGenerateSuccess = (newProject: DumpProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    setCurrentView('editor');
  };

  // Duplicate a project in Dashboard
  const handleDuplicateProject = (proj: DumpProject) => {
    const duplicated: DumpProject = {
      ...proj,
      id: `dump-${Date.now()}`,
      title: `${proj.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [duplicated, ...prev]);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
  };

  // When user picks a template from the gallery
  const handleUseTemplateStyle = (tmpl: TemplateReference) => {
    setPreviewTemplate(null);
    setWizardPrompt(tmpl.promptExample);
    setCurrentView('wizard');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200 selection:bg-rose-500 selection:text-white">
      {/* Global Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view: any) => {
          if (view === 'generator') setCurrentView('wizard');
          else setCurrentView(view);
        }}
        onNavigate={(view: any) => {
          if (view === 'generator') setCurrentView('wizard');
          else setCurrentView(view);
        }}
        isDarkMode={darkMode}
        darkMode={darkMode}
        setIsDarkMode={setDarkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onStartNewDump={() => handleStartWizard()}
        onCreateClick={() => handleStartWizard()}
        hasActiveProject={Boolean(activeProject)}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingHero
            onStartWithPrompt={(p) => handleStartWizard(p)}
            onStartCreating={(p) => handleStartWizard(p || '')}
            onExploreTemplates={() => setCurrentView('templates')}
            onOpenSampleEditor={() => {
              if (activeProject) {
                setCurrentView('editor');
              } else if (projects.length > 0) {
                setActiveProject(projects[0]);
                setCurrentView('editor');
              } else {
                handleStartWizard();
              }
            }}
            onOpenProject={(proj) => {
              if (proj) {
                setActiveProject(proj);
                setCurrentView('editor');
              } else if (projects.length > 0) {
                setActiveProject(projects[0]);
                setCurrentView('editor');
              } else {
                handleStartWizard();
              }
            }}
          />
        )}

        {currentView === 'wizard' && (
          <GeneratorWizard
            initialPrompt={wizardPrompt}
            onGenerateSuccess={handleGenerateSuccess}
            onCancel={() => setCurrentView(projects.length > 0 ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'editor' && activeProject && (
          <DumpEditor
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenExport={() => setExportModalOpen(true)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            projects={projects}
            onOpenProject={(proj) => {
              setActiveProject(proj);
              setCurrentView('editor');
            }}
            onStartNewDump={() => handleStartWizard()}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onSelectTemplate={handleUseTemplateStyle}
          />
        )}

        {currentView === 'templates' && (
          <TemplatesGallery
            onSelectTemplate={handleUseTemplateStyle}
            onPreviewTemplate={(tmpl) => setPreviewTemplate(tmpl)}
          />
        )}
      </main>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseStyle={handleUseTemplateStyle}
      />

      {/* High-Resolution Instagram Export Modal */}
      {exportModalOpen && activeProject && (
        <ExportModal
          project={activeProject}
          onClose={() => setExportModalOpen(false)}
        />
      )}
    </div>
  );
}
