import Link from 'next/link';
import styles from './Sidebar.module.css';
import { prisma } from '@/lib/prisma';

export default async function Sidebar() {
  const allCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // Group by platform
  const platforms = Array.from(new Set(allCategories.map(c => c.platform).filter(Boolean)));
  
  const platformIcons: Record<string, string> = {
    'MT5': '📈',
    'MT4': '📊',
    'Android': '📱',
    'Windows': '💻',
    'Web': '🌐'
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>CATEGORIES</h3>
        
        {platforms.map((platform, idx) => {
          const catItems = allCategories.filter(c => c.platform === platform);
          return (
            <div key={idx} className={styles.categoryGroup}>
              <div className={styles.categoryHeader}>
                <span className={styles.icon}>{platformIcons[platform] || '📁'}</span>
                <span className={styles.title}>{platform}</span>
              </div>
              <ul className={styles.subCategoryList}>
                {catItems.map((item, i) => (
                  <li key={i}>
                    <Link href={`/category/${item.slug}`} className={styles.subCategoryItem}>
                      <span className={styles.bullet}>›</span> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div className={styles.divider}></div>

        <ul className={styles.extraCategoryList}>
          <li>
            <Link href="/categories" className={styles.extraCategoryItem}>
              <span className={styles.icon}>🕒</span>
              All Categories
            </Link>
          </li>
        </ul>

        <Link href="/categories" className={styles.exploreBtn}>
          Explore All Categories ›
        </Link>
      </div>

      <div className={styles.trustBadge}>
        <h4>Trusted by 10,000+ Traders</h4>
        <p>High quality products, secure payments, and 24/7 support.</p>
        <div className={styles.rating}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.score}>4.9 / 5</span>
        </div>
      </div>
    </aside>
  );
}
