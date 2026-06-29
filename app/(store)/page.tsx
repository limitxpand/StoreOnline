import Link from 'next/link';
export const dynamic = 'force-dynamic';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { getWebsiteSettings } from '@/lib/settings';
import { prisma } from '@/lib/prisma';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const settings = await getWebsiteSettings();
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams?.search === 'string' ? resolvedParams.search : undefined;
  const filter = typeof resolvedParams?.filter === 'string' ? resolvedParams.filter : 'all';

  const whereClause: any = { status: 'published' };

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { developer: { uid: { contains: search, mode: 'insensitive' } } },
      { pid: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (filter === 'free') {
    whereClause.price = 0;
  } else if (filter === 'paid') {
    whereClause.price = { gt: 0 };
  } else if (filter === 'mt4') {
    whereClause.platform = 'MT4';
  } else if (filter === 'mt5') {
    whereClause.platform = 'MT5';
  } else if (filter === 'ea') {
    whereClause.category = { name: 'Expert Advisors' };
  }

  const featuredProducts = await prisma.product.findMany({
    where: whereClause,
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
                {(settings.floatingLogoUrl || settings.floatingLogoLightUrl) ? (
                  <>
                    <img 
                      src={settings.floatingLogoUrl || settings.floatingLogoLightUrl} 
                      alt="Hero Banner Logo" 
                      style={{ 
                        width: '180px', 
                        height: '180px', 
                        objectFit: 'contain', 
                        zIndex: 2, 
                        position: 'relative',
                        borderRadius: settings.floatingLogoRadius === 'circle' ? '50%' : settings.floatingLogoRadius === 'rounded' ? '12px' : '0',
                        mixBlendMode: settings.floatingLogoRemoveBg ? 'multiply' : 'normal',
                        filter: settings.floatingLogoShadow ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' : 'none'
                      }} 
                      className={`${styles.floatingCart} theme-logo-dark`} 
                    />
                    <img 
                      src={settings.floatingLogoLightUrl || settings.floatingLogoUrl} 
                      alt="Hero Banner Logo Light" 
                      style={{ 
                        width: '180px', 
                        height: '180px', 
                        objectFit: 'contain', 
                        zIndex: 2, 
                        position: 'relative',
                        borderRadius: settings.floatingLogoRadius === 'circle' ? '50%' : settings.floatingLogoRadius === 'rounded' ? '12px' : '0',
                        mixBlendMode: settings.floatingLogoRemoveBg ? 'multiply' : 'normal',
                        filter: settings.floatingLogoShadow ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' : 'none'
                      }} 
                      className={`${styles.floatingCart} theme-logo-light`} 
                    />
                  </>
                ) : (
                  <div className={styles.floatingCart}>🛒</div>
                )}
              </div>
            </div>

            {/* Featured Products Section */}
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                {search ? `Search Results for "${search}"` : 'Featured Products'}
              </h3>
              <div className={styles.tabs}>
                <Link href="/" className={`${styles.tab} ${filter === 'all' ? styles.activeTab : ''}`}>All Products</Link>
                <Link href="/?filter=free" className={`${styles.tab} ${filter === 'free' ? styles.activeTab : ''}`}>Free</Link>
                <Link href="/?filter=paid" className={`${styles.tab} ${filter === 'paid' ? styles.activeTab : ''}`}>Paid</Link>
                <Link href="/?filter=mt4" className={`${styles.tab} ${filter === 'mt4' ? styles.activeTab : ''}`}>MT4</Link>
                <Link href="/?filter=mt5" className={`${styles.tab} ${filter === 'mt5' ? styles.activeTab : ''}`}>MT5</Link>
                <Link href="/?filter=ea" className={`${styles.tab} ${filter === 'ea' ? styles.activeTab : ''}`}>EA</Link>
              </div>
              <Link href="/categories" className={styles.viewAllBtn}>View All</Link>
            </div>

            <div className="global-product-grid mobile-swipeable">
              {featuredProducts.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
                  No products found.
                </div>
              ) : (
                featuredProducts.map((product: any) => (
                  <ProductCard 
                    key={product.id}
                    title={product.title}
                    slug={product.slug}
                    category={product.category?.name || 'Uncategorized'}
                    type={product.platform}
                    price={product.price}
                    rating={5.0} // Placeholder until review model exists
                    reviews={0}
                    image={product.logoUrl || ''}
                  />
                ))
              )}
            </div>

            {/* Added AdSense banner to the original layout */}
            {settings.enableAdsense && (
              <div style={{ marginTop: '3rem', width: '100%' }}>
                <AdBanner slotId="homepage_bottom" />
              </div>
            )}

      <Link 
        href="/admin/dashboard" 
        className={styles.adminLoginBtn}
      >
        <span>🛡️</span> Admin Login
      </Link>
    </div>
  );
}
