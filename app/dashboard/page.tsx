import styles from './dashboard.module.css';
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

  // Fetch recent sales (Royalties)
  const recentSales = await prisma.royalty.findMany({
    where: { developerId },
    include: {
      transaction: {
        include: {
          product: true
        }
      }
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
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statInfo}>
            <h3>Total Earnings</h3>
            <p>${totalEarnings.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statInfo}>
            <h3>Active Products</h3>
            <p>{activeProducts}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statInfo}>
            <h3>Pending Review</h3>
            <p>{pendingProducts}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🛒</div>
          <div className={styles.statInfo}>
            <h3>Total Sales</h3>
            <p>{totalSales}</p>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Recent Sales</h3>
        
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
                    <td style={{ padding: '1rem 0' }}>{sale.transaction.product.title}</td>
                    <td style={{ padding: '1rem 0' }}>{sale.createdAt.toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0' }}>${sale.transaction.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--success)' }}>+${sale.royaltyAmount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        backgroundColor: sale.status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                        color: sale.status === 'paid' ? 'var(--success)' : '#eab308'
                      }}>
                        {sale.status}
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
