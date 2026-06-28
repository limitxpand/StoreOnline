'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../app/(store)/product/[slug]/product.module.css';

export default function ProductActions({ productId, downloadUrl, productTitle, isLoggedIn }: { productId: string, downloadUrl: string, productTitle: string, isLoggedIn?: boolean }) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    try {
      // Register purchase/download
      await fetch('/api/customer/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      
      // Trigger download
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('Error registering download:', error);
      window.location.href = downloadUrl;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
      {isLoggedIn ? (
        <button 
          onClick={handleDownload}
          className={styles.buyBtn} 
          style={{ textAlign: 'center', background: 'linear-gradient(90deg, #10b981, #047857)', border: 'none', cursor: 'pointer', color: 'white' }}
        >
          ⬇️ Direct Download
        </button>
      ) : (
        <button 
          onClick={() => router.push('/login')}
          className={styles.buyBtn} 
          style={{ textAlign: 'center', background: 'linear-gradient(90deg, #10b981, #047857)', border: 'none', cursor: 'pointer' }}
        >
          🔒 Login to Download
        </button>
      )}
      
      <button 
        onClick={handleShare}
        style={{ 
          background: 'var(--bg-tertiary)', 
          color: 'white', 
          border: '1px solid var(--border-color)', 
          padding: '0.8rem', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s'
        }}
      >
        {copied ? '✅ Link Copied!' : '🔗 Share Link'}
      </button>

      <div className={styles.guarantee} style={{ justifyContent: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '1.2rem' }}>🛡️</span>
        <span>Secure download. Protected by StoreOnline.</span>
      </div>
    </div>
  );
}
