'use client';

import { useState } from 'react';
import styles from './product.module.css';

interface ProductButtonsProps {
  downloadUrl: string;
}

export default function ProductButtons({ downloadUrl }: ProductButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      <a 
        href={downloadUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.buyBtn} 
        style={{ textAlign: 'center', background: 'linear-gradient(90deg, #10b981, #047857)', width: '100%', textDecoration: 'none' }}
      >
        ⬇️ Direct Download
      </a>

      <button 
        onClick={handleShare}
        className={styles.buyBtn} 
        style={{ 
          background: 'var(--bg-tertiary)', 
          border: '1px solid var(--border-color)', 
          color: 'var(--text-primary)',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        {copied ? '✅ Link Copied!' : '🔗 Share Link'}
      </button>
    </div>
  );
}
