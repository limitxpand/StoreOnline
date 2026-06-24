import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CheckoutButton from './CheckoutButton';
import styles from '../../product/[slug]/product.module.css';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = await params;

  const product = await prisma.product.findFirst({
    where: { 
      OR: [
        { id: productId },
        { slug: productId }
      ]
    }
  });

  if (!product) {
    notFound();
  }

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
              <span>{product.title}</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span>Lifetime License</span>
              <span>Included</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: '800', fontSize: '1.5rem' }}>
              <span>Total</span>
              <span className="gradient-text">${product.price.toFixed(2)}</span>
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

          <CheckoutButton productId={product.id} />
          
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            By clicking "Pay with Cryptomus", you will be redirected to securely complete your payment.
          </p>
        </div>
      </main>
    </div>
  );
}
