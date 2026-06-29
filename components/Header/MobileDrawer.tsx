'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileDrawer.module.css';

interface MobileDrawerProps {
  categories: any[];
  dashboardLink: string;
  isAdmin: boolean;
}

export default function MobileDrawer({ categories, dashboardLink, isAdmin }: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Group by platform for subcategories
  const platforms = Array.from(new Set(categories.map(c => c.platform).filter(Boolean)));
  const platformIcons: Record<string, string> = {
    'MT5': '📈', 'MT4': '📊', 'Android': '📱', 'Windows': '💻', 'Web': '🌐'
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Categories', href: '/categories', icon: '📁' },
    { name: 'Blog', href: '/blog', icon: '📝' },
    { name: 'Royalty Program', href: '/royalty', icon: '💎' },
  ];

  return (
    <>
      <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Menu">
        ☰
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3 className="gradient-text">Store Online</h3>
              <button className={styles.closeBtn} onClick={closeMenu}>✕</button>
            </div>
            
            <div className={styles.drawerContent}>
              {/* Main Nav Links */}
              <div className={styles.mainNavGroup}>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`${styles.mainNavItem} ${pathname === link.href ? styles.active : ''}`}
                    onClick={closeMenu}
                  >
                    <span className={styles.icon}>{link.icon}</span>
                    <span className={styles.title}>{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className={styles.divider}></div>

              {/* Subcategories */}
              <div className={styles.categoryTitle}>Browse by Platform</div>
              {platforms.map((platform, idx) => {
                const catItems = categories.filter(c => c.platform === platform);
                return (
                  <div key={idx} className={styles.categoryGroup}>
                    <div className={styles.categoryHeader}>
                      <span className={styles.icon}>{platformIcons[platform as string] || '📁'}</span>
                      <span className={styles.title}>{platform as string}</span>
                    </div>
                    <ul className={styles.subCategoryList}>
                      {catItems.map((item, i) => (
                        <li key={i}>
                          <Link href={`/category/${item.slug}`} className={styles.subCategoryItem} onClick={closeMenu}>
                            <span className={styles.bullet}>›</span> {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              
              <div className={styles.divider}></div>
              
              {/* Account / Support */}
              <div className={styles.mainNavGroup}>
                <Link href={dashboardLink} className={styles.mainNavItem} onClick={closeMenu}>
                  <span className={styles.icon}>{isAdmin ? '🛡️' : '👤'}</span>
                  <span className={styles.title}>Dashboard</span>
                </Link>
                
                {isAdmin ? (
                  <button onClick={() => { closeMenu(); window.location.href = '/api/admin/logout'; }} className={styles.mainNavItemBtn}>
                    <span className={styles.icon}>🚪</span>
                    <span className={styles.title}>Logout</span>
                  </button>
                ) : dashboardLink !== '/login' ? (
                  <button onClick={() => { closeMenu(); window.location.href = '/api/auth/signout'; }} className={styles.mainNavItemBtn}>
                    <span className={styles.icon}>🚪</span>
                    <span className={styles.title}>Logout</span>
                  </button>
                ) : (
                  <Link href="/login" className={styles.mainNavItem} onClick={closeMenu}>
                    <span className={styles.icon}>🔑</span>
                    <span className={styles.title}>Login / Register</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
