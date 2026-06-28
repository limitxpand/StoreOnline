import styles from './AdBanner.module.css';
import { getWebsiteSettings } from '@/lib/settings';

interface AdBannerProps {
  slotId?: string; // E.g., '1234567890' for AdSense slot
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default async function AdBanner({ slotId, format = 'auto', className = '' }: AdBannerProps) {
  const settings = await getWebsiteSettings();

  if (!settings.enableAdsense || !settings.adsenseClientId) {
    return null; // Do not show anything if ads are disabled or client ID is missing
  }

  return (
    <div className={`${styles.adContainer} ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={settings.adsenseClientId}
        data-ad-slot={slotId || "default_slot"}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
      <script dangerouslySetInnerHTML={{ __html: '(window.adsbygoogle = window.adsbygoogle || []).push({});' }} />
    </div>
  );
}
