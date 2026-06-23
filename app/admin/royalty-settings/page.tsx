'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css';

export default function RoyaltySettings() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    platformCommission: 15,
    minPayoutThreshold: 50,
    payoutSchedule: 'weekly',
    autoApprovePayouts: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings({ ...settings, [name]: val });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Royalty settings saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 800);
  };

  return (
    <div className={styles.container}>
      <h2>Royalty & Commission Settings</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Configure the global commission rates and payout rules for vendors.</p>

      {message && (
        <div className={styles.successBox}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.section}>
          <h3>Revenue Share</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Platform Commission (%)</label>
              <input 
                type="number" 
                name="platformCommission" 
                min="0" max="100" 
                value={settings.platformCommission} 
                onChange={handleChange} 
                required 
              />
              <small style={{ color: 'var(--text-secondary)' }}>The percentage of each sale kept by the platform.</small>
            </div>
            <div className={styles.formGroup}>
              <label>Vendor Share (%)</label>
              <input 
                type="number" 
                value={100 - Number(settings.platformCommission)} 
                disabled 
                style={{ background: 'var(--bg-primary)', color: 'var(--success)' }}
              />
              <small style={{ color: 'var(--text-secondary)' }}>The percentage vendors receive.</small>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Payout Rules</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Minimum Payout Threshold ($)</label>
              <input 
                type="number" 
                name="minPayoutThreshold" 
                min="0" 
                value={settings.minPayoutThreshold} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Payout Schedule</label>
              <select name="payoutSchedule" value={settings.payoutSchedule} onChange={handleChange}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual Request Only</option>
              </select>
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="autoApprovePayouts" 
              name="autoApprovePayouts" 
              checked={settings.autoApprovePayouts} 
              onChange={handleChange} 
            />
            <label htmlFor="autoApprovePayouts">Auto-Approve Payout Requests (Not Recommended)</label>
          </div>
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
