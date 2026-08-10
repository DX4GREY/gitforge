import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { GitHubAuthModal } from './components/GitHubAuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReadmeBuilderPage } from './pages/ReadmeBuilderPage';
import { ReadmeAgentPage } from './pages/ReadmeAgentPage';
import { SvgCardsPage } from './pages/SvgCardsPage';
import { AvatarGeneratorPage } from './pages/AvatarGeneratorPage';
import { ProjectPersonaPage } from './pages/ProjectPersonaPage';
import { WrappedPage } from './pages/WrappedPage';
import { DailyCardPage } from './pages/DailyCardPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { PortfolioBuilderPage } from './pages/PortfolioBuilderPage';
import { HostedProfilePage } from './pages/HostedProfilePage';
import { ThemesPage } from './pages/ThemesPage';
import { ExtensionPage } from './pages/ExtensionPage';
import { DocsPage } from './pages/DocsPage';

function AppContent() {
  const { activeTheme } = useTheme();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    if (currentPath.startsWith('/profile/')) {
      const usernameParam = currentPath.split('/profile/')[1] || 'octocat';
      return <HostedProfilePage usernameParam={usernameParam} />;
    }

    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case '/readme':
        return <ReadmeBuilderPage onNavigate={navigate} />;
      case '/readme-agent':
        return <ReadmeAgentPage />;
      case '/cards':
        return <SvgCardsPage />;
      case '/avatar':
        return <AvatarGeneratorPage />;
      case '/project-persona':
        return <ProjectPersonaPage />;
      case '/wrapped':
        return <WrappedPage />;
      case '/daily-card':
        return <DailyCardPage />;
      case '/repo-visualizer':
        return <VisualizerPage />;
      case '/intelligence':
        return <IntelligencePage />;
      case '/portfolio':
        return <PortfolioBuilderPage />;
      case '/themes':
        return <ThemesPage />;
      case '/extension':
        return <ExtensionPage />;
      case '/docs':
        return <DocsPage />;
      case '/':
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
      style={{
        backgroundColor: activeTheme.bg,
        color: activeTheme.text,
      }}
    >
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <main className="flex-1">{renderCurrentView()}</main>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={navigate}
      />

      <GitHubAuthModal />

      {/* Global Footer */}
      <footer
        className="border-t py-6 text-xs font-mono mt-12 transition-colors duration-200"
        style={{
          backgroundColor: activeTheme.id === 'high-density' ? '#D9D8D5' : activeTheme.surfaceSecondary,
          color: activeTheme.text,
          borderColor: activeTheme.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="px-1.5 py-0.5 font-bold text-[10px]"
              style={{
                backgroundColor: activeTheme.id === 'high-density' ? '#141414' : activeTheme.primary,
                color: activeTheme.id === 'high-density' ? '#E4E3E0' : '#FFFFFF',
              }}
            >
              GF-OS
            </span>
            <strong>GitForge Engine</strong> — High Density Developer Toolkit
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => navigate('/docs')} className="hover:underline cursor-pointer">Docs</button>
            <span className="opacity-40">|</span>
            <button onClick={() => navigate('/extension')} className="hover:underline cursor-pointer">Extension</button>
            <span className="opacity-40">|</span>
            <button onClick={() => navigate('/themes')} className="hover:underline cursor-pointer">Themes</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
