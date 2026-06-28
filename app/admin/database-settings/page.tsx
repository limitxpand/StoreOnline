import styles from '../../dashboard/dashboard.module.css';

export const dynamic = 'force-dynamic';

export default function DatabaseSettings() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Database Settings</h1>
        <p>Manage your database connection and backups here.</p>
      </div>

      <div className={styles.panel}>
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🗄️</span>
          <h3>Database configuration coming soon</h3>
          <p>This module will allow you to manage database connections, run backups, and optimize tables.</p>
        </div>
      </div>
    </div>
  );
}
