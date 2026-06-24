import styles from '../../dashboard/dashboard.module.css';
import { prisma } from '@/lib/prisma';
import MarkPaidButton from './MarkPaidButton';

export const dynamic = 'force-dynamic';

export default async function Withdrawals() {
  const withdrawals = await prisma.withdrawal.findMany({
    where: { status: 'pending' },
    include: {
      developer: {
        select: { name: true, username: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Manage Withdrawals</h1>
        <p>Review and process contributor payout requests.</p>
      </div>

      <div className={styles.panel}>
        {withdrawals.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No pending withdrawals.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0' }}>Contributor</th>
                  <th style={{ padding: '1rem 0' }}>Amount</th>
                  <th style={{ padding: '1rem 0' }}>Wallet Info</th>
                  <th style={{ padding: '1rem 0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>{w.createdAt.toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>
                      {w.developer.name || w.developer.username} <br/>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.developer.email}</span>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--warning)', fontWeight: '600' }}>${w.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>Send to registered wallet</td>
                    <td style={{ padding: '1rem 0' }}>
                      <MarkPaidButton withdrawalId={w.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
