'use client';
import { useState, useEffect } from 'react';
import styles from '../../dashboard/dashboard.module.css';

export default function PendingPayments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/pending-payments');
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

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

    try {
      const res = await fetch(`/api/admin/pending-payments/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchTransactions(); // refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to perform action');
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading pending payments...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div className={styles.pageHeader}>
        <h1>Pending Manual Payments</h1>
        <p>Review and approve manual USDT deposit transactions.</p>
      </div>

      {transactions.length === 0 ? (
        <div style={{ background: '#1f2937', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#9ca3af' }}>
          No pending payments to review.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {transactions.map(tx => (
            <div key={tx.id} style={{ background: '#1f2937', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#f3f4f6' }}>Order: {tx.product.title}</h3>
                  <p style={{ margin: 0, color: '#9ca3af' }}>Amount Due: <strong style={{ color: '#10b981' }}>${tx.amount} USDT</strong></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#f3f4f6' }}>Buyer: {tx.user.name} ({tx.user.email})</p>
                  <p style={{ margin: 0, color: '#9ca3af' }}>Date: {new Date(tx.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div style={{ background: '#111827', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.9rem' }}>Network: <strong style={{ color: '#fff' }}>{tx.network}</strong></p>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                  TxID: <strong style={{ color: '#60a5fa' }}>{tx.txHash}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleAction(tx.id, 'approve')}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
                >
                  Approve Payment
                </button>
                <button 
                  onClick={() => handleAction(tx.id, 'reject')}
                  style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', flex: 1, fontWeight: 'bold' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
