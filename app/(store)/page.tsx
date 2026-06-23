import Link from 'next/link';
export const dynamic = 'force-dynamic';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { getWebsiteSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const settings = getWebsiteSettings();

  const featuredProducts = await prisma.product.findMany({
    where: { status: 'published' },
    include: { category: true, developer: { select: { name: true } } },
    take: 8,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ '--accent-primary': settings.primaryColor } as React.CSSProperties}>
      {/* Banner Section */}
            <div className={styles.heroBanner}>
              <div className={styles.bannerContent}>
                <span className={styles.welcomeBadge}>WELCOME TO {settings.siteName.toUpperCase()}</span>
                <h2 className={styles.bannerTitle} dangerouslySetInnerHTML={{ __html: settings.heroTitle.replace('Premium', '<span class="gradient-text">Premium</span>') }}></h2>
                <p className={styles.bannerSubtitle}>
                  {settings.heroSubtitle}
                </p>
                <div className={styles.bannerFeatures}>
                  <span>✓ Secure Payments</span>
                  <span>✓ Instant Delivery</span>
                  <span>✓ Royalty Program</span>
                </div>
              </div>
              <div className={styles.bannerGraphic}>
                <div className={styles.glowCircle}></div>
                <div className={styles.floatingCart}>🛒</div>
              </div>
            </div>

            {/* Featured Products Section */}
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Featured Products</h3>
              <div className={styles.tabs}>
                <button className={`${styles.tab} ${styles.activeTab}`}>All Products</button>
                <button className={styles.tab}>Free</button>
                <button className={styles.tab}>Paid</button>
                <button className={styles.tab}>MT4</button>
                <button className={styles.tab}>MT5</button>
                <button className={styles.tab}>EA</button>
              </div>
              <button className={styles.viewAllBtn}>View All</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {featuredProducts.map((product: any) => (
                <ProductCard 
                  key={product.id}
                  title={product.title}
                  slug={product.slug}
                  category={product.category.name}
                  type={product.platform}
                  price={product.price}
                  rating={5.0} // Placeholder until review model exists
                  reviews={0}
                  image={product.logoUrl || ''}
                />
              ))}
            </div>

            {/* Added AdSense banner to the original layout */}
            {settings.enableAdsense && (
              <div style={{ marginTop: '3rem', width: '100%' }}>
                <AdBanner slotId="homepage_bottom" />
              </div>
            )}

      <Link 
        href="/admin/dashboard" 
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <span>🛡️</span> Admin Login
      </Link>
    </div>
  );
}
