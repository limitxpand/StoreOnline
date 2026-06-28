'use client';
import { useState, useEffect } from 'react';
import styles from '../settings/settings.module.css';
import dashboardStyles from '../../dashboard/dashboard.module.css';
import { PaymentMethod, PaymentSettings as IPSettings } from '@/lib/settings';

export default function PaymentSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showProjectId, setShowProjectId] = useState(false);
  const [settings, setSettings] = useState<IPSettings>({
    enableCrypto: false,
    walletConnectProjectId: '',
    paymentMethods: []
  });

  useEffect(() => {
    fetch('/api/admin/payment-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings({
            enableCrypto: data.settings.enableCrypto ?? false,
            walletConnectProjectId: data.settings.walletConnectProjectId ?? '',
            paymentMethods: data.settings.paymentMethods ?? []
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMethodChange = (index: number, field: keyof PaymentMethod, value: string) => {
    const newMethods = [...settings.paymentMethods];
    newMethods[index] = { ...newMethods[index], [field]: value };
    setSettings(prev => ({ ...prev, paymentMethods: newMethods }));
  };

  const addMethod = (type: 'smart_contract' | 'deposit_address') => {
    const newMethod: PaymentMethod = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      network: 'BEP20',
      address: '',
      currency: 'USDT'
    };
    setSettings(prev => ({ ...prev, paymentMethods: [...prev.paymentMethods, newMethod] }));
  };

  const removeMethod = (index: number) => {
    const newMethods = settings.paymentMethods.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, paymentMethods: newMethods }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Payment gateways saved successfully.', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Failed to save settings.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'An error occurred while saving.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={dashboardStyles.pageHeader}>
        <h1>Payment Gateways Configuration</h1>
        <p>Manage how your marketplace accepts USDT payments.</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.successBox : styles.errorBox}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.section}>
          <h3>Global Web3 Settings</h3>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="enableCrypto" 
              name="enableCrypto" 
              checked={settings.enableCrypto} 
              onChange={handleChange} 
            />
            <label htmlFor="enableCrypto">Enable Crypto Payments (USDT)</label>
          </div>

          {settings.enableCrypto && (
            <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
              <label>WalletConnect Project ID</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showProjectId ? "text" : "password"} 
                  name="walletConnectProjectId" 
                  value={settings.walletConnectProjectId} 
                  onChange={handleChange} 
                  placeholder="e.g., fa5abff71a69afa78..."
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowProjectId(!showProjectId)}
                  style={{
                    position: 'absolute', right: '10px', background: 'transparent',
                    border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)'
                  }}
                  title={showProjectId ? "Hide Project ID" : "Show Project ID"}
                >
                  {showProjectId ? '🙈' : '👁️'}
                </button>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required for "Smart Contract" payment methods.</span>
            </div>
          )}
        </div>

        {settings.enableCrypto && (
          <div className={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3>Payment Methods</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => addMethod('smart_contract')} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Smart Contract (Auto)</button>
                <button type="button" onClick={() => addMethod('deposit_address')} style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Deposit Address (Manual)</button>
              </div>
            </div>

            {settings.paymentMethods.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No payment methods added. Click above to add one.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {settings.paymentMethods.map((method, index) => (
                <div key={method.id} style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h4 style={{ margin: 0, color: method.type === 'smart_contract' ? 'var(--accent-secondary)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {method.type === 'smart_contract' ? '⚡ Smart Contract (WalletConnect)' : '🏦 Manual Deposit Address'}
                    </h4>
                    <button type="button" onClick={() => removeMethod(index)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                      <label>Network</label>
                      <select 
                        value={method.network} 
                        onChange={(e) => handleMethodChange(index, 'network', e.target.value)}
                      >
                        <option value="BEP20">Binance Smart Chain (BEP20)</option>
                        {method.type === 'deposit_address' && <option value="TRC20">Tron (TRC20)</option>}
                      </select>
                    </div>
                    
                    <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                      <label>Receiving Wallet Address</label>
                      <input 
                        type="text" 
                        value={method.address} 
                        onChange={(e) => handleMethodChange(index, 'address', e.target.value)}
                        placeholder="0x..."
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
