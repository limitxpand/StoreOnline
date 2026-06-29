import Link from 'next/link';
import AdBanner from '../../components/AdBanner';
import styles from './dashboard.module.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardNav from './DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Developer";

  return (
    <div className={styles.layout}>
      <input type="checkbox" id="mobile-menu-toggle" className={styles.mobileMenuToggle} />
      <label htmlFor="mobile-menu-toggle" className={styles.mobileOverlay}></label>

      {/* Dashboard Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2><span className={styles.logoIcon}>🛒</span> Store <span className="gradient-text">Online</span></h2>
          <span className={styles.roleBadge}>Contributor</span>
          <label htmlFor="mobile-menu-toggle" className={styles.mobileCloseBtn}>✕</label>
        </div>
        
        <DashboardNav styles={styles} />

        {/* Sidebar Ad Placement */}
        <div style={{ padding: '1rem', marginTop: 'auto' }}>
          <AdBanner slotId="dashboard_sidebar" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Dashboard Topbar */}
        <header className={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="mobile-menu-toggle" className={styles.mobileMenuBtn}>☰</label>
            <div className={styles.pageTitle}>Dashboard</div>
          </div>
          <div className={styles.userMenu}>
            <div className={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
            <span>{userName}</span>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
