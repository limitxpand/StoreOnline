'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('A password reset link has been sent to your email!');
      } else {
        setError(data.error || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      
      <div className={styles.authCard}>
        <Link href="/" className={styles.logo}>
          <span style={{ fontSize: '2rem' }}>🛒</span>
          <h2>Store <span className="gradient-text">Online</span></h2>
        </Link>
        
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.subtitle}>Enter your email to receive a reset link</p>

        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{message}</div>}
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              className={styles.input}
              placeholder="Enter your registered email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.switchText}>
          Remember your password? <Link href="/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
