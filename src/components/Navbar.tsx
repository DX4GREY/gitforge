import React, { useState } from 'react';
import { Sparkles, Terminal, Palette, Search, Menu, X, Layout, FileText, UserCheck, Code, Layers, ShieldAlert, Shield, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { GitForgeLogo } from './GitForgeLogo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenCommandPalette }) => {
  const { activeTheme, setThemeById, themes } = useTheme();
  const { authState, setIsModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Layout },
    { label: 'README Builder', path: '/readme', icon: FileText },
    { label: 'SVG Cards', path: '/cards', icon: Code },
    { label: 'Avatar', path: '/avatar', icon: UserCheck },
    { label: 'Wrapped', path: '/wrapped', icon: Terminal },
    { label: 'Intelligence', path: '/intelligence', icon: ShieldAlert },
    { label: 'Portfolio', path: '/portfolio', icon: Layers },
    { label: 'Themes', path: '/themes', icon: Palette },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200"
      style={{
        backgroundColor: activeTheme.id === 'high-density' ? '#E4E3E0' : `${activeTheme.bg}dd`,
        borderColor: activeTheme.border,
      }}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 font-black text-xl tracking-tight focus:outline-none cursor-pointer"
        >
          <GitForgeLogo size={32} />
          <span style={{ color: activeTheme.text }}>
            Git<span style={{ color: activeTheme.primary }}>Forge</span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.slice(0, 6).map((link) => {
            const isActive = currentPath === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  isActive ? 'shadow-sm' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isActive ? activeTheme.surfaceSecondary : 'transparent',
                  color: isActive ? activeTheme.primary : activeTheme.textMuted,
                  border: isActive ? `1px solid ${activeTheme.border}` : '1px solid transparent',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Theme Quick Select */}
        <div className="flex items-center gap-2">
          {/* Cmd+K Search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition"
            style={{
              backgroundColor: activeTheme.surface,
              borderColor: activeTheme.border,
              color: activeTheme.textMuted,
            }}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search...</span>
            <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border bg-black/30 border-gray-700">
              ⌘K
            </kbd>
          </button>

          {/* GitHub Auth Button */}
          {authState.isAuthenticated && authState.user ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md border font-mono text-xs font-bold transition hover:opacity-90"
              style={{
                backgroundColor: activeTheme.id === 'high-density' ? '#D9D8D5' : activeTheme.surfaceSecondary,
                borderColor: activeTheme.border,
                color: activeTheme.text,
              }}
            >
              <img
                src={authState.user.avatarUrl}
                alt={authState.user.login}
                className="w-5 h-5 rounded-full border border-current"
              />
              <span className="hidden sm:inline">@{authState.user.login}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              title="GitHub Login"
              aria-label="GitHub Login"
              className="p-2 rounded-lg border font-mono transition hover:opacity-90 shadow-xs flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: '#141414',
                color: '#E4E3E0',
                borderColor: activeTheme.border,
              }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </button>
          )}

          {/* Theme Quick Selector (Hidden on extra small screens, visible in mobile drawer) */}
          <select
            value={activeTheme.id}
            onChange={(e) => setThemeById(e.target.value)}
            className="hidden sm:block text-xs px-2.5 py-1.5 rounded-lg border font-mono outline-none cursor-pointer"
            style={{
              backgroundColor: activeTheme.surface,
              borderColor: activeTheme.border,
              color: activeTheme.text,
            }}
          >
            {themes.map((t) => (
              <option key={t.id} value={t.id}>
                🎨 {t.name}
              </option>
            ))}
          </select>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border"
            style={{
              backgroundColor: activeTheme.surface,
              borderColor: activeTheme.border,
              color: activeTheme.text,
            }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-b px-4 pt-3 pb-5 space-y-3"
          style={{
            backgroundColor: activeTheme.surface,
            borderColor: activeTheme.border,
          }}
        >
          {/* Mobile Search & Theme Controls */}
          <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: activeTheme.border }}>
            <button
              onClick={() => {
                onOpenCommandPalette();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium"
              style={{
                backgroundColor: activeTheme.surfaceSecondary,
                borderColor: activeTheme.border,
                color: activeTheme.textMuted,
              }}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Tools...</span>
            </button>

            <select
              value={activeTheme.id}
              onChange={(e) => setThemeById(e.target.value)}
              className="text-xs px-2 py-2 rounded-lg border font-mono outline-none cursor-pointer"
              style={{
                backgroundColor: activeTheme.surfaceSecondary,
                borderColor: activeTheme.border,
                color: activeTheme.text,
              }}
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  🎨 {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    onNavigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition"
                  style={{
                    backgroundColor: isActive ? activeTheme.surfaceSecondary : 'transparent',
                    color: isActive ? activeTheme.primary : activeTheme.text,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
