'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css';

export default function SeoAdsManagement() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    metaDescription: 'The Ultimate Marketplace for MT4, MT5 Experts, Indicators, Utilities and Android APKs. Download secure, license-protected software.',
    keywords: 'MT4, MT5, Expert Advisor, Trading Bot, MQL5, Android APK, Buy Software',
    ogImageUrl: 'https://storeonline.com/og-image.jpg',
    adsenseClientId: 'ca-pub-XXXXXXXXXXXXXXXX',
    adsEnabled: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings({ ...settings, [name]: val });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('SEO & Ads settings saved successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 800);
  };

  return (
    <div className={styles.container}>
      <h2>SEO & Ads Management</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Optimize your marketplace for search engines and configure monetization.</p>

      {message && (
        <div className={styles.successBox}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.section}>
          <h3>Search Engine Optimization (SEO)</h3>
          
          <div className={styles.formGroup}>
            <label>Global Meta Description</label>
            <textarea 
              name="metaDescription" 
              value={settings.metaDescription} 
              onChange={handleChange} 
              rows={3} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Meta Keywords (Comma separated)</label>
            <input 
              type="text" 
              name="keywords" 
              value={settings.keywords} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>OpenGraph Image URL (Social Media Link Preview)</label>
            <input 
              type="url" 
              name="ogImageUrl" 
              value={settings.ogImageUrl} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Advertisement (Google AdSense)</h3>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="adsEnabled" 
              name="adsEnabled" 
              checked={settings.adsEnabled} 
              onChange={handleChange} 
            />
            <label htmlFor="adsEnabled">Enable AdSense Sitewide</label>
          </div>

          {settings.adsEnabled && (
            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label>AdSense Client ID (Publisher ID)</label>
              <input 
                type="text" 
                name="adsenseClientId" 
                value={settings.adsenseClientId} 
                onChange={handleChange} 
                placeholder="ca-pub-XXXXXXXXXXXXXXXX" 
                required 
              />
            </div>
          )}
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
