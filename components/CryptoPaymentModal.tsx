'use client';
import { useState } from 'react';
import { PaymentMethod } from '@/lib/settings';
import WalletConnectButton from './WalletConnectButton';

export default function CryptoPaymentModal({
  isOpen,
  onClose,
  price,
  productId,
  paymentMethods,
  walletConnectProjectId,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  productId: string;
  paymentMethods: PaymentMethod[];
  walletConnectProjectId: string;
  onSuccess: (txHash?: string) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod || !txHash) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/customer/submit-txid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          txHash,
          network: selectedMethod.network,
          amount: price
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Failed to submit transaction ID');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#1f2937', width: '100%', maxWidth: '500px', 
        borderRadius: '12px', overflow: 'hidden', border: '1px solid #374151'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f3f4f6' }}>Select Payment Method</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Transaction Submitted!</h3>
              <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                Your transaction is currently pending. Once the admin verifies the payment, your download will be unlocked automatically.
              </p>
              <button 
                onClick={onClose}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close Window
              </button>
            </div>
          ) : !selectedMethod ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: '#9ca3af' }}>Select how you would like to pay <strong>${price} USDT</strong>:</p>
              
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.2rem', background: '#374151', border: '1px solid #4b5563',
                    borderRadius: '8px', cursor: 'pointer', color: 'white', transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#374151'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {method.type === 'smart_contract' ? '⚡' : '🏦'}
                    </span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {method.type === 'smart_contract' ? 'Auto Crypto Payment' : 'Manual Deposit'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                        {method.network} - {method.currency}
                      </div>
                    </div>
                  </div>
                  <span style={{ color: '#60a5fa' }}>&rarr;</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setSelectedMethod(null)}
                style={{ background: 'transparent', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                &larr; Back to methods
              </button>

              {selectedMethod.type === 'smart_contract' ? (
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#f3f4f6' }}>Pay via Web3 Wallet</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Click the button below to connect your wallet (e.g., MetaMask, TrustWallet) and pay <strong>${price} USDT</strong> automatically on the {selectedMethod.network} network.
                  </p>
                  <WalletConnectButton
                    price={price}
                    cryptoCurrency={selectedMethod.currency}
                    adminWalletAddress={selectedMethod.address}
                    walletConnectProjectId={walletConnectProjectId}
                    onSuccess={(tx) => {
                      onSuccess(tx);
                      onClose();
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#f3f4f6' }}>Manual Deposit ({selectedMethod.network})</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Send exactly <strong>${price} {selectedMethod.currency}</strong> on the <strong>{selectedMethod.network}</strong> network to the address below, then enter the Transaction ID (TxHash) to verify your payment.
                  </p>
                  
                  <div style={{ background: '#111827', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #374151' }}>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Admin Deposit Address</div>
                    <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', color: '#10b981', fontSize: '1.1rem' }}>
                      {selectedMethod.address}
                    </div>
                  </div>

                  <form onSubmit={handleManualSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#d1d5db', fontSize: '0.9rem' }}>Transaction ID (TxHash)</label>
                      <input 
                        type="text" 
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder="Enter the transaction hash..."
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #4b5563', background: '#374151', color: 'white', boxSizing: 'border-box' }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !txHash}
                      style={{ 
                        width: '100%', padding: '1rem', background: '#3b82f6', color: 'white', 
                        border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isSubmitting || !txHash ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting || !txHash ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'I have made the payment'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
