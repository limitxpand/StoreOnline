'use client';
import { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { useSession } from 'next-auth/react';

export default function SellerSettings() {
  const { data: session } = useSession();
  const [bep20Address, setBep20Address] = useState('');
  const [bep20QrUrl, setBep20QrUrl] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [resetStatus, setResetStatus] = useState({ loading: false, message: '', type: '' });
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
        setUid(data.uid || '');
        if (data.bep20Address || data.bep20QrUrl) {
          setHasInitialData(true);
        }
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
    if (bep20QrUrl) {
      formData.append('oldFileUrl', bep20QrUrl);
    }
    
    try {
      const res = await fetch('/api/upload-image', {
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
        setHasInitialData(true);
      } else {
        setMessage({ text: data.error || 'Failed to save settings', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error occurred', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!session?.user?.email) return;
    setResetStatus({ loading: true, message: '', type: '' });
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email })
      });
      const data = await res.json();
      if (res.ok) {
        setResetStatus({ loading: false, message: 'Password reset link sent to your email via Resend!', type: 'success' });
      } else {
        setResetStatus({ loading: false, message: data.error || 'Failed to send link', type: 'error' });
      }
    } catch (error) {
      setResetStatus({ loading: false, message: 'Network error', type: 'error' });
    }
  };

  if (loading) return <div className={styles.panel}>Loading settings...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Account & Payment Settings</h1>
        <p>Update your BEP-20 (USDT/BNB) details and manage your account.</p>
        {uid && (
          <div style={{ marginTop: '1rem', display: 'inline-block', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong>Your Store UID:</strong> <span style={{ color: 'var(--accent-neon)', fontFamily: 'monospace' }}>{uid}</span>
          </div>
        )}
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
                color: 'var(--text-primary)'
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
            {saving ? 'Saving...' : hasInitialData ? 'Update Payment Details' : 'Save Payment Details'}
          </button>
        </form>
      </div>

      {/* Account Settings / Security Section */}
      <div className={styles.pageHeader} style={{ marginTop: '3rem' }}>
        <h1>Account Settings</h1>
        <p>Manage your account security and password.</p>
      </div>

      <div className={styles.panel} style={{ maxWidth: '600px' }}>
        {resetStatus.message && (
          <div style={{
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            background: resetStatus.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: resetStatus.type === 'success' ? 'var(--success)' : 'var(--danger)',
            border: `1px solid ${resetStatus.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
          }}>
            {resetStatus.message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Need to change your password? Click the button below and we will email you a secure reset link via Resend.
          </p>
          <button 
            onClick={handlePasswordReset}
            disabled={resetStatus.loading}
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              padding: '0.8rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: resetStatus.loading ? 0.7 : 1,
              width: 'fit-content'
            }}
          >
            {resetStatus.loading ? 'Sending...' : 'Change Password / Forgot Password'}
          </button>
        </div>
      </div>
    </div>
  );
}
