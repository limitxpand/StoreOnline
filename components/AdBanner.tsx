import styles from './AdBanner.module.css';

interface AdBannerProps {
  slotId?: string; // E.g., '1234567890' for AdSense slot
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdBanner({ slotId, format = 'auto', className = '' }: AdBannerProps) {
  // In a real application, you would load the Google AdSense script globally
  // and use <ins className="adsbygoogle" ... /> here.
  // For the MVP, we use a placeholder that fits the premium design.

  return (
    <div className={`${styles.adContainer} ${className}`}>
      <div className={styles.adPlaceholder}>
        <span className={styles.adBadge}>ADVERTISEMENT</span>
        <div className={styles.adContent}>
          <span className={styles.adIcon}>📢</span>
          <p>Google AdSense Placeholder</p>
          <small>Slot: {slotId || 'Default'}</small>
        </div>
      </div>
    </div>
  );
}
