import Link from 'next/link';
import styles from '../../product/[slug]/product.module.css';

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const productName = params.id === 'gold-scalper-pro' ? 'Gold Scalper Pro EA' : 'Quantum Indicator';
  const price = params.id === 'gold-scalper-pro' ? 129.00 : 89.00;

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <h2><span className="gradient-text">Secure Checkout</span></h2>
        </div>
      </header>

      <main className={styles.main} style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '600px', width: '100%' }}>
          <h1 style={{ color: 'white', marginBottom: '1.5rem', textAlign: 'center' }}>Complete Purchase</h1>
          
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'white', fontWeight: '500' }}>
              <span>{productName}</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span>Lifetime License</span>
              <span>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: '800', fontSize: '1.5rem' }}>
              <span>Total</span>
              <span className="gradient-text">${price.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>Payment Method</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, border: '2px solid var(--accent-primary)', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(79, 70, 229, 0.1)', color: 'white', fontWeight: '600' }}>
                Cryptomus (Crypto)
              </div>
            </div>
          </div>

          {/* Simulate Payment & License Generation */}
          <Link href="/customer/licenses" style={{ display: 'block', width: '100%', padding: '1.25rem', background: 'var(--success)', color: 'white', textAlign: 'center', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
            Pay Now & Generate License
          </Link>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            By clicking "Pay Now", you will be redirected to the customer dashboard simulating a successful purchase and automatic license injection.
          </p>
        </div>
      </main>
    </div>
  );
}
