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
    contactEmail: '',
    logoUrl: '',
    faviconUrl: '',
    floatingLogoUrl: '',
    logoRadius: 'none',
    logoRemoveBg: false,
    floatingLogoRadius: 'none',
    floatingLogoRemoveBg: false,
    floatingLogoShadow: false
  });
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(prev => ({ ...prev, [fieldName]: true }));
      
      const formData = new FormData();
      formData.append('file', file);
      if (settings[fieldName as keyof typeof settings]) {
        formData.append('oldFileUrl', settings[fieldName as keyof typeof settings] as string);
      }

      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setSettings({ ...settings, [fieldName]: data.url });
          setMessage({ text: 'Image uploaded successfully.', type: 'success' });
        } else {
          setMessage({ text: 'Failed to upload image.', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Error uploading image.', type: 'error' });
      } finally {
        setUploading(prev => ({ ...prev, [fieldName]: false }));
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      }
    }
  };

  const handleDeleteImage = async (fieldName: string) => {
    const fileUrl = settings[fieldName as keyof typeof settings] as string;
    if (!fileUrl) return;
    
    setUploading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const res = await fetch('/api/upload-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl })
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, [fieldName]: '' });
        setMessage({ text: 'Image deleted successfully.', type: 'success' });
      } else {
        setMessage({ text: 'Failed to delete image.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error deleting image.', type: 'error' });
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const getPreviewStyle = (fieldName: string) => {
    let style: React.CSSProperties = {
      maxWidth: '250px', 
      maxHeight: '120px', 
      objectFit: 'contain', 
      border: '1px solid var(--border-color)', 
      background: 'var(--bg-secondary)', 
      padding: '0.5rem',
      transition: 'all 0.3s ease'
    };

    if (fieldName === 'logoUrl') {
      if (settings.logoRadius === 'rounded') style.borderRadius = '12px';
      else if (settings.logoRadius === 'circle') style.borderRadius = '50%';
      else style.borderRadius = '0';
      if (settings.logoRemoveBg) style.mixBlendMode = 'multiply';
    } else if (fieldName === 'floatingLogoUrl') {
      if (settings.floatingLogoRadius === 'rounded') style.borderRadius = '12px';
      else if (settings.floatingLogoRadius === 'circle') style.borderRadius = '50%';
      else style.borderRadius = '0';
      if (settings.floatingLogoRemoveBg) style.mixBlendMode = 'multiply';
      if (settings.floatingLogoShadow) style.filter = 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))';
    } else {
      style.borderRadius = '8px'; // default for favicon
    }

    return style;
  };

  const renderImageUploader = (label: string, fieldName: string, recommendedSize: string, hasStyles = false) => {
    const isUploading = uploading[fieldName];
    const imageUrl = settings[fieldName as keyof typeof settings] as string;

    return (
      <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
        <label>{label} <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '8px'}}>({recommendedSize})</span></label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
          {imageUrl ? (
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <img src={imageUrl} alt={`${label} Preview`} style={getPreviewStyle(fieldName)} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label style={{ cursor: 'pointer', background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, display: 'inline-block', transition: 'background 0.2s' }}>
                  {isUploading ? 'Uploading...' : 'Update'}
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, fieldName)} style={{ display: 'none' }} disabled={isUploading} />
                </label>
                <button type="button" onClick={() => handleDeleteImage(fieldName)} disabled={isUploading} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.2s' }}>
                  Delete
                </button>
              </div>
              
              {hasStyles && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                   <h4 style={{marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Styling Options (Live Preview)</h4>
                   <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                         <label style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Edge Style</label>
                         <select 
                           name={fieldName === 'logoUrl' ? 'logoRadius' : 'floatingLogoRadius'} 
                           value={settings[fieldName === 'logoUrl' ? 'logoRadius' : 'floatingLogoRadius'] as string} 
                           onChange={handleChange}
                           style={{ padding: '0.5rem', borderRadius: '4px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                         >
                            <option value="none">Square (Default)</option>
                            <option value="rounded">Rounded</option>
                            <option value="circle">Circle</option>
                         </select>
                      </div>
                      <div className={styles.checkboxGroup} style={{marginTop: '1.8rem'}}>
                         <input type="checkbox" id={`${fieldName}-bg`} name={fieldName === 'logoUrl' ? 'logoRemoveBg' : 'floatingLogoRemoveBg'} checked={settings[fieldName === 'logoUrl' ? 'logoRemoveBg' : 'floatingLogoRemoveBg'] as boolean} onChange={handleChange} />
                         <label htmlFor={`${fieldName}-bg`}>Remove Background (Multiply)</label>
                      </div>
                      {fieldName === 'floatingLogoUrl' && (
                        <div className={styles.checkboxGroup} style={{marginTop: '1.8rem'}}>
                           <input type="checkbox" id={`${fieldName}-shadow`} name="floatingLogoShadow" checked={settings.floatingLogoShadow as boolean} onChange={handleChange} />
                           <label htmlFor={`${fieldName}-shadow`}>Add 3D Shadow</label>
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <label style={{ cursor: 'pointer', background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 500, display: 'inline-block', transition: 'background 0.2s' }}>
              {isUploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, fieldName)} style={{ display: 'none' }} disabled={isUploading} />
            </label>
          )}
        </div>
      </div>
    );
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
          <h3>Logos and Branding</h3>
          
          {renderImageUploader('Main Website Logo', 'logoUrl', 'Recommended height: 40-60px', true)}
          {renderImageUploader('Website Favicon', 'faviconUrl', 'Recommended size: 32x32 pixels (PNG/ICO)', false)}
          {renderImageUploader('Hero Floating Logo (Optional)', 'floatingLogoUrl', 'Recommended size: 200x200 pixels', true)}
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
