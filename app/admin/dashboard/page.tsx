import styles from '../../dashboard/dashboard.module.css';
import { prisma } from '@/lib/prisma';
import { getWebsiteSettings } from '@/lib/settings';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    totalBuyers,
    totalSellers,
    totalUsers,
    pendingProducts,
    pendingWithdrawalsCount,
    openTicketsCount,
    totalSalesAgg,
    platformRevenueAgg,
    totalDemos
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.user.count({ where: { role: 'developer' } }),
    prisma.user.count(),
    prisma.product.count({ where: { status: 'pending' } }),
    prisma.withdrawal.count({ where: { status: 'pending' } }),
    prisma.ticket.count({ where: { status: 'open' } }),
    prisma.transaction.aggregate({
      where: { status: 'completed' },
      _sum: { amount: true }
    }),
    prisma.royalty.aggregate({
      _sum: { platformFee: true }
    }),
    prisma.transaction.count({ where: { status: 'demo' } })
  ]);

  const totalSales = totalSalesAgg._sum.amount || 0;
  const platformRevenue = platformRevenueAgg._sum.platformFee || 0;
  
  const settings = await getWebsiteSettings();
  const injectionUrl = settings.injectionModuleUrl || 'https://dashboard-ff4p.vercel.app/';

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Super Admin Overview</h1>
        <p>Manage the platform, review products, and process payouts.</p>
      </div>

      <div className={styles.statsGrid}>
        <Link href="/admin/sales" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>🛍️</div>
            <div className={styles.statInfo}>
              <h3>Total Marketplace Sales</h3>
              <p>${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/sales" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>💵</div>
            <div className={styles.statInfo}>
              <h3>Platform Revenue (30%)</h3>
              <p>${platformRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/sales" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-secondary)' }}>⬇️</div>
            <div className={styles.statInfo}>
              <h3>Demo Downloads</h3>
              <p>{totalDemos}</p>
            </div>
          </div>
        </Link>
        <a href={injectionUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--accent-primary)', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)' }}>💉</div>
            <div className={styles.statInfo}>
              <h3>Injection Module</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Launch External Dashboard</p>
            </div>
          </div>
        </a>
        <Link href="/admin/pending-products" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            {pendingProducts > 0 && (
              <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                {pendingProducts}
              </div>
            )}
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>⏳</div>
            <div className={styles.statInfo}>
              <h3>Pending Source Codes</h3>
              <p>{pendingProducts}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/withdrawals" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            {pendingWithdrawalsCount > 0 && (
              <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                {pendingWithdrawalsCount}
              </div>
            )}
            <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-neon)' }}>💸</div>
            <div className={styles.statInfo}>
              <h3>Pending Payouts</h3>
              <p>{pendingWithdrawalsCount}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/support" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            {openTicketsCount > 0 && (
              <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                {openTicketsCount}
              </div>
            )}
            <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>💬</div>
            <div className={styles.statInfo}>
              <h3>Open Tickets</h3>
              <p>{openTicketsCount}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className={styles.statsGrid} style={{ marginTop: '2rem' }}>
        <Link href="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>👥</div>
            <div className={styles.statInfo}>
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/sellers" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>🧑‍💻</div>
            <div className={styles.statInfo}>
              <h3>Total Sellers</h3>
              <p>{totalSellers}</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/buyers" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={styles.statCard} style={{ cursor: 'pointer', transition: 'transform 0.2s', ...({ ':hover': { transform: 'scale(1.02)' } } as any) }}>
            <div className={styles.statIcon} style={{ background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6' }}>🛒</div>
            <div className={styles.statInfo}>
              <h3>Total Buyers</h3>
              <p>{totalBuyers}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
