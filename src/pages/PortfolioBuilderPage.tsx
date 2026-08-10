import React, { useState, useEffect } from 'react';
import { Layout, Download, Eye, Sparkles, Check, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import { useTheme } from '../context/ThemeContext';
import { getGitHubProfile } from '../lib/github';
import { GitHubProfile } from '../types';

export const PortfolioBuilderPage: React.FC = () => {
  const { activeTheme } = useTheme();
  const [username, setUsername] = useState('octocat');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getGitHubProfile(username);
      setProfile(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const downloadZipPortfolio = async () => {
    if (!profile) return;
    setExporting(true);

    try {
      const zip = new JSZip();

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${profile.name || profile.username} — Portfolio</title>
  <style>
    body {
      margin: 0;
      font-family: ${activeTheme.font};
      background-color: ${activeTheme.bg};
      color: ${activeTheme.text};
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 30px;
      border-bottom: 1px solid ${activeTheme.border};
    }
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 20px;
      border: 2px solid ${activeTheme.primary};
    }
    .title {
      font-size: 28px;
      font-weight: 800;
      margin: 0;
    }
    .bio {
      color: ${activeTheme.textMuted};
      font-size: 14px;
      margin-top: 6px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .card {
      background-color: ${activeTheme.surface};
      border: 1px solid ${activeTheme.border};
      padding: 20px;
      border-radius: 12px;
    }
    .card-title {
      color: ${activeTheme.primary};
      font-weight: 700;
      text-decoration: none;
      font-size: 16px;
    }
    .card-desc {
      color: ${activeTheme.textMuted};
      font-size: 12px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${profile.avatarUrl}" class="avatar" alt="${profile.username}">
      <div>
        <h1 class="title">${profile.name || profile.username}</h1>
        <div class="bio">${profile.bio || 'Software Developer & Open Source Creator'}</div>
      </div>
    </div>

    <h2>Featured Projects</h2>
    <div class="grid">
      ${profile.pinnedRepos
        .map(
          (repo) => `
        <div class="card">
          <a href="${repo.url}" target="_blank" class="card-title">${repo.name}</a>
          <div class="card-desc">${repo.description || 'Open source project.'}</div>
        </div>
      `
        )
        .join('')}
    </div>
  </div>
</body>
</html>`;

      zip.file('index.html', htmlContent);
      zip.file('README.md', `# ${profile.name}'s Web Portfolio\nGenerated with GitForge.`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.username}-portfolio.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <Layout className="w-6 h-6 text-indigo-400" />
          Developer Portfolio Builder &amp; Exporter
        </h1>
        <p className="text-xs" style={{ color: activeTheme.textMuted }}>
          Generate a responsive web portfolio site and download a self-contained ZIP bundle ready for hosting.
        </p>
      </div>

      <div className="p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
        <div className="flex-1 w-full">
          <label className="text-xs font-bold mb-1 block">GitHub Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="octocat"
            className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border, color: activeTheme.text }}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto self-end">
          <button
            onClick={fetchProfile}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5"
            style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync Repos
          </button>
          <button
            onClick={downloadZipPortfolio}
            disabled={exporting || !profile}
            className="px-6 py-2.5 rounded-lg text-xs font-bold transition shadow-md flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            style={{ background: activeTheme.gradient, color: '#ffffff' }}
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? 'Exporting ZIP...' : 'Export Portfolio ZIP'}
          </button>
        </div>
      </div>

      {/* Web Portfolio Live Preview Frame */}
      {profile && (
        <div className="p-8 rounded-2xl border space-y-8" style={{ backgroundColor: activeTheme.surface, borderColor: activeTheme.border }}>
          <div className="flex items-center gap-6 pb-6 border-b" style={{ borderColor: activeTheme.border }}>
            <img src={profile.avatarUrl} alt={profile.username} className="w-20 h-20 rounded-2xl border object-cover" style={{ borderColor: activeTheme.primary }} />
            <div>
              <h2 className="text-2xl font-black">{profile.name || profile.username}</h2>
              <p className="text-xs" style={{ color: activeTheme.textMuted }}>{profile.bio}</p>
              <div className="text-xs font-mono mt-2" style={{ color: activeTheme.primary }}>
                📍 {profile.location || 'Remote Developer'} | 🌐 {profile.website || window.location.origin}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm">Featured Repositories Showcase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.pinnedRepos.map((repo) => (
                <div key={repo.id} className="p-5 rounded-xl border space-y-2" style={{ backgroundColor: activeTheme.surfaceSecondary, borderColor: activeTheme.border }}>
                  <div className="font-bold text-sm" style={{ color: activeTheme.primary }}>{repo.name}</div>
                  <p className="text-xs" style={{ color: activeTheme.textMuted }}>{repo.description}</p>
                  <div className="flex items-center gap-3 text-xs font-mono pt-2">
                    <span>⭐ {repo.stars}</span>
                    <span>🍴 {repo.forks}</span>
                    <span className="text-amber-400">{repo.language}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
