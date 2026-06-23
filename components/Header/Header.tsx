import Link from 'next/link';
import styles from './Header.module.css';
import { getWebsiteSettings } from '@/lib/settings';
import SearchBar from './SearchBar';

export default function Header() {
  const settings = getWebsiteSettings();
  const siteNameParts = settings.siteName.split(' ');
  const firstPart = siteNameParts[0] || 'Store';
  const secondPart = siteNameParts.slice(1).join(' ') || 'Online';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className={styles.logoIcon}>🛒</span>
            <div>
              <h1 className={styles.logoText}>{firstPart} <span className={styles.logoHighlight}>{secondPart}</span></h1>
              <span className={styles.logoSubtext}>Digital Product Marketplace</span>
            </div>
          </Link>
        </div>

        <div className={styles.searchContainer} style={{ background: 'none', padding: 0, border: 'none' }}>
          <SearchBar />
        </div>

        <div className={styles.actions}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginRight: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
            <Link href="/royalty" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Royalty Program</Link>
            <Link href="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Blog</Link>
          </div>
          <button className={styles.iconBtn}>🌙</button>
          <div className={styles.cartContainer}>
            <button className={styles.iconBtn}>🛒</button>
            <span className={styles.cartBadge}>3</span>
          </div>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/register" className={styles.registerBtn}>Register</Link>
        </div>
      </div>
    </header>
  );
}
