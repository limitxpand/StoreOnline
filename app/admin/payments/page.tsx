'use client';
import { useState, useEffect } from 'react';
import styles from '../settings/settings.module.css';
import dashboardStyles from '../../dashboard/dashboard.module.css';

export default function PaymentSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [settings, setSettings] = useState({
    enableCrypto: false,
    walletConnectProjectId: '',
    adminWalletAddress: '',
    cryptoCurrency: 'USDT'
  });

  useEffect(() => {
    fetch('/api/admin/payment-settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings({
            enableCrypto: data.settings.enableCrypto ?? false,
            walletConnectProjectId: data.settings.walletConnectProjectId ?? '',
            adminWalletAddress: data.settings.adminWalletAddress ?? '',
            cryptoCurrency: data.settings.cryptoCurrency ?? 'USDT'
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings({ ...settings, [name]: val });
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

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <div className={dashboardStyles.pageHeader}>
        <h1>Payment Gateways Configuration</h1>
        <p>Manage how your marketplace accepts payments from customers.</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.successBox : styles.errorBox}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.section}>
          <h3>Web3 Crypto Payments (WalletConnect)</h3>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="enableCrypto" 
              name="enableCrypto" 
              checked={settings.enableCrypto} 
              onChange={handleChange} 
            />
            <label htmlFor="enableCrypto">Enable Direct Crypto Payments</label>
          </div>

          {settings.enableCrypto && (
            <>
              <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                <label>WalletConnect Project ID</label>
                <input 
                  type="password" 
                  name="walletConnectProjectId" 
                  value={settings.walletConnectProjectId} 
                  onChange={handleChange} 
                  placeholder="Get this from cloud.walletconnect.com"
                  required 
                />
                <small style={{ color: 'var(--text-secondary)' }}>Required to enable Web3Modal for mobile wallet connections.</small>
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Receiving Wallet Address</label>
                  <input 
                    type="text" 
                    name="adminWalletAddress" 
                    value={settings.adminWalletAddress} 
                    onChange={handleChange} 
                    placeholder="0x..."
                    required 
                  />
                  <small style={{ color: 'var(--text-secondary)' }}>Your wallet address where funds will be sent.</small>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Accepted Cryptocurrency</label>
                  <select name="cryptoCurrency" value={settings.cryptoCurrency} onChange={handleChange}>
                    <option value="USDT">USDT (Tether)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
