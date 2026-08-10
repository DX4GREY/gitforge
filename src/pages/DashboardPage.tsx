import React, { useState, useEffect } from 'react';
import { Layout, FileText, Code, UserCheck, ShieldAlert, Cpu, Palette, ArrowRight, Star, GitFork, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getGitHubProfile } from '../lib/github';
import { GitHubProfile } from '../types';
import { DeepAccountAnalytics } from '../components/DeepAccountAnalytics';

interface DashboardPageProps {
  onNavigate: (path: string, params?: { username?: string }) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { activeTheme } = useTheme();
  const [username, setUsername] = useState('octocat');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);

  const fetchUser = async (userToFetch: string) => {
    setLoading(true);
    try {
      const data = await getGitHubProfile(userToFetch);
      setProfile(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(username);
  }, []);

  const quickTools = [
    { label: 'README Builder', path: '/readme', icon: FileText, desc: 'Visual markdown profile generator' },
    { label: 'SVG Cards', path: '/cards', icon: Code, desc: 'Stats, languages, streak & repos' },
    { label: 'Developer Avatar', path: '/avatar', icon: UserCheck, desc: 'Custom vector persona' },
    { label: 'Profile Intelligence', path: '/intelligence', icon: ShieldAlert, desc: 'AI developer score & report' },
    { label: 'GitHub Wrapped', path: '/wrapped', icon: Cpu, desc: 'Yearly developer recap story' },
    { label: 'Portfolio Builder', path: '/portfolio', icon: Layout, desc: 'Web portfolio & ZIP download' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Username selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="space-y-1">
          <h1 className="text-2xl font-black">Developer Command Center</h1>
          <p className="text-xs" style={{ color: activeTheme.textMuted }}>
            Manage identity assets, analyze GitHub stats, and export profiles.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (username.trim()) fetchUser(username.trim());
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="GitHub username"
            className="px-3 py-2 rounded-lg text-xs font-mono border outline-none"
            style={{
              backgroundColor: activeTheme.surfaceSecondary,
              borderColor: activeTheme.border,
              color: activeTheme.text,
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-md hover:opacity-90 disabled:opacity-50"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Load Profile
          </button>
        </form>
      </div>

      {/* Deep Account Analytics Section */}
      <DeepAccountAnalytics
        onLoadAuthenticatedUserIntoCards={(user) => {
          setUsername(user);
          fetchUser(user);
        }}
      />

      {/* GitHub Profile Overview Card */}
      {profile && (
        <div className="p-6 rounded-2xl border space-y-6" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-16 h-16 rounded-xl border object-cover"
                style={{ borderColor: activeTheme.primary }}
              />
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {profile.name || profile.username}
                  <span className="text-xs font-mono font-normal" style={{ color: activeTheme.primary }}>
                    @{profile.username}
                  </span>
                </h2>
                <p className="text-xs max-w-xl" style={{ color: activeTheme.textMuted }}>
                  {profile.bio}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate(`/profile/${profile.username}`)}
              className="px-4 py-2 rounded-lg text-xs font-bold border transition hover:opacity-90 flex items-center gap-1.5 self-start sm:self-center"
              style={{
                backgroundColor: activeTheme.surfaceSecondary,
                borderColor: activeTheme.border,
                color: activeTheme.accent,
              }}
            >
              View Hosted Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t" style={{ borderColor: activeTheme.border }}>
            <div className="p-3 rounded-lg" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
              <div className="text-xs font-semibold" style={{ color: activeTheme.textMuted }}>Repositories</div>
              <div className="text-lg font-bold">{profile.publicRepos}</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
              <div className="text-xs font-semibold" style={{ color: activeTheme.textMuted }}>Total Stars</div>
              <div className="text-lg font-bold flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {profile.starsCount}
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
              <div className="text-xs font-semibold" style={{ color: activeTheme.textMuted }}>Fork Count</div>
              <div className="text-lg font-bold flex items-center gap-1">
                <GitFork className="w-4 h-4 text-cyan-400" />
                {profile.forksCount}
              </div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: activeTheme.surfaceSecondary }}>
              <div className="text-xs font-semibold" style={{ color: activeTheme.textMuted }}>Active Streak</div>
              <div className="text-lg font-bold" style={{ color: activeTheme.accent }}>
                {profile.currentStreak} Days
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold">Quick Actions &amp; Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigate(tool.path)}
                className="p-5 rounded-xl border text-left flex items-start gap-4 transition hover:-translate-y-0.5 hover:shadow-lg group"
                style={{
                  backgroundColor: activeTheme.surface,
                  borderColor: activeTheme.border,
                }}
              >
                <div
                  className="p-3 rounded-lg transition group-hover:scale-105"
                  style={{
                    backgroundColor: activeTheme.surfaceSecondary,
                    color: activeTheme.primary,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5">{tool.label}</h3>
                  <p className="text-xs" style={{ color: activeTheme.textMuted }}>
                    {tool.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
