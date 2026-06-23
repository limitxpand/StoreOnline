import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './category.module.css';

import { prisma } from '@/lib/prisma';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/'); // handle if there are multiple parts somehow, or just take first
  const catSlug = resolvedParams.slug[resolvedParams.slug.length - 1]; // take the last part as the actual category slug

  // Try to find the category
  const category = await prisma.category.findUnique({
    where: { slug: catSlug }
  });

  const categoryName = category ? `${category.platform} > ${category.name}` : catSlug.replace(/-/g, ' ').toUpperCase();

  const whereClause: any = { status: 'published' };
  
  if (category) {
    whereClause.categoryId = category.id;
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
            category={product.category?.name || category?.platform || 'Unknown'}
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
