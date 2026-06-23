import styles from '../../dashboard/dashboard.module.css';

export default function AdminLicenses() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Manage Product Licenses</h1>
        <p>View issued licenses, reset hardware locks, and revoke access for piracy violations.</p>
      </div>

      <div className={styles.panel}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>License Key</th>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>Customer</th>
                <th style={{ padding: '1rem 0' }}>HWID Locked</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
                <th style={{ padding: '1rem 0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--accent-neon)' }}>STORE-8F2A-B9X1-L0QZ</td>
                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>Gold Scalper Pro EA</td>
                <td style={{ padding: '1rem 0' }}>John Doe</td>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>BFEBFBFF000906EA</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Active</span>
                </td>
                <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                  <button style={{ 
                    background: 'var(--bg-tertiary)', 
                    color: 'white', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', 
                    borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer'
                  }}>Reset HWID</button>
                  <button style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.4rem 0.8rem', 
                    borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer'
                  }}>Revoke</button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--text-muted)' }}>STORE-4R9M-Z2P8-K7W3</td>
                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>Quantum Indicator</td>
                <td style={{ padding: '1rem 0' }}>Jane Smith</td>
                <td style={{ padding: '1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not Locked</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Revoked</span>
                </td>
                <td style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem' }}>
                  <button style={{ 
                    background: 'var(--bg-tertiary)', 
                    color: 'white', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', 
                    borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer'
                  }}>Restore</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
