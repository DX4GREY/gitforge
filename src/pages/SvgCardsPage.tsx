import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, ExternalLink, Palette, RefreshCw, Download, Info, Server, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SvgCardsPage: React.FC = () => {
  const { activeTheme, themes } = useTheme();
  const { authState } = useAuth();
  const [username, setUsername] = useState(authState.user?.login || 'octocat');

  useEffect(() => {
    if (authState.user?.login) {
      setUsername(authState.user.login);
    }
  }, [authState.user?.login]);
  const [cardType, setCardType] = useState<'profile' | 'stats' | 'languages' | 'streak' | 'contributions' | 'repository'>('profile');
  const [cardTheme, setCardTheme] = useState('midnight');
  const [cardAnimate, setCardAnimate] = useState('none');
  const [cardLayout, setCardLayout] = useState('classic');
  const [showGithubLogo, setShowGithubLogo] = useState(true);
  const [copiedType, setCopiedType] = useState<'md' | 'html' | 'url' | 'raw' | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardTypes = [
    { id: 'profile', label: 'Profile Card' },
    { id: 'stats', label: 'Stats Card' },
    { id: 'languages', label: 'Top Languages' },
    { id: 'streak', label: 'Commit Streak' },
    { id: 'contributions', label: 'Contribution Matrix' },
    { id: 'repository', label: 'Repo Highlight' },
  ];

  const appUrl = window.location.origin;
  const cardApiUrl = `${appUrl}/api/card/${cardType}?username=${encodeURIComponent(username)}&theme=${cardTheme}&animate=${cardAnimate}&layout=${cardLayout}&github_logo=${showGithubLogo}`;

  const markdownEmbed = `![GitForge ${cardType}](${cardApiUrl})`;
  const htmlEmbed = `<img src="${cardApiUrl}" alt="GitForge ${cardType}" />`;
  const relativeRepoPath = `![GitForge ${cardType}](./assets/${cardType}-${username}.svg)`;

  const copyToClipboard = (text: string, type: 'md' | 'html' | 'url' | 'raw') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadSvgFile = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(cardApiUrl);
      const svgText = await res.text();
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gitforge-${cardType}-${username}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download SVG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyRawSvgCode = async () => {
    try {
      const res = await fetch(cardApiUrl);
      const svgText = await res.text();
      copyToClipboard(svgText, 'raw');
    } catch (err) {
      console.error('Failed to fetch raw SVG:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Code className="w-6 h-6 text-cyan-400" />
          Server-Rendered SVG Cards Hub
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Embeddable, responsive SVG widgets with theme support for your GitHub profile README.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="space-y-4 p-5 rounded-2xl border" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold mb-1.5 block">GitHub Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="octocat"
              className="w-full px-3 py-2.5 rounded-lg text-xs font-mono border outline-none transition focus:ring-1 focus:ring-cyan-500"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            />
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block">Card Widget Type</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            >
              {cardTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block">Theme Palette</label>
            <select
              value={cardTheme}
              onChange={(e) => setCardTheme(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  🎨 {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: activeTheme.border }}>
          <div>
            <label className="text-xs font-bold mb-1.5 block">Animation Style</label>
            <select
              value={cardAnimate}
              onChange={(e) => setCardAnimate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            >
              <option value="none">📴 Static (No Animation)</option>
              <option value="fade">✨ Smooth Fade-In</option>
              <option value="slide">🚀 Slide & Rise Cascade</option>
              <option value="float">🎈 Gentle Drift Levitation</option>
              <option value="pulse">💓 Pulse & Breathe Glow</option>
              <option value="rainbow">🌈 Rainbow Border Loop</option>
              <option value="glitch">⚡ Cybernetic Hacker Glitch</option>
              <option value="wave">🔍 High-Tech Scanner Wave</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold mb-1.5 block">Card Layout Style</label>
            <select
              value={cardLayout}
              onChange={(e) => setCardLayout(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            >
              <option value="classic">🏛️ Classic Boxed</option>
              <option value="modern">🚀 Modern Sleek Gradient</option>
              <option value="cyber">👽 Cyber Monospace Grid</option>
              <option value="gitskins">💎 GitSkins Dual Rounded</option>
            </select>
          </div>

          <div className="flex flex-col justify-end pb-1">
            <label className="text-xs font-bold mb-2 block">GitHub Brand Logo</label>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-semibold py-1">
              <input
                type="checkbox"
                checked={showGithubLogo}
                onChange={(e) => setShowGithubLogo(e.target.checked)}
                className="rounded border bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
              />
              Show GitHub Icon on Cards
            </label>
          </div>
        </div>
      </div>

      {/* Card Preview Frame */}
      <div className="p-8 rounded-2xl border flex flex-col items-center justify-center space-y-6 shadow-xl" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="w-full flex items-center justify-between">
          <div className="text-xs font-mono font-semibold" style={{ color: activeTheme.textMuted }}>
            Live SVG Render
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadSvgFile}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition hover:opacity-90 shadow-sm text-white"
              style={{ backgroundColor: activeTheme.primary }}
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloading ? 'Downloading...' : 'Download SVG File'}
            </button>
            <button
              onClick={copyRawSvgCode}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition hover:opacity-85 shadow-sm"
              style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
            >
              {copiedType === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5 text-cyan-400" />}
              {copiedType === 'raw' ? 'SVG Code Copied!' : 'Copy Raw SVG Code'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full p-4 rounded-xl bg-black/30 border border-gray-800">
          <img src={cardApiUrl} alt="SVG Card Preview" className="max-w-full h-auto" />
        </div>

        {/* Info Box about GitHub README Uptime & Dev Server Auto-Sleep */}
        <div className="w-full p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'rgba(34, 211, 238, 0.05)', borderColor: 'rgba(34, 211, 238, 0.2)' }}>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Info className="w-4 h-4" />
            <span>How to keep your SVG active 24/7 on GitHub README</span>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: activeTheme.textMuted }}>
            Preview environments automatically enter sleep mode when no active visitors are present. To ensure your GitHub README always displays your card without interruption:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
            <div className="p-2.5 rounded-lg bg-black/30 border border-gray-800 space-y-1">
              <span className="font-bold text-white block">Method 1: Static SVG Asset (100% Guaranteed Uptime)</span>
              <p style={{ color: activeTheme.textMuted }}>
                Download the <code className="text-cyan-300">.svg</code> file using the button above and commit it to your repository (e.g. <code className="text-cyan-300">assets/stats.svg</code>). Embed it with:
              </p>
              <code className="block p-1.5 rounded bg-black/50 font-mono text-[10px] text-cyan-400 select-all mt-1">
                {relativeRepoPath}
              </code>
            </div>
            <div className="p-2.5 rounded-lg bg-black/30 border border-gray-800 space-y-1">
              <span className="font-bold text-white block">Method 2: Live Production Deployment</span>
              <p style={{ color: activeTheme.textMuted }}>
                Deploy this applet to production (Cloud Run / Vercel) via the <strong>Settings &gt; Deploy</strong> menu. Use your custom production domain for real-time dynamic updates.
              </p>
            </div>
          </div>
        </div>

        {/* Embed Codes */}
        <div className="w-full space-y-4 pt-4 border-t" style={{ borderColor: activeTheme.border }}>
          <h3 className="font-bold text-sm">Embed Code Snippets</h3>

          <div className="space-y-3">
            {/* Markdown */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono" style={{ color: activeTheme.textMuted }}>
                <span>Dynamic Live URL (Markdown Embed)</span>
                <button
                  onClick={() => copyToClipboard(markdownEmbed, 'md')}
                  className="flex items-center gap-1 font-sans text-xs font-bold"
                  style={{ color: activeTheme.primary }}
                >
                  {copiedType === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'md' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <input
                readOnly
                value={markdownEmbed}
                className="w-full p-2.5 rounded-lg text-xs font-mono border bg-black/40 outline-none"
                style={{ borderColor: activeTheme.border, color: activeTheme.text }}
              />
            </div>

            {/* Direct URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono" style={{ color: activeTheme.textMuted }}>
                <span>Direct Image API Endpoint</span>
                <button
                  onClick={() => copyToClipboard(cardApiUrl, 'url')}
                  className="flex items-center gap-1 font-sans text-xs font-bold"
                  style={{ color: activeTheme.primary }}
                >
                  {copiedType === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'url' ? 'Copied' : 'Copy URL'}
                </button>
              </div>
              <input
                readOnly
                value={cardApiUrl}
                className="w-full p-2.5 rounded-lg text-xs font-mono border bg-black/40 outline-none"
                style={{ borderColor: activeTheme.border, color: activeTheme.text }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
