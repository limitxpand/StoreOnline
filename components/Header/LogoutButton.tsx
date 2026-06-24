'use client';
import { signOut } from 'next-auth/react';
import styles from './Header.module.css';

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.loginBtn} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
      Logout
    </button>
  );
}
