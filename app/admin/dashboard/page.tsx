import styles from '../../dashboard/dashboard.module.css';

export default function AdminDashboard() {
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
            <p>$15,400.00</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>💵</div>
          <div className={styles.statInfo}>
            <h3>Platform Revenue (30%)</h3>
            <p>$4,620.00</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>⏳</div>
          <div className={styles.statInfo}>
            <h3>Pending Source Codes</h3>
            <p>5</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-neon)' }}>💸</div>
          <div className={styles.statInfo}>
            <h3>Pending Payouts</h3>
            <p>2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
