import { GitHubProfile, Theme } from '../../types';
import { getThemeById } from '../../lib/themes';

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function renderProfileCard(profile: GitHubProfile, themeInput?: string): string {
  const theme = getThemeById(themeInput);
  const width = 480;
  const height = 220;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      .card-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.5; rx: 14; }
      .text-title { font-family: ${theme.font}; font-size: 18px; font-weight: 700; fill: ${theme.text}; }
      .text-username { font-family: ${theme.font}; font-size: 13px; font-weight: 500; fill: ${theme.primary}; }
      .text-bio { font-family: ${theme.font}; font-size: 12px; fill: ${theme.textMuted}; }
      .stat-val { font-family: ${theme.font}; font-size: 16px; font-weight: 700; fill: ${theme.text}; }
      .stat-lbl { font-family: ${theme.font}; font-size: 10px; font-weight: 600; fill: ${theme.textMuted}; text-transform: uppercase; }
      .badge-bg { fill: ${theme.surfaceSecondary}; stroke: ${theme.border}; stroke-width: 1; rx: 6; }
      .badge-text { font-family: ${theme.font}; font-size: 10px; font-weight: 600; fill: ${theme.accent}; }
    </style>
    <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    <circle cx="60" cy="60" r="32" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2"/>
    <text x="60" y="66" font-family="${theme.font}" font-size="22" font-weight="bold" fill="${theme.primary}" text-anchor="middle">${escapeXml(profile.name?.charAt(0) || profile.username.charAt(0))}</text>
    
    <text x="110" y="52" class="text-title">${escapeXml(profile.name || profile.username)}</text>
    <text x="110" y="70" class="text-username">@${escapeXml(profile.username)}</text>
    <text x="110" y="90" class="text-bio">${escapeXml(profile.bio?.slice(0, 52) || '')}</text>

    <!-- Divider -->
    <line x1="25" y1="120" x2="${width - 25}" y2="120" stroke="${theme.border}" stroke-width="1"/>

    <!-- Stats Row -->
    <g transform="translate(25, 140)">
      <!-- Repos -->
      <g transform="translate(0, 0)">
        <text y="0" class="stat-val">${profile.publicRepos}</text>
        <text y="18" class="stat-lbl">Repositories</text>
      </g>
      <!-- Stars -->
      <g transform="translate(100, 0)">
        <text y="0" class="stat-val">${profile.starsCount}</text>
        <text y="18" class="stat-lbl">Stars Earned</text>
      </g>
      <!-- Followers -->
      <g transform="translate(200, 0)">
        <text y="0" class="stat-val">${profile.followers}</text>
        <text y="18" class="stat-lbl">Followers</text>
      </g>
      <!-- Streak -->
      <g transform="translate(310, 0)">
        <text y="0" class="stat-val" fill="${theme.accent}">${profile.currentStreak} Days</text>
        <text y="18" class="stat-lbl">Active Streak</text>
      </g>
    </g>

    <!-- Footer Branding -->
    <rect class="badge-bg" x="${width - 100}" y="15" width="85" height="22"/>
    <text x="${width - 57.5}" y="30" class="badge-text" text-anchor="middle">GitForge ID</text>
  </svg>`;
}

export function renderStatsCard(profile: GitHubProfile, themeInput?: string): string {
  const theme = getThemeById(themeInput);
  const width = 420;
  const height = 210;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      .card-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.5; rx: 12; }
      .header-title { font-family: ${theme.font}; font-size: 16px; font-weight: 700; fill: ${theme.primary}; }
      .stat-label { font-family: ${theme.font}; font-size: 13px; font-weight: 500; fill: ${theme.textMuted}; }
      .stat-value { font-family: ${theme.font}; font-size: 14px; font-weight: 700; fill: ${theme.text}; }
      .rank-circle { fill: ${theme.surfaceSecondary}; stroke: ${theme.accent}; stroke-width: 3; }
      .rank-text { font-family: ${theme.font}; font-size: 26px; font-weight: 800; fill: ${theme.accent}; text-anchor: middle; }
      .rank-label { font-family: ${theme.font}; font-size: 10px; font-weight: 700; fill: ${theme.textMuted}; text-anchor: middle; }
    </style>
    <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    <text x="25" y="38" class="header-title">${escapeXml(profile.name || profile.username)}'s GitHub Stats</text>

    <!-- Rank Badge -->
    <g transform="translate(${width - 65}, 70)">
      <circle class="rank-circle" cx="0" cy="0" r="34"/>
      <text y="8" class="rank-text">A+</text>
      <text y="-42" class="rank-label">GITFORGE SCORE</text>
    </g>

    <!-- Metrics List -->
    <g transform="translate(25, 65)">
      <g transform="translate(0, 0)">
        <text class="stat-label">Total Stars Earned:</text>
        <text x="180" class="stat-value">${profile.starsCount}</text>
      </g>
      <g transform="translate(0, 26)">
        <text class="stat-label">Total Commits (Est.):</text>
        <text x="180" class="stat-value">${profile.totalContributions}</text>
      </g>
      <g transform="translate(0, 52)">
        <text class="stat-label">Total Repositories:</text>
        <text x="180" class="stat-value">${profile.publicRepos}</text>
      </g>
      <g transform="translate(0, 78)">
        <text class="stat-label">Total Forks:</text>
        <text x="180" class="stat-value">${profile.forksCount}</text>
      </g>
      <g transform="translate(0, 104)">
        <text class="stat-label">Contributed to:</text>
        <text x="180" class="stat-value">${profile.organizations.length || 1} Orgs</text>
      </g>
    </g>
  </svg>`;
}

