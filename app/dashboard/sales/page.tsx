import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import styles from '../dashboard.module.css';

export const dynamic = 'force-dynamic';

export default async function ContributorSales() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return <div>Please log in to view your sales and downloads.</div>;
  }

  const developerId = session.user.id;

  // Fetch all transactions (downloads and sales) for this developer's products
  const transactions = await prisma.transaction.findMany({
    where: { 
      product: { developerId },
      status: 'completed'
    },
    include: {
      product: true,
      user: {
        select: {
          name: true,
          email: true,
          id: true // This is the UID
        }
      },
      royalty: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Sales & Downloads</h1>
        <p>Track who is downloading and purchasing your products.</p>
      </div>

      <div className={styles.panel}>
        <div style={{ overflowX: 'auto' }}>
          {transactions.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>Product (PID)</th>
                  <th style={{ padding: '1rem 0' }}>Customer (UID)</th>
                  <th style={{ padding: '1rem 0' }}>Date</th>
                  <th style={{ padding: '1rem 0' }}>Type</th>
                  <th style={{ padding: '1rem 0' }}>Price</th>
                  <th style={{ padding: '1rem 0' }}>Your Royalty</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 'bold' }}>{tx.product.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PID: {tx.product.id}</div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 'bold' }}>{tx.user.name || 'Unknown User'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UID: {tx.user.id}</div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>{tx.createdAt.toLocaleDateString()}</td>
                    <td style={{ padding: '1rem 0' }}>
                      {tx.amount > 0 ? (
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Purchase</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Free Download</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 0' }}>${tx.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      {tx.royalty ? (
                        <span style={{ color: 'var(--success)' }}>+${tx.royalty.royaltyAmount.toFixed(2)}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>$0.00</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
              No sales or downloads recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
