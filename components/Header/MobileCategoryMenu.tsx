'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './MobileCategoryMenu.module.css';

export default function MobileCategoryMenu({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Group by platform
  const platforms = Array.from(new Set(categories.map(c => c.platform).filter(Boolean)));
  const platformIcons: Record<string, string> = {
    'MT5': '📈', 'MT4': '📊', 'Android': '📱', 'Windows': '💻', 'Web': '🌐'
  };

  return (
    <>
      <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Menu">
        ☰
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>Categories</h3>
              <button className={styles.closeBtn} onClick={closeMenu}>✕</button>
            </div>
            
            <div className={styles.drawerContent}>
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
              
              <Link href="/categories" className={styles.exploreBtn} onClick={closeMenu}>
                Explore All Categories ›
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
