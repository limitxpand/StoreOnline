'use client';

import { useState } from 'react';
import earningsStyles from './earnings.module.css';

export default function WithdrawButton({ availableAmount }: { availableAmount: number }) {
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (availableAmount < 50) {
      alert('Minimum withdrawal amount is $50.');
      return;
    }

    if (!confirm(`Are you sure you want to request a withdrawal of $${availableAmount.toFixed(2)}?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
      });
      if (res.ok) {
        alert('Withdrawal request submitted successfully! Admin will process it soon.');
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to request withdrawal');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={earningsStyles.withdrawBtn} 
      onClick={handleWithdraw}
      disabled={loading || availableAmount <= 0}
      style={{ opacity: loading || availableAmount <= 0 ? 0.6 : 1 }}
    >
      {loading ? 'Processing...' : 'Request Payout'}
    </button>
  );
}
