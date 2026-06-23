'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '@/app/auth.module.css';

export default function Login() {
  const [role, setRole] = useState<'customer' | 'contributor' | 'admin'>('customer');
  const router = useRouter();
  const [error, setError] = useState('');

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // For local testing convenience, if user types "test" we'll use "test@test.com"
    const finalEmail = login === 'test' ? 'test@test.com' : login;

    const res = await signIn('credentials', {
      redirect: false,
      email: finalEmail,
      password: password,
      role: role,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      // Route based on role
      if (role === 'customer') router.push('/customer/dashboard');
      else if (role === 'admin') router.push('/admin');
      else router.push('/dashboard');
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
        
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to access your dashboard</p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <div className={styles.roleToggle}>
          <div 
            className={`${styles.roleBtn} ${role === 'customer' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('customer')}
          >
            Customer
          </div>
          <div 
            className={`${styles.roleBtn} ${role === 'contributor' ? styles.roleBtnActive : ''}`}
            onClick={() => setRole('contributor')}
          >
            Developer
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="login">Email Address</label>
            <input 
              type="email" 
              id="login" 
              className={styles.input} 
              placeholder="e.g. test@test.com" 
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className={styles.input} 
              placeholder="e.g. test" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Login as {role === 'customer' ? 'Customer' : 'Developer'}
          </button>
        </form>

        <div className={styles.switchText}>
          Don't have an account? <Link href="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
