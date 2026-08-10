import React, { useState } from 'react';
import { Sparkles, ArrowRight, Code, ShieldCheck, Cpu, Terminal, Palette, FileText, CheckCircle2, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onNavigate: (path: string, params?: { username?: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { activeTheme } = useTheme();
  const [usernameInput, setUsernameInput] = useState('octocat');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      onNavigate('/profile/' + encodeURIComponent(usernameInput.trim()));
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 text-center px-4 max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Your GitHub. <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: activeTheme.gradient }}
          >
            Your Identity.
          </span>
        </h1>

        <p
          className="text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed"
          style={{ color: activeTheme.textMuted }}
        >
          Turn your raw GitHub activity into a complete developer persona — README, SVG cards, portfolio, analytics, wrapped recap, and visual assets.
        </p>

        {/* Instant GitHub Username Bar */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex items-center gap-2 p-1.5 rounded-xl border shadow-xl" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="pl-3 text-sm font-mono font-semibold" style={{ color: activeTheme.textMuted }}>github.com/</div>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="octocat"
            className="w-full bg-transparent outline-none text-sm font-semibold font-mono"
            style={{ color: activeTheme.text }}
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold transition shadow-md hover:opacity-90 whitespace-nowrap"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            Build Identity
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="flex items-center justify-center gap-3 text-xs font-mono" style={{ color: activeTheme.textMuted }}>
          <span>Try demo accounts:</span>
          {['octocat', 'torvalds', 'gaearon'].map((demo) => (
            <button
              key={demo}
              onClick={() => onNavigate('/profile/' + demo)}
              className="underline hover:text-white transition"
            >
              @{demo}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold">All-In-One Customization Suite</h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: activeTheme.textMuted }}>
            Everything you need to craft an outstanding GitHub profile and portfolio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'GitHub Profile README Builder',
              desc: 'Multi-step visual builder with live Markdown preview, badge stack, and stats cards.',
              icon: FileText,
              path: '/readme',
            },
            {
              title: 'Server-Rendered SVG Cards',
              desc: 'Embeddable SVG cards for stats, top languages, commit streak, and repo highlights.',
              icon: Code,
              path: '/cards',
            },
            {
              title: 'AI Profile Intelligence',
              desc: 'Deep analytical report with developer archetype, score 0-100, strengths, and recommendations.',
              icon: ShieldCheck,
              path: '/intelligence',
            },
            {
              title: 'Developer Portfolio Builder',
              desc: 'Generate interactive web portfolio and download full self-contained ZIP bundle.',
              icon: Layers,
              path: '/portfolio',
            },
            {
              title: 'GitHub Wrapped Story',
              desc: 'Yearly developer recap story with slide transitions and shareable archetype cards.',
              icon: Cpu,
              path: '/wrapped',
            },
            {
              title: '20+ Original Themes',
              desc: 'Centralized theme engine with real-time customizer, JSON import/export, and glow effects.',
              icon: Palette,
              path: '/themes',
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate(feature.path)}
                className="group p-6 rounded-xl border transition cursor-pointer hover:-translate-y-1 hover:shadow-xl space-y-4"
                style={{
                  backgroundColor: activeTheme.surface,
                  borderColor: activeTheme.border,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition group-hover:scale-110"
                  style={{
                    backgroundColor: activeTheme.surfaceSecondary,
                    color: activeTheme.primary,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">{feature.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: activeTheme.textMuted }}>
                    {feature.desc}
                  </p>
                </div>
                <div className="flex items-center text-xs font-semibold gap-1" style={{ color: activeTheme.primary }}>
                  Explore feature <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Free SaaS Promise Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div
          className="p-8 sm:p-12 rounded-2xl border text-center space-y-6 relative overflow-hidden"
          style={{
            backgroundColor: activeTheme.surface,
            borderColor: activeTheme.border,
          }}
        >
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold">100% Free &amp; Open Minded</h3>
            <p className="text-sm max-w-xl mx-auto" style={{ color: activeTheme.textMuted }}>
              No pro plan, no credit system, no locked features. Built for developers by developers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-4">
            {[
              'Unlimited README Exports',
              'SVG Card Embeds',
              'AI Profile Analysis',
              'Portfolio ZIP Downloads',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition hover:opacity-90 shadow-lg"
              style={{ background: activeTheme.gradient, color: '#ffffff' }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
