'use client';
import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { useSession } from 'next-auth/react';

export default function SellerSettings() {
  const { data: session } = useSession();
  const [bep20Address, setBep20Address] = useState('');
  const [bep20QrUrl, setBep20QrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/dashboard/settings');
      if (res.ok) {
        const data = await res.json();
        setBep20Address(data.bep20Address || '');
        setBep20QrUrl(data.bep20QrUrl || '');
      }
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setBep20QrUrl(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      alert('Upload failed due to network error');
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bep20Address, bep20QrUrl })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save settings', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.panel}>Loading settings...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Payment Settings</h1>
        <p>Update your BEP-20 (USDT/BNB) details to receive royalties.</p>
      </div>

      <div className={styles.panel} style={{ maxWidth: '600px' }}>
        {message.text && (
          <div style={{
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              BEP-20 Wallet Address (USDT/BNB)
            </label>
            <input 
              type="text" 
              value={bep20Address}
              onChange={(e) => setBep20Address(e.target.value)}
              placeholder="0x..."
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-tertiary)',
                color: 'white'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              BEP-20 QR Code (Optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              {bep20QrUrl ? (
                <img 
                  src={bep20QrUrl} 
                  alt="QR Code" 
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              ) : (
                <div style={{ width: '120px', height: '120px', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
                  No QR
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Upload a screenshot of your wallet's QR code to make it easier for admin to pay you.
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={saving}
            style={{
              background: 'var(--accent-neon)',
              color: 'black',
              padding: '0.8rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Payment Details'}
          </button>
        </form>
      </div>
    </div>
  );
}
