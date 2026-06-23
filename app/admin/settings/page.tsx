'use client';
import { useState, useEffect } from 'react';
import styles from './settings.module.css';

export default function WebsiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [settings, setSettings] = useState({
    siteName: '',
    heroTitle: '',
    heroSubtitle: '',
    theme: 'dark',
    primaryColor: '#3b82f6',
    enableAdsense: true,
    contactEmail: ''
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSettings(data.settings);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Settings saved successfully! These changes will apply to the live site.', type: 'success' });
      } else {
        setMessage({ text: 'Failed to save settings.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <h2>Website Customization</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update your website's appearance and text dynamically.</p>

      {message.text && (
        <div className={message.type === 'success' ? styles.successBox : styles.errorBox}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>General Settings</h3>
          
          <div className={styles.formGroup}>
            <label>Site Name</label>
            <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Contact Email</label>
            <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Homepage Banner</h3>
          
          <div className={styles.formGroup}>
            <label>Hero Title</label>
            <input type="text" name="heroTitle" value={settings.heroTitle} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
            <label>Hero Subtitle</label>
            <textarea name="heroSubtitle" value={settings.heroSubtitle} onChange={handleChange} rows={4} required></textarea>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Appearance & Integrations</h3>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Theme</label>
              <select name="theme" value={settings.theme} onChange={handleChange}>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Primary Color</label>
              <input type="color" name="primaryColor" value={settings.primaryColor} onChange={handleChange} style={{ height: '40px', padding: '2px' }} />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="enableAdsense" name="enableAdsense" checked={settings.enableAdsense} onChange={handleChange} />
            <label htmlFor="enableAdsense">Enable Google AdSense Banners</label>
          </div>
        </div>

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
