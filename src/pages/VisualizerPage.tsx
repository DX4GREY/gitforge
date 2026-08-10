import React, { useState } from 'react';
import { Cpu, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const VisualizerPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const [repoUrl, setRepoUrl] = useState('https://github.com/octocat/gitforge-core');
  const [loading, setLoading] = useState(false);
  const [visualized, setVisualized] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisualized(true);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Cpu className="w-6 h-6 text-amber-400" />
          Repository Architecture Visualizer
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Inspect repository module structure, technology stack mapping, and component dependencies.
        </p>
      </div>

      <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <label className="text-xs font-bold mb-1 block">GitHub Repository URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-2 rounded-lg text-xs font-bold transition shadow-md flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Visualize Repo
          </button>
        </div>
      </div>

      {visualized && (
        <div className="p-8 rounded-2xl border space-y-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <h3 className="font-bold text-sm">Architecture Module Map</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl border space-y-2 bg-black/30" style={{ borderColor: activeTheme.border }}>
              <div className="font-bold text-blue-400">1. Frontend Layer</div>
              <div>• React 19 SPA</div>
              <div>• Tailwind CSS v4</div>
              <div>• Framer Motion</div>
            </div>

            <div className="p-4 rounded-xl border space-y-2 bg-black/30" style={{ borderColor: activeTheme.border }}>
              <div className="font-bold text-emerald-400">2. Server API Layer</div>
              <div>• Express Node.js</div>
              <div>• SVG Card Renderer</div>
              <div>• Gemini AI Client</div>
            </div>

            <div className="p-4 rounded-xl border space-y-2 bg-black/30" style={{ borderColor: activeTheme.border }}>
              <div className="font-bold text-purple-400">3. Data &amp; Export</div>
              <div>• In-Memory Cache</div>
              <div>• JSZip Exporter</div>
              <div>• GitHub REST Integration</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
