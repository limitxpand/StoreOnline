'use client';
import { signOut } from 'next-auth/react';
import styles from './dashboard.module.css';

export default function DashboardLogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className={`${styles.navLink} ${styles.logoutBtn}`}
      style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', textAlign: 'left', fontSize: '1rem', fontFamily: 'inherit' }}
    >
      <span className={styles.icon}>🚪</span> Logout
    </button>
  );
}
