import styles from '../settings/settings.module.css';
import { prisma } from '@/lib/prisma';
import AdminSearch from '@/components/AdminSearch';

export const dynamic = 'force-dynamic';

export default async function SalesManagement({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const transactions = await prisma.transaction.findMany({
    where: {
      status: { in: ['completed', 'demo'] },
      ...(q ? {
        OR: [
          { product: { title: { contains: q, mode: 'insensitive' } } },
          { product: { pid: { contains: q, mode: 'insensitive' } } },
          { user: { email: { contains: q, mode: 'insensitive' } } },
          { user: { name: { contains: q, mode: 'insensitive' } } }
        ]
      } : {})
    },
    include: {
      product: true,
      user: true,
      royalty: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <h2>Marketplace Sales</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>View all completed transactions and platform revenue.</p>

      <div style={{ marginBottom: '2rem' }}>
        <AdminSearch placeholder="Search by PID, product title or buyer email..." />
      </div>

      <div className={styles.section}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 0' }}>Date</th>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>Buyer</th>
                <th style={{ padding: '1rem 0' }}>Amount</th>
                <th style={{ padding: '1rem 0' }}>Type</th>
                <th style={{ padding: '1rem 0' }}>Platform Revenue (30%)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No sales or downloads found.</td>
                </tr>
              ) : transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>
                    {tx.createdAt.toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 0', fontWeight: '500' }}>
                    <div>{tx.product?.title || 'Unknown Product'}</div>
                    {tx.product?.pid && <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{tx.product.pid}</div>}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <div>{tx.user?.name || tx.user?.username || 'Unknown'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{tx.user?.email}</div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--success)' }}>
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {tx.status === 'demo' ? (
                      <span style={{ padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-secondary)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>Demo</span>
                    ) : (
                      <span style={{ padding: '4px 12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>Purchase</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--accent-neon)' }}>
                    ${(tx.royalty?.platformFee || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
