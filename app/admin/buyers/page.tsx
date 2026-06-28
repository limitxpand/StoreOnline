import styles from '../settings/settings.module.css';
import { prisma } from '@/lib/prisma';
import AdminSearch from '@/components/AdminSearch';
import DeleteUserButton from '../users/DeleteUserButton';

export const dynamic = 'force-dynamic';

export default async function BuyersManagement({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const buyers = await prisma.user.findMany({
    where: {
      role: 'customer',
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } }
        ]
      } : {})
    },
    include: {
      _count: {
        select: { transactions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <h2>Buyers Directory</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>View and search all registered buyers (customers) on the platform.</p>

      <div style={{ marginBottom: '2rem' }}>
        <AdminSearch placeholder="Search by name, email, or username..." />
      </div>

      <div className={styles.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0' }}>Name / Email</th>
              <th style={{ padding: '1rem 0' }}>Total Purchases</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No buyers found.</td>
              </tr>
            ) : buyers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ fontWeight: 500 }}>{u.name || u.username || 'Unnamed'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{u._count.transactions} items</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <DeleteUserButton userId={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
