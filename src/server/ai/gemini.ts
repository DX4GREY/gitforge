import { GoogleGenAI } from '@google/genai';
import { GitHubProfile, ProfileIntelligenceResult, ProjectPersonaResult } from '../../types';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function generateAIReadme(
  profile: GitHubProfile,
  style: string,
  sections: string[],
  baseUrl: string = 'https://gitforge.ai.studio',
  theme: string = 'midnight'
): Promise<string> {
  const ai = getAIClient();
  if (!ai) {
    return generateFallbackReadme(profile, style, sections, baseUrl, theme);
  }

  try {
    const prompt = `You are GitForge's AI Developer Agent. Generate an outstanding GitHub Profile README.md for user @${profile.username} (${profile.name || profile.username}).
Style requested: ${style}
Theme requested for SVG stats cards/widgets (use &theme=${theme} parameter): ${theme}
Include sections: ${sections.join(', ')}

User stats context:
- Bio: ${profile.bio}
- Company: ${profile.company}
- Location: ${profile.location}
- Repositories: ${profile.publicRepos}
- Stars: ${profile.starsCount}
- Top Languages: ${profile.languages.map((l) => l.name).join(', ')}
- Pinned repos: ${profile.pinnedRepos.map((r) => r.name + ': ' + r.description).join('; ')}

Return strictly valid Markdown without wrapping in outer json keys. Make sure to use SVG badges from shields.io, stats widgets embeds from ${baseUrl}/api/card/* (always append ?username=${profile.username}&theme=${theme} to all card URLs), tech stack badges, and formatted project showcases. 
Please write high-quality, beautifully structured developer markdown. Feature the metadata tag at the top: **Theme:** ${theme} · **Style:** ${style} · **Agent:** Full-Stack Engineer.
Footer link should be [GitForge](${baseUrl}).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
    return generateFallbackReadme(profile, style, sections, baseUrl, theme);
  } catch (err) {
    console.warn('[GitForge AI] Gemini call failed, using deterministic fallback:', err);
    return generateFallbackReadme(profile, style, sections, baseUrl, theme);
  }
}

export async function generateProfileIntelligence(
  profile: GitHubProfile
): Promise<ProfileIntelligenceResult> {
  const ai = getAIClient();
  if (!ai) {
    return generateFallbackIntelligence(profile);
  }

  try {
    const prompt = `Analyze this GitHub profile and provide structured JSON assessment:
Username: ${profile.username}
Name: ${profile.name}
Bio: ${profile.bio}
Public Repos: ${profile.publicRepos}
Stars: ${profile.starsCount}
Languages: ${profile.languages.map((l) => `${l.name} (${l.percentage}%)`).join(', ')}
Pinned Repos: ${profile.pinnedRepos.map((r) => r.name).join(', ')}

Return a JSON object with:
- score: number 0-100
- archetype: concise title (e.g., "Full-Stack Systems Architect")
- summary: paragraph evaluation
- strengths: string array (3 items)
- growthAreas: string array (2 items)
- techFocus: string array (4 items)
- openSourceImpact: short statement
- recommendations: string array (3 items)
- readmeSuggestions: string array (2 items)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as ProfileIntelligenceResult;
    }
    return generateFallbackIntelligence(profile);
  } catch (err) {
    console.warn('[GitForge AI Intelligence] Gemini call failed, using fallback:', err);
    return generateFallbackIntelligence(profile);
  }
}

