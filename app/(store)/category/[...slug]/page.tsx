import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './category.module.css';

import { prisma } from '@/lib/prisma';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug;
  
  // Format the name for display
  const categoryName = slugs.map(s => s.replace(/-/g, ' ').toUpperCase()).join(' > ');

  // E.g., slugs = ['mt4', 'expert-advisors']
  const platform = slugs[0]?.toUpperCase();
  const catSlug = slugs.length > 1 ? `${slugs[0]}-${slugs[1]}` : null;

  let whereClause: any = { status: 'published' };
  if (platform) {
    whereClause.platform = platform;
  }
  
  if (catSlug) {
    whereClause.category = { slug: catSlug };
  } else if (slugs.length === 1 && slugs[0] !== 'all') {
    whereClause.platform = platform;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      developer: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div style={{ width: '100%', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{categoryName}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Browse the best digital products in this category.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {products.map((product: any) => (
          <ProductCard 
            key={product.id}
            title={product.title}
            slug={product.slug}
            category={product.category?.name || platform}
            type={product.platform}
            price={product.price}
            rating={5.0}
            reviews={0}
            image={product.logoUrl || ''}
          />
        ))}
      </div>
            
      {products.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
          No products found in this category yet.
        </div>
      )}
    </>
  );
}
