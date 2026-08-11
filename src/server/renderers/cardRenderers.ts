import { GitHubProfile } from '../../types';
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

function getGithubLogoSvg(theme: any, x: number, y: number, size: number = 20): string {
  return `<g transform="translate(${x}, ${y})">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.06.069-.06 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="${theme.primary}" transform="scale(${size / 24})" opacity="0.85"/>
  </g>`;
}

function getAnimationStyles(animate: string, theme: any, width: number = 480, height: number = 220): string {
  let styles = '';
  
  // Slide entrance animation
  if (animate === 'slide') {
    styles += `
      @keyframes slideUpIn {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-item {
        animation: slideUpIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .delay-1 { animation-delay: 0.1s; opacity: 0; }
      .delay-2 { animation-delay: 0.22s; opacity: 0; }
      .delay-3 { animation-delay: 0.34s; opacity: 0; }
      .delay-4 { animation-delay: 0.46s; opacity: 0; }
      .delay-5 { animation-delay: 0.58s; opacity: 0; }
    `;
  }

  // Smooth fade-in entrance animation
  if (animate === 'fade') {
    styles += `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-item {
        animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .delay-1 { animation-delay: 0.08s; opacity: 0; }
      .delay-2 { animation-delay: 0.18s; opacity: 0; }
      .delay-3 { animation-delay: 0.28s; opacity: 0; }
      .delay-4 { animation-delay: 0.38s; opacity: 0; }
      .delay-5 { animation-delay: 0.48s; opacity: 0; }
    `;
  }

  // Pulse glow and breathing animation
  if (animate === 'pulse') {
    styles += `
      @keyframes pulseGlow {
        0%, 100% { filter: drop-shadow(0 0 2px rgba(100, 100, 100, 0.1)); }
        50% { filter: drop-shadow(0 0 10px ${theme.accent}55); }
      }
      @keyframes scalePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.01); }
      }
      .card-bg {
        animation: pulseGlow 4s infinite ease-in-out;
      }
      .pulse-item {
        animation: scalePulse 4s infinite ease-in-out;
        transform-origin: center;
      }
    `;
  }

  // Float (subtle continuous floating physics)
  if (animate === 'float') {
    styles += `
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
      }
      .float-item {
        animation: gentleFloat 5s infinite ease-in-out;
        transform-origin: center;
      }
    `;
  }

  // Rainbow active border cycle
  if (animate === 'rainbow') {
    styles += `
      @keyframes rainbowBorder {
        0% { stroke: ${theme.primary}; }
        33% { stroke: ${theme.accent}; }
        66% { stroke: #ec4899; }
        100% { stroke: ${theme.primary}; }
      }
      .card-bg {
        animation: rainbowBorder 6s infinite linear;
      }
    `;
  }

  // Hacker style glitch flicker
  if (animate === 'glitch') {
    styles += `
      @keyframes glitchFlicker {
        0%, 100% { opacity: 0.98; }
        15% { opacity: 0.95; }
        16% { opacity: 0.75; }
        17% { opacity: 0.98; }
        45% { opacity: 0.98; }
        46% { opacity: 0.65; }
        47% { opacity: 0.98; }
        82% { opacity: 0.98; }
        83% { opacity: 0.55; }
        84% { opacity: 0.98; }
      }
      .glitch-item {
        animation: glitchFlicker 3s infinite linear;
      }
    `;
  }

  // Scanning diagnostic light wave
  if (animate === 'wave') {
    styles += `
      @keyframes scanLineMove {
        0% { transform: translateY(-15px); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateY(${height}px); opacity: 0; }
      }
      .scanner-bar {
        animation: scanLineMove 4.5s infinite linear;
        fill: url(#scanGradient);
      }
    `;
  }

  return styles;
}

function getLayoutDecorations(layout: string, width: number, height: number, theme: any): string {
  if (layout === 'cyber') {
    return `
      <!-- Corner Bracket ticks for cyber layout -->
      <path d="M 8 24 L 8 8 L 24 8" stroke="${theme.accent}" stroke-width="2" fill="none" />
      <path d="M ${width - 24} 8 L ${width - 8} 8 L ${width - 8} 24" stroke="${theme.accent}" stroke-width="2" fill="none" />
      <path d="M 8 ${height - 24} L 8 ${height - 8} L 24 ${height - 8}" stroke="${theme.accent}" stroke-width="2" fill="none" />
      <path d="M ${width - 24} ${height - 8} L ${width - 8} ${height - 8} L ${width - 8} ${height - 24}" stroke="${theme.accent}" stroke-width="2" fill="none" />
      <!-- Grid crosshair markings -->
      <line x1="${width / 2}" y1="6" x2="${width / 2}" y2="12" stroke="${theme.border}" stroke-width="1" opacity="0.4" />
      <line x1="${width / 2}" y1="${height - 12}" x2="${width / 2}" y2="${height - 6}" stroke="${theme.border}" stroke-width="1" opacity="0.4" />
    `;
  }
  return '';
}

