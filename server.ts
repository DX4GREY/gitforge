import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fetchGitHubProfile, getMockGitHubProfile } from './src/server/github/githubService';
import {
  getGitHubOAuthUrl,
  exchangeCodeForToken,
  fetchAuthenticatedDeepProfile,
} from './src/server/github/authService';
import {
  renderProfileCard,
  renderStatsCard,
  renderLanguagesCard,
  renderStreakCard,
  renderContributionsCard,
  renderRepositoryCard,
} from './src/server/renderers/cardRenderers';
import {
  generateAIReadme,
  generateProfileIntelligence,
  generateProjectPersona,
} from './src/server/ai/gemini';

// In-memory auth session store for current session token
let activeAuthSession: {
  token: string;
  user: any;
  method: 'oauth' | 'pat' | 'demo';
} | null = null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  /* API ROUTES FIRST */

  // Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'GitForge',
      version: '1.0.0',
      geminiAvailable: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      oauthConfigured: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    });
  });

  /* GITHUB OAUTH AUTHENTICATION ROUTES */

  // Get OAuth URL
  app.get('/api/auth/github/url', (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = 'gitforge.ai.studio' && !'gitforge.ai.studio'.includes('ai.studio')
      ? 'gitforge.ai.studio'.replace(/\/$/, '')
      : `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/auth/callback`;
    const url = getGitHubOAuthUrl(redirectUri);

    res.json({
      url,
      configured: Boolean(url),
      redirectUri,
      clientId: process.env.GITHUB_CLIENT_ID || null,
    });
  });

  // OAuth Callback Route (handles /auth/callback, /auth/callback/, and /api/auth/github/callback)
  const handleOAuthCallback = async (req: express.Request, res: express.Response) => {
    const code = req.query.code as string;
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = 'gitforge.ai.studio' && !'gitforge.ai.studio'.includes('ai.studio')
      ? 'gitforge.ai.studio'.replace(/\/$/, '')
      : `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/auth/callback`;

    if (!code) {
      return res.status(400).send('Missing code parameter in OAuth callback');
    }

    try {
      const accessToken = await exchangeCodeForToken(code, redirectUri);
      const deepUser = await fetchAuthenticatedDeepProfile(accessToken);

      activeAuthSession = {
        token: accessToken,
        user: deepUser,
        method: 'oauth',
      };

      // Return HTML page that posts message to opener window and closes popup
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>GitForge Authentication Success</title>
            <style>
              body { font-family: monospace; background: #E4E3E0; color: #141414; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { border: 1px solid #141414; padding: 24px; background: #D9D8D5; max-width: 400px; text-align: center; }
              .btn { background: #141414; color: #E4E3E0; padding: 8px 16px; border: none; cursor: pointer; margin-top: 12px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="card">
              <h3>[ GITFORGE OAUTH OK ]</h3>
              <p>GitHub Authentication Successful for <strong>@${deepUser.login}</strong>!</p>
              <p style="font-size: 11px; opacity: 0.8;">This window will close automatically...</p>
              <button class="btn" onclick="closeSelf()">Close Window</button>
            </div>
            <script>
              const payload = {
                type: 'OAUTH_AUTH_SUCCESS',
                token: ${JSON.stringify(accessToken)},
                user: ${JSON.stringify(deepUser)}
              };
              if (window.opener) {
                window.opener.postMessage(payload, '*');
                setTimeout(() => { window.close(); }, 1200);
              }
              function closeSelf() {
                if (window.opener) { window.opener.postMessage(payload, '*'); }
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('OAuth Callback Error:', err);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Authentication Failed</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <h2>Authentication Failed</h2>
            <p>${err.message || 'An error occurred during GitHub authentication'}</p>
            <p>Make sure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are configured.</p>
          </body>
        </html>
      `);
    }
  };

  app.get(['/auth/callback', '/auth/callback/', '/api/auth/github/callback'], handleOAuthCallback);

  // Token Login / PAT (Personal Access Token fallback)
  app.post('/api/auth/github/token-login', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const deepUser = await fetchAuthenticatedDeepProfile(token.trim());
      activeAuthSession = {
        token: token.trim(),
        user: deepUser,
        method: 'pat',
      };

      res.json({
        success: true,
        user: deepUser,
        method: 'pat',
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Invalid or expired GitHub Personal Access Token' });
    }
  });

  // Get current session status
  app.get('/api/auth/me', (req, res) => {
    if (activeAuthSession) {
      res.json({
        isAuthenticated: true,
        token: activeAuthSession.token,
        authMethod: activeAuthSession.method,
        user: activeAuthSession.user,
      });
    } else {
      res.json({
        isAuthenticated: false,
      });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    activeAuthSession = null;
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Fetch Authenticated Deep Profile
  app.get('/api/github/authenticated/deep-profile', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      let token = activeAuthSession?.token;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }

      if (!token) {
        return res.status(401).json({ error: 'No authentication token provided' });
      }

      const deepUser = await fetchAuthenticatedDeepProfile(token);
      res.json(deepUser);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch deep profile' });
    }
  });

  // Get GitHub Profile Data
  app.get('/api/github/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const profile = await fetchGitHubProfile(username);
      res.json(profile);
    } catch (err: any) {
      res.status(404).json({ error: err.message || 'Failed to fetch GitHub profile' });
    }
  });

  // SVG Card Endpoints
  app.get('/api/card/profile', async (req, res) => {
    try {
      const username = (req.query.username as string) || 'octocat';
      const theme = (req.query.theme as string) || 'midnight';
      const profile = await fetchGitHubProfile(username);
      const svg = renderProfileCard(profile, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svg);
    } catch {
      const fallback = getMockGitHubProfile('octocat');
      const svg = renderProfileCard(fallback, 'midnight');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  });

  app.get('/api/card/stats', async (req, res) => {
    try {
      const username = (req.query.username as string) || 'octocat';
      const theme = (req.query.theme as string) || 'midnight';
      const profile = await fetchGitHubProfile(username);
      const svg = renderStatsCard(profile, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svg);
    } catch {
      const fallback = getMockGitHubProfile('octocat');
      const svg = renderStatsCard(fallback, 'midnight');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  });

  app.get('/api/card/languages', async (req, res) => {
    try {
      const username = (req.query.username as string) || 'octocat';
      const theme = (req.query.theme as string) || 'midnight';
      const profile = await fetchGitHubProfile(username);
      const svg = renderLanguagesCard(profile, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svg);
    } catch {
      const fallback = getMockGitHubProfile('octocat');
      const svg = renderLanguagesCard(fallback, 'midnight');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  });

  app.get('/api/card/streak', async (req, res) => {
    try {
      const username = (req.query.username as string) || 'octocat';
      const theme = (req.query.theme as string) || 'midnight';
      const profile = await fetchGitHubProfile(username);
      const svg = renderStreakCard(profile, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svg);
    } catch {
      const fallback = getMockGitHubProfile('octocat');
      const svg = renderStreakCard(fallback, 'midnight');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  });

  app.get('/api/card/contributions', async (req, res) => {
    try {
      const username = (req.query.username as string) || 'octocat';
      const theme = (req.query.theme as string) || 'midnight';
      const profile = await fetchGitHubProfile(username);
      const svg = renderContributionsCard(profile, theme);
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.send(svg);
    } catch {
      const fallback = getMockGitHubProfile('octocat');
      const svg = renderContributionsCard(fallback, 'midnight');
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    }
  });

  app.get('/api/card/repository', async (req, res) => {
    const repo = (req.query.repo as string) || 'gitforge-core';
    const owner = (req.query.owner as string) || 'octocat';
    const theme = (req.query.theme as string) || 'midnight';
    const svg = renderRepositoryCard(repo, owner, theme);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // Hosted profile payload route
  app.get('/api/profile/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.get('host') || 'gitforge.ai.studio';
      const origin = `${protocol}://${host}`;
      const profile = await fetchGitHubProfile(username);
      res.json({
        profile,
        hostedUrl: `${origin}/profile/${encodeURIComponent(username)}`,
        seo: {
          title: `${profile.name || profile.username} | GitForge Developer Profile`,
          description: profile.bio || `Explore ${profile.username}'s GitHub portfolio and developer stats on GitForge.`,
        },
      });
    } catch (err: any) {
      res.status(404).json({ error: err.message || 'Profile not found' });
    }
  });

  // AI Endpoints
  app.post('/api/ai/readme', async (req, res) => {
    try {
      const { username, style = 'Technical', sections = ['Header', 'About', 'Tech Stack', 'Featured Projects', 'GitHub Stats'] } = req.body;
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = req.headers['x-forwarded-host'] || req.get('host') || 'gitforge.ai.studio';
      const origin = `${protocol}://${host}`;
      const profile = await fetchGitHubProfile(username || 'octocat');
      const markdown = await generateAIReadme(profile, style, sections, origin);
      res.json({ markdown });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate README' });
    }
  });

  app.post('/api/ai/intelligence', async (req, res) => {
    try {
      const { username } = req.body;
      const profile = await fetchGitHubProfile(username || 'octocat');
      const intelligence = await generateProfileIntelligence(profile);
      res.json(intelligence);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to analyze profile intelligence' });
    }
  });

  app.post('/api/ai/project-persona', async (req, res) => {
    try {
      const { repoName = 'gitforge', description = 'Developer Identity Platform', language = 'TypeScript', stars = 200 } = req.body;
      const persona = await generateProjectPersona(repoName, description, language, stars);
      res.json(persona);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate project persona' });
    }
  });

  /* VITE OR STATIC MIDDLEWARE */
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GitForge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
