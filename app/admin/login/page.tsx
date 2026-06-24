'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '../../auth.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Forgot state
  const [secretCode, setSecretCode] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: username,
        password: password,
      });
      
      if (res?.ok && !res.error) {
        // Double check session to ensure it is actually admin? We can trust the backend handles this or do client-side check if needed, but routing takes care of it.
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password', secretCode, newPassword, newUsername })
      });
      const data = await res.json();
      
      if (data.success) {
        // Sign in using NextAuth to actually establish the session!
        const signInRes = await signIn('credentials', {
          redirect: false,
          email: newUsername,
          password: newPassword,
        });

        if (signInRes?.ok && !signInRes.error) {
          alert('Credentials reset successfully. You are now logged in.');
          router.push('/admin/dashboard');
        } else {
           setError('Password reset successful, but auto-login failed. Please login manually.');
        }
      } else {
        setError(data.message || 'Reset failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      
      <div className={styles.authCard}>
        <div className={styles.logo}>
          <span style={{ fontSize: '2.5rem' }}>🛡️</span>
          <h2>Super <span className="gradient-text">Admin</span></h2>
        </div>
        
        <h1 className={styles.title}>
          {mode === 'login' ? 'System Access' : 'Password Recovery'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'login' ? 'Enter your credentials to manage the platform' : 'Enter your Secret Code to reset password'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className={styles.input} 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className={styles.input} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading} style={{ background: 'linear-gradient(90deg, #ef4444, #b91c1c)' }}>
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className={styles.formGroup}>
              <label htmlFor="secretCode">Secret Code</label>
              <input 
                type="text" 
                id="secretCode" 
                className={styles.input} 
                placeholder="Enter your 6-digit code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newUsername">New Username</label>
              <input 
                type="text" 
                id="newUsername" 
                className={styles.input} 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                className={styles.input} 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading} style={{ background: 'linear-gradient(90deg, #10b981, #047857)' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className={styles.switchText}>
          {mode === 'login' ? (
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setMode('forgot'); setError(''); }}>
              Forgot Password?
            </span>
          ) : (
            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => { setMode('login'); setError(''); }}>
              ← Back to Login
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