export async function generateProjectPersona(
  repoName: string,
  description: string,
  language: string,
  stars: number
): Promise<ProjectPersonaResult> {
  const ai = getAIClient();
  if (!ai) {
    return generateFallbackProjectPersona(repoName, description, language, stars);
  }

  try {
    const prompt = `Generate a creative Project Persona for repository "${repoName}".
Description: ${description}
Language: ${language}
Stars: ${stars}

Return a JSON object:
- projectName: string
- mascotName: string (e.g., "Rusty the Titan")
- archetype: string (e.g., "High-Performance Speed Demon")
- tagline: string
- traits: string array (3 items)
- visualStyle: string (e.g., "Cyberpunk Dark Metal")
- colorPalette: string array of hex colors
- personalityDescription: paragraph
- readmeBadgeMarkdown: markdown snippet
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as ProjectPersonaResult;
    }
    return generateFallbackProjectPersona(repoName, description, language, stars);
  } catch (err) {
    return generateFallbackProjectPersona(repoName, description, language, stars);
  }
}

/* Fallback Generator Methods */

export function generateFallbackReadme(
  profile: GitHubProfile,
  style: string,
  sections: string[],
  baseUrl: string = 'https://gitforge.ai.studio',
  theme: string = 'midnight'
): string {
  const name = profile.name || profile.username;
  const topLangs = profile.languages.map((l) => l.name).join(', ');

  // Standard metadata tags inspired by the user's template
  let md = `# ${name}\n\n`;
  md += `> ${profile.bio || 'Building open source projects and shipping software.'}\n\n`;
  md += `**Theme:** ${theme.toUpperCase()} · **Style:** ${style} · **Agent:** Full-Stack Engineer\n\n`;

  if (style === 'Recruiter-friendly') {
    // Elegant recruiter-friendly layout with picture-perfect centering and header block
    if (sections.includes('Header') || sections.includes('About')) {
      md += `## 👤 Professional Profile\n`;
      md += `> Tuned for recruiters looking to get in touch and evaluate proof of work.\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/profile?username=${profile.username}&theme=${theme}" alt="${profile.username} profile" />\n`;
      md += `</p>\n\n`;
      md += `Hi, I'm **${name}**. This README highlights my skills and projects using a beautiful visual telemetry card system. Let's build something exceptional!\n\n`;
    }

    if (sections.includes('About')) {
      md += `### 🏢 About Me\n\n`;
      md += `- 🔭 Currently working on **${profile.pinnedRepos[0]?.name || 'Modern Scalable Applications'}**\n`;
      if (profile.company) md += `- 🏢 Employed at **${profile.company}**\n`;
      if (profile.location) md += `- 📍 Based out of **${profile.location}**\n`;
      md += `- 💬 Let's discuss **${topLangs || 'TypeScript, React, Go, Systems Architecture'}**\n`;
      if (profile.website) md += `- 🌐 Portfolio Site: [${profile.website}](${profile.website})\n`;
      md += `\n`;
    }

    if (sections.includes('Tech Stack')) {
      md += `## 🛠 Core Competencies\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> \n`;
      md += `  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> \n`;
      md += `  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" /> \n`;
      md += `  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" /> \n`;
      md += `  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />\n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('GitHub Stats')) {
      md += `## 📊 Verified Platform Performance\n`;
      md += `> Real-time GitHub engine telemetry.\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/stats?username=${profile.username}&theme=${theme}" alt="${profile.username}'s GitHub Stats" />\n`;
      md += `  <img src="${baseUrl}/api/card/languages?username=${profile.username}&theme=${theme}" alt="${profile.username}'s Top Languages" />\n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('Contribution graph')) {
      md += `### 🔥 Continuous Deployment Velocity\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/streak?username=${profile.username}&theme=${theme}" alt="${profile.username}'s Streak" />\n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('Featured Projects') && profile.pinnedRepos.length > 0) {
      md += `## 🌟 Featured Engineering Works\n\n`;
      profile.pinnedRepos.slice(0, 3).forEach((repo) => {
        md += `### 📂 [${repo.name}](${repo.url})\n`;
        md += `> ${repo.description || 'Production-grade software build.'}\n\n`;
        md += `\`${repo.language || 'Code'}\` | ⭐ **${repo.stars}** stars | 🍴 **${repo.forks}** forks\n\n`;
      });
    }

    if (sections.includes('Contact')) {
      md += `## 📞 Get In Touch\n\n`;
      md += `If you are looking for a reliable, growth-oriented engineer to join your engineering crew, reach out:\n\n`;
      md += `<p align="center">\n`;
      md += `  <a href="https://github.com/${profile.username}"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>\n`;
      if (profile.twitterUsername) {
        md += `  <a href="https://twitter.com/${profile.twitterUsername}"><img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" /></a>\n`;
      }
      md += `</p>\n\n`;
    }

  } else if (style === 'Technical') {
    // Highly technical detailed specifications & system specs layout
    if (sections.includes('Header')) {
      md += `### \`System Specifications: @${profile.username}\`\n`;
      md += `\`\`\`bash\n`;
      md += `Host: GitForge Core Engine v1.0.0\n`;
      md += `User: ${profile.username}\n`;
      md += `Repos: ${profile.publicRepos} | Stars: ${profile.starsCount}\n`;
      md += `Base: ${profile.location || 'Localhost'}\n`;
      md += `\`\`\`\n\n`;
    }

    if (sections.includes('About')) {
      md += `## 🔌 Hardware & System Status\n\n`;
      md += `- **Active Sub-System:** Working on \`${profile.pinnedRepos[0]?.name || 'main-microservice'}\`\n`;
      md += `- **Tech Stack Stack:** \`${topLangs || 'TypeScript, ESM, Node, Docker'}\`\n`;
      if (profile.company) md += `- **Firmware Instance:** @\`${profile.company}\`\n`;
    }

    if (sections.includes('GitHub Stats') || sections.includes('Languages')) {
      md += `## 📊 Processor & Memory Telemetry\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/languages?username=${profile.username}&theme=${theme}" alt="Languages Telemetry" />\n`;
      md += `  <img src="${baseUrl}/api/card/stats?username=${profile.username}&theme=${theme}" alt="Engine Stats" />\n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('Featured Projects') && profile.pinnedRepos.length > 0) {
      md += `## 📦 Compiled Modules\n\n`;
      profile.pinnedRepos.forEach((repo) => {
        md += `### 🛠️ [\`${repo.name}\`](${repo.url})\n`;
        md += `> ${repo.description || 'Sub-assembly repo.'}\n`;
        md += `\`\`\`yaml\n`;
        md += `runtime: ${repo.language || 'Native'}\n`;
        md += `popularity: ⭐ ${repo.stars} | forks: ${repo.forks}\n`;
        md += `\`\`\`\n\n`;
      });
    }

  } else if (style === 'Minimal') {
    // Sleek, text-heavy layout with minimal distractions
    md += `Hi, I'm **${name}**. ${profile.bio || 'Software engineer and designer.'}\n\n`;

    if (sections.includes('GitHub Stats')) {
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/stats?username=${profile.username}&theme=${theme}" alt="Stats Card" />\n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('About')) {
      md += `### Focus\n`;
      md += `Building high-performance web applications with a focus on code design and modular systems.\n\n`;
    }

  } else if (style === 'Creative') {
    // Aesthetic, stylized layout with bold headers and center-aligned grid cards
    md += `<p align="center">\n`;
    md += `  <img src="${baseUrl}/api/card/profile?username=${profile.username}&theme=${theme}" alt="Aesthetic Profile" />\n`;
    md += `</p>\n\n`;

    md += `<h1 align="center">✨ ${name} ✨</h1>\n`;
    md += `<p align="center"><em>${profile.bio || 'Weaving code into elegant interfaces and visual masterpieces.'}</em></p>\n\n`;

    if (sections.includes('Tech Stack')) {
      md += `<h3 align="center">🔮 My Creative Toolkit</h3>\n`;
      md += `<p align="center">\n`;
      md += `  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" /> \n`;
      md += `  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> \n`;
      md += `  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> \n`;
      md += `  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" /> \n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('GitHub Stats')) {
      md += `<h3 align="center">🌈 Platform Vibes</h3>\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/stats?username=${profile.username}&theme=${theme}" alt="Stats Card" />\n`;
      md += `  <img src="${baseUrl}/api/card/streak?username=${profile.username}&theme=${theme}" alt="Streak" />\n`;
      md += `</p>\n\n`;
    }

  } else if (style === 'Open Source') {
    // Focused on community contributions, issues, streaks, and sponsorships
    md += `## 🌍 Open Source Advocate & Maintainer\n\n`;
    md += `I spend my time building developer tooling, contributing to libraries, and publishing open-source components.\n\n`;

    if (sections.includes('Contribution graph')) {
      md += `### ⚡ Contribution Flow\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/streak?username=${profile.username}&theme=${theme}" alt="Streak" />\n`;
      md += `</p>\n\n`;
    }

    if (sections.includes('GitHub Stats')) {
      md += `### 📊 Open Source Metrics\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/stats?username=${profile.username}&theme=${theme}" alt="OS Stats" />\n`;
      md += `</p>\n\n`;
    }

  } else {
    // Standard default template
    if (sections.includes('About')) {
      md += `## 🚀 About Me\n\n`;
      md += `- 🔭 Currently working on **${profile.pinnedRepos[0]?.name || 'Web & Systems Applications'}**\n`;
      if (profile.company) md += `- 🏢 Working at **${profile.company}**\n`;
      if (profile.location) md += `- 📍 Based in **${profile.location}**\n`;
      md += `- 💬 Ask me about **${topLangs || 'TypeScript, React, Node.js'}**\n`;
      if (profile.website) md += `- 🌐 Portfolio & Blog: [${profile.website}](${profile.website})\n`;
      md += `\n`;
    }

    if (sections.includes('Tech Stack')) {
      md += `## 🛠 Tech Stack & Tools\n\n`;
      md += `![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) `;
      md += `![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) `;
      md += `![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) `;
      md += `![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)\n\n`;
    }

    if (sections.includes('GitHub Stats')) {
      md += `## 📊 GitHub Analytics\n\n`;
      md += `<p align="center">\n`;
      md += `  <img src="${baseUrl}/api/card/stats?username=${profile.username}&theme=${theme}" alt="Stats" />\n`;
      md += `  <img src="${baseUrl}/api/card/languages?username=${profile.username}&theme=${theme}" alt="Languages" />\n`;
      md += `</p>\n\n`;
    }
  }

  md += `---\n*Generated with ⚡ [GitForge](${baseUrl}) — The Developer Identity Platform*\n`;

  return md;
}

export function generateFallbackIntelligence(
  profile: GitHubProfile
): ProfileIntelligenceResult {
  const langCount = profile.languages.length;
  const stars = profile.starsCount;
  const contribs = profile.totalContributions;

  let score = Math.min(Math.round(50 + stars * 0.2 + contribs * 0.02 + profile.publicRepos * 0.5), 98);
  if (score < 65) score = 72;

  const primaryLang = profile.languages[0]?.name || 'TypeScript';

  return {
    score,
    archetype: `${primaryLang} Systems Specialist`,
    summary: `@${profile.username} demonstrates solid activity with ${profile.publicRepos} public repositories and an active output in ${primaryLang}. Repositories show good modularity and consistent commit frequency.`,
    strengths: [
      `High consistency in ${primaryLang} development`,
      `Strong project repository diversity (${profile.publicRepos} repos)`,
      `Active engagement in open source contribution workflows`
    ],
    growthAreas: [
      'Increase documentation and README depth for pinned repositories',
      'Expand automated GitHub Actions CI/CD workflows across top repos'
    ],
    techFocus: profile.languages.slice(0, 4).map((l) => l.name),
    openSourceImpact: `Earned ${profile.starsCount} stars and ${profile.forksCount} forks across public repositories.`,
    recommendations: [
      'Add comprehensive LICENSE and issue template files to top repositories',
      'Feature live deployment URLs in repo homepages',
      'Embed GitForge SVG cards in profile README for instant recruiter visibility'
    ],
    readmeSuggestions: [
      'Include a dedicated Tech Stack badge matrix',
      'Highlight top 3 repositories with star/fork counters'
    ]
  };
}

export function generateFallbackProjectPersona(
  repoName: string,
  description: string,
  language: string,
  stars: number
): ProjectPersonaResult {
  return {
    projectName: repoName,
    mascotName: `${repoName.charAt(0).toUpperCase() + repoName.slice(1)} Sentinel`,
    archetype: 'High-Performance Engine',
    tagline: description || 'Engineered for scalability and clean developer experience.',
    traits: ['Robust', 'High-Speed', 'Modular'],
    visualStyle: 'Cyberpunk Obsidian',
    colorPalette: ['#3b82f6', '#10b981', '#06b6d4', '#1f2937'],
    personalityDescription: `The ${repoName} project embodies precision engineering in ${language || 'TypeScript'}. Designed with high reliability and clean architectural abstractions.`,
    readmeBadgeMarkdown: `![${repoName} Persona](https://img.shields.io/badge/Project_Persona-Sentinel-3b82f6?style=for-the-badge&logo=github)`
  };
}
