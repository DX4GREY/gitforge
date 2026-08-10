import { GitHubProfile, ProfileIntelligenceResult, ProjectPersonaResult } from '../types';

export async function getGitHubProfile(username: string): Promise<GitHubProfile> {
  const res = await fetch(`/api/github/${encodeURIComponent(username)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch GitHub user' }));
    throw new Error(err.error || 'Failed to load GitHub profile');
  }
  return res.json();
}

export async function generateAIReadmeApi(
  username: string,
  style: string,
  sections: string[]
): Promise<string> {
  const res = await fetch('/api/ai/readme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, style, sections }),
  });
  if (!res.ok) {
    throw new Error('Failed to generate AI README');
  }
  const data = await res.json();
  return data.markdown;
}

export async function fetchProfileIntelligenceApi(username: string): Promise<ProfileIntelligenceResult> {
  const res = await fetch('/api/ai/intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    throw new Error('Failed to analyze profile intelligence');
  }
  return res.json();
}

export async function fetchProjectPersonaApi(
  repoName: string,
  description: string,
  language: string,
  stars: number
): Promise<ProjectPersonaResult> {
  const res = await fetch('/api/ai/project-persona', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoName, description, language, stars }),
  });
  if (!res.ok) {
    throw new Error('Failed to generate project persona');
  }
  return res.json();
}
