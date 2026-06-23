import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import styles from './product.module.css';

export default function ProductPage({ params }: { params: { slug: string } }) {
  // Mock data for MVP
  const productName = params.slug === 'gold-scalper-pro' ? 'Gold Scalper Pro EA' : 'Quantum Indicator';
  const price = params.slug === 'gold-scalper-pro' ? 129.00 : 89.00;

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
              <span style={{ fontSize: '5rem' }}>📈</span>
            </div>
            <div className={styles.thumbnails}>
              <div className={styles.thumb}></div>
              <div className={styles.thumb}></div>
              <div className={styles.thumb}></div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className={styles.infoColumn}>
            <span className={styles.categoryBadge}>MT5 Expert Advisor</span>
            <h1 className={styles.title}>{productName}</h1>
            
            <div className={styles.reviews}>
              <span style={{ color: 'gold' }}>★★★★★</span>
              <span style={{ color: 'var(--text-muted)' }}>(24 Reviews)</span>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>${price.toFixed(2)}</span>
            </div>

            <p className={styles.description}>
              The ultimate automated trading system designed for XAUUSD (Gold). Built with advanced price action algorithms and strict risk management. 
              Purchase includes a lifetime license locked to your account/hardware.
            </p>

            <ul className={styles.features}>
              <li>✅ Automated Trading on MT5</li>
              <li>✅ Built-in Stop Loss & Take Profit</li>
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
