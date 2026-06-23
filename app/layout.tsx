import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Store Online - Digital Product Marketplace',
  description: 'The Ultimate Marketplace for MT4, MT5 Experts, Indicators, Utilities and Android APKs. Download secure, license-protected software.',
  keywords: 'MT4, MT5, Expert Advisor, Trading Bot, MQL5, Android APK, Buy Software, Store Online',
  openGraph: {
    title: 'Store Online - Premium Marketplace',
    description: 'Buy and sell premium license-protected trading bots, indicators, and software.',
    url: 'https://storeonline.com',
    siteName: 'Store Online',
    images: [
      {
        url: 'https://storeonline.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Store Online Marketplace',
    description: 'Buy and sell premium license-protected software.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics & AdSense scripts would be injected here in production */}
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
