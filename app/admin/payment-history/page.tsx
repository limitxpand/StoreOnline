'use client';
import { useState, useEffect } from 'react';
import styles from '../../dashboard/dashboard.module.css';

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/payment-history');
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getExplorerLink = (network: string, txHash: string) => {
    if (network === 'BEP20' || network === 'Binance Smart Chain (BEP20)') {
      return `https://bscscan.com/tx/${txHash}`;
    }
    if (network === 'TRC20' || network === 'Tron (TRC20)') {
      return `https://tronscan.org/#/transaction/${txHash}`;
    }
    return '#';
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Loading payment history...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div className={styles.pageHeader}>
        <h1>All Payment History</h1>
        <p>View all auto (Smart Contract) and manual (Deposit Address) transactions.</p>
      </div>

      {transactions.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No payment history found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Network</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{tx.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tx.user?.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{tx.product?.title || 'Unknown Product'}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    ${tx.amount} USDT
                  </td>
                  <td style={{ padding: '1rem' }}>{tx.network || 'Unknown'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600,
                      background: tx.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : tx.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: tx.status === 'completed' ? 'var(--success)' : tx.status === 'pending' ? '#f59e0b' : 'var(--danger)',
                      border: `1px solid ${tx.status === 'completed' ? 'var(--success)' : tx.status === 'pending' ? '#f59e0b' : 'var(--danger)'}`
                    }}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {tx.txHash ? (
                      <a 
                        href={getExplorerLink(tx.network, tx.txHash)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          background: 'var(--accent-primary)',
                          color: 'white',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: 600
                        }}
                      >
                        🔍 Track Payment
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No TxID</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
