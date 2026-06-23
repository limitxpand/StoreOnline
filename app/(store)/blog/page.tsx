import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata = {
  title: 'Blog - Store Online Marketplace',
  description: 'Read the latest strategies, tips, and reviews on MT4/MT5 Expert Advisors and trading software.',
};

export default function BlogListing() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <main style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Trading Insights & <span className="gradient-text">News</span></h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '1.2rem', marginBottom: '3rem' }}>Discover the best EAs, trading strategies, and platform updates.</p>

        {/* Top Ad */}
        <AdBanner slotId="blog_top_leaderboard" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          
          {/* Blog Post Card */}
          <Link href="/blog/top-5-mt5-eas-2026" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}>
              <div style={{ height: '200px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                🤖
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ color: 'var(--accent-neon)', fontSize: '0.85rem', fontWeight: '600' }}>MARKET RESEARCH</span>
                <h3 style={{ color: 'white', fontSize: '1.4rem', margin: '0.5rem 0' }}>Top 5 MT5 Expert Advisors in 2026</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>We analyzed the best-performing automated trading bots of the year. See which ones passed our strict risk-management tests...</p>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Published on Oct 24, 2026 • 5 min read</span>
              </div>
            </div>
          </Link>

          {/* Blog Post Card */}
          <Link href="/blog/why-license-protection-matters" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}>
              <div style={{ height: '200px', background: 'linear-gradient(135deg, #10b981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                🛡️
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600' }}>SECURITY</span>
                <h3 style={{ color: 'white', fontSize: '1.4rem', margin: '0.5rem 0' }}>Why License Protection Matters for Developers</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>Piracy ruins the software industry. Learn how Store Online's built-in Hardware Lock protects your source code and boosts sales...</p>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Published on Oct 20, 2026 • 4 min read</span>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
