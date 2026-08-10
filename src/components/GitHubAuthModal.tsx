import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Key, Shield, ExternalLink, Check, AlertTriangle, Lock, UserCheck, X, Copy, RefreshCw } from 'lucide-react';

export const GitHubAuthModal: React.FC = () => {
  const { isModalOpen, setIsModalOpen, authState, loginWithOAuth, logout, refreshDeepProfile } = useAuth();
  const { activeTheme } = useTheme();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-2xl border shadow-2xl relative overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: activeTheme.id === 'high-density' ? '#E4E3E0' : activeTheme.surface,
          borderColor: activeTheme.border,
          color: activeTheme.text,
          borderRadius: activeTheme.radius,
        }}
      >
        {/* Header Bar */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between font-mono"
          style={{
            backgroundColor: activeTheme.id === 'high-density' ? '#141414' : activeTheme.surfaceSecondary,
            color: activeTheme.id === 'high-density' ? '#E4E3E0' : activeTheme.text,
            borderColor: activeTheme.border,
          }}
        >
          <div className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>[ GITHUB_AUTH_VAULT_V2 ]</span>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Status Banner if Authenticated */}
          {authState.isAuthenticated && authState.user ? (
            <div
              className="p-4 border mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
              style={{
                backgroundColor: activeTheme.id === 'high-density' ? '#D9D8D5' : `${activeTheme.surfaceSecondary}`,
                borderColor: activeTheme.border,
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={authState.user.avatarUrl}
                  alt={authState.user.login}
                  className="w-10 h-10 rounded-full border border-current"
                />
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>@{authState.user.login}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold">
                      AUTHENTICATED ({authState.authMethod?.toUpperCase()})
                    </span>
                  </div>
                  <div className="text-opacity-80 text-[11px] mt-0.5">
                    {authState.user.email ? `Email: ${authState.user.email}` : 'Private repos & email scope active'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshDeepProfile}
                  className="px-3 py-1.5 border font-semibold hover:bg-black/5 flex items-center gap-1.5"
                  style={{ borderColor: activeTheme.border }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Data
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}

          {/* OAuth Login View */}
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-600/40 rounded-none">
              <div className="font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-1 text-sm">
                <UserCheck className="w-4 h-4" />
                GitHub OAuth Login Authorization
              </div>
              <p className="text-opacity-80 leading-relaxed text-[11px]">
                Log in with your GitHub account to authorize GitForge to retrieve deep account intelligence:
                private repository access, email status, 5,000 req/hr API rate limits, and full contribution history.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border text-center" style={{ borderColor: activeTheme.border }}>
              <button
                onClick={loginWithOAuth}
                className="px-6 py-3 bg-[#141414] text-[#E4E3E0] dark:bg-white dark:text-black font-bold flex items-center gap-3 text-sm hover:opacity-90 shadow-lg transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Connect & Login via GitHub Popup</span>
              </button>
              <div className="text-[10px] opacity-70 mt-3">
                Requested scopes: <code className="bg-black/10 px-1 py-0.5 font-bold">read:user, user:email, repo, read:org</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-between text-[11px] font-mono opacity-80" style={{ borderColor: activeTheme.border }}>
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure PostMessage Cross-Origin OAuth Flow</span>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-1.5 border font-bold hover:bg-black/10"
            style={{ borderColor: activeTheme.border }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
