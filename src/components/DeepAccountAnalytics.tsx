import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Lock, Mail, HardDrive, Key, Users, Star, GitFork, RefreshCw, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface DeepAccountAnalyticsProps {
  onLoadAuthenticatedUserIntoCards?: (username: string) => void;
}

export const DeepAccountAnalytics: React.FC<DeepAccountAnalyticsProps> = ({ onLoadAuthenticatedUserIntoCards }) => {
  const { authState, refreshDeepProfile, setIsModalOpen } = useAuth();
  const { activeTheme } = useTheme();

  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div
        className="p-8 border text-center font-mono my-8 transition-colors"
        style={{
          backgroundColor: activeTheme.id === 'high-density' ? '#D9D8D5' : activeTheme.surface,
          borderColor: activeTheme.border,
          color: activeTheme.text,
        }}
      >
        <Lock className="w-12 h-12 mx-auto mb-4 text-amber-500 opacity-90" />
        <h3 className="text-lg font-bold uppercase tracking-wider mb-2">[ GITHUB_AUTH_REQUIRED ]</h3>
        <p className="text-xs opacity-80 max-w-md mx-auto mb-6 leading-relaxed">
          Log in with your GitHub account to unlock Deep Account Analytics (Private Repos, Email Status, 5,000 req/hr API Rate Limit, Disk Usage, &amp; 2FA Status).
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#141414] text-[#E4E3E0] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Login via GitHub OAuth
        </button>
      </div>
    );
  }

  const user = authState.user;

  return (
    <div
      className="p-6 border font-mono my-8 space-y-6"
      style={{
        backgroundColor: activeTheme.id === 'high-density' ? '#E4E3E0' : activeTheme.surface,
        borderColor: activeTheme.border,
        color: activeTheme.text,
      }}
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: activeTheme.border }}>
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.login}
            className="w-14 h-14 border-2 border-current shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold uppercase tracking-tight">@{user.login}</h2>
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] tracking-wider uppercase">
                [ VERIFIED {authState.authMethod?.toUpperCase()} ]
              </span>
            </div>
            <p className="text-xs opacity-80">{user.name || user.login} {user.company ? `• ${user.company}` : ''} {user.location ? `• ${user.location}` : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onLoadAuthenticatedUserIntoCards && (
            <button
              onClick={() => onLoadAuthenticatedUserIntoCards(user.login)}
              className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-800"
            >
              <Sparkles className="w-4 h-4" />
              Gunakan Profil Ini di GitForge Cards
            </button>
          )}
          <button
            onClick={refreshDeepProfile}
            className="px-3 py-2 border font-bold text-xs flex items-center gap-1.5 hover:bg-black/5"
            style={{ borderColor: activeTheme.border }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Real-time
          </button>
        </div>
      </div>

      {/* Grid Metrics Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 border" style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.surfaceSecondary }}>
          <div className="text-[10px] uppercase opacity-70 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-500" /> Private Repositories
          </div>
          <div className="text-2xl font-bold mt-1">{user.totalPrivateRepos}</div>
          <div className="text-[10px] opacity-60 mt-0.5">Owned: {user.ownedPrivateRepos}</div>
        </div>

        <div className="p-3 border" style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.surfaceSecondary }}>
          <div className="text-[10px] uppercase opacity-70 flex items-center gap-1">
            <Key className="w-3 h-3 text-blue-500" /> API Rate Limit
          </div>
          <div className="text-2xl font-bold mt-1">{user.rateLimit?.remaining ?? 5000} <span className="text-xs font-normal">/ {user.rateLimit?.limit ?? 5000}</span></div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">High Capacity (5k/hr)</div>
        </div>

        <div className="p-3 border" style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.surfaceSecondary }}>
          <div className="text-[10px] uppercase opacity-70 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> 2FA Security
          </div>
          <div className="text-sm font-bold mt-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            {user.twoFactorAuthentication ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Enabled
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-500" /> Standard
              </>
            )}
          </div>
          <div className="text-[10px] opacity-60 mt-0.5">Plan: {user.plan?.name || 'Developer'}</div>
        </div>

        <div className="p-3 border" style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.surfaceSecondary }}>
          <div className="text-[10px] uppercase opacity-70 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-purple-500" /> Disk Usage
          </div>
          <div className="text-2xl font-bold mt-1">{(user.diskUsage / 1024).toFixed(1)} <span className="text-xs">MB</span></div>
          <div className="text-[10px] opacity-60 mt-0.5">Private Gists: {user.privateGists}</div>
        </div>
      </div>

      {/* Two Column Section: Emails & Private Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emails Section */}
        <div className="p-4 border" style={{ borderColor: activeTheme.border }}>
          <div className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Terverifikasi Email GitHub ({user.emails.length})</span>
          </div>

          <div className="space-y-2 text-xs">
            {user.emails.length > 0 ? (
              user.emails.map((emailItem, idx) => (
                <div
                  key={idx}
                  className="p-2 border flex items-center justify-between"
                  style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.surfaceSecondary }}
                >
                  <div className="truncate pr-2">
                    <span className="font-bold">{emailItem.email}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    {emailItem.primary && (
                      <span className="px-1.5 py-0.5 bg-blue-600 text-white font-bold">PRIMARY</span>
                    )}
                    {emailItem.verified && (
                      <span className="px-1.5 py-0.5 bg-emerald-600 text-white font-bold">VERIFIED</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-opacity-60 italic text-xs">Primary Email: {user.email || 'Private / Unlisted'}</div>
            )}
          </div>
        </div>

        {/* Private Repositories List */}
        <div className="p-4 border" style={{ borderColor: activeTheme.border }}>
          <div className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Repositori Privat Terbaru ({user.privateRepositoriesList?.length || 0})</span>
          </div>

          <div className="space-y-2 text-xs">
            {user.privateRepositoriesList && user.privateRepositoriesList.length > 0 ? (
              user.privateRepositoriesList.map((repo) => (
                <div
                  key={repo.id}
                  className="p-2.5 border flex items-center justify-between"
                  style={{ borderColor: activeTheme.border, backgroundColor: activeTheme.surfaceSecondary }}
                >
                  <div className="truncate pr-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">{repo.name}</span>
                    </div>
                    {repo.description && (
                      <p className="text-[10px] opacity-70 truncate mt-0.5">{repo.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] shrink-0 font-mono">
                    {repo.language && (
                      <span className="px-1.5 py-0.5 border" style={{ borderColor: activeTheme.border }}>
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500" /> {repo.stars}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-opacity-70 text-xs p-3 border border-dashed text-center" style={{ borderColor: activeTheme.border }}>
                No private repositories found or private repository scope was not granted.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
