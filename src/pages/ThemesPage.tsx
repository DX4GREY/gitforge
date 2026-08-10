import React, { useState } from 'react';
import { Palette, Download, Upload, RotateCcw, Check, Copy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../types';

export const ThemesPage: React.FC = () => {
  const { activeTheme, setThemeById, updateCustomTheme, themes } = useTheme();
  const [customTheme, setCustomTheme] = useState<Theme>(activeTheme);
  const [copied, setCopied] = useState(false);

  const handleColorChange = (key: keyof Theme, val: string) => {
    const next = { ...customTheme, [key]: val };
    setCustomTheme(next);
    updateCustomTheme(next);
  };

  const exportThemeJson = () => {
    const json = JSON.stringify(customTheme, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Palette className="w-6 h-6 text-pink-400" />
          Centralized Theme Engine &amp; Customizer
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Explore 20 original developer themes or design a custom color palette with real-time SVG preview.
        </p>
      </div>

      {/* Preset Theme Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold">20 Original Theme Presets</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {themes.map((t) => {
            const isSelected = activeTheme.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setThemeById(t.id);
                  setCustomTheme(t);
                }}
                className={`p-3 rounded-xl border text-left transition hover:-translate-y-0.5 space-y-2 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: t.surface, borderColor: t.border }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.primary }} />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.accent }} />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.bg }} />
                </div>
                <div className="text-xs font-bold truncate" style={{ color: t.text }}>
                  {t.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t" style={{ borderColor: activeTheme.border }}>
        <div className="lg:col-span-6 p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Theme Color Palette Controls</h3>
            <button
              onClick={exportThemeJson}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON' : 'Export JSON'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Background', key: 'bg' },
              { label: 'Surface', key: 'surface' },
              { label: 'Primary Accent', key: 'primary' },
              { label: 'Secondary Accent', key: 'secondary' },
              { label: 'Accent Highlight', key: 'accent' },
              { label: 'Border Color', key: 'border' },
              { label: 'Text Main', key: 'text' },
              { label: 'Text Muted', key: 'textMuted' },
            ].map((col) => (
              <div key={col.key}>
                <label className="text-xs font-semibold mb-1 block" style={{ color: activeTheme.textMuted }}>
                  {col.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(customTheme as any)[col.key] || '#ffffff'}
                    onChange={(e) => handleColorChange(col.key as any, e.target.value)}
                    className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={(customTheme as any)[col.key] || '#ffffff'}
                    onChange={(e) => handleColorChange(col.key as any, e.target.value)}
                    className="w-full px-2 py-1 rounded text-xs font-mono border outline-none"
                    style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Card Preview Frame */}
        <div className="lg:col-span-6 p-6 rounded-2xl border flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="text-xs font-mono font-bold" style={{ color: activeTheme.textMuted }}>
            Live Theme Preview Card
          </div>
          <div className="p-4 rounded-2xl border bg-black/30">
            <img src={`/api/card/profile?username=octocat&theme=${activeTheme.id}`} alt="Theme Preview" className="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
