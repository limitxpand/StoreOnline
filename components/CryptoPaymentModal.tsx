'use client';
import { useState } from 'react';
import { PaymentMethod } from '@/lib/settings';
import WalletConnectButton from './WalletConnectButton';
import QRCode from 'react-qr-code';

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
  const [isHidden, setIsHidden] = useState(false);
  const [copyCopied, setCopyCopied] = useState(false);

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

  const copyToClipboard = () => {
    if (selectedMethod) {
      navigator.clipboard.writeText(selectedMethod.address);
      setCopyCopied(true);
      setTimeout(() => setCopyCopied(false), 2000);
    }
  };

  const pasteTxHash = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTxHash(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: isHidden ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-secondary, #121826)', width: '100%', maxWidth: '500px', 
        borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        color: 'var(--text-primary, #ffffff)'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary, #ffffff)' }}>Select Payment Method</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted, #718096)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: 'var(--success, #10b981)', marginBottom: '1rem' }}>Transaction Submitted!</h3>
              <p style={{ color: 'var(--text-secondary, #a0aec0)', marginBottom: '2rem' }}>
                Your transaction is currently pending. Once the admin verifies the payment, your download will be unlocked automatically.
              </p>
              <button 
                onClick={onClose}
                style={{ background: 'var(--accent-primary, #4f46e5)', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Close Window
              </button>
            </div>
          ) : !selectedMethod ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary, #a0aec0)' }}>Select how you would like to pay <strong>${price} USDT</strong>:</p>
              
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.2rem', background: 'var(--bg-tertiary, #1c2438)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                    borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary, #ffffff)', transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-primary, #0a0e17)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-tertiary, #1c2438)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {method.type === 'smart_contract' ? '⚡' : '🏦'}
                    </span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {method.type === 'smart_contract' ? 'Auto Crypto Payment' : 'Manual Deposit'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #718096)', marginTop: '0.2rem' }}>
                        {method.network} - {method.currency}
                      </div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--accent-secondary, #0ea5e9)' }}>&rarr;</span>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setSelectedMethod(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-secondary, #0ea5e9)', cursor: 'pointer', padding: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                &larr; Back to methods
              </button>

              {selectedMethod.type === 'smart_contract' ? (
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary, #ffffff)' }}>Pay via Web3 Wallet</h3>
                  <p style={{ color: 'var(--text-secondary, #a0aec0)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Click the button below to connect your wallet (e.g., MetaMask, TrustWallet) and pay <strong>${price} USDT</strong> automatically on the {selectedMethod.network} network.
                  </p>
                  <WalletConnectButton
                    price={price}
                    cryptoCurrency={selectedMethod.currency}
                    adminWalletAddress={selectedMethod.address}
                    walletConnectProjectId={walletConnectProjectId}
                    onInteractionStart={() => setIsHidden(true)}
                    onSuccess={(tx) => {
                      onSuccess(tx);
                      onClose();
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary, #ffffff)' }}>Manual Deposit ({selectedMethod.network})</h3>
                  <p style={{ color: 'var(--text-secondary, #a0aec0)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Send exactly <strong>${price} {selectedMethod.currency}</strong> on the <strong>{selectedMethod.network}</strong> network.
                  </p>
                  
                  <div style={{ background: 'var(--bg-primary, #0a0e17)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: 'white', padding: '10px', borderRadius: '8px', marginBottom: '1rem' }}>
                      <QRCode value={selectedMethod.address} size={150} />
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary, #1c2438)', padding: '0.5rem 1rem', borderRadius: '6px' }}>
                      <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--success, #10b981)', fontSize: '0.9rem' }}>
                        {selectedMethod.address}
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        style={{ marginLeft: '1rem', background: 'var(--accent-primary, #4f46e5)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        {copyCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleManualSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary, #a0aec0)', fontSize: '0.9rem' }}>Transaction ID (TxHash)</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          value={txHash}
                          onChange={(e) => setTxHash(e.target.value)}
                          placeholder="Paste the transaction hash..."
                          required
                          style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', background: 'var(--bg-tertiary, #1c2438)', color: 'var(--text-primary, #ffffff)', boxSizing: 'border-box' }}
                        />
                        <button 
                          type="button"
                          onClick={pasteTxHash}
                          style={{ background: 'var(--bg-primary, #0a0e17)', color: 'var(--text-secondary, #a0aec0)', border: '1px solid var(--border-color, rgba(255,255,255,0.08))', padding: '0 1rem', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Paste
                        </button>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !txHash}
                      style={{ 
                        width: '100%', padding: '1rem', background: 'var(--accent-primary, #4f46e5)', color: 'white', 
                        border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isSubmitting || !txHash ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting || !txHash ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Verify Payment'}
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
