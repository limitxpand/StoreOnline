import styles from '../../dashboard/dashboard.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const totalBuyers = await prisma.user.count({ where: { role: 'customer' } });
  const totalSellers = await prisma.user.count({ where: { role: 'developer' } });
  const totalUsers = await prisma.user.count();
  const pendingProducts = await prisma.product.count({ where: { status: 'pending' } });
  const pendingWithdrawalsCount = await prisma.withdrawal.count({ where: { status: 'pending' } });

  // Calculate Total Sales
  const completedTransactions = await prisma.transaction.findMany({
    where: { status: 'completed' }
  });
  const totalSales = completedTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate Platform Revenue
  const allRoyalties = await prisma.royalty.findMany();
  const platformRevenue = allRoyalties.reduce((sum, r) => sum + r.platformFee, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Super Admin Overview</h1>
        <p>Manage the platform, review products, and process payouts.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>🛍️</div>
          <div className={styles.statInfo}>
            <h3>Total Marketplace Sales</h3>
            <p>${totalSales.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>💵</div>
          <div className={styles.statInfo}>
            <h3>Platform Revenue (30%)</h3>
            <p>${platformRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>⏳</div>
          <div className={styles.statInfo}>
            <h3>Pending Source Codes</h3>
            <p>{pendingProducts}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-neon)' }}>💸</div>
          <div className={styles.statInfo}>
            <h3>Pending Payouts</h3>
            <p>{pendingWithdrawalsCount}</p>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid} style={{ marginTop: '2rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>👥</div>
          <div className={styles.statInfo}>
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>🧑‍💻</div>
          <div className={styles.statInfo}>
            <h3>Total Sellers</h3>
            <p>{totalSellers}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6' }}>🛒</div>
          <div className={styles.statInfo}>
            <h3>Total Buyers</h3>
            <p>{totalBuyers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