export function renderLanguagesCard(profile: GitHubProfile, themeInput?: string): string {
  const theme = getThemeById(themeInput);
  const width = 380;
  const height = 210;

  const topLangs = profile.languages.slice(0, 5);

  let currentX = 25;
  const barWidth = width - 50;
  const segments = topLangs.map((lang) => {
    const segW = (lang.percentage / 100) * barWidth;
    const rect = `<rect x="${currentX}" y="60" width="${Math.max(segW, 2)}" height="10" fill="${lang.color}" rx="2"/>`;
    currentX += segW;
    return rect;
  }).join('');

  const listItems = topLangs.map((lang, idx) => {
    const col = idx % 2 === 0 ? 25 : 200;
    const row = Math.floor(idx / 2) * 28 + 95;
    return `<g transform="translate(${col}, ${row})">
      <circle cx="6" cy="6" r="5" fill="${lang.color}"/>
      <text x="18" y="10" font-family="${theme.font}" font-size="12" font-weight="600" fill="${theme.text}">${escapeXml(lang.name)}</text>
      <text x="140" y="10" font-family="${theme.font}" font-size="11" font-weight="500" fill="${theme.textMuted}">${lang.percentage}%</text>
    </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      .card-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.5; rx: 12; }
      .header-title { font-family: ${theme.font}; font-size: 15px; font-weight: 700; fill: ${theme.primary}; }
    </style>
    <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    <text x="25" y="38" class="header-title">Most Used Languages</text>
    <g>${segments}</g>
    <g>${listItems}</g>
  </svg>`;
}

export function renderStreakCard(profile: GitHubProfile, themeInput?: string): string {
  const theme = getThemeById(themeInput);
  const width = 440;
  const height = 180;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      .card-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.5; rx: 12; }
      .title { font-family: ${theme.font}; font-size: 15px; font-weight: 700; fill: ${theme.primary}; }
      .val { font-family: ${theme.font}; font-size: 26px; font-weight: 800; fill: ${theme.text}; }
      .sub { font-family: ${theme.font}; font-size: 11px; font-weight: 600; fill: ${theme.textMuted}; text-transform: uppercase; }
      .flame { fill: ${theme.accent}; }
    </style>
    <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    <text x="25" y="36" class="title">🔥 Commit Streak Tracker</text>

    <!-- 3 Columns -->
    <g transform="translate(25, 70)">
      <!-- Current Streak -->
      <g transform="translate(0, 0)">
        <text class="val" fill="${theme.accent}">${profile.currentStreak}</text>
        <text y="24" class="sub">Current Streak (Days)</text>
      </g>
      <!-- Longest Streak -->
      <g transform="translate(140, 0)">
        <text class="val">${profile.longestStreak}</text>
        <text y="24" class="sub">Longest Streak</text>
      </g>
      <!-- Total Contributions -->
      <g transform="translate(270, 0)">
        <text class="val">${profile.totalContributions}</text>
        <text y="24" class="sub">Total Contribs</text>
      </g>
    </g>

    <line x1="25" y1="135" x2="${width - 25}" y2="135" stroke="${theme.border}" stroke-width="1"/>
    <text x="25" y="155" font-family="${theme.font}" font-size="11" fill="${theme.textMuted}">Keep code activity going strong with daily GitHub pushes!</text>
  </svg>`;
}

export function renderContributionsCard(profile: GitHubProfile, themeInput?: string): string {
  const theme = getThemeById(themeInput);
  const width = 500;
  const height = 180;

  const cols = 22;
  const rows = 7;
  const tileSize = 14;
  const gap = 4;

  const cal = profile.contributionCalendar || [];
  const recentDays = cal.length >= cols * rows ? cal.slice(-(cols * rows)) : cal;

  let matrixSvg = '';
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const idx = c * rows + r;
      const dayData = recentDays[idx];
      const count = dayData ? dayData.count : 0;

      let opacity = '0.15';
      let fill = theme.textMuted;
      if (count > 0 && count <= 2) { opacity = '0.4'; fill = theme.primary; }
      else if (count > 2 && count <= 5) { opacity = '0.7'; fill = theme.primary; }
      else if (count > 5) { opacity = '1.0'; fill = theme.accent; }

      const x = c * (tileSize + gap);
      const y = r * (tileSize + gap);
      matrixSvg += `<rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="3" fill="${fill}" fill-opacity="${opacity}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      .card-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.5; rx: 12; }
      .header-title { font-family: ${theme.font}; font-size: 15px; font-weight: 700; fill: ${theme.text}; }
      .sub-title { font-family: ${theme.font}; font-size: 12px; font-weight: 600; fill: ${theme.accent}; }
    </style>
    <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    <text x="25" y="32" class="header-title">Contribution Matrix Graph</text>
    <text x="${width - 25}" y="32" class="sub-title" text-anchor="end">${profile.totalContributions} Contributions</text>

    <g transform="translate(25, 48)">
      ${matrixSvg}
    </g>
  </svg>`;
}

export function renderRepositoryCard(repoName: string, owner: string, themeInput?: string): string {
  const theme = getThemeById(themeInput);
  const width = 400;
  const height = 140;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <style>
      .card-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.5; rx: 10; }
      .repo-name { font-family: ${theme.font}; font-size: 16px; font-weight: 700; fill: ${theme.primary}; }
      .repo-desc { font-family: ${theme.font}; font-size: 12px; fill: ${theme.textMuted}; }
      .stat-text { font-family: ${theme.font}; font-size: 12px; font-weight: 600; fill: ${theme.text}; }
    </style>
    <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    <text x="20" y="35" class="repo-name">📦 ${escapeXml(owner)} / ${escapeXml(repoName)}</text>
    <text x="20" y="60" class="repo-desc">Production-ready developer identity engine &amp; profile kit.</text>

    <g transform="translate(20, 105)">
      <circle cx="6" cy="-4" r="5" fill="${theme.accent}"/>
      <text x="18" y="0" class="stat-text">TypeScript</text>

      <text x="140" y="0" class="stat-text">⭐ 240</text>
      <text x="220" y="0" class="stat-text">🍴 48</text>
    </g>
  </svg>`;
}
