import React, { useState, useEffect } from 'react';
import { Share2, Star, GitFork, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getGitHubProfile } from '../lib/github';
import { GitHubProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface HostedProfilePageProps {
  usernameParam?: string;
}

export const HostedProfilePage: React.FC<HostedProfilePageProps> = ({ usernameParam = 'octocat' }) => {
  const { activeTheme } = useTheme();
  const { authState } = useAuth();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    let targetUser = usernameParam;
    if ((targetUser === 'octocat' || targetUser === 'demo') && authState.user?.login) {
      targetUser = authState.user.login;
    }
    getGitHubProfile(targetUser)
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [usernameParam, authState.user?.login]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs font-mono" style={{ color: activeTheme.textMuted }}>
        Loading GitForge Hosted Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs font-mono" style={{ color: activeTheme.textMuted }}>
        GitHub Profile @{usernameParam} not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Top Banner Header */}
      <div className="p-8 rounded-3xl border shadow-2xl space-y-6 relative overflow-hidden" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img src={profile.avatarUrl} alt={profile.username} className="w-24 h-24 rounded-2xl border-2 object-cover" style={{ borderColor: activeTheme.primary }} />
          <div className="space-y-1.5 flex-1">
            <h1 className="text-3xl font-black flex items-center justify-center sm:justify-start gap-2">
              {profile.name || profile.username}
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </h1>
            <p className="text-xs font-mono font-semibold" style={{ color: activeTheme.primary }}>@{profile.username}</p>
            <p className="text-xs max-w-lg" style={{ color: activeTheme.textMuted }}>{profile.bio}</p>
          </div>

          <button
            onClick={copyProfileLink}
            className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition hover:opacity-80"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Link Copied' : 'Share Profile'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t" style={{ borderColor: activeTheme.border }}>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
            <div className="text-lg font-extrabold">{profile.publicRepos}</div>
            <div className="text-[10px] font-bold uppercase" style={{ color: activeTheme.textMuted }}>Repositories</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
            <div className="text-lg font-extrabold">{profile.starsCount}</div>
            <div className="text-[10px] font-bold uppercase" style={{ color: activeTheme.textMuted }}>Stars</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
            <div className="text-lg font-extrabold">{profile.followers}</div>
            <div className="text-[10px] font-bold uppercase" style={{ color: activeTheme.textMuted }}>Followers</div>
          </div>
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
            <div className="text-lg font-extrabold" style={{ color: activeTheme.accent }}>{profile.currentStreak} Days</div>
            <div className="text-[10px] font-bold uppercase" style={{ color: activeTheme.textMuted }}>Streak</div>
          </div>
        </div>
      </div>

      {/* SVG Cards Showcase */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold">GitHub Activity Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border bg-black/30 flex justify-center" style={{ borderColor: activeTheme.border }}>
            <img src={`/api/card/stats?username=${profile.username}&theme=${activeTheme.id}`} alt="Stats" className="max-w-full h-auto" />
          </div>
          <div className="p-4 rounded-xl border bg-black/30 flex justify-center" style={{ borderColor: activeTheme.border }}>
            <img src={`/api/card/languages?username=${profile.username}&theme=${activeTheme.id}`} alt="Languages" className="max-w-full h-auto" />
          </div>
        </div>
      </div>

      {/* Pinned Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold">Pinned Repositories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.pinnedRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-xl border space-y-2 block transition hover:-translate-y-0.5"
              style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}
            >
              <div className="font-bold text-sm flex items-center justify-between" style={{ color: activeTheme.primary }}>
                <span>{repo.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <p className="text-xs" style={{ color: activeTheme.textMuted }}>{repo.description}</p>
              <div className="flex items-center gap-3 text-xs font-mono pt-2">
                <span>⭐ {repo.stars}</span>
                <span>🍴 {repo.forks}</span>
                <span className="text-amber-400">{repo.language}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
