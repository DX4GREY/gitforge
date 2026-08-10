import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, RefreshCw, ArrowRight, Bot, Copy, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { generateAIReadmeApi } from '../lib/github';
import { useAuth } from '../context/AuthContext';

export const ReadmeAgentPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const { authState } = useAuth();
  const [username, setUsername] = useState(authState.user?.login || 'octocat');

  useEffect(() => {
    if (authState.user?.login) {
      setUsername(authState.user.login);
    }
  }, [authState.user?.login]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalOutput, setFinalOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const steps = [
    { title: 'Analyze GitHub Profile', desc: 'Parsing repositories, language weight, stars & activity' },
    { title: 'Build Developer Identity', desc: 'Extracting primary archetypes and tech stack focus' },
    { title: 'Draft README Structure', desc: 'Generating initial layout and badge matrices' },
    { title: 'AI Critique & Quality Audit', desc: 'Auditing clarity, formatting, and markdown links' },
    { title: 'Apply Optimizations', desc: 'Refining design, SVG widgets, and final markdown' },
  ];

  const startPipeline = async () => {
    if (!username.trim() || isProcessing) return;
    setIsProcessing(true);
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((res) => setTimeout(res, 800));
    }

    try {
      const res = await generateAIReadmeApi(username, 'Technical', [
        'Header',
        'About',
        'Tech Stack',
        'Featured Projects',
        'GitHub Stats',
        'Contribution graph',
        'Contact',
      ]);
      setFinalOutput(res);
    } catch {
      // Fallback
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border, color: activeTheme.accent }}>
          <Bot className="w-3.5 h-3.5" /> Autonomous AI Pipeline
        </div>
        <h1 className="text-3xl font-black">AI README Agent</h1>
        <p className="text-xs max-w-lg mx-auto" style={{ color: activeTheme.textMuted }}>
          Watch Gemini AI analyze your GitHub, draft, critique, and optimize your profile README in real-time.
        </p>
      </div>

      {/* Username Bar */}
      <div className="max-w-md mx-auto p-4 rounded-xl border space-y-3" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <label className="text-xs font-bold">GitHub Username</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="octocat"
            className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
          />
          <button
            onClick={startPipeline}
            disabled={isProcessing}
            className="px-5 py-2 rounded-lg text-xs font-bold transition shadow-md flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Run AI Agent
          </button>
        </div>
      </div>

      {/* Pipeline Steps Tracker */}
      <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <h3 className="font-bold text-sm">Execution Pipeline</h3>
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep || (currentStep === steps.length - 1 && !isProcessing && finalOutput);
            const isCurrent = idx === currentStep && isProcessing;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-lg border transition"
                style={{
                  backgroundColor: isCurrent ? activeTheme.surfaceSecondary : 'transparent',
                  borderColor: isCurrent ? activeTheme.primary : activeTheme.border,
                }}
              >
                <div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold" style={{ borderColor: activeTheme.border, color: activeTheme.textMuted }}>
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold">{step.title}</div>
                  <div className="text-[11px]" style={{ color: activeTheme.textMuted }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final AI Output */}
      {finalOutput && (
        <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Agent Final README Output</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(finalOutput);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5"
                style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
          <pre className="p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-black/40 border border-gray-800" style={{ color: activeTheme.text }}>
            {finalOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
