import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './category.module.css';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug;
  const categoryName = slugs.map(s => s.replace(/-/g, ' ').toUpperCase()).join(' > ');

  // Mock products for the category
  const mockProducts = [
    { id: 1, title: 'Pro EA Template', category: categoryName, type: slugs[0].toUpperCase(), price: 49.00, rating: 4.8, reviews: 12, image: '' },
    { id: 2, title: 'Advanced Indicator', category: categoryName, type: slugs[0].toUpperCase(), price: 29.00, rating: 4.5, reviews: 8, image: '' },
    { id: 3, title: 'Utility Script', category: categoryName, type: slugs[0].toUpperCase(), price: 19.00, rating: 4.9, reviews: 45, image: '' },
  ];

  return (
    <>
      <div style={{ width: '100%', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{categoryName}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Browse the best digital products in this category.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', width: '100%' }}>
              {mockProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  title={product.title}
                  category={product.category}
                  type={product.type}
                  price={product.price}
                  rating={product.rating}
                  reviews={product.reviews}
                  image={product.image}
                />
              ))}
            </div>
            
      {mockProducts.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
          No products found in this category yet.
        </div>
      )}
    </>
  );
}
