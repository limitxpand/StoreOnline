'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../dashboard.module.css';
import uploadStyles from '../upload/upload.module.css';

export default function UploadAPK() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [platform, setPlatform] = useState('Android');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [source, setSource] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!logo || !source) {
      setError('Please provide both logo and APK files.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('platform', platform);
    formData.append('description', description);
    formData.append('logo', logo);
    formData.append('source', source);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Android App uploaded successfully! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong during upload.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Upload Android APK</h1>
        <p>Submit your Android application for admin review before it goes live.</p>
      </div>

      <div className={styles.panel}>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        
        {success ? (
          <div className={uploadStyles.successCard}>
            <div className={uploadStyles.successIcon}>✅</div>
            <h2 className={uploadStyles.successTitle}>Successfully Uploaded!</h2>
            <p className={uploadStyles.successText}>{success}</p>
          </div>
        ) : (
          <form className={uploadStyles.form} onSubmit={handleSubmit}>
          <div className={uploadStyles.grid}>
            <div className={uploadStyles.inputGroup}>
              <label>App Name</label>
              <input type="text" placeholder="e.g. Pro Trading Signals" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            
            <div className={uploadStyles.inputGroup}>
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="trading-app">Trading App</option>
                <option value="signals">Signal Provider App</option>
                <option value="utility">Utility / Tools</option>
              </select>
            </div>

            <div className={uploadStyles.inputGroup}>
              <label>Suggested Price ($)</label>
              <input type="number" placeholder="29.00" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>

            <div className={uploadStyles.inputGroup}>
              <label>Minimum Android Version</label>
              <select required>
                <option value="android-10">Android 10+</option>
                <option value="android-11">Android 11+</option>
                <option value="android-12">Android 12+</option>
                <option value="android-9">Android 9+</option>
              </select>
            </div>
          </div>

          <div className={uploadStyles.inputGroup}>
            <label>Description & Features</label>
            <textarea rows={5} placeholder="Describe your Android app's features..." value={description} onChange={e => setDescription(e.target.value)} required></textarea>
          </div>

          <div className={uploadStyles.fileGroup}>
            <label>Product Logo Image <span style={{color: 'var(--danger)'}}>*</span></label>
            <div className={uploadStyles.fileDropzone} style={{ padding: '2rem 1.5rem', minHeight: '150px' }}>
              <span className={uploadStyles.uploadIcon}>🖼️</span>
              <p>{logo ? logo.name : 'Drag and drop your logo here or click to browse'}</p>
              <input type="file" accept=".gif,.png,.jpg,.jpeg" className={uploadStyles.fileInput} onChange={e => setLogo(e.target.files?.[0] || null)} required />
            </div>
            <p className={uploadStyles.helpText}>
              Size: for the card - 200x200 pixels | Format: GIF, PNG, JPG, JPEG
            </p>
          </div>

          <div className={uploadStyles.fileGroup}>
            <label>Upload Android App (.apk) <span style={{color: 'var(--danger)'}}>*</span></label>
            <div className={uploadStyles.fileDropzone}>
              <span className={uploadStyles.uploadIcon}>📱</span>
              <p>{source ? source.name : 'Drag and drop your .apk file here or click to browse'}</p>
              <input type="file" accept=".apk" className={uploadStyles.fileInput} onChange={e => setSource(e.target.files?.[0] || null)} required />
            </div>
            <p className={uploadStyles.helpText}>
              Your APK will be thoroughly scanned for malware and security vulnerabilities before approval.
            </p>
          </div>

          <button type="submit" className={uploadStyles.submitBtn} disabled={loading}>
            {loading ? 'Uploading...' : 'Submit APK for Review'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
