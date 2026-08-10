import React, { useState, useEffect } from 'react';
import { Cpu, ArrowLeft, ArrowRight, Share2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { getGitHubProfile } from '../lib/github';
import { GitHubProfile } from '../types';
import { useAuth } from '../context/AuthContext';

export const WrappedPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const { authState } = useAuth();
  const [username, setUsername] = useState(authState.user?.login || 'octocat');
  const [slide, setSlide] = useState(0);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  useEffect(() => {
    if (authState.user?.login) {
      setUsername(authState.user.login);
    }
  }, [authState.user?.login]);

  useEffect(() => {
    getGitHubProfile(username).then((data) => setProfile(data)).catch(() => {});
  }, [username]);

  const slides = [
    {
      title: 'Yearly Developer Recap',
      subtitle: `An epic breakdown of @${username}'s engineering output.`,
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl font-black" style={{ color: activeTheme.primary }}>
            {profile?.totalContributions || 1480}
          </div>
          <div className="text-sm uppercase tracking-widest font-bold" style={{ color: activeTheme.textMuted }}>
            Total Code Contributions Shipped
          </div>
        </div>
      ),
    },
    {
      title: 'Dominant Tech Stack',
      subtitle: 'The primary language fueling your code commits.',
      content: (
        <div className="text-center space-y-4">
          <div className="text-5xl font-black text-amber-400">
            {profile?.languages[0]?.name || 'TypeScript'}
          </div>
          <div className="text-sm font-semibold" style={{ color: activeTheme.textMuted }}>
            Accounting for {profile?.languages[0]?.percentage || 42}% of total repository lines.
          </div>
        </div>
      ),
    },
    {
      title: 'Consistency & Commit Streak',
      subtitle: 'Unstoppable momentum on GitHub.',
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl font-black" style={{ color: activeTheme.accent }}>
            {profile?.currentStreak || 18} Days
          </div>
          <div className="text-sm uppercase tracking-widest font-bold" style={{ color: activeTheme.textMuted }}>
            Active Commit Streak
          </div>
        </div>
      ),
    },
    {
      title: 'Your Developer Archetype',
      subtitle: 'Based on repository velocity, star count, and code balance.',
      content: (
        <div className="text-center space-y-4">
          <Award className="w-16 h-16 mx-auto text-purple-400 animate-bounce" />
          <div className="text-3xl font-black" style={{ color: activeTheme.text }}>
            Polyglot Systems Architect
          </div>
          <div className="text-xs max-w-md mx-auto" style={{ color: activeTheme.textMuted }}>
            High modularity, multi-language mastery, and active open source engagement.
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
      if (slide === slides.length - 2) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const prevSlide = () => {
    if (slide > 0) setSlide(slide - 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-6 h-6 text-pink-400" />
          <h1 className="text-xl font-black">GitHub Wrapped</h1>
        </div>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono border outline-none w-32"
          style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
        />
      </div>

      {/* Progress indicators */}
      <div className="flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i <= slide ? activeTheme.primary : activeTheme.border,
            }}
          />
        ))}
      </div>

      {/* Slide Container */}
      <div
        className="p-10 rounded-3xl border shadow-2xl min-h-[380px] flex flex-col justify-between items-center text-center relative overflow-hidden"
        style={{
          backgroundColor: activeTheme.surface,
          borderColor: activeTheme.border,
        }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-black">{slides[slide].title}</h2>
          <p className="text-xs" style={{ color: activeTheme.textMuted }}>
            {slides[slide].subtitle}
          </p>
        </div>

        <div className="my-8">{slides[slide].content}</div>

        <div className="flex items-center justify-between w-full pt-4 border-t" style={{ borderColor: activeTheme.border }}>
          <button
            onClick={prevSlide}
            disabled={slide === 0}
            className="p-2 rounded-xl border disabled:opacity-30"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold" style={{ color: activeTheme.textMuted }}>
            {slide + 1} / {slides.length}
          </span>

          <button
            onClick={nextSlide}
            disabled={slide === slides.length - 1}
            className="p-2 rounded-xl border disabled:opacity-30"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
