'use client';
import { useState, useEffect } from 'react';
import styles from '../settings/settings.module.css';

export default function SeoAdsManagement() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState({
    metaDescription: '',
    metaKeywords: '',
    ogImageUrl: '',
    adsenseClientId: '',
    enableAdsense: false
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings({
            metaDescription: data.settings.metaDescription || '',
            metaKeywords: data.settings.metaKeywords || '',
            ogImageUrl: data.settings.ogImageUrl || '',
            adsenseClientId: data.settings.adsenseClientId || '',
            enableAdsense: data.settings.enableAdsense || false
          });
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings({ ...settings, [name]: val });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('SEO & Ads settings saved successfully.');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
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
              name="metaKeywords" 
              value={settings.metaKeywords} 
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
              id="enableAdsense" 
              name="enableAdsense" 
              checked={settings.enableAdsense} 
              onChange={handleChange} 
            />
            <label htmlFor="enableAdsense">Enable AdSense Sitewide</label>
          </div>

          {settings.enableAdsense && (
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
