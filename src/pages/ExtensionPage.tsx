import React from 'react';
import { Terminal, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ExtensionPage: React.FC = () => {
  const { activeTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Terminal className="w-6 h-6 text-cyan-400" />
          GitForge Manifest V3 Chrome Extension
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          1-Click GitForge profile badge injector and quick launcher directly on github.com.
        </p>
      </div>

      <div className="p-8 rounded-2xl border space-y-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <h2 className="text-lg font-extrabold">Extension Installation Instructions</h2>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <strong>Step 1:</strong> Locate the <code>/extension</code> folder in the source codebase.
          </div>
          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <strong>Step 2:</strong> Open Chrome and navigate to <code>chrome://extensions/</code>.
          </div>
          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <strong>Step 3:</strong> Enable <strong>Developer Mode</strong> in the top-right toggle.
          </div>
          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <strong>Step 4:</strong> Click <strong>Load Unpacked</strong> and select the <code>extension</code> directory.
          </div>
        </div>

        <div className="pt-4 border-t space-y-3" style={{ borderColor: activeTheme.border }}>
          <h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: activeTheme.textMuted }}>Features Included</h3>
          <ul className="space-y-2 text-xs font-semibold">
            <li className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Inject "View on GitForge" badge on GitHub profile pages
            </li>
            <li className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Quick launcher popup to jump directly to README &amp; SVG card builders
            </li>
            <li className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Zero invasive permissions (only activeTab and storage)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
