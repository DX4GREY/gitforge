import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GitHubAuthState, GitHubDeepUserData } from '../types';

interface AuthContextType {
  authState: GitHubAuthState;
  loading: boolean;
  oauthConfig: { configured: boolean; redirectUri: string; clientId: string | null };
  loginWithOAuth: () => Promise<void>;
  loginWithPAT: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshDeepProfile: () => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<GitHubAuthState>({
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [oauthConfig, setOauthConfig] = useState<{ configured: boolean; redirectUri: string; clientId: string | null }>({
    configured: false,
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
    clientId: null,
  });

  // Check initial authentication and fetch OAuth configuration
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Fetch OAuth config
        const configRes = await fetch('/api/auth/github/url');
        if (configRes.ok) {
          const configData = await configRes.json();
          setOauthConfig({
            configured: Boolean(configData.configured),
            redirectUri: configData.redirectUri || `${window.location.origin}/auth/callback`,
            clientId: configData.clientId || null,
          });
        }

        // Fetch current auth session
        const meRes = await fetch('/api/auth/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.isAuthenticated && meData.user) {
            setAuthState({
              isAuthenticated: true,
              token: meData.token,
              authMethod: meData.authMethod,
              user: meData.user,
            });
          }
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for OAuth postMessage events from popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const origin = event.origin;
      if (
        origin !== window.location.origin &&
        !origin.endsWith('.run.app') &&
        !origin.endsWith('.ai.studio') &&
        !origin.includes('localhost')
      ) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { token, user } = event.data;
        if (user) {
          setAuthState({
            isAuthenticated: true,
            token,
            authMethod: 'oauth',
            user,
          });
          setIsModalOpen(false);
        } else {
          // Re-fetch me
          refreshDeepProfile();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const loginWithOAuth = async () => {
    try {
      const response = await fetch('/api/auth/github/url');
      if (!response.ok) {
        throw new Error('Failed to fetch OAuth Authorization URL');
      }
      const data = await response.json();

      if (data.url) {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const authWindow = window.open(
          data.url,
          'github_oauth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`
        );

        if (!authWindow) {
          alert('Popup blocked by browser. Please allow popups for this site to continue GitHub login.');
        }
      } else {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('OAuth initiation failed:', err);
      setIsModalOpen(true);
    }
  };

  const loginWithPAT = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/github/token-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Token authentication failed');
      }

      const data = await response.json();
      setAuthState({
        isAuthenticated: true,
        token,
        authMethod: 'pat',
        user: data.user,
      });
      setIsModalOpen(false);
      return true;
    } catch (err: any) {
      alert(err.message || 'Invalid token');
      return false;
    }
  };

  const refreshDeepProfile = async () => {
    if (!authState.token) return;
    try {
      const res = await fetch('/api/github/authenticated/deep-profile', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (res.ok) {
        const user: GitHubDeepUserData = await res.json();
        setAuthState((prev) => ({
          ...prev,
          user,
        }));
      }
    } catch (err) {
      console.error('Error refreshing deep profile:', err);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthState({ isAuthenticated: false });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        loading,
        oauthConfig,
        loginWithOAuth,
        loginWithPAT,
        logout,
        refreshDeepProfile,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
