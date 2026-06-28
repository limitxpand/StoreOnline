'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../app/(store)/product/[slug]/product.module.css';
import CryptoPaymentModal from './CryptoPaymentModal';

export default function ProductActions({ 
  productId, 
  downloadUrl, 
  productTitle, 
  isLoggedIn,
  demoAdsenseCode,
  demoAdTimer = 15,
  price = 0,
  paymentSettings
}: { 
  productId: string, 
  downloadUrl: string, 
  productTitle: string, 
  isLoggedIn?: boolean,
  demoAdsenseCode?: string,
  demoAdTimer?: number,
  price?: number,
  paymentSettings?: any
}) {
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [timeLeft, setTimeLeft] = useState(demoAdTimer);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAdModal && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showAdModal, timeLeft]);

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
    
    // Show ad if configured
    if (demoAdsenseCode && !adWatched) {
      setShowAdModal(true);
      setTimeLeft(demoAdTimer);
      return;
    }
    
    triggerDownload();
  };

  const triggerDownload = async (txHash?: string) => {
    try {
      // Register purchase/download
      await fetch('/api/customer/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, txHash })
      });
      
      // Trigger download
      window.location.href = downloadUrl;
    } catch (error) {
      console.error('Error registering download:', error);
      window.location.href = downloadUrl;
    }
  };

  const handleAdFinished = () => {
    setAdWatched(true);
    setShowAdModal(false);
    triggerDownload();
  };

  const adFrameSource = demoAdsenseCode ? `
    <html>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_CLIENT_ID" crossorigin="anonymous"></script>
        <style>body { margin: 0; display: flex; justify-content: center; align-items: center; background: #000; height: 100vh; overflow: hidden; color: white; font-family: sans-serif; }</style>
      </head>
      <body>
        <div style="width: 100%; text-align: center;">
          ${demoAdsenseCode}
        </div>
      </body>
    </html>
  ` : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
      {isLoggedIn ? (
        <>
          {/* Always show the Free Demo Download Button */}
          <button 
            onClick={handleDownloadClick}
            className={styles.buyBtn} 
            style={{ textAlign: 'center', background: 'linear-gradient(90deg, #10b981, #047857)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            {demoAdsenseCode && !adWatched ? '🎁 View our Sponsor to unlock your Free Demo' : '⬇️ Download Free Demo'}
          </button>
          
          {/* Show Buy Now Button if price > 0 */}
          {price > 0 && (
            paymentSettings?.enableCrypto && paymentSettings?.paymentMethods?.length > 0 ? (
              <>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className={styles.buyBtn} 
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                    color: 'white', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💎</span> 
                  Buy Now with Crypto
                </button>
                <CryptoPaymentModal
                  isOpen={showPaymentModal}
                  onClose={() => setShowPaymentModal(false)}
                  price={price}
                  productId={productId}
                  paymentMethods={paymentSettings.paymentMethods}
                  walletConnectProjectId={paymentSettings.walletConnectProjectId}
                  onSuccess={(txHash) => {
                    if (txHash) triggerDownload(txHash);
                  }}
                />
              </>
            ) : (
              <button 
                className={styles.buyBtn} 
                style={{ textAlign: 'center', background: '#374151', border: 'none', cursor: 'not-allowed', color: 'var(--text-primary)' }}
                disabled
              >
                🔒 Purchasing Temporarily Disabled
              </button>
            )
          )}
        </>
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
          color: 'var(--text-primary)', 
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '800px', width: '90%', position: 'relative' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', textAlign: 'center' }}>
              {timeLeft > 0 ? `Your download will be ready in ${timeLeft} seconds...` : 'Your download is ready!'}
            </h3>
            
            <div style={{ position: 'relative', height: '400px', overflow: 'hidden', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
              <iframe 
                srcDoc={adFrameSource}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setShowAdModal(false)}
                style={{ padding: '0.8rem 1.5rem', background: '#374151', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAdFinished}
                disabled={timeLeft > 0}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  background: timeLeft > 0 ? '#4b5563' : 'linear-gradient(90deg, #10b981, #047857)', 
                  color: 'var(--text-primary)', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: timeLeft > 0 ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s'
                }}
              >
                {timeLeft > 0 ? `Wait ${timeLeft}s` : 'Download Now ⬇️'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
