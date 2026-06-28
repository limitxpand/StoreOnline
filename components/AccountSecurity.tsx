'use client';
import { useState } from 'react';
import styles from '@/app/dashboard/dashboard.module.css';

export default function AccountSecurity({ email }: { email: string }) {
  const [resetStatus, setResetStatus] = useState({ loading: false, message: '', type: '' });

  const handlePasswordReset = async () => {
    if (!email) return;
    setResetStatus({ loading: true, message: '', type: '' });
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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

  return (
    <>
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
              color: 'white',
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
    </>
  );
}
