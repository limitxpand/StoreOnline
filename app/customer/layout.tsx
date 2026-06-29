import Link from 'next/link';
import AdBanner from '../../components/AdBanner';
import styles from '../dashboard/dashboard.module.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CustomerNav from './CustomerNav';

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Customer";
  return (
    <div className={styles.layout}>
      <input type="checkbox" id="mobile-menu-toggle" className={styles.mobileMenuToggle} />
      <label htmlFor="mobile-menu-toggle" className={styles.mobileOverlay}></label>

      {/* Customer Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2><span className={styles.logoIcon}>🛍️</span> My <span className="gradient-text">Purchases</span></h2>
          <span className={styles.roleBadge} style={{ color: 'var(--accent-secondary)', borderColor: 'rgba(14, 165, 233, 0.2)', background: 'rgba(14, 165, 233, 0.1)' }}>Customer</span>
          <label htmlFor="mobile-menu-toggle" className={styles.mobileCloseBtn}>✕</label>
        </div>
        
        <CustomerNav styles={styles} />

        {/* Sidebar Ad Placement */}
        <div style={{ padding: '1rem', marginTop: 'auto' }}>
          <AdBanner slotId="customer_sidebar" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="mobile-menu-toggle" className={styles.mobileMenuBtn}>☰</label>
            <div className={styles.pageTitle}>Customer Portal</div>
          </div>
          <div className={styles.userMenu}>
            <div className={styles.avatar} style={{ background: 'var(--accent-secondary)' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
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
