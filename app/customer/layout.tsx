import Link from 'next/link';
import AdBanner from '../../components/AdBanner';
import styles from '../dashboard/dashboard.module.css';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardLogoutButton from "../dashboard/DashboardLogoutButton";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Customer";
  
  return (
    <div className={styles.layout}>
      {/* Customer Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2><span className={styles.logoIcon}>🛍️</span> My <span className="gradient-text">Purchases</span></h2>
          <span className={styles.roleBadge} style={{ color: 'var(--accent-secondary)', borderColor: 'rgba(14, 165, 233, 0.2)', background: 'rgba(14, 165, 233, 0.1)' }}>Customer</span>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/customer/dashboard" className={styles.navLink}>
            <span className={styles.icon}>📦</span> Purchased Products
          </Link>
          <Link href="/customer/licenses" className={styles.navLink}>
            <span className={styles.icon}>🔑</span> Licenses & Downloads
          </Link>
          <div className={styles.divider}></div>
          <Link href="/" className={styles.navLink}>
            <span className={styles.icon}>🔙</span> Back to Store
          </Link>
          <DashboardLogoutButton />
        </nav>

        {/* Sidebar Ad Placement */}
        <div style={{ padding: '1rem', marginTop: 'auto' }}>
          <AdBanner slotId="customer_sidebar" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.pageTitle}>Customer Portal</div>
          <div className={styles.userMenu}>
            <div className={styles.avatar} style={{ background: 'var(--accent-secondary)' }}>{userName.charAt(0).toUpperCase()}</div>
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
