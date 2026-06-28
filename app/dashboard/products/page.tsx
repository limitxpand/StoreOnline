import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import styles from '../dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function ContributorProducts({ searchParams }: { searchParams: { status?: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return <div>Please log in to view your products.</div>;
  }

  const developerId = session.user.id;
  const statusFilter = searchParams.status || 'all';

  const whereClause: any = { developerId };
  if (statusFilter === 'active') {
    whereClause.status = 'published';
  } else if (statusFilter === 'pending') {
    whereClause.status = 'pending';
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>My Products</h1>
        <p>Manage all your uploaded applications and codes.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <a href="/dashboard/products" style={{ padding: '0.5rem 1rem', background: statusFilter === 'all' ? 'var(--primary-color)' : 'var(--bg-tertiary)', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>All</a>
        <a href="/dashboard/products?status=active" style={{ padding: '0.5rem 1rem', background: statusFilter === 'active' ? 'var(--primary-color)' : 'var(--bg-tertiary)', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>Active</a>
        <a href="/dashboard/products?status=pending" style={{ padding: '0.5rem 1rem', background: statusFilter === 'pending' ? 'var(--primary-color)' : 'var(--bg-tertiary)', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>Pending</a>
      </div>

      <div className={styles.panel}>
        <div style={{ overflowX: 'auto' }}>
          {products.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>Title</th>
                  <th style={{ padding: '1rem 0' }}>Platform</th>
                  <th style={{ padding: '1rem 0' }}>Price</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>{product.title}</td>
                    <td style={{ padding: '1rem 0' }}>{product.platform}</td>
                    <td style={{ padding: '1rem 0' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        backgroundColor: product.status === 'published' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                        color: product.status === 'published' ? 'var(--success)' : '#eab308'
                      }}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0' }}>{product.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
