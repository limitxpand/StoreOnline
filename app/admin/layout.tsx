'use client';
import Link from 'next/link';
import styles from '../dashboard/dashboard.module.css';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>{children}</div>;
  }

  return (
    <div className={styles.layout}>
      {/* Admin Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2><span className={styles.logoIcon}>🛡️</span> Store <span className="gradient-text">Admin</span></h2>
          <span className={styles.roleBadge} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.1)' }}>Super Admin</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navLink}>
            <span className={styles.icon}>📈</span> Overview
          </Link>
          <Link href="/admin/pending-products" className={styles.navLink}>
            <span className={styles.icon}>🔍</span> Review Products
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            <span className={styles.icon}>🛍️</span> Manage Products
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            <span className={styles.icon}>👥</span> Manage Users
          </Link>
          <Link href="/admin/licenses" className={styles.navLink}>
            <span className={styles.icon}>🔑</span> Manage Licenses
          </Link>
          <Link href="/admin/royalty-settings" className={styles.navLink}>
            <span className={styles.icon}>💰</span> Royalty Rules
          </Link>
          <Link href="/admin/withdrawals" className={styles.navLink}>
            <span className={styles.icon}>💸</span> Withdrawals
          </Link>
          <div className={styles.divider}></div>
          <Link href="/admin/payments" className={styles.navLink}>
            <span className={styles.icon}>💳</span> Payment Gateways
          </Link>
          <Link href="/admin/seo-ads" className={styles.navLink}>
            <span className={styles.icon}>🚀</span> SEO & Ads
          </Link>
          <div className={styles.divider}></div>
          <Link href="/admin/settings" className={styles.navLink}>
            <span className={styles.icon}>⚙️</span> Site Settings
          </Link>
          <Link href="/admin/categories" className={styles.navLink}>
            <span className={styles.icon}>📁</span> Categories
          </Link>
          <Link href="/admin/security" className={styles.navLink}>
            <span className={styles.icon}>🔒</span> Security
          </Link>
          <div className={styles.divider}></div>
          <Link href="/" className={styles.navLink}>
            <span className={styles.icon}>🔙</span> Back to Store
          </Link>
          <button 
            className={`${styles.navLink} ${styles.logoutBtn}`}
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', marginTop: '1rem' }}
            onClick={async () => {
              await fetch('/api/admin/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) });
              window.location.href = '/admin/login';
            }}
          >
            <span className={styles.icon}>🚪</span> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.pageTitle}>Admin Control Panel</div>
          <div className={styles.userMenu}>
            <div className={styles.avatar} style={{ background: 'var(--danger)' }}>A</div>
            <span>Super Admin</span>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
