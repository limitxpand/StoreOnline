import Link from 'next/link';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';


export default function AllCategories() {
  const allCategories = [
    { name: 'MT5 Expert Advisors', slug: '/category/mt5/expert-advisors', icon: '📈', count: 124 },
    { name: 'MT5 Indicators', slug: '/category/mt5/indicators', icon: '📉', count: 89 },
    { name: 'MT4 Expert Advisors', slug: '/category/mt4/expert-advisors', icon: '📊', count: 210 },
    { name: 'MT4 Indicators', slug: '/category/mt4/indicators', icon: '📊', count: 156 },
    { name: 'Android Game APK', slug: '/category/android-game-apk', icon: '📱', count: 45 },
    { name: 'Software APK', slug: '/category/software-apk', icon: '💻', count: 32 },
    { name: 'Scripts & Tools', slug: '/category/scripts-&-tools', icon: '⚙️', count: 78 },
    { name: 'Templates', slug: '/category/templates', icon: '🎨', count: 112 },
    { name: 'E-books', slug: '/category/e-books', icon: '📚', count: 56 },
  ];

  return (
    <>
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>All Categories</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore our wide range of digital products and tools.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', width: '100%', marginTop: '2rem' }}>
        {allCategories.map((cat, i) => (
          <Link key={i} href={cat.slug} style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'var(--bg-secondary)', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            >
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{cat.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cat.count} Products</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '12px', marginTop: '2rem' }}>
        More categories coming soon...
      </div>
    </>
  );
}
