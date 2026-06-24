'use client';

import { useState } from 'react';
import Link from 'next/link';
import authStyles from '../auth.module.css';

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
        setMessage('If an account with that email exists, a password reset link has been sent.');
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
    <div className={authStyles.authContainer}>
      <div className={authStyles.authBox}>
        <div className={authStyles.logoArea}>
          <h2>StoreOnline</h2>
          <p>Reset your password</p>
        </div>

        {message && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className={authStyles.authForm}>
          <div className={authStyles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your registered email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={authStyles.submitBtn} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className={authStyles.authFooter}>
          <p>Remember your password? <Link href="/login">Log in here</Link></p>
        </div>
      </div>
    </div>
  );
}