export function renderProfileCard(
  profile: GitHubProfile,
  themeInput?: string,
  animate: string = 'none',
  layout: string = 'classic',
  githubLogo: boolean = true
): string {
  const theme = getThemeById(themeInput);

  if (layout === 'gitskins') {
    const width = 520;
    const height = 145;
    const fontStyle = theme.font || "sans-serif";
    const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
    const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

    let pillX = 110;
    let pillsSvg = '';
    const langs = profile.languages.slice(0, 4);
    langs.forEach((lang) => {
      const label = lang.name;
      const textWidth = Math.max(label.length * 7 + 16, 50);
      pillsSvg += `
        <g transform="translate(${pillX}, 112)">
          <rect width="${textWidth}" height="18" rx="9" fill="rgba(15, 30, 46, 0.6)" stroke="${theme.border}" stroke-width="1" />
          <text x="${textWidth / 2}" y="12" font-family="${fontStyle}" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">${escapeXml(label)}</text>
        </g>
      `;
      pillX += textWidth + 8;
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        <clipPath id="gitskinsAvatarClip">
          <circle cx="62" cy="72" r="34" />
        </clipPath>
        ${animate === 'wave' ? `
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </linearGradient>
        ` : ''}
      </defs>
      <style>
        .outer-bg { fill: ${theme.bg}; stroke: ${theme.border}; stroke-width: 2; rx: 24; }
        .inner-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.2; rx: 14; }
        .text-title { font-family: ${fontStyle}; font-size: 23px; font-weight: 800; fill: #FFFFFF; }
        .text-username { font-family: ${fontStyle}; font-size: 12px; font-weight: 700; fill: ${theme.textMuted}; opacity: 0.85; }
        .text-bio { font-family: ${fontStyle}; font-size: 11.5px; font-weight: 500; fill: ${theme.textMuted}; opacity: 0.9; }
        .stat-val { font-family: ${fontStyle}; font-size: 34px; font-weight: 800; fill: ${theme.accent}; }
        .stat-lbl { font-family: ${fontStyle}; font-size: 9px; font-weight: 700; fill: ${theme.textMuted}; letter-spacing: 1.5; }
        ${getAnimationStyles(animate, theme, width, height)}
      </style>
      
      <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
        <rect class="outer-bg" width="${width - 4}" height="${height - 4}" x="2" y="2"/>
        <rect class="inner-bg" width="${width - 30}" height="${height - 30}" x="15" y="15"/>
      </g>

      <!-- Swoosh arc behind username -->
      <path d="M 108 50 Q 170 38 230 52" stroke="${theme.primary}" stroke-width="1.5" opacity="0.45" fill="none" />

      <g class="${itemClass} ${glitchClass} delay-1">
        <circle cx="62" cy="72" r="34" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2.5"/>
        <circle cx="62" cy="72" r="38" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.6" stroke-dasharray="8 4"/>
        <line x1="42" y1="52" x2="82" y2="92" stroke="${theme.primary}" stroke-width="1" opacity="0.3" />
        <line x1="82" y1="52" x2="42" y2="92" stroke="${theme.primary}" stroke-width="1" opacity="0.3" />
        ${profile.avatarUrl ? `
          <image href="${escapeXml(profile.avatarUrl)}" x="28" y="38" width="68" height="68" clip-path="url(#gitskinsAvatarClip)" />
          <circle cx="62" cy="72" r="34" fill="none" stroke="${theme.primary}" stroke-width="2.5"/>
        ` : `
          <text x="62" y="78" font-family="${fontStyle}" font-size="22" font-weight="bold" fill="${theme.primary}" text-anchor="middle">${escapeXml(profile.name?.charAt(0) || profile.username.charAt(0))}</text>
        `}
      </g>
      
      <g class="${itemClass} ${glitchClass} delay-2">
        <text x="110" y="46" class="text-username">@${escapeXml(profile.username)}</text>
        <text x="110" y="78" class="text-title">${escapeXml(profile.name || profile.username)}</text>
        <text x="110" y="98" class="text-bio">${escapeXml(profile.bio?.slice(0, 50) || 'Backend Developer | System Tweaking')}</text>
      </g>

      <!-- Language pills -->
      <g class="${itemClass} delay-3">
        ${pillsSvg}
      </g>

      <!-- Right stats -->
      <g transform="translate(${width - 65}, 74)" class="${itemClass} ${glitchClass} delay-4" text-anchor="middle">
        <text class="stat-val">${profile.starsCount}</text>
        <text y="18" class="stat-lbl">TOTAL STARS</text>
      </g>

      <!-- Signature branding footer -->
      <text x="${width - 25}" y="${height - 8}" font-family="${fontStyle}" font-size="9.5" font-weight="600" fill="${theme.border}" opacity="0.8" text-anchor="end">gitskins.com</text>

      <!-- Scanning Diagnostic light overlay -->
      ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
    </svg>`;
  }

  const width = 480;
  const height = 220;

  const fontStyle = layout === 'cyber' ? "Menlo, Monaco, Consolas, monospace" : theme.font;
  const borderRadius = layout === 'cyber' ? '0' : layout === 'modern' ? '24' : '14';
  const bgFill = layout === 'modern' ? 'url(#modernGradProfile)' : theme.surface;

  const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
  const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <defs>
      <linearGradient id="modernGradProfile" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.surface}"/>
        <stop offset="100%" stop-color="${theme.surfaceSecondary}"/>
      </linearGradient>
      <clipPath id="avatarClip">
        <circle cx="60" cy="60" r="32" />
      </clipPath>
      ${animate === 'wave' ? `
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </linearGradient>
      ` : ''}
    </defs>
    <style>
      .card-bg { fill: ${bgFill}; stroke: ${theme.border}; stroke-width: 1.5; rx: ${borderRadius}; }
      .text-title { font-family: ${fontStyle}; font-size: 18px; font-weight: 700; fill: ${theme.text}; }
      .text-username { font-family: ${fontStyle}; font-size: 13px; font-weight: 500; fill: ${theme.primary}; }
      .text-bio { font-family: ${fontStyle}; font-size: 12px; fill: ${theme.textMuted}; }
      .stat-val { font-family: ${fontStyle}; font-size: 16px; font-weight: 700; fill: ${theme.text}; }
      .stat-lbl { font-family: ${fontStyle}; font-size: 10px; font-weight: 600; fill: ${theme.textMuted}; text-transform: uppercase; }
      .badge-bg { fill: ${theme.surfaceSecondary}; stroke: ${theme.border}; stroke-width: 1; rx: 6; }
      .badge-text { font-family: ${fontStyle}; font-size: 10px; font-weight: 600; fill: ${theme.accent}; }
      ${getAnimationStyles(animate, theme, width, height)}
    </style>
    
    <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
      <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    </g>

    ${getLayoutDecorations(layout, width, height, theme)}

    <g class="${itemClass} ${glitchClass} delay-1">
      <circle cx="60" cy="60" r="32" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2"/>
      ${profile.avatarUrl ? `
        <!-- Embedded Circular GitHub Avatar Image -->
        <image href="${escapeXml(profile.avatarUrl)}" x="28" y="28" width="64" height="64" clip-path="url(#avatarClip)" />
        <!-- Overlay boundary ring -->
        <circle cx="60" cy="60" r="32" fill="none" stroke="${theme.primary}" stroke-width="2"/>
      ` : `
        <text x="60" y="66" font-family="${fontStyle}" font-size="22" font-weight="bold" fill="${theme.primary}" text-anchor="middle">${escapeXml(profile.name?.charAt(0) || profile.username.charAt(0))}</text>
      `}

      <!-- Status GitHub Logo Badge overlay on bottom-right of avatar -->
      ${githubLogo ? `
      <g>
        <circle cx="80" cy="80" r="11" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1.5"/>
        <g transform="translate(73, 73)">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="${theme.primary}" transform="scale(0.875)"/>
        </g>
      </g>
      ` : ''}
    </g>
    
    <g class="${itemClass} ${glitchClass} delay-2">
      <text x="110" y="52" class="text-title">${escapeXml(profile.name || profile.username)}</text>
      <text x="110" y="70" class="text-username">@${escapeXml(profile.username)}</text>
      <text x="110" y="90" class="text-bio">${escapeXml(profile.bio?.slice(0, 52) || 'Building scalable developer utilities.')}</text>
    </g>

    <!-- Divider (Omitted or altered in modern style) -->
    ${layout !== 'modern' ? `<line x1="25" y1="120" x2="${width - 25}" y2="120" stroke="${theme.border}" stroke-width="1" stroke-dasharray="${layout === 'cyber' ? '4 4' : '0'}"/>` : ''}

    <!-- Stats Row -->
    <g transform="translate(25, 140)" class="${itemClass} ${glitchClass} delay-3">
      <!-- Repos -->
      <g transform="translate(0, 0)">
        <text y="0" class="stat-val">${profile.publicRepos}</text>
        <text y="18" class="stat-lbl">Repositories</text>
      </g>
      <!-- Stars -->
      <g transform="translate(105, 0)">
        <text y="0" class="stat-val">${profile.starsCount}</text>
        <text y="18" class="stat-lbl">Stars Earned</text>
      </g>
      <!-- Followers -->
      <g transform="translate(210, 0)">
        <text y="0" class="stat-val">${profile.followers}</text>
        <text y="18" class="stat-lbl">Followers</text>
      </g>
      <!-- Streak -->
      <g transform="translate(315, 0)">
        <text y="0" class="stat-val" fill="${theme.accent}">${profile.currentStreak} Days</text>
        <text y="18" class="stat-lbl">Active Streak</text>
      </g>
    </g>

    <!-- Brand Badge / GitHub Logo Integration -->
    <g class="${itemClass} delay-4">
      ${githubLogo ? getGithubLogoSvg(theme, width - 130, 16, 18) : ''}
      <rect class="badge-bg" x="${width - 100}" y="15" width="85" height="22"/>
      <text x="${width - 57.5}" y="30" class="badge-text" text-anchor="middle">GitForge ID</text>
    </g>

    <!-- Scanning Diagnostic light overlay -->
    ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
  </svg>`;
}

export function renderStatsCard(
  profile: GitHubProfile,
  themeInput?: string,
  animate: string = 'none',
  layout: string = 'classic',
  githubLogo: boolean = true
): string {
  const theme = getThemeById(themeInput);

  if (layout === 'gitskins') {
    const width = 520;
    const height = 145;
    const fontStyle = theme.font || "sans-serif";
    const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
    const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        ${animate === 'wave' ? `
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </linearGradient>
        ` : ''}
      </defs>
      <style>
        .outer-bg { fill: ${theme.bg}; stroke: ${theme.border}; stroke-width: 2; rx: 24; }
        .inner-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.2; rx: 14; }
        .text-title { font-family: ${fontStyle}; font-size: 21px; font-weight: 800; fill: #FFFFFF; }
        .text-username { font-family: ${fontStyle}; font-size: 11px; font-weight: 700; fill: ${theme.textMuted}; opacity: 0.85; }
        .stat-val { font-family: ${fontStyle}; font-size: 15px; font-weight: 800; fill: ${theme.accent}; }
        .stat-lbl { font-family: ${fontStyle}; font-size: 10px; font-weight: 600; fill: ${theme.textMuted}; text-transform: uppercase; }
        .rank-text { font-family: ${fontStyle}; font-size: 32px; font-weight: 900; fill: ${theme.accent}; }
        .rank-lbl { font-family: ${fontStyle}; font-size: 8px; font-weight: 700; fill: ${theme.textMuted}; text-transform: uppercase; letter-spacing: 1.2; }
        ${getAnimationStyles(animate, theme, width, height)}
      </style>
      
      <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
        <rect class="outer-bg" width="${width - 4}" height="${height - 4}" x="2" y="2"/>
        <rect class="inner-bg" width="${width - 30}" height="${height - 30}" x="15" y="15"/>
      </g>

      <!-- Swoosh arc behind username -->
      <path d="M 108 50 Q 170 38 230 52" stroke="${theme.primary}" stroke-width="1.5" opacity="0.45" fill="none" />

      <!-- Left side Rank Badge circles -->
      <g class="${itemClass} ${glitchClass} delay-1">
        <circle cx="62" cy="72" r="34" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2.5"/>
        <circle cx="62" cy="72" r="38" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.6" stroke-dasharray="8 4"/>
        <text x="62" y="83" class="rank-text" text-anchor="middle">A+</text>
      </g>
      
      <g class="${itemClass} ${glitchClass} delay-2">
        <text x="110" y="46" class="text-username">@${escapeXml(profile.username)}</text>
        <text x="110" y="78" class="text-title">GitHub Developer Stats</text>
      </g>

      <!-- Metrics Row -->
      <g transform="translate(110, 110)" class="${itemClass} ${glitchClass} delay-3">
        <g transform="translate(0, 0)">
          <text class="stat-val">${profile.starsCount}</text>
          <text y="15" class="stat-lbl">Stars</text>
        </g>
        <g transform="translate(90, 0)">
          <text class="stat-val">${profile.totalContributions}</text>
          <text y="15" class="stat-lbl">Commits</text>
        </g>
        <g transform="translate(180, 0)">
          <text class="stat-val">${profile.publicRepos}</text>
          <text y="15" class="stat-lbl">Repos</text>
        </g>
        <g transform="translate(270, 0)">
          <text class="stat-val">${profile.followers}</text>
          <text y="15" class="stat-lbl">Followers</text>
        </g>
      </g>

      <!-- Signature branding footer -->
      <text x="${width - 25}" y="${height - 8}" font-family="${fontStyle}" font-size="9.5" font-weight="600" fill="${theme.border}" opacity="0.8" text-anchor="end">gitskins.com</text>

      <!-- Scanning Diagnostic light overlay -->
      ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
    </svg>`;
  }

  const width = 420;
  const height = 210;

  const fontStyle = layout === 'cyber' ? "Menlo, Monaco, Consolas, monospace" : theme.font;
  const borderRadius = layout === 'cyber' ? '0' : layout === 'modern' ? '24' : '12';
  const bgFill = layout === 'modern' ? 'url(#modernGradStats)' : theme.surface;

  const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
  const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <defs>
      <linearGradient id="modernGradStats" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.surface}"/>
        <stop offset="100%" stop-color="${theme.surfaceSecondary}"/>
      </linearGradient>
      ${animate === 'wave' ? `
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </linearGradient>
      ` : ''}
    </defs>
    <style>
      .card-bg { fill: ${bgFill}; stroke: ${theme.border}; stroke-width: 1.5; rx: ${borderRadius}; }
      .header-title { font-family: ${fontStyle}; font-size: 16px; font-weight: 700; fill: ${theme.primary}; }
      .stat-label { font-family: ${fontStyle}; font-size: 13px; font-weight: 500; fill: ${theme.textMuted}; }
      .stat-value { font-family: ${fontStyle}; font-size: 14px; font-weight: 700; fill: ${theme.text}; }
      .rank-circle { fill: ${theme.surfaceSecondary}; stroke: ${theme.accent}; stroke-width: 3; }
      .rank-text { font-family: ${fontStyle}; font-size: 26px; font-weight: 800; fill: ${theme.accent}; text-anchor: middle; }
      .rank-label { font-family: ${fontStyle}; font-size: 10px; font-weight: 700; fill: ${theme.textMuted}; text-anchor: middle; }
      ${getAnimationStyles(animate, theme, width, height)}
    </style>
    
    <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
      <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    </g>

    ${getLayoutDecorations(layout, width, height, theme)}

    <g class="${itemClass} ${glitchClass} delay-1">
      <text x="25" y="38" class="header-title">${escapeXml(profile.name || profile.username)}'s GitHub Stats</text>
      ${githubLogo ? getGithubLogoSvg(theme, width - 40, 22, 18) : ''}
    </g>

    <!-- Rank Badge -->
    <g transform="translate(${width - 65}, 80)" class="${itemClass} ${glitchClass} delay-2">
      <circle class="rank-circle" cx="0" cy="0" r="34"/>
      <text y="8" class="rank-text">A+</text>
      <text y="-42" class="rank-label">GITFORGE SCORE</text>
    </g>

    <!-- Metrics List -->
    <g transform="translate(25, 65)" class="${itemClass} ${glitchClass} delay-3">
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

    <!-- Scanning Diagnostic light overlay -->
    ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
  </svg>`;
}

export function renderLanguagesCard(
  profile: GitHubProfile,
  themeInput?: string,
  animate: string = 'none',
  layout: string = 'classic',
  githubLogo: boolean = true
): string {
  const theme = getThemeById(themeInput);

  if (layout === 'gitskins') {
    const width = 520;
    const height = 145;
    const fontStyle = theme.font || "sans-serif";
    const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
    const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

    const topLangs = profile.languages.slice(0, 4);
    let pillX = 110;
    let pillsSvg = '';
    topLangs.forEach((lang, idx) => {
      const label = `${lang.name} (${lang.percentage}%)`;
      const textWidth = Math.max(label.length * 6.5 + 20, 60);
      pillsSvg += `
        <g transform="translate(${pillX}, 112)" class="${itemClass} delay-${idx + 2}">
          <rect width="${textWidth}" height="18" rx="9" fill="rgba(15, 30, 46, 0.6)" stroke="${theme.border}" stroke-width="1" />
          <circle cx="8" cy="9" r="4.5" fill="${lang.color}" />
          <text x="${textWidth / 2 + 5}" y="12" font-family="${fontStyle}" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">${escapeXml(lang.name)} ${lang.percentage}%</text>
        </g>
      `;
      pillX += textWidth + 8;
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        ${animate === 'wave' ? `
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </linearGradient>
        ` : ''}
      </defs>
      <style>
        .outer-bg { fill: ${theme.bg}; stroke: ${theme.border}; stroke-width: 2; rx: 24; }
        .inner-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.2; rx: 14; }
        .text-title { font-family: ${fontStyle}; font-size: 21px; font-weight: 800; fill: #FFFFFF; }
        .text-username { font-family: ${fontStyle}; font-size: 11px; font-weight: 700; fill: ${theme.textMuted}; opacity: 0.85; }
        .main-lang-text { font-family: ${fontStyle}; font-size: 22px; font-weight: 900; fill: ${theme.accent}; }
        ${getAnimationStyles(animate, theme, width, height)}
      </style>
      
      <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
        <rect class="outer-bg" width="${width - 4}" height="${height - 4}" x="2" y="2"/>
        <rect class="inner-bg" width="${width - 30}" height="${height - 30}" x="15" y="15"/>
      </g>

      <!-- Swoosh arc behind username -->
      <path d="M 108 50 Q 170 38 230 52" stroke="${theme.primary}" stroke-width="1.5" opacity="0.45" fill="none" />

      <!-- Left side Circle representing Language Wheel -->
      <g class="${itemClass} ${glitchClass} delay-1">
        <circle cx="62" cy="72" r="34" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2.5"/>
        <circle cx="62" cy="72" r="38" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.6" stroke-dasharray="8 4"/>
        <text x="62" y="80" class="main-lang-text" text-anchor="middle">${escapeXml(topLangs[0]?.name.charAt(0) || 'L')}</text>
      </g>
      
      <g class="${itemClass} ${glitchClass} delay-2">
        <text x="110" y="46" class="text-username">@${escapeXml(profile.username)}</text>
        <text x="110" y="78" class="text-title">Most Used Languages</text>
      </g>

      <!-- Language List -->
      <g transform="translate(0, 0)">
        ${pillsSvg}
      </g>

      <!-- Signature branding footer -->
      <text x="${width - 25}" y="${height - 8}" font-family="${fontStyle}" font-size="9.5" font-weight="600" fill="${theme.border}" opacity="0.8" text-anchor="end">gitskins.com</text>

      <!-- Scanning Diagnostic light overlay -->
      ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
    </svg>`;
  }

  const width = 380;
  const height = 210;

  const fontStyle = layout === 'cyber' ? "Menlo, Monaco, Consolas, monospace" : theme.font;
  const borderRadius = layout === 'cyber' ? '0' : layout === 'modern' ? '24' : '12';
  const bgFill = layout === 'modern' ? 'url(#modernGradLangs)' : theme.surface;

  const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
  const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

  const topLangs = profile.languages.slice(0, 5);

  let currentX = 25;
  const barWidth = width - 50;
  const segments = topLangs.map((lang, idx) => {
    const segW = (lang.percentage / 100) * barWidth;
    const rect = `<rect class="${itemClass} delay-${idx + 1}" x="${currentX}" y="60" width="${Math.max(segW, 2)}" height="10" fill="${lang.color}" rx="2"/>`;
    currentX += segW;
    return rect;
  }).join('');

  const listItems = topLangs.map((lang, idx) => {
    const col = idx % 2 === 0 ? 25 : 200;
    const row = Math.floor(idx / 2) * 28 + 95;
    return `<g transform="translate(${col}, ${row})" class="${itemClass} ${glitchClass} delay-${idx + 2}">
      <circle cx="6" cy="6" r="5" fill="${lang.color}"/>
      <text x="18" y="10" font-family="${fontStyle}" font-size="12" font-weight="600" fill="${theme.text}">${escapeXml(lang.name)}</text>
      <text x="140" y="10" font-family="${fontStyle}" font-size="11" font-weight="500" fill="${theme.textMuted}">${lang.percentage}%</text>
    </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <defs>
      <linearGradient id="modernGradLangs" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.surface}"/>
        <stop offset="100%" stop-color="${theme.surfaceSecondary}"/>
      </linearGradient>
      ${animate === 'wave' ? `
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </linearGradient>
      ` : ''}
    </defs>
    <style>
      .card-bg { fill: ${bgFill}; stroke: ${theme.border}; stroke-width: 1.5; rx: ${borderRadius}; }
      .header-title { font-family: ${fontStyle}; font-size: 15px; font-weight: 700; fill: ${theme.primary}; }
      ${getAnimationStyles(animate, theme, width, height)}
    </style>
    
    <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
      <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    </g>

    ${getLayoutDecorations(layout, width, height, theme)}

    <g class="${itemClass} ${glitchClass} delay-1">
      <text x="25" y="38" class="header-title">Most Used Languages</text>
      ${githubLogo ? getGithubLogoSvg(theme, width - 40, 22, 18) : ''}
    </g>
    
    <g>${segments}</g>
    <g>${listItems}</g>

    <!-- Scanning Diagnostic light overlay -->
    ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
  </svg>`;
}

export function renderStreakCard(
  profile: GitHubProfile,
  themeInput?: string,
  animate: string = 'none',
  layout: string = 'classic',
  githubLogo: boolean = true
): string {
  const theme = getThemeById(themeInput);

  if (layout === 'gitskins') {
    const width = 520;
    const height = 145;
    const fontStyle = theme.font || "sans-serif";
    const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
    const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        ${animate === 'wave' ? `
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </linearGradient>
        ` : ''}
      </defs>
      <style>
        .outer-bg { fill: ${theme.bg}; stroke: ${theme.border}; stroke-width: 2; rx: 24; }
        .inner-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.2; rx: 14; }
        .text-title { font-family: ${fontStyle}; font-size: 21px; font-weight: 800; fill: #FFFFFF; }
        .text-username { font-family: ${fontStyle}; font-size: 11px; font-weight: 700; fill: ${theme.textMuted}; opacity: 0.85; }
        .stat-val { font-family: ${fontStyle}; font-size: 15px; font-weight: 800; fill: ${theme.accent}; }
        .stat-lbl { font-family: ${fontStyle}; font-size: 10px; font-weight: 600; fill: ${theme.textMuted}; text-transform: uppercase; }
        .streak-glowing { font-family: ${fontStyle}; font-size: 28px; font-weight: 900; fill: ${theme.accent}; }
        ${getAnimationStyles(animate, theme, width, height)}
      </style>
      
      <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
        <rect class="outer-bg" width="${width - 4}" height="${height - 4}" x="2" y="2"/>
        <rect class="inner-bg" width="${width - 30}" height="${height - 30}" x="15" y="15"/>
      </g>

      <!-- Swoosh arc behind username -->
      <path d="M 108 50 Q 170 38 230 52" stroke="${theme.primary}" stroke-width="1.5" opacity="0.45" fill="none" />

      <!-- Left side Circle with flame icon -->
      <g class="${itemClass} ${glitchClass} delay-1">
        <circle cx="62" cy="72" r="34" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2.5"/>
        <circle cx="62" cy="72" r="38" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.6" stroke-dasharray="8 4"/>
        <text x="62" y="80" class="streak-glowing" text-anchor="middle">🔥</text>
      </g>
      
      <g class="${itemClass} ${glitchClass} delay-2">
        <text x="110" y="46" class="text-username">@${escapeXml(profile.username)}</text>
        <text x="110" y="78" class="text-title">Active Commit Streak Tracker</text>
      </g>

      <!-- Stats Row -->
      <g transform="translate(110, 110)" class="${itemClass} ${glitchClass} delay-3">
        <g transform="translate(0, 0)">
          <text class="stat-val">${profile.currentStreak} Days</text>
          <text y="15" class="stat-lbl">Current Streak</text>
        </g>
        <g transform="translate(120, 0)">
          <text class="stat-val">${profile.longestStreak} Days</text>
          <text y="15" class="stat-lbl">Longest Streak</text>
        </g>
        <g transform="translate(240, 0)">
          <text class="stat-val">${profile.totalContributions}</text>
          <text y="15" class="stat-lbl">Total Contributions</text>
        </g>
      </g>

      <!-- Signature branding footer -->
      <text x="${width - 25}" y="${height - 8}" font-family="${fontStyle}" font-size="9.5" font-weight="600" fill="${theme.border}" opacity="0.8" text-anchor="end">gitskins.com</text>

      <!-- Scanning Diagnostic light overlay -->
      ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
    </svg>`;
  }

  const width = 440;
  const height = 180;

  const fontStyle = layout === 'cyber' ? "Menlo, Monaco, Consolas, monospace" : theme.font;
  const borderRadius = layout === 'cyber' ? '0' : layout === 'modern' ? '24' : '12';
  const bgFill = layout === 'modern' ? 'url(#modernGradStreak)' : theme.surface;

  const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
  const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <defs>
      <linearGradient id="modernGradStreak" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.surface}"/>
        <stop offset="100%" stop-color="${theme.surfaceSecondary}"/>
      </linearGradient>
      ${animate === 'wave' ? `
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </linearGradient>
      ` : ''}
    </defs>
    <style>
      .card-bg { fill: ${bgFill}; stroke: ${theme.border}; stroke-width: 1.5; rx: ${borderRadius}; }
      .title { font-family: ${fontStyle}; font-size: 15px; font-weight: 700; fill: ${theme.primary}; }
      .val { font-family: ${fontStyle}; font-size: 26px; font-weight: 800; fill: ${theme.text}; }
      .sub { font-family: ${fontStyle}; font-size: 11px; font-weight: 600; fill: ${theme.textMuted}; text-transform: uppercase; }
      ${getAnimationStyles(animate, theme, width, height)}
    </style>
    
    <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
      <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    </g>

    ${getLayoutDecorations(layout, width, height, theme)}

    <g class="${itemClass} ${glitchClass} delay-1">
      <text x="25" y="36" class="title">🔥 Commit Streak Tracker</text>
      ${githubLogo ? getGithubLogoSvg(theme, width - 40, 20, 18) : ''}
    </g>

    <!-- 3 Columns -->
    <g transform="translate(25, 70)" class="${itemClass} ${glitchClass} delay-2">
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

    ${layout !== 'modern' ? `<line x1="25" y1="135" x2="${width - 25}" y2="135" stroke="${theme.border}" stroke-width="1" stroke-dasharray="${layout === 'cyber' ? '4 4' : '0'}"/>` : ''}
    <text x="25" y="155" font-family="${fontStyle}" font-size="11" fill="${theme.textMuted}" class="${itemClass} delay-3">Keep code activity going strong with daily GitHub pushes!</text>

    <!-- Scanning Diagnostic light overlay -->
    ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
  </svg>`;
}

export function renderContributionsCard(
  profile: GitHubProfile,
  themeInput?: string,
  animate: string = 'none',
  layout: string = 'classic',
  githubLogo: boolean = true
): string {
  const theme = getThemeById(themeInput);

  if (layout === 'gitskins') {
    const width = 520;
    const height = 145;
    const fontStyle = theme.font || "sans-serif";
    const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
    const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

    const cols = 22;
    const rows = 5;
    const tileSize = 13;
    const gap = 3.5;

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
        
        const animDelay = (c * 0.02).toFixed(2);
        const styleAttr = animate === 'fade' || animate === 'slide' ? `style="animation-delay: ${animDelay}s; opacity: 0;"` : '';
        matrixSvg += `<rect class="${itemClass}" ${styleAttr} x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="2" fill="${fill}" fill-opacity="${opacity}"/>`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        ${animate === 'wave' ? `
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </linearGradient>
        ` : ''}
      </defs>
      <style>
        .outer-bg { fill: ${theme.bg}; stroke: ${theme.border}; stroke-width: 2; rx: 24; }
        .inner-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.2; rx: 14; }
        .text-title { font-family: ${fontStyle}; font-size: 18px; font-weight: 800; fill: #FFFFFF; }
        .text-username { font-family: ${fontStyle}; font-size: 11px; font-weight: 700; fill: ${theme.textMuted}; opacity: 0.85; }
        ${getAnimationStyles(animate, theme, width, height)}
      </style>
      
      <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
        <rect class="outer-bg" width="${width - 4}" height="${height - 4}" x="2" y="2"/>
        <rect class="inner-bg" width="${width - 30}" height="${height - 30}" x="15" y="15"/>
      </g>

      <g class="${itemClass} ${glitchClass} delay-1" transform="translate(25, 30)">
        <text class="text-username">@${escapeXml(profile.username)}</text>
        <text y="22" class="text-title">Contribution Matrix Graph</text>
      </g>

      <!-- Matrix translation -->
      <g transform="translate(130, 48)">
        ${matrixSvg}
      </g>

      <!-- Signature branding footer -->
      <text x="${width - 25}" y="${height - 8}" font-family="${fontStyle}" font-size="9.5" font-weight="600" fill="${theme.border}" opacity="0.8" text-anchor="end">gitskins.com</text>

      <!-- Scanning Diagnostic light overlay -->
      ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
    </svg>`;
  }

  const width = 500;
  const height = 180;

  const fontStyle = layout === 'cyber' ? "Menlo, Monaco, Consolas, monospace" : theme.font;
  const borderRadius = layout === 'cyber' ? '0' : layout === 'modern' ? '24' : '12';
  const bgFill = layout === 'modern' ? 'url(#modernGradContribs)' : theme.surface;

  const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
  const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

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
      
      const animDelay = (c * 0.02).toFixed(2);
      const styleAttr = animate === 'fade' || animate === 'slide' ? `style="animation-delay: ${animDelay}s; opacity: 0;"` : '';
      matrixSvg += `<rect class="${itemClass}" ${styleAttr} x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" rx="3" fill="${fill}" fill-opacity="${opacity}"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <defs>
      <linearGradient id="modernGradContribs" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.surface}"/>
        <stop offset="100%" stop-color="${theme.surfaceSecondary}"/>
      </linearGradient>
      ${animate === 'wave' ? `
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </linearGradient>
      ` : ''}
    </defs>
    <style>
      .card-bg { fill: ${bgFill}; stroke: ${theme.border}; stroke-width: 1.5; rx: ${borderRadius}; }
      .header-title { font-family: ${fontStyle}; font-size: 15px; font-weight: 700; fill: ${theme.text}; }
      .sub-title { font-family: ${fontStyle}; font-size: 12px; font-weight: 600; fill: ${theme.accent}; }
      ${getAnimationStyles(animate, theme, width, height)}
    </style>
    
    <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
      <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    </g>

    ${getLayoutDecorations(layout, width, height, theme)}

    <g class="${itemClass} ${glitchClass} delay-1">
      <text x="25" y="32" class="header-title">Contribution Matrix Graph</text>
      <text x="${width - (githubLogo ? 50 : 25)}" y="32" class="sub-title" text-anchor="end">${profile.totalContributions} Contributions</text>
      ${githubLogo ? getGithubLogoSvg(theme, width - 40, 16, 18) : ''}
    </g>

    <g transform="translate(25, 48)">
      ${matrixSvg}
    </g>

    <!-- Scanning Diagnostic light overlay -->
    ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
  </svg>`;
}

export function renderRepositoryCard(
  repoName: string,
  owner: string,
  themeInput?: string,
  animate: string = 'none',
  layout: string = 'classic',
  githubLogo: boolean = true
): string {
  const theme = getThemeById(themeInput);

  if (layout === 'gitskins') {
    const width = 520;
    const height = 145;
    const fontStyle = theme.font || "sans-serif";
    const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
    const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
      <defs>
        ${animate === 'wave' ? `
        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
          <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </linearGradient>
        ` : ''}
      </defs>
      <style>
        .outer-bg { fill: ${theme.bg}; stroke: ${theme.border}; stroke-width: 2; rx: 24; }
        .inner-bg { fill: ${theme.surface}; stroke: ${theme.border}; stroke-width: 1.2; rx: 14; }
        .text-title { font-family: ${fontStyle}; font-size: 21px; font-weight: 800; fill: #FFFFFF; }
        .text-username { font-family: ${fontStyle}; font-size: 11px; font-weight: 700; fill: ${theme.textMuted}; opacity: 0.85; }
        .text-desc { font-family: ${fontStyle}; font-size: 11.5px; font-weight: 500; fill: ${theme.textMuted}; opacity: 0.9; }
        .stat-val { font-family: ${fontStyle}; font-size: 13px; font-weight: 700; fill: ${theme.accent}; }
        .stat-lbl { font-family: ${fontStyle}; font-size: 10px; font-weight: 600; fill: ${theme.textMuted}; }
        ${getAnimationStyles(animate, theme, width, height)}
      </style>
      
      <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
        <rect class="outer-bg" width="${width - 4}" height="${height - 4}" x="2" y="2"/>
        <rect class="inner-bg" width="${width - 30}" height="${height - 30}" x="15" y="15"/>
      </g>

      <!-- Swoosh arc behind username -->
      <path d="M 108 50 Q 170 38 230 52" stroke="${theme.primary}" stroke-width="1.5" opacity="0.45" fill="none" />

      <!-- Left side Circle with package icon -->
      <g class="${itemClass} ${glitchClass} delay-1">
        <circle cx="62" cy="72" r="34" fill="${theme.surfaceSecondary}" stroke="${theme.primary}" stroke-width="2.5"/>
        <circle cx="62" cy="72" r="38" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.6" stroke-dasharray="8 4"/>
        <text x="62" y="80" font-size="28" text-anchor="middle">📦</text>
      </g>
      
      <g class="${itemClass} ${glitchClass} delay-2">
        <text x="110" y="46" class="text-username">@${escapeXml(owner)}</text>
        <text x="110" y="78" class="text-title">${escapeXml(repoName)}</text>
        <text x="110" y="98" class="text-desc">Production-ready developer identity engine &amp; profile kit.</text>
      </g>

      <!-- Stats Row -->
      <g transform="translate(110, 114)" class="${itemClass} ${glitchClass} delay-3">
        <circle cx="6" cy="-4" r="5" fill="${theme.accent}"/>
        <text x="18" y="0" class="stat-val" fill="#FFFFFF">TypeScript</text>

        <text x="140" y="0" class="stat-val">⭐ 240</text>
        <text x="220" y="0" class="stat-val">🍴 48</text>
      </g>

      <!-- Signature branding footer -->
      <text x="${width - 25}" y="${height - 8}" font-family="${fontStyle}" font-size="9.5" font-weight="600" fill="${theme.border}" opacity="0.8" text-anchor="end">gitskins.com</text>

      <!-- Scanning Diagnostic light overlay -->
      ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
    </svg>`;
  }

  const width = 400;
  const height = 140;

  const fontStyle = layout === 'cyber' ? "Menlo, Monaco, Consolas, monospace" : theme.font;
  const borderRadius = layout === 'cyber' ? '0' : layout === 'modern' ? '24' : '10';
  const bgFill = layout === 'modern' ? 'url(#modernGradRepo)' : theme.surface;

  const itemClass = (animate === 'fade' || animate === 'slide' || animate === 'glitch') ? 'animate-item' : '';
  const glitchClass = animate === 'glitch' ? 'glitch-item' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
    <defs>
      <linearGradient id="modernGradRepo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.surface}"/>
        <stop offset="100%" stop-color="${theme.surfaceSecondary}"/>
      </linearGradient>
      ${animate === 'wave' ? `
      <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="transparent" stop-opacity="0"/>
        <stop offset="50%" stop-color="${theme.accent}" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </linearGradient>
      ` : ''}
    </defs>
    <style>
      .card-bg { fill: ${bgFill}; stroke: ${theme.border}; stroke-width: 1.5; rx: ${borderRadius}; }
      .repo-name { font-family: ${fontStyle}; font-size: 16px; font-weight: 700; fill: ${theme.primary}; }
      .repo-desc { font-family: ${fontStyle}; font-size: 12px; fill: ${theme.textMuted}; }
      .stat-text { font-family: ${fontStyle}; font-size: 12px; font-weight: 600; fill: ${theme.text}; }
      ${getAnimationStyles(animate, theme, width, height)}
    </style>
    
    <g class="${animate === 'pulse' ? 'pulse-item' : animate === 'float' ? 'float-item' : ''}">
      <rect class="card-bg" width="${width - 3}" height="${height - 3}" x="1.5" y="1.5"/>
    </g>

    ${getLayoutDecorations(layout, width, height, theme)}

    <g class="${itemClass} ${glitchClass} delay-1">
      <text x="20" y="35" class="repo-name">📦 ${escapeXml(owner)} / ${escapeXml(repoName)}</text>
      ${githubLogo ? getGithubLogoSvg(theme, width - 40, 20, 18) : ''}
    </g>

    <g class="${itemClass} ${glitchClass} delay-2">
      <text x="20" y="60" class="repo-desc">Production-ready developer identity engine &amp; profile kit.</text>
    </g>

    <g transform="translate(20, 105)" class="${itemClass} ${glitchClass} delay-3">
      <circle cx="6" cy="-4" r="5" fill="${theme.accent}"/>
      <text x="18" y="0" class="stat-text">TypeScript</text>

      <text x="140" y="0" class="stat-text">⭐ 240</text>
      <text x="220" y="0" class="stat-text">🍴 48</text>
    </g>

    <!-- Scanning Diagnostic light overlay -->
    ${animate === 'wave' ? `<rect class="scanner-bar" x="2" y="2" width="${width - 4}" height="15" pointer-events="none" />` : ''}
  </svg>`;
}
