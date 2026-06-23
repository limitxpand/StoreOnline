'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css'; // Reusing the same CSS

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangeCredentials = async () => {
    if (!password) {
      setMessage({ text: 'Current password is required.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_credentials', currentPassword: password, newUsername, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Credentials updated successfully!', type: 'success' });
        setNewUsername('');
        setNewPassword('');
        setPassword('');
      } else {
        setMessage({ text: data.message || 'Failed to update credentials.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_secret', password, secretCode })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Secret code updated successfully!', type: 'success' });
        setPassword('');
        setSecretCode('');
      } else {
        setMessage({ text: data.message || 'Failed to update secret code.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: '600px' }}>
      <h2>Security & Access</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Change your master Secret Code used for password recovery.</p>

      {message.text && (
        <div className={message.type === 'success' ? styles.successBox : styles.errorBox}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Update Credentials</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Change your admin username and password.
          </p>

          <div className={styles.formGroup}>
            <label>Current Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Required to make any changes"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>New Username</label>
            <input 
              type="text" 
              value={newUsername} 
              onChange={e => setNewUsername(e.target.value)} 
              placeholder="Leave blank to keep current"
            />
          </div>

          <div className={styles.formGroup}>
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Leave blank to keep current"
            />
          </div>

          <button type="button" onClick={handleChangeCredentials} className={styles.saveBtn} disabled={loading} style={{ marginBottom: '2rem' }}>
            {loading ? 'Updating...' : 'Update Credentials'}
          </button>
        </div>

        <div className={styles.section}>
          <h3>Update Secret Code</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--danger)', marginBottom: '1rem' }}>
            Warning: Do not lose your secret code. It is the only way to recover your admin account.
          </p>
          
          <div className={styles.formGroup}>
            <label>New Secret Code</label>
            <input 
              type="text" 
              value={secretCode} 
              onChange={e => setSecretCode(e.target.value)} 
              placeholder="e.g. 123456"
            />
          </div>

          <button type="submit" className={styles.saveBtn} disabled={loading} style={{ background: 'var(--danger)' }}>
            {loading ? 'Updating...' : 'Update Secret Code'}
          </button>
        </div>
      </form>
    </div>
  );
}
