import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

// Dynamic SEO Metadata generation
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${title} - Store Online Blog`,
    description: `Read our comprehensive guide and review on ${title}. Optimize your trading strategy today.`,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <header style={{ height: '80px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🛒</span>
          <h2 style={{ color: 'white' }}>Store <span className="gradient-text">Online</span></h2>
        </div>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link href="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Blog</Link>
        </nav>
      </header>

      <main style={{ padding: '4rem 5%', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/blog" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
          ← Back to all posts
        </Link>
        
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>{title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <span>By Admin</span>
          <span>•</span>
          <span>Oct 24, 2026</span>
          <span>•</span>
          <span>5 min read</span>
        </div>

        <article style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Welcome to our comprehensive guide on the {title}. In the fast-paced world of algorithmic trading, finding reliable software can make the difference between consistent profits and blown accounts.
          </p>
          
          <h2 style={{ color: 'white', fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem' }}>Why Automated Trading?</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Automated trading systems remove the psychological barriers of manual trading. They execute trades based on pre-defined algorithms 24/5.
          </p>

          {/* In-content Ad */}
          <AdBanner slotId="blog_in_content" className="my-8" />

          <h2 style={{ color: 'white', fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem' }}>Our Testing Methodology</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Before recommending any software on the Store Online marketplace, we subject them to rigorous testing, including:
          </p>
          <ul style={{ listStylePosition: 'inside', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>10-year tick-data backtesting (99.9% modeling quality)</li>
            <li>Forward testing on live accounts</li>
            <li>Source code security analysis</li>
          </ul>

          <p style={{ marginBottom: '1.5rem' }}>
            Ready to upgrade your trading arsenal? Check out our <Link href="/" style={{ color: 'var(--accent-neon)' }}>Marketplace</Link> for the best premium tools.
          </p>
        </article>

        {/* Bottom Ad */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <AdBanner slotId="blog_bottom" />
        </div>
      </main>
    </div>
  );
}
