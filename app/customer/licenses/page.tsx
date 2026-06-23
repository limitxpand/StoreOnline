import styles from '../../dashboard/dashboard.module.css';

export default function CustomerLicenses() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Licenses & Downloads</h1>
        <p>Manage your product licenses, check expiry dates, and download the compiled files.</p>
      </div>

      <div className={styles.panel}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>Product</th>
                <th style={{ padding: '1rem 0' }}>License Key</th>
                <th style={{ padding: '1rem 0' }}>Activations</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
                <th style={{ padding: '1rem 0' }}>Download</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>Gold Scalper Pro EA</td>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--accent-neon)' }}>STORE-8F2A-B9X1-L0QZ</td>
                <td style={{ padding: '1rem 0' }}>1 / 2</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Active</span>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <button style={{ 
                    background: 'var(--accent-secondary)', 
                    color: 'white', border: 'none', padding: '0.5rem 1rem', 
                    borderRadius: '6px', fontWeight: '600', cursor: 'pointer'
                  }}>Download .ex5</button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>Quantum Indicator</td>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--accent-neon)' }}>STORE-4R9M-Z2P8-K7W3</td>
                <td style={{ padding: '1rem 0' }}>1 / 1</td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Expired</span>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <button style={{ 
                    background: 'var(--bg-tertiary)', 
                    color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', 
                    borderRadius: '6px', fontWeight: '600', cursor: 'not-allowed'
                  }} disabled>Unavailable</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
