import fs from 'fs';
import path from 'path';
import { GitHubProfile, GitHubDeepUserData } from '../../types';

export interface SyncedUser {
  id: number | string;
  login: string;
  name: string;
  avatarUrl: string;
  email: string | null;
  authMethod: 'oauth' | 'pat' | 'demo';
  lastSyncedAt: string;
  profileData?: GitHubProfile;
  deepUserData?: GitHubDeepUserData;
}

export interface DatabaseSchema {
  activeUserLogin: string | null;
  users: Record<string, SyncedUser>;
  updatedAt: string;
}

const DB_PATH = path.join(process.cwd(), 'data', 'gitforge_db.json');

function ensureDbFile(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initial: DatabaseSchema = {
        activeUserLogin: null,
        users: {},
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const content = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error('Database read error:', err);
    return { activeUserLogin: null, users: {}, updatedAt: new Date().toISOString() };
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Database save error:', err);
  }
}

export function syncUserToDb(
  deepUser: Partial<GitHubDeepUserData> & { login: string; id?: number },
  profileData?: GitHubProfile,
  authMethod: 'oauth' | 'pat' | 'demo' = 'oauth'
): SyncedUser {
  const db = ensureDbFile();
  const key = deepUser.login.toLowerCase();

  const existing = db.users[key];
  const syncedUser: SyncedUser = {
    id: deepUser.id || existing?.id || Date.now(),
    login: deepUser.login,
    name: deepUser.name || deepUser.login,
    avatarUrl: deepUser.avatarUrl || profileData?.avatarUrl || existing?.avatarUrl || '',
    email: deepUser.email || existing?.email || null,
    authMethod,
    lastSyncedAt: new Date().toISOString(),
    profileData: profileData || existing?.profileData,
    deepUserData: (deepUser as GitHubDeepUserData) || existing?.deepUserData,
  };

  db.users[key] = syncedUser;
  db.activeUserLogin = deepUser.login;
  saveDb(db);

  return syncedUser;
}

export function getSyncedUser(login: string): SyncedUser | null {
  const db = ensureDbFile();
  return db.users[login.toLowerCase()] || null;
}

export function getActiveSyncedUser(): SyncedUser | null {
  const db = ensureDbFile();
  if (db.activeUserLogin && db.users[db.activeUserLogin.toLowerCase()]) {
    return db.users[db.activeUserLogin.toLowerCase()];
  }
  const keys = Object.keys(db.users);
  if (keys.length > 0) {
    return db.users[keys[0]];
  }
  return null;
}

export function getAllSyncedUsers(): SyncedUser[] {
  const db = ensureDbFile();
  return Object.values(db.users);
}
