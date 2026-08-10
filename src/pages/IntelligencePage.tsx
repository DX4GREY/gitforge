import React, { useState } from 'react';
import { ShieldAlert, Sparkles, RefreshCw, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchProfileIntelligenceApi } from '../lib/github';
import { ProfileIntelligenceResult } from '../types';

export const IntelligencePage: React.FC = () => {
  const { activeTheme } = useTheme();
  const [username, setUsername] = useState('octocat');
  const [loading, setLoading] = useState(false);
  const [intelligence, setIntelligence] = useState<ProfileIntelligenceResult | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetchProfileIntelligenceApi(username.trim());
      setIntelligence(res);
    } catch {
      // Fallback handled inside API
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-400" />
          AI Profile Intelligence &amp; Score
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Deep analytical assessment of code velocity, repository quality, and profile positioning.
        </p>
      </div>

      <div className="p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="flex-1 w-full">
          <label className="text-xs font-bold mb-1 block">GitHub Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="octocat"
            className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 self-end disabled:opacity-50"
          style={{ background: activeTheme.gradient, color: '#ffffff' }}
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Analyze Intelligence
        </button>
      </div>

      {intelligence && (
        <div className="space-y-6">
          {/* Main Score Header */}
          <div className="p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono px-2.5 py-1 rounded border uppercase font-bold" style={{ borderColor: activeTheme.border, color: activeTheme.accent, backgroundColor: activeTheme.surfaceSecondary }}>
                {intelligence.archetype}
              </span>
              <h2 className="text-2xl font-black">Developer Score Analysis</h2>
              <p className="text-xs max-w-xl" style={{ color: activeTheme.textMuted }}>
                {intelligence.summary}
              </p>
            </div>

            <div className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl shrink-0" style={{ borderColor: activeTheme.primary, backgroundColor: activeTheme.surfaceSecondary }}>
              <div className="text-3xl font-black" style={{ color: activeTheme.primary }}>{intelligence.score}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: activeTheme.textMuted }}>SCORE</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
              <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Core Technical Strengths
              </h3>
              <ul className="space-y-2">
                {intelligence.strengths.map((item, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: activeTheme.text }}>
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
              <h3 className="font-bold text-sm flex items-center gap-2 text-blue-400">
                <TrendingUp className="w-4 h-4" /> Strategic Recommendations
              </h3>
              <ul className="space-y-2">
                {intelligence.recommendations.map((item, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: activeTheme.text }}>
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
