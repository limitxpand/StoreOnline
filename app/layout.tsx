import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

import { getWebsiteSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings();
  
  return {
    title: settings.siteName || 'Store Online - Digital Product Marketplace',
    description: settings.metaDescription || 'The Ultimate Marketplace for MT4, MT5 Experts, Indicators, Utilities and Android APKs. Download secure, license-protected software.',
    keywords: settings.metaKeywords || 'MT4, MT5, Expert Advisor, Trading Bot, MQL5, Android APK, Buy Software, Store Online',
    openGraph: {
      title: settings.siteName || 'Store Online - Premium Marketplace',
      description: settings.metaDescription || 'Buy and sell premium license-protected trading bots, indicators, and software.',
      url: 'https://storeonline.in',
      siteName: settings.siteName || 'Store Online',
      images: [
        {
          url: settings.ogImageUrl || 'https://storeonline.in/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteName || 'Store Online Marketplace',
      description: settings.metaDescription || 'Buy and sell premium license-protected software.',
    },
    icons: (settings.faviconLightUrl || settings.faviconUrl) ? {
      icon: settings.faviconLightUrl || settings.faviconUrl || '',
      shortcut: settings.faviconLightUrl || settings.faviconUrl || '',
      apple: settings.faviconLightUrl || settings.faviconUrl || '',
    } : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getWebsiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
              } else {
                document.documentElement.removeAttribute('data-theme');
              }
            } catch (e) {}
          `
        }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no" />
        {settings.enableAdsense && settings.adsenseClientId && (
          <script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsenseClientId}`}
            crossOrigin="anonymous"
          ></script>
        )}
        {settings.adsenseClientId && (
          <meta name="google-adsense-account" content={settings.adsenseClientId} />
        )}
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
