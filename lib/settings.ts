import { prisma } from '@/lib/prisma';

export interface WebsiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  theme: string;
  primaryColor: string;
  enableAdsense: boolean;
  contactEmail: string;
}

export interface AppSettings {
  website: WebsiteSettings;
}

const defaultSettings: AppSettings = {
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

export async function getSettings(): Promise<AppSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { id: 'global' }
    });
    
    if (setting && setting.data) {
      return setting.data as unknown as AppSettings;
    }
    
    return defaultSettings;
  } catch (error) {
    console.error('Error reading settings from DB, using fallback:', error);
    return defaultSettings;
  }
}

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const settings = await getSettings();
  return settings.website;
}

export async function saveSettings(newSettings: Partial<AppSettings>) {
  try {
    const current = await getSettings();
    const updated = {
      website: { ...current.website, ...newSettings.website }
    };
    
    await prisma.setting.upsert({
      where: { id: 'global' },
      update: { data: updated as any },
      create: {
        id: 'global',
        data: updated as any
      }
    });
    
    return updated;
  } catch (error) {
    console.error('Error saving settings to DB:', error);
    return defaultSettings;
  }
}
