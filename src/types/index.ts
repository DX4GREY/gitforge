export interface GitHubProfile {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  website: string | null;
  twitterUsername: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
  starsCount: number;
  forksCount: number;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  languages: Array<{ name: string; percentage: number; color: string; count: number }>;
  pinnedRepos: GitHubRepository[];
  topRepos: GitHubRepository[];
  organizations: Array<{ login: string; avatarUrl: string }>;
  recentActivity: Array<{ type: string; repo: string; date: string }>;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  isArchived: boolean;
  isFork: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  bg: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  gradient: string;
  glow: string;
  radius: string; // e.g. "0.5rem"
  font: string; // e.g. "Inter, sans-serif"
}

export interface ProfileIntelligenceResult {
  score: number;
  archetype: string;
  summary: string;
  strengths: string[];
  growthAreas: string[];
  techFocus: string[];
  openSourceImpact: string;
  recommendations: string[];
  readmeSuggestions: string[];
}

export interface ProjectPersonaResult {
  projectName: string;
  mascotName: string;
  archetype: string;
  tagline: string;
  traits: string[];
  visualStyle: string;
  colorPalette: string[];
  personalityDescription: string;
  readmeBadgeMarkdown: string;
}

export interface DailyCardData {
  title: string;
  description: string;
  projectName?: string;
  date: string;
  category: 'feature' | 'bugfix' | 'refactor' | 'learning' | 'milestone';
  stats?: string;
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export interface GitHubDeepUserData {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  emails: GitHubEmail[];
  publicRepos: number;
  totalPrivateRepos: number;
  ownedPrivateRepos: number;
  publicGists: number;
  privateGists: number;
  followers: number;
  following: number;
  diskUsage: number;
  collaborators: number;
  twoFactorAuthentication: boolean;
  plan?: {
    name: string;
    space: number;
    privateRepos: number;
  };
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
  scopes?: string[];
  privateRepositoriesList?: Array<{
    id: number;
    name: string;
    fullName: string;
    private: boolean;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    updatedAt: string;
  }>;
}

export interface GitHubAuthState {
  isAuthenticated: boolean;
  token?: string;
  authMethod?: 'oauth' | 'pat' | 'demo';
  user?: GitHubDeepUserData;
}

export interface SavedAsset {
  id: string;
  title: string;
  type: 'readme' | 'card' | 'portfolio' | 'avatar' | 'wrapped';
  createdAt: string;
  content: string;
  metadata?: Record<string, unknown>;
}
