'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css';

export default function PaymentSettings() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    cryptoEnabled: true,
    nowpaymentsApiKey: 'NP_XXXXXXXXXXXXXXXXXXXXXXX',
    btcWalletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    fiatEnabled: false,
    stripeSecretKey: '',
    stripePublishableKey: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings({ ...settings, [name]: val });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Payment gateways saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 800);
  };

  return (
    <div className={styles.container}>
      <h2>Payment Gateways Configuration</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage how your marketplace accepts payments from customers.</p>

      {message && (
        <div className={styles.successBox}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.section}>
          <h3>Crypto Payments (NowPayments)</h3>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="cryptoEnabled" 
              name="cryptoEnabled" 
              checked={settings.cryptoEnabled} 
              onChange={handleChange} 
            />
            <label htmlFor="cryptoEnabled">Enable Crypto Payments</label>
          </div>

          {settings.cryptoEnabled && (
            <>
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>NowPayments API Key</label>
                <input 
                  type="password" 
                  name="nowpaymentsApiKey" 
                  value={settings.nowpaymentsApiKey} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Backup Receiving BTC Wallet</label>
                <input 
                  type="text" 
                  name="btcWalletAddress" 
                  value={settings.btcWalletAddress} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.section}>
          <h3>Fiat Payments (Credit/Debit Card)</h3>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="fiatEnabled" 
              name="fiatEnabled" 
              checked={settings.fiatEnabled} 
              onChange={handleChange} 
            />
            <label htmlFor="fiatEnabled">Enable Stripe Payments</label>
          </div>

          {settings.fiatEnabled && (
            <>
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Stripe Publishable Key</label>
                <input 
                  type="text" 
                  name="stripePublishableKey" 
                  value={settings.stripePublishableKey} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Stripe Secret Key</label>
                <input 
                  type="password" 
                  name="stripeSecretKey" 
                  value={settings.stripeSecretKey} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </>
          )}
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
