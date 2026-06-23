import Link from 'next/link';
import Header from '@/components/Header/Header';
import AdBanner from '@/components/AdBanner';

export const metadata = {
  title: 'Developer Royalty Program | Store Online',
  description: 'Earn 70% royalties by selling your Expert Advisors, Indicators, and Software on Store Online. Zero piracy risk with our hardware license injection system.',
};

export default function RoyaltyProgram() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.25rem 1rem', 
              background: 'rgba(59, 130, 246, 0.1)', 
              color: 'var(--accent-primary)', 
              borderRadius: '20px', 
              fontWeight: 700, 
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              FOR CREATORS & DEVELOPERS
            </span>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              The Ultimate <span className="gradient-text">Royalty Program</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Turn your source code into a passive income stream. We handle the compiling, licensing, anti-piracy protection, and payments. You just collect the royalties.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>70% Profit Split</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                You take home 70% of every sale. Our 30% fee covers the heavy lifting: server costs, crypto payment processing, and dynamic license injection.
              </p>
            </div>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Zero Piracy Risk</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Never sell unprotected code again. Our proprietary engine compiles your source code on-the-fly and hardware-locks it to the buyer's machine.
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>Instant Crypto Payouts</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Withdraw your earnings instantly to your crypto wallet (USDT, BTC, ETH) without waiting for 30-day holds or bank delays.
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Automated Ledgers</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Track every sale, license activation, and royalty payment in real-time through your Contributor Dashboard.
              </p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to monetize your code?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
              Upload your MQL4, MQL5, or APK source code today. Once approved by our admins, it goes live in the marketplace immediately.
            </p>
            <Link href="/register" style={{
              display: 'inline-block',
              background: 'var(--accent-primary)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.2s'
            }}>
              Become a Contributor
            </Link>
          </div>

          <div style={{ marginTop: '4rem' }}>
            <AdBanner slotId="royalty_bottom" />
          </div>

        </div>
      </main>
    </div>
  );
}
