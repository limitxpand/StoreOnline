'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/auth.module.css';

export default function Register() {
  const [role, setRole] = useState<'customer' | 'contributor'>('customer');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'customer') {
      router.push('/customer/dashboard');
    } else {
      router.push('/dashboard');
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
            <input type="text" id="name" className={styles.input} placeholder="John Doe" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" className={styles.input} placeholder="you@example.com" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className={styles.input} placeholder="••••••••" required />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create {role === 'customer' ? 'Customer' : 'Developer'} Account
          </button>
        </form>

        <div className={styles.switchText}>
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
