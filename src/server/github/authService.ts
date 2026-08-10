import { GitHubDeepUserData } from '../../types';

export function getGitHubOAuthUrl(redirectUri: string = 'https://gitforge.ai.studio/auth/callback'): string | null {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user,user:email,repo,read:org',
    allow_signup: 'true',
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, redirectUri: string = 'https://gitforge.ai.studio/auth/callback'): Promise<string> {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing on the server.');
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`GitHub OAuth Error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

export async function fetchAuthenticatedDeepProfile(token: string): Promise<GitHubDeepUserData> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'GitForge-App',
    Accept: 'application/vnd.github.v3+json',
  };

  // Fetch core user object
  const userRes = await fetch('https://api.github.com/user', { headers });
  if (!userRes.ok) {
    throw new Error(`Failed to fetch GitHub user details: ${userRes.statusText}`);
  }
  const userData = await userRes.json();

  // Fetch emails (including private/unlisted)
  let emails: any[] = [];
  try {
    const emailRes = await fetch('https://api.github.com/user/emails', { headers });
    if (emailRes.ok) {
      emails = await emailRes.json();
    }
  } catch (err) {
    console.warn('Could not fetch user emails:', err);
  }

  // Fetch rate limit information
  let rateLimit = { limit: 5000, remaining: 4999, reset: Math.floor(Date.now() / 1000) + 3600 };
  try {
    const rateRes = await fetch('https://api.github.com/rate_limit', { headers });
    if (rateRes.ok) {
      const rateData = await rateRes.json();
      if (rateData?.rate) {
        rateLimit = {
          limit: rateData.rate.limit,
          remaining: rateData.rate.remaining,
          reset: rateData.rate.reset,
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch rate limits:', err);
  }

  // Fetch repos including private repositories if scope allows
  let privateRepositoriesList: any[] = [];
  try {
    const reposRes = await fetch('https://api.github.com/user/repos?type=all&sort=updated&per_page=30', { headers });
    if (reposRes.ok) {
      const allRepos = await reposRes.json();
      privateRepositoriesList = allRepos
        .filter((r: any) => r.private)
        .slice(0, 10)
        .map((r: any) => ({
          id: r.id,
          name: r.name,
          fullName: r.full_name,
          private: r.private,
          description: r.description,
          stars: r.stargazers_count || 0,
          forks: r.forks_count || 0,
          language: r.language,
          updatedAt: r.updated_at,
        }));
    }
  } catch (err) {
    console.warn('Could not fetch private repos list:', err);
  }

  const primaryEmail = emails.find((e: any) => e.primary)?.email || userData.email || null;

  return {
    id: userData.id,
    login: userData.login,
    name: userData.name || userData.login,
    avatarUrl: userData.avatar_url,
    bio: userData.bio || null,
    company: userData.company || null,
    location: userData.location || null,
    email: primaryEmail,
    emails: emails.map((e: any) => ({
      email: e.email,
      primary: Boolean(e.primary),
      verified: Boolean(e.verified),
      visibility: e.visibility || null,
    })),
    publicRepos: userData.public_repos || 0,
    totalPrivateRepos: userData.total_private_repos || 0,
    ownedPrivateRepos: userData.owned_private_repos || 0,
    publicGists: userData.public_gists || 0,
    privateGists: userData.private_gists || 0,
    followers: userData.followers || 0,
    following: userData.following || 0,
    diskUsage: userData.disk_usage || 0,
    collaborators: userData.collaborators || 0,
    twoFactorAuthentication: Boolean(userData.two_factor_authentication),
    plan: userData.plan
      ? {
          name: userData.plan.name,
          space: userData.plan.space,
          privateRepos: userData.plan.private_repos,
        }
      : undefined,
    rateLimit,
    privateRepositoriesList,
  };
}
