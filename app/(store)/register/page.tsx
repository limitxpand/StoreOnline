'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from '@/app/auth.module.css';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRole = searchParams.get('role');
  
  // Default to customer if invalid or missing
  const initialRole = (urlRole === 'contributor' || urlRole === 'developer') ? 'contributor' : 'customer';
  
  const [role, setRole] = useState<'customer' | 'contributor'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If role changes in URL, update state
  useEffect(() => {
    if (urlRole === 'contributor' || urlRole === 'developer') {
      setRole('contributor');
    } else {
      setRole('customer');
    }
  }, [urlRole]);

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
    <>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span style={{ 
          display: 'inline-block', 
          padding: '0.5rem 1rem', 
          background: role === 'customer' ? 'rgba(0, 118, 255, 0.1)' : 'rgba(139, 92, 246, 0.1)',
          color: role === 'customer' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
          borderRadius: '20px',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          Registering as: {role === 'customer' ? 'Buyer' : 'Seller'}
        </span>
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
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              className={styles.input} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ paddingRight: '40px' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading} style={{ background: role === 'customer' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
          {loading ? 'Creating Account...' : `Create ${role === 'customer' ? 'Buyer' : 'Seller'} Account`}
        </button>
      </form>
    </>
  );
}

export default function Register() {
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

        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading form...</div>}>
          <RegisterForm />
        </Suspense>

        <div className={styles.footer}>
          Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
