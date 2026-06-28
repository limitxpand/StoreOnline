import { prisma } from '@/lib/prisma';

export interface WebsiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  theme: string;
  primaryColor: string;
  enableAdsense: boolean;
  contactEmail: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  adsenseClientId?: string;
  logoUrl?: string;
  logoLightUrl?: string;
  faviconUrl?: string;
  faviconLightUrl?: string;
  floatingLogoUrl?: string;
  floatingLogoLightUrl?: string;
  logoRadius?: 'none' | 'rounded' | 'circle';
  logoRemoveBg?: boolean;
  floatingLogoRadius?: 'none' | 'rounded' | 'circle';
  floatingLogoRemoveBg?: boolean;
  floatingLogoShadow?: boolean;
  demoAdsenseCode?: string;
  demoAdTimer?: number;
  enableDemoAd?: boolean;
  injectionModuleUrl?: string;
}

export interface RoyaltySettings {
  platformCommission: number;
  minPayoutThreshold: number;
  payoutSchedule: string;
  autoApprovePayouts: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'smart_contract' | 'deposit_address';
  network: 'BEP20' | 'TRC20';
  address: string;
  currency: string;
}

export interface PaymentSettings {
  enableCrypto: boolean;
  walletConnectProjectId: string;
  paymentMethods: PaymentMethod[];
}

export interface AppSettings {
  website: WebsiteSettings;
  royalty: RoyaltySettings;
  payment: PaymentSettings;
}

const defaultSettings: AppSettings = {
  website: {
    siteName: "Store Online",
    heroTitle: "Premium Marketplace",
    heroSubtitle: "Buy and sell highly secure MT4/MT5 EA.",
    theme: "light",
    primaryColor: "#3b82f6",
    enableAdsense: false,
    contactEmail: "support@storeonline.com",
    metaDescription: "The Ultimate Marketplace for MT4, MT5 Experts, Indicators, Utilities and Android APKs. Download secure, license-protected software.",
    metaKeywords: "MT4, MT5, Expert Advisor, Trading Bot, MQL5, Android APK, Buy Software",
    ogImageUrl: "https://storeonline.in/og-image.jpg",
    adsenseClientId: "",
    logoUrl: "",
    logoLightUrl: "",
    faviconUrl: "",
    faviconLightUrl: "",
    floatingLogoUrl: "",
    floatingLogoLightUrl: "",
    logoRadius: "none",
    logoRemoveBg: false,
    floatingLogoRadius: "none",
    floatingLogoRemoveBg: false,
    floatingLogoShadow: false,
    demoAdsenseCode: "",
    demoAdTimer: 15,
    enableDemoAd: false,
    injectionModuleUrl: "https://dashboard-ff4p.vercel.app/"
  },
  royalty: {
    platformCommission: 15,
    minPayoutThreshold: 50,
    payoutSchedule: "weekly",
    autoApprovePayouts: false
  },
  payment: {
    enableCrypto: true,
    walletConnectProjectId: "fa5abff71a69afa7834481216b781e88",
    paymentMethods: [
      {
        id: "default-sc-bep20",
        type: "smart_contract",
        network: "BEP20",
        address: "", // Configured by admin
        currency: "USDT"
      }
    ]
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
  return settings.website || defaultSettings.website;
}

export async function getRoyaltySettings(): Promise<RoyaltySettings> {
  const settings = await getSettings();
  return settings.royalty || defaultSettings.royalty;
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const settings = await getSettings();
  return settings.payment || defaultSettings.payment;
}

export async function saveSettings(newSettings: Partial<AppSettings>) {
  try {
    const current = await getSettings();
    const updated = {
      ...current,
      ...newSettings,
      website: { ...current.website, ...newSettings.website },
      royalty: { ...current.royalty, ...newSettings.royalty },
      payment: { ...current.payment, ...newSettings.payment }
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
