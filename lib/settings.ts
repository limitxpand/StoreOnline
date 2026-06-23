import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'database', 'mock_settings.json');

export interface WebsiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  theme: string;
  primaryColor: string;
  enableAdsense: boolean;
  contactEmail: string;
}

export interface AdminCredentials {
  username: string;
  password?: string;
  secretCode?: string;
}

export interface AppSettings {
  admin: AdminCredentials;
  website: WebsiteSettings;
}

export function getSettings(): AppSettings {
  try {
    const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings:', error);
    throw new Error('Failed to load settings');
  }
}

export function getWebsiteSettings(): WebsiteSettings {
  return getSettings().website;
}

export function saveSettings(newSettings: Partial<AppSettings>) {
  try {
    const current = getSettings();
    const updated = {
      admin: { ...current.admin, ...newSettings.admin },
      website: { ...current.website, ...newSettings.website }
    };
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Failed to save settings');
  }
}
