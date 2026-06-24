import styles from '../dashboard.module.css';
import earningsStyles from './earnings.module.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WithdrawButton from './WithdrawButton';

export const dynamic = 'force-dynamic';

export default async function Earnings() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const developerId = session.user.id;

  // Fetch all royalties for this developer
  const royalties = await prisma.royalty.findMany({
    where: { developerId },
    include: {
      transaction: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate stats
  let availableAmount = 0;
  let lifetimeEarnings = 0;
  
  royalties.forEach(r => {
    lifetimeEarnings += r.royaltyAmount;
    if (r.status === 'pending') {
      availableAmount += r.royaltyAmount;
    }
  });

  // Fetch completed withdrawals to verify exact withdrawn amount
  const withdrawals = await prisma.withdrawal.findMany({
    where: { developerId, status: 'completed' }
  });

  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Earnings & Royalties</h1>
        <p>Track your sales and request withdrawals to your crypto wallet.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💸</div>
          <div className={styles.statInfo}>
            <h3>Available to Withdraw</h3>
            <p className={earningsStyles.highlightText}>${availableAmount.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statInfo}>
            <h3>Total Lifetime Earnings</h3>
            <p>${lifetimeEarnings.toFixed(2)}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💳</div>
          <div className={styles.statInfo}>
            <h3>Total Withdrawn</h3>
            <p>${totalWithdrawn.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={earningsStyles.withdrawSection}>
          <div>
            <h3 className={styles.panelTitle} style={{ borderBottom: 'none', marginBottom: '0.5rem' }}>Request Withdrawal</h3>
            <p className={earningsStyles.withdrawHelp}>Minimum withdrawal amount is $50. Payments are made in crypto (USDT, BTC, ETH).</p>
          </div>
          <WithdrawButton availableAmount={availableAmount} />
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Royalty Ledger</h3>
        
        {royalties.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No sales yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0' }}>Transaction ID</th>
                  <th style={{ padding: '1rem 0' }}>Product</th>
                  <th style={{ padding: '1rem 0' }}>Sale Price</th>
                  <th style={{ padding: '1rem 0' }}>Admin Fee (30%)</th>
                  <th style={{ padding: '1rem 0' }}>Your Earn (70%)</th>
                  <th style={{ padding: '1rem 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {royalties.map(royalty => (
                  <tr key={royalty.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{royalty.transaction.id.substring(0, 8)}</td>
                    <td style={{ padding: '1rem 0' }}>{royalty.transaction.product.title}</td>
                    <td style={{ padding: '1rem 0' }}>${royalty.saleAmount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--danger)' }}>-${royalty.platformFee.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--success)' }}>+${royalty.royaltyAmount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span className={royalty.status === 'pending' ? earningsStyles.statusAvailable : earningsStyles.statusWithdrawn}>
                        {royalty.status === 'pending' ? 'Available' : 'Withdrawn'}
                      </span>
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
