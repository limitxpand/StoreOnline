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
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', file);
      if (settings.ogImageUrl) {
        formData.append('oldFileUrl', settings.ogImageUrl);
      }

      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setSettings({ ...settings, ogImageUrl: data.url });
          setMessage('Image uploaded successfully.');
        } else {
          setMessage('Failed to upload image.');
        }
      } catch (error) {
        setMessage('Error uploading image.');
      } finally {
        setUploadingImage(false);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!settings.ogImageUrl) return;
    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: settings.ogImageUrl })
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, ogImageUrl: '' });
        setMessage('Image deleted successfully.');
      } else {
        setMessage('Failed to delete image.');
      }
    } catch (error) {
      setMessage('Error deleting image.');
    } finally {
      setUploadingImage(false);
      setTimeout(() => setMessage(''), 3000);
    }
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
            <label>OpenGraph Image (Social Media Link Preview)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              {settings.ogImageUrl ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={settings.ogImageUrl} alt="OpenGraph Preview" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <label className={styles.btnSecondary} style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                      {uploadingImage ? 'Uploading...' : 'Update Image'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                    </label>
                    <button type="button" onClick={handleDeleteImage} disabled={uploadingImage} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <label className={styles.btnSecondary} style={{ cursor: 'pointer' }}>
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                </label>
              )}
            </div>
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
