import React, { useState } from 'react';
import { UserCheck, RefreshCw, Download, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const AvatarGeneratorPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const [style, setStyle] = useState<'cyber' | 'minimal' | 'pixel' | 'wizard'>('cyber');
  const [bgColor, setBgColor] = useState('#1e293b');
  const [skinColor, setSkinColor] = useState('#f87171');
  const [hairColor, setHairColor] = useState('#38bdf8');
  const [hasGlasses, setHasGlasses] = useState(true);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000));
  const [copied, setCopied] = useState(false);

  const randomize = () => {
    setSeed(Math.floor(Math.random() * 10000));
    setHasGlasses(Math.random() > 0.5);
    const colors = ['#38bdf8', '#a855f7', '#f43f5e', '#10b981', '#f59e0b'];
    setHairColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
    <rect width="200" height="200" rx="30" fill="${bgColor}"/>
    <circle cx="100" cy="100" r="75" fill="${hairColor}" fill-opacity="0.2"/>
    <!-- Head -->
    <circle cx="100" cy="95" r="45" fill="${skinColor}"/>
    <!-- Eyes -->
    <circle cx="85" cy="90" r="6" fill="#0f172a"/>
    <circle cx="115" cy="90" r="6" fill="#0f172a"/>
    <!-- Glasses -->
    ${hasGlasses ? `<rect x="72" y="82" width="26" height="16" rx="4" fill="none" stroke="#38bdf8" stroke-width="3"/>
    <rect x="102" y="82" width="26" height="16" rx="4" fill="none" stroke="#38bdf8" stroke-width="3"/>
    <line x1="98" y1="90" x2="102" y2="90" stroke="#38bdf8" stroke-width="3"/>` : ''}
    <!-- Mouth -->
    <path d="M 88 112 Q 100 122 112 112" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    <!-- Hair -->
    <path d="M 55 90 C 55 50, 145 50, 145 90 C 130 65, 70 65, 55 90 Z" fill="${hairColor}"/>
  </svg>`;

  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gitforge-avatar-${seed}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-purple-400" />
          Developer Avatar Persona Generator
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Design deterministic vector developer personas for your GitHub profile and assets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        {/* Preview Frame */}
        <div className="p-8 rounded-2xl border flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div
            className="p-4 rounded-3xl border shadow-2xl"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          <div className="flex gap-2 w-full max-w-xs">
            <button
              onClick={randomize}
              className="flex-1 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition hover:opacity-80"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Randomize
            </button>
            <button
              onClick={downloadSvg}
              className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md hover:opacity-90"
              style={{ background: activeTheme.gradient, color: '#ffffff' }}
            >
              <Download className="w-3.5 h-3.5" /> Export SVG
            </button>
          </div>
        </div>

        {/* Customization Options */}
        <div className="p-6 rounded-2xl border space-y-5" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <h3 className="font-bold text-sm">Avatar Styling Controls</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Hair / Highlight Color</label>
              <div className="flex gap-2">
                {['#38bdf8', '#a855f7', '#f43f5e', '#10b981', '#f59e0b', '#f87171'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setHairColor(c)}
                    className={`w-7 h-7 rounded-full border transition ${hairColor === c ? 'scale-110 ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: c, borderColor: activeTheme.border }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Background Backdrop</label>
              <div className="flex gap-2">
                {['#0f172a', '#1e1b4b', '#022c22', '#311021', '#111827'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setBgColor(c)}
                    className={`w-7 h-7 rounded-full border transition ${bgColor === c ? 'scale-110 ring-2 ring-white' : ''}`}
                    style={{ backgroundColor: c, borderColor: activeTheme.border }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGlasses}
                  onChange={(e) => setHasGlasses(e.target.checked)}
                  className="rounded"
                />
                <span>Developer Tech Glasses</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
