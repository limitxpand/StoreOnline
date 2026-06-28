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
    enableAdsense: false,
    demoAdsenseCode: '',
    demoAdTimer: 15,
    enableDemoAd: false
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
            enableAdsense: data.settings.enableAdsense || false,
            demoAdsenseCode: data.settings.demoAdsenseCode || '',
            demoAdTimer: data.settings.demoAdTimer || 15,
            enableDemoAd: data.settings.enableDemoAd || false
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

  const handleSave = async (e?: React.FormEvent, customSuccessMessage?: string) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage(customSuccessMessage || 'SEO & Ads settings saved successfully.');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      setMessage('Error saving settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleSaveAndInject = async () => {
    await handleSave(undefined, 'Settings saved and successfully injected into Search Engines! (Live Update)');
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
            <label>OpenGraph Image (Social Media Link Preview) <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '8px'}}>(Recommended size: 1200x630 pixels)</span></label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
              {settings.ogImageUrl ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={settings.ogImageUrl} alt="OpenGraph Preview" style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <label style={{ cursor: 'pointer', background: 'var(--accent-primary)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 500, display: 'inline-block', transition: 'background 0.2s' }}>
                      {uploadingImage ? 'Uploading...' : 'Update Image'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                    </label>
                    <button type="button" onClick={handleDeleteImage} disabled={uploadingImage} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500, transition: 'background 0.2s' }}>
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <label style={{ cursor: 'pointer', background: 'var(--accent-primary)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 500, display: 'inline-block', transition: 'background 0.2s' }}>
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

        <div className={styles.section}>
          <h3>Ad-Locked Downloads (Pre-Download Demo Ad)</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Enter your AdSense Ad Unit Code (HTML) here. Users will be required to view this ad for the specified timer duration before they can download a Demo product.
          </p>

          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              id="enableDemoAd" 
              name="enableDemoAd" 
              checked={settings.enableDemoAd} 
              onChange={handleChange} 
            />
            <label htmlFor="enableDemoAd">Enable Ad-Locked Downloads</label>
          </div>

          {settings.enableDemoAd && (
            <>
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>AdSense Ad Unit Code (HTML)</label>
                <textarea 
                  name="demoAdsenseCode" 
                  value={settings.demoAdsenseCode} 
                  onChange={handleChange} 
                  placeholder="<ins class='adsbygoogle' ...></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>" 
                  rows={5}
                />
              </div>
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Timer Duration (Seconds)</label>
                <input 
                  type="number" 
                  name="demoAdTimer" 
                  value={settings.demoAdTimer} 
                  onChange={handleChange} 
                  min="1"
                  max="120"
                  placeholder="15" 
                />
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button 
            type="button" 
            onClick={handleSaveAndInject} 
            disabled={saving}
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)', 
              color: 'white', 
              border: 'none', 
              padding: '1rem 2rem', 
              fontSize: '1rem', 
              fontWeight: 600, 
              borderRadius: '8px', 
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {saving ? 'Injecting...' : 'Save & Inject 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
}
