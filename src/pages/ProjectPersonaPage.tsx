import React, { useState } from 'react';
import { Layers, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchProjectPersonaApi } from '../lib/github';
import { ProjectPersonaResult } from '../types';

export const ProjectPersonaPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const [repoName, setRepoName] = useState('gitforge-core');
  const [description, setDescription] = useState('Developer Identity Platform & Profile Customization Engine.');
  const [language, setLanguage] = useState('TypeScript');
  const [stars, setStars] = useState(240);
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<ProjectPersonaResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetchProjectPersonaApi(repoName, description, language, stars);
      setPersona(res);
    } catch {
      // Fallback handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-400" />
          Repository Persona Engine
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Extract a character archetype, mascot identity, and badge layout for any repository.
        </p>
      </div>

      <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold mb-1 block">Repository Name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            />
          </div>
          <div>
            <label className="text-xs font-bold mb-1 block">Primary Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold mb-1 block">Repository Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: activeTheme.gradient, color: '#ffffff' }}
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Project Persona
        </button>
      </div>

      {persona && (
        <div className="p-8 rounded-2xl border space-y-6 shadow-2xl" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono px-2.5 py-1 rounded border uppercase font-bold" style={{ borderColor: activeTheme.border, color: activeTheme.accent, backgroundColor: activeTheme.surfaceSecondary }}>
                {persona.archetype}
              </span>
              <h2 className="text-2xl font-black mt-2">{persona.mascotName}</h2>
              <p className="text-xs" style={{ color: activeTheme.textMuted }}>{persona.tagline}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-black/30 space-y-2" style={{ borderColor: activeTheme.border }}>
            <div className="text-xs font-bold">Personality Analysis</div>
            <p className="text-xs leading-relaxed" style={{ color: activeTheme.textMuted }}>{persona.personalityDescription}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold">README Badge Markdown</div>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={persona.readmeBadgeMarkdown}
                className="w-full p-2.5 rounded-lg text-xs font-mono border bg-black/40 outline-none"
                style={{ borderColor: activeTheme.border, color: activeTheme.text }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(persona.readmeBadgeMarkdown);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Badge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
