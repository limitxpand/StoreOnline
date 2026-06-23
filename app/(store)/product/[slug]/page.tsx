import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './product.module.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
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
            <span className={styles.categoryBadge}>{product.platform} {product.category?.name}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>By {product.developer?.name || 'Unknown'}</p>
            
            <div className={styles.reviews}>
              <span style={{ color: 'gold' }}>★★★★★</span>
              <span style={{ color: 'var(--text-muted)' }}>(0 Reviews)</span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            </div>

            <p className={styles.description}>
              {product.description}
            </p>

            <ul className={styles.features}>
              <li>✅ Ready for {product.platform}</li>
              <li>✅ Instant Delivery</li>
              <li>✅ Protected via Custom License Module</li>
              <li>✅ Free Updates</li>
            </ul>

            <Link href={`/checkout/${params.slug}`} className={styles.buyBtn}>
              Buy Now with Crypto
            </Link>

            <div className={styles.guarantee}>
              <span style={{ fontSize: '1.2rem' }}>🛡️</span>
              <span>Secure checkout provided by Cryptomus. Instant license delivery.</span>
            </div>

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
