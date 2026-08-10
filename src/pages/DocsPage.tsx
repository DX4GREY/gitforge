import React from 'react';
import { FileText, Code, Terminal, Server, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DocsPage: React.FC = () => {
  const { activeTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-400" />
          GitForge Platform Documentation &amp; API Specs
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Complete developer reference for SVG card embedding, AI API endpoints, theme specs, and self-hosting.
        </p>
      </div>

      {/* SVG Card API Section */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" /> Server-Rendered SVG Card API
        </h2>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          All card endpoints return valid <code>image/svg+xml</code> vector graphics with HTTP caching headers.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <div className="font-bold text-emerald-400">GET /api/card/profile?username={'{username}'}&amp;theme={'{theme}'}</div>
            <div className="text-[11px] mt-1" style={{ color: activeTheme.textMuted }}>Renders profile avatar, bio, repositories, stars, followers, and active streak.</div>
          </div>

          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <div className="font-bold text-emerald-400">GET /api/card/stats?username={'{username}'}&amp;theme={'{theme}'}</div>
            <div className="text-[11px] mt-1" style={{ color: activeTheme.textMuted }}>Renders total stars, commit volume estimate, total forks, and GitForge rank.</div>
          </div>

          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <div className="font-bold text-emerald-400">GET /api/card/languages?username={'{username}'}&amp;theme={'{theme}'}</div>
            <div className="text-[11px] mt-1" style={{ color: activeTheme.textMuted }}>Renders top used programming languages percentage bar and breakdown.</div>
          </div>

          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <div className="font-bold text-emerald-400">GET /api/card/streak?username={'{username}'}&amp;theme={'{theme}'}</div>
            <div className="text-[11px] mt-1" style={{ color: activeTheme.textMuted }}>Renders current streak, longest streak, and total contribution output.</div>
          </div>
        </div>
      </div>

      {/* AI API Endpoints */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" /> AI Agent &amp; Intelligence API
        </h2>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <div className="font-bold text-purple-400">POST /api/ai/readme</div>
            <div className="text-[11px] mt-1" style={{ color: activeTheme.textMuted }}>Generates a complete Markdown profile README. Body: <code>{`{ username, style, sections }`}</code></div>
          </div>

          <div className="p-3 rounded-lg border bg-black/30" style={{ borderColor: activeTheme.border }}>
            <div className="font-bold text-purple-400">POST /api/ai/intelligence</div>
            <div className="text-[11px] mt-1" style={{ color: activeTheme.textMuted }}>Calculates developer archetype and score 0-100. Body: <code>{`{ username }`}</code></div>
          </div>
        </div>
      </div>

      {/* Self Hosting Guide */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <h2 className="text-lg font-extrabold flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" /> Self-Hosting &amp; Environment Setup
        </h2>
        <pre className="p-4 rounded-xl font-mono text-xs bg-black/40 border border-gray-800 leading-relaxed">
{`# 1. Clone repository & install dependencies
npm install

# 2. Configure environment variables (.env)
GEMINI_API_KEY="YOUR_API_KEY"

# 3. Launch local dev server
npm run dev

# 4. Build for production deployment
npm run build
npm start`}
        </pre>
      </div>
    </div>
  );
};
