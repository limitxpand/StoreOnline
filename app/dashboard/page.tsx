import styles from './dashboard.module.css';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ContributorDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const developerId = session.user.id;

  // Fetch metrics
  const activeProducts = await prisma.product.count({
    where: { developerId, status: 'published' }
  });

  const pendingProducts = await prisma.product.count({
    where: { developerId, status: 'pending' }
  });

  const totalSales = await prisma.royalty.count({
    where: { developerId }
  });

  const earningsData = await prisma.royalty.aggregate({
    _sum: { royaltyAmount: true },
    where: { developerId, status: 'paid' }
  });

  const totalEarnings = earningsData._sum.royaltyAmount || 0;

  // Fetch recent sales and downloads (Transactions)
  const recentSales = await prisma.transaction.findMany({
    where: { 
      product: { developerId },
      status: 'completed'
    },
    include: {
      product: true,
      user: {
        select: { name: true, id: true }
      },
      royalty: true
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your products today.</p>
      </div>

      <div className={styles.statsGrid}>
        <Link href="/dashboard/earnings" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...{ ':hover': { transform: 'translateY(-2px)' } } as any }}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <h3>Total Earnings</h3>
              <p>${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/products?status=active" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statInfo}>
              <h3>Active Products</h3>
              <p>{activeProducts}</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/products?status=pending" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statInfo}>
              <h3>Pending Review</h3>
              <p>{pendingProducts}</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/sales" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div className={styles.statIcon}>🛒</div>
            <div className={styles.statInfo}>
              <h3>Total Sales</h3>
              <p>{totalSales}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className={styles.panelTitle} style={{ margin: 0 }}>Recent Sales & Downloads</h3>
          <Link href="/dashboard/sales" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>
            View All →
          </Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          {recentSales.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>Product</th>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0' }}>Price</th>
                  <th style={{ padding: '1rem 0' }}>Your Royalty (70%)</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 'bold' }}>{sale.product.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UID: {sale.user?.id || 'Unknown'}</div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>{sale.createdAt.toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0' }}>${sale.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--success)' }}>
                      {sale.royalty ? `+$${sale.royalty.royaltyAmount.toFixed(2)}` : '$0.00'}
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        backgroundColor: sale.amount > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        color: sale.amount > 0 ? 'var(--success)' : 'var(--text-muted)'
                      }}>
                        {sale.amount > 0 ? 'Purchase' : 'Download'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
              No sales recorded yet. Your successful sales will appear here!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
