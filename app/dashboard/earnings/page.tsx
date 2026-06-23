import styles from '../dashboard.module.css';
import earningsStyles from './earnings.module.css';

export default function Earnings() {
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
            <p className={earningsStyles.highlightText}>$450.00</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statInfo}>
            <h3>Total Lifetime Earnings</h3>
            <p>$1,250.00</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💳</div>
          <div className={styles.statInfo}>
            <h3>Total Withdrawn</h3>
            <p>$800.00</p>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={earningsStyles.withdrawSection}>
          <div>
            <h3 className={styles.panelTitle} style={{ borderBottom: 'none', marginBottom: '0.5rem' }}>Request Withdrawal</h3>
            <p className={earningsStyles.withdrawHelp}>Minimum withdrawal amount is $50. Payments are made in crypto (USDT, BTC, ETH).</p>
          </div>
          <button className={earningsStyles.withdrawBtn}>Request Payout</button>
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Royalty Ledger</h3>
        
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
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>#TXN-84920</td>
                <td style={{ padding: '1rem 0' }}>Gold Scalper Pro EA</td>
                <td style={{ padding: '1rem 0' }}>$129.00</td>
                <td style={{ padding: '1rem 0', color: 'var(--danger)' }}>-$38.70</td>
                <td style={{ padding: '1rem 0', color: 'var(--success)' }}>+$90.30</td>
                <td style={{ padding: '1rem 0' }}><span className={earningsStyles.statusAvailable}>Available</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>#TXN-84915</td>
                <td style={{ padding: '1rem 0' }}>Quantum Indicator</td>
                <td style={{ padding: '1rem 0' }}>$89.00</td>
                <td style={{ padding: '1rem 0', color: 'var(--danger)' }}>-$26.70</td>
                <td style={{ padding: '1rem 0', color: 'var(--success)' }}>+$62.30</td>
                <td style={{ padding: '1rem 0' }}><span className={earningsStyles.statusWithdrawn}>Withdrawn</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
