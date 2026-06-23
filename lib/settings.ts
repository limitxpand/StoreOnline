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
    console.error('Error reading settings, using fallback:', error);
    // Return fallback settings to prevent 500 error in Vercel production
    return {
      admin: {
        username: "admin",
        password: "admin",
        secretCode: "333725"
      },
      website: {
        siteName: "Store Online",
        heroTitle: "Premium Marketplace",
        heroSubtitle: "Buy and sell highly secure MT4/MT5 EA.",
        theme: "light",
        primaryColor: "#3b82f6",
        enableAdsense: true,
        contactEmail: "support@storeonline.com"
      }
    };
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
    // In production Vercel, the file system is read-only, so this will fail.
    // For now, return the updated object so the UI doesn't crash, even though it's not persisted.
    const current = getSettings();
    return {
      admin: { ...current.admin, ...newSettings.admin },
      website: { ...current.website, ...newSettings.website }
    } as AppSettings;
  }
}
