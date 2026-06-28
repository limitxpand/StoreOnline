'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../app/(store)/product/[slug]/product.module.css';

export default function ProductActions({ 
  productId, 
  downloadUrl, 
  productTitle, 
  isLoggedIn,
  demoVideoAdUrl
}: { 
  productId: string, 
  downloadUrl: string, 
  productTitle: string, 
  isLoggedIn?: boolean,
  demoVideoAdUrl?: string
}) {
  const [copied, setCopied] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const router = useRouter();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    if (demoVideoAdUrl && !adWatched) {
      setShowAdModal(true);
      return;
    }
    
    triggerDownload();
  };

  const triggerDownload = async () => {
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

  const handleVideoEnded = () => {
    setAdWatched(true);
    setShowAdModal(false);
    triggerDownload();
  };

  const getYoutubeEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/') + '?autoplay=1&controls=0&modestbranding=1';
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1&controls=0&modestbranding=1';
    }
    return url;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
      {isLoggedIn ? (
        <button 
          onClick={handleDownloadClick}
          className={styles.buyBtn} 
          style={{ textAlign: 'center', background: 'linear-gradient(90deg, #10b981, #047857)', border: 'none', cursor: 'pointer', color: 'white' }}
        >
          {demoVideoAdUrl && !adWatched ? '📺 Watch a short ad to unlock your Free Demo' : '⬇️ Direct Download'}
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

      {showAdModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '800px', width: '90%', position: 'relative' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>Please watch this short ad to support our platform...</h3>
            
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000', borderRadius: '12px' }}>
              {demoVideoAdUrl?.includes('youtube.com') || demoVideoAdUrl?.includes('youtu.be') ? (
                <iframe 
                  src={getYoutubeEmbedUrl(demoVideoAdUrl)} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video 
                  src={demoVideoAdUrl} 
                  autoPlay 
                  controls={false}
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsVideoPlaying(true)}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setShowAdModal(false)}
                style={{ padding: '0.8rem 1.5rem', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              {(demoVideoAdUrl?.includes('youtube.com') || demoVideoAdUrl?.includes('youtu.be')) && (
                <button 
                  onClick={handleVideoEnded}
                  style={{ padding: '0.8rem 1.5rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  I've finished watching (Download Now)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
