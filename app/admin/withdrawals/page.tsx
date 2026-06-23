import styles from '../../dashboard/dashboard.module.css';

export default function Withdrawals() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Manage Withdrawals</h1>
        <p>Review and process contributor payout requests.</p>
      </div>

      <div className={styles.panel}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>Date</th>
                <th style={{ padding: '1rem 0' }}>Contributor</th>
                <th style={{ padding: '1rem 0' }}>Amount</th>
                <th style={{ padding: '1rem 0' }}>Wallet Address (USDT)</th>
                <th style={{ padding: '1rem 0' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>Oct 26, 2026</td>
                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>EA_Master</td>
                <td style={{ padding: '1rem 0', color: 'var(--warning)', fontWeight: '600' }}>$450.00</td>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>TYxyz123...abc987</td>
                <td style={{ padding: '1rem 0' }}>
                  <button style={{ 
                    background: 'var(--success)', 
                    color: 'white', border: 'none', padding: '0.5rem 1rem', 
                    borderRadius: '6px', fontWeight: '600' 
                  }}>Mark as Paid</button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>Oct 25, 2026</td>
                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'white' }}>TradeCoder</td>
                <td style={{ padding: '1rem 0', color: 'var(--warning)', fontWeight: '600' }}>$1,200.00</td>
                <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.85rem' }}>TXabc456...def123</td>
                <td style={{ padding: '1rem 0' }}>
                  <button style={{ 
                    background: 'var(--success)', 
                    color: 'white', border: 'none', padding: '0.5rem 1rem', 
                    borderRadius: '6px', fontWeight: '600' 
                  }}>Mark as Paid</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
