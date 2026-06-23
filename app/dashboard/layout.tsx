import Link from 'next/link';
import AdBanner from '../../components/AdBanner';
import styles from './dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      {/* Dashboard Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2><span className={styles.logoIcon}>🛒</span> Store <span className="gradient-text">Online</span></h2>
          <span className={styles.roleBadge}>Contributor</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            <span className={styles.icon}>📊</span> Overview
          </Link>
          <Link href="/dashboard/upload" className={styles.navLink}>
            <span className={styles.icon}>📤</span> Upload Code
          </Link>
          <Link href="/dashboard/upload-apk" className={styles.navLink}>
            <span className={styles.icon}>📱</span> Upload APK
          </Link>
          <Link href="/dashboard/earnings" className={styles.navLink}>
            <span className={styles.icon}>💰</span> Earnings & Royalty
          </Link>
          <div className={styles.divider}></div>
          <Link href="/" className={styles.navLink}>
            <span className={styles.icon}>🔙</span> Back to Store
          </Link>
          <Link href="/login" className={`${styles.navLink} ${styles.logoutBtn}`}>
            <span className={styles.icon}>🚪</span> Logout
          </Link>
        </nav>

        {/* Sidebar Ad Placement */}
        <div style={{ padding: '1rem', marginTop: 'auto' }}>
          <AdBanner slotId="dashboard_sidebar" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Dashboard Topbar */}
        <header className={styles.topbar}>
          <div className={styles.pageTitle}>Dashboard</div>
          <div className={styles.userMenu}>
            <div className={styles.avatar}>C</div>
            <span>Contributor User</span>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
