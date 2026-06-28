'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CustomerNav({ styles }: { styles: any }) {
  const [notifications, setNotifications] = useState({ openTickets: 0, total: 0 });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={styles.nav}>
      <Link href="/customer/dashboard" className={styles.navLink}>
        <span className={styles.icon}>📦</span> Already Downloaded Products
      </Link>
      <Link href="/customer/licenses" className={styles.navLink}>
        <span className={styles.icon}>🔑</span> Licenses & Downloads
      </Link>
      <Link href="/customer/support" className={styles.navLink} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><span className={styles.icon}>💬</span> Live Support</div>
        {notifications.openTickets > 0 && (
          <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{notifications.openTickets}</span>
        )}
      </Link>
      <Link href="/customer/settings" className={styles.navLink}>
        <span className={styles.icon}>⚙️</span> Account Settings
      </Link>
      <div className={styles.divider}></div>
      <Link href="/" className={styles.navLink}>
        <span className={styles.icon}>🔙</span> Back to Store
      </Link>
      <Link href="/login" className={`${styles.navLink} ${styles.logoutBtn}`}>
        <span className={styles.icon}>🚪</span> Logout
      </Link>
    </nav>
  );
}
