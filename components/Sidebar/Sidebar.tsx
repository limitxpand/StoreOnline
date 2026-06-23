import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const categories = [
    {
      title: 'MT5',
      icon: '📈',
      items: ['Expert Advisors', 'Indicators', 'Utilities', 'Libraries']
    },
    {
      title: 'MT4',
      icon: '📊',
      items: ['Expert Advisors', 'Indicators', 'Utilities', 'Libraries']
    }
  ];

  const extraCategories = [
    { title: 'Android Game APK', icon: '📱' },
    { title: 'Software APK', icon: '💻' },
    { title: 'Scripts & Tools', icon: '⚙️' },
    { title: 'Templates', icon: '🎨' },
    { title: 'E-books', icon: '📚' }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>CATEGORIES</h3>
        
        {categories.map((cat, idx) => (
          <div key={idx} className={styles.categoryGroup}>
            <div className={styles.categoryHeader}>
              <span className={styles.icon}>{cat.icon}</span>
              <span className={styles.title}>{cat.title}</span>
            </div>
            <ul className={styles.subCategoryList}>
              {cat.items.map((item, i) => (
                <li key={i}>
                  <Link href={`/category/${cat.title.toLowerCase()}/${item.toLowerCase().replace(' ', '-')}`} className={styles.subCategoryItem}>
                    <span className={styles.bullet}>›</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.divider}></div>

        <ul className={styles.extraCategoryList}>
          {extraCategories.map((cat, idx) => (
            <li key={idx}>
              <Link href={`/category/${cat.title.toLowerCase().replace(/ /g, '-')}`} className={styles.extraCategoryItem}>
                <span className={styles.icon}>{cat.icon}</span>
                {cat.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/categories" className={styles.extraCategoryItem}>
              <span className={styles.icon}>🕒</span>
              More Categories
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
