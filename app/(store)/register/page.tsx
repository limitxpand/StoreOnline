'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '@/app/auth.module.css';

export default function Register() {
  const [role, setRole] = useState<'customer' | 'contributor'>('customer');
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Automatically sign in after registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        throw new Error(signInRes.error);
      }

      if (role === 'customer') {
        router.push('/customer/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
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
        
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join the ultimate digital marketplace</p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <div className={styles.roleToggle}>
          <div 
            className={`${styles.roleBtn} ${role === 'customer' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('customer')}
          >
            I want to Buy
          </div>
          <div 
            className={`${styles.roleBtn} ${role === 'contributor' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('contributor')}
          >
            I want to Sell
          </div>
        </div>

        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className={styles.input} 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className={styles.input} 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className={styles.input} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating...' : `Create ${role === 'customer' ? 'Customer' : 'Developer'} Account`}
          </button>
        </form>

        <div className={styles.switchText}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
