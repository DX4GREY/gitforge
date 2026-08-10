import React, { useState, useEffect } from 'react';
import { Search, Sparkles, FileText, Layout, UserCheck, ShieldAlert, Cpu, Palette, Code, Terminal, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const { activeTheme } = useTheme();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Layout, desc: 'Overview & recent assets' },
    { id: 'readme', label: 'README Generator', path: '/readme', icon: FileText, desc: 'Build profile README.md' },
    { id: 'readme-agent', label: 'AI README Agent', path: '/readme-agent', icon: Sparkles, desc: 'Multi-step AI README pipeline' },
    { id: 'cards', label: 'SVG Cards Hub', path: '/cards', icon: Code, desc: 'Profile, Stats, Lang & Streak Cards' },
    { id: 'avatar', label: 'Developer Avatar Generator', path: '/avatar', icon: UserCheck, desc: 'Custom vector persona' },
    { id: 'project-persona', label: 'Project Persona', path: '/project-persona', icon: Layers, desc: 'Repository mascot & archetype' },
    { id: 'wrapped', label: 'GitHub Wrapped', path: '/wrapped', icon: Cpu, desc: 'Yearly developer story' },
    { id: 'daily-card', label: 'Daily Dev Card', path: '/daily-card', icon: Terminal, desc: 'Shareable daily progress card' },
    { id: 'intelligence', label: 'Profile Intelligence', path: '/intelligence', icon: ShieldAlert, desc: 'AI developer score & report' },
    { id: 'portfolio', label: 'Developer Portfolio', path: '/portfolio', icon: Layout, desc: 'Generate web portfolio & ZIP' },
    { id: 'themes', label: 'Theme Customizer', path: '/themes', icon: Palette, desc: '20+ original themes' },
    { id: 'docs', label: 'Documentation & API', path: '/docs', icon: FileText, desc: 'API specs & embedding guide' },
  ];

  const filtered = commands.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: activeTheme.surface,
          borderColor: activeTheme.border,
          color: activeTheme.text,
        }}
      >
        <div className="flex items-center px-4 border-b" style={{ borderColor: activeTheme.border }}>
          <Search className="w-5 h-5 mr-3" style={{ color: activeTheme.textMuted }} />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search tools... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 bg-transparent outline-none text-sm placeholder-gray-500"
            style={{ color: activeTheme.text }}
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm" style={{ color: activeTheme.textMuted }}>
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onNavigate(cmd.path);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left transition hover:opacity-90"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = activeTheme.surfaceSecondary)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-md"
                      style={{ backgroundColor: activeTheme.surfaceSecondary, color: activeTheme.primary }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{cmd.label}</div>
                      <div className="text-xs" style={{ color: activeTheme.textMuted }}>
                        {cmd.desc}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded border" style={{ borderColor: activeTheme.border, color: activeTheme.textMuted }}>
                    Jump
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
