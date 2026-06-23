import styles from './dashboard.module.css';

export default function ContributorDashboard() {
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
            <p>$1,250.00</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statInfo}>
            <h3>Active Products</h3>
            <p>3</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statInfo}>
            <h3>Pending Review</h3>
            <p>1</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🛒</div>
          <div className={styles.statInfo}>
            <h3>Total Sales</h3>
            <p>24</p>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Recent Sales</h3>
        
        {/* Placeholder Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>Date</th>
                <th style={{ padding: '1rem 0' }}>Price</th>
                <th style={{ padding: '1rem 0' }}>Your Royalty (70%)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>Gold Scalper Pro EA</td>
                <td style={{ padding: '1rem 0' }}>Oct 24, 2026</td>
                <td style={{ padding: '1rem 0' }}>$129.00</td>
                <td style={{ padding: '1rem 0', color: 'var(--success)' }}>+$90.30</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>Quantum Indicator</td>
                <td style={{ padding: '1rem 0' }}>Oct 23, 2026</td>
                <td style={{ padding: '1rem 0' }}>$89.00</td>
                <td style={{ padding: '1rem 0', color: 'var(--success)' }}>+$62.30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
