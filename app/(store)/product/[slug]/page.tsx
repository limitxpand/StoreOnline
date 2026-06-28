import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './product.module.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getWebsiteSettings } from '@/lib/settings';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  const settings = await getWebsiteSettings();
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      developer: { select: { name: true } },
      category: true
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <span style={{ fontSize: '1.5rem' }}>🛒</span>
          <h2>Store <span className="gradient-text">Online</span></h2>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Contributor Portal</Link>
          <Link href="/customer/dashboard" className={styles.loginBtn}>Customer Login</Link>
        </nav>
      </header>

      {/* Product Details Section */}
      <main className={styles.main}>
        <div className={styles.productGrid}>
          {/* Left Column - Images */}
          <div className={styles.imageColumn}>
            <div className={styles.mainImage}>
              {product.logoUrl ? (
                <img src={product.logoUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
              ) : (
                <span style={{ fontSize: '5rem' }}>📦</span>
              )}
            </div>
            <div className={styles.thumbnails}>
              <div className={styles.thumb}></div>
              <div className={styles.thumb}></div>
              <div className={styles.thumb}></div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className={styles.infoColumn}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className={styles.categoryBadge}>{product.platform} {product.category?.name}</span>
              {product.pid && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'monospace' }}>PID: {product.pid}</span>}
            </div>
            <h1 className={styles.title}>{product.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>By {product.developer?.name || 'Unknown'}</p>
            
            <div className={styles.reviews}>
              <span style={{ color: 'gold' }}>★★★★★</span>
              <span style={{ color: 'var(--text-muted)' }}>(0 Reviews)</span>
            </div>

            <p className={styles.description}>
              {product.description}
            </p>

            <ul className={styles.features}>
              <li>✅ 20 Days Free Demo (Full Access)</li>
              <li>✅ Ready for {product.platform}</li>
              <li>✅ Instant Download</li>
              <li>✅ Safe & Verified Source</li>
              <li>✅ Free Updates</li>
            </ul>

            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⏱️</span> 20 Days Free Trial
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                You can download and use this {product.platform} {product.category?.name} completely free for 20 days without any limitations. 
                To continue using it after the trial period, simply click the <strong>Live Chat</strong> button inside the {product.platform} terminal EA/Indicator panel to make your payment securely.
              </p>
            </div>

            <ProductActions 
              productId={product.id}
              downloadUrl={product.compiledFileUrl || product.sourceFileUrl || '#'} 
              productTitle={product.title} 
              isLoggedIn={!!session}
              demoVideoAdUrl={settings.demoVideoAdUrl}
            />

            {/* AdSense Placement */}
            <div style={{ width: '100%', marginTop: '2rem' }}>
              <AdBanner slotId="product_page_bottom" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
