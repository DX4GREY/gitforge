import React, { useState } from 'react';
import { Terminal, Download, Share2, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DailyCardPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const [title, setTitle] = useState('Shipped GitForge Full-Stack Engine');
  const [description, setDescription] = useState('Implemented SVG renderers, AI intelligence pipeline, and portfolio ZIP builder.');
  const [project, setProject] = useState('gitforge-core');
  const [category, setCategory] = useState('feature');
  const [copied, setCopied] = useState(false);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const cardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="220" viewBox="0 0 480 220" fill="none">
    <rect width="477" height="217" x="1.5" y="1.5" rx="14" fill="${activeTheme.surface}" stroke="${activeTheme.border}" stroke-width="1.5"/>
    <rect x="25" y="25" width="80" height="22" rx="6" fill="${activeTheme.surfaceSecondary}"/>
    <text x="65" y="40" font-family="${activeTheme.font}" font-size="10" font-weight="700" fill="${activeTheme.accent}" text-anchor="middle">${category.toUpperCase()}</text>
    <text x="455" y="40" font-family="${activeTheme.font}" font-size="11" font-weight="600" fill="${activeTheme.textMuted}" text-anchor="end">${dateStr}</text>

    <text x="25" y="80" font-family="${activeTheme.font}" font-size="18" font-weight="800" fill="${activeTheme.text}">${title}</text>
    <text x="25" y="110" font-family="${activeTheme.font}" font-size="12" fill="${activeTheme.textMuted}">${description.slice(0, 70)}...</text>

    <line x1="25" y1="150" x2="455" y2="150" stroke="${activeTheme.border}" stroke-width="1"/>
    <text x="25" y="180" font-family="${activeTheme.font}" font-size="12" font-weight="700" fill="${activeTheme.primary}">📦 ${project}</text>
    <text x="455" y="180" font-family="${activeTheme.font}" font-size="11" font-weight="700" fill="${activeTheme.accent}" text-anchor="end">⚡ GitForge Log</text>
  </svg>`;

  const downloadSvg = () => {
    const blob = new Blob([cardSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-card-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Terminal className="w-6 h-6 text-emerald-400" />
          Daily Developer Achievement Card
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Generate shareable daily achievement cards for Twitter/X, LinkedIn, or GitHub.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
        <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div>
            <label className="text-xs font-bold mb-1 block">Achievement Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none resize-none"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold mb-1 block">Project / Repo</label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
              />
            </div>

            <div>
              <label className="text-xs font-bold mb-1 block">Category Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
              >
                <option value="feature">Feature</option>
                <option value="bugfix">Bugfix</option>
                <option value="refactor">Refactor</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Card Render */}
        <div className="p-6 rounded-2xl border space-y-4 flex flex-col items-center" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="text-xs font-mono font-bold" style={{ color: activeTheme.textMuted }}>Live Card Preview</div>
          <div dangerouslySetInnerHTML={{ __html: cardSvg }} className="max-w-full overflow-x-auto" />

          <button
            onClick={downloadSvg}
            className="w-full py-2.5 rounded-lg text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            <Download className="w-3.5 h-3.5" /> Download SVG Card
          </button>
        </div>
      </div>
    </div>
  );
};
