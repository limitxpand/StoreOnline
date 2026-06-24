'use client';
import { useState } from 'react';

export default function MarkPaidButton({ withdrawalId }: { withdrawalId: string }) {
  const [loading, setLoading] = useState(false);

  const handleMarkPaid = async () => {
    if (!confirm('Are you sure you want to mark this withdrawal as Paid? This will also mark all pending royalties for this developer as paid.')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        alert('Withdrawal marked as Paid successfully.');
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to approve withdrawal');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleMarkPaid}
      disabled={loading}
      style={{ 
        background: 'var(--success)', 
        color: 'white', border: 'none', padding: '0.5rem 1rem', 
        borderRadius: '6px', fontWeight: '600', cursor: 'pointer',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? 'Processing...' : 'Mark as Paid'}
    </button>
  );
}
