'use client';

import { useState } from 'react';

export default function CheckoutButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (err) {
      alert('An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
        display: 'block',
        width: '100%',
        padding: '1.25rem',
        background: 'var(--success)',
        color: 'white',
        textAlign: 'center',
        borderRadius: '8px',
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Processing...' : 'Pay with Cryptomus'}
    </button>
  );
}
