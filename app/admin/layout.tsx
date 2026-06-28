'use client';
import Link from 'next/link';
import styles from '../dashboard/dashboard.module.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState({ pendingProducts: 0, openTickets: 0, pendingWithdrawals: 0, total: 0 });

  useEffect(() => {
    if (pathname === '/admin/login') return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [pathname]);

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
          <Link href="/admin/pending-products" className={styles.navLink} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><span className={styles.icon}>🔍</span> Review Products</div>
            {notifications.pendingProducts > 0 && (
              <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{notifications.pendingProducts}</span>
            )}
          </Link>
          <Link href="/admin/products" className={styles.navLink}>
            <span className={styles.icon}>🛍️</span> Manage Products
          </Link>
          <Link href="/admin/users" className={styles.navLink}>
            <span className={styles.icon}>👥</span> Manage Users
          </Link>
          <Link href="/admin/support" className={styles.navLink} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><span className={styles.icon}>💬</span> Support Tickets</div>
            {notifications.openTickets > 0 && (
              <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{notifications.openTickets}</span>
            )}
          </Link>
          <Link href="/admin/licenses" className={styles.navLink}>
            <span className={styles.icon}>🔑</span> Manage Licenses
          </Link>
          <Link href="/admin/royalty-settings" className={styles.navLink}>
            <span className={styles.icon}>💰</span> Royalty Rules
          </Link>
          <Link href="/admin/withdrawals" className={styles.navLink} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><span className={styles.icon}>💸</span> Withdrawals</div>
            {notifications.pendingWithdrawals > 0 && (
              <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{notifications.pendingWithdrawals}</span>
            )}
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
          <div className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Admin Control Panel
            {notifications.total > 0 && (
              <span style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                {notifications.total} New Notifications
              </span>
            )}
          </div>
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
