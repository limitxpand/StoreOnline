'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileNav.module.css';

export default function MobileNav({ dashboardLink }: { dashboardLink: string }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Search', href: '/search', icon: '🔍' },
    { name: 'Cart', href: '/cart', icon: '🛒' },
    { name: 'Account', href: dashboardLink, icon: '👤' },
  ];

  return (
    <nav className={styles.mobileNav}>
      <ul className={styles.navItems}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Account' && pathname.includes('/dashboard'));
          return (
            <li key={item.name}>
              <Link href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                <div className={item.name === 'Cart' ? styles.cartWrapper : ''}>
                  <span className={styles.icon}>{item.icon}</span>
                  {item.name === 'Cart' && <span className={styles.cartBadge}>0</span>}
                </div>
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
