'use client';
import { useState, useEffect } from 'react';
import styles from '../settings/settings.module.css';
import dashboardStyles from '../../dashboard/dashboard.module.css';

export default function DatabaseSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [dbSettings, setDbSettings] = useState({
    dbType: 'postgresql',
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    password: '',
    database: 'storeonline',
    connectionUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDbSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setMessage({ text: 'Testing connection...', type: 'info' });
    
    // Simulate connection test
    setTimeout(() => {
      setTesting(false);
      setMessage({ text: 'Connection successful! (Simulated)', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      setMessage({ text: 'Database configuration saved successfully. A server restart may be required.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={dashboardStyles.pageHeader}>
        <h1>Database Settings</h1>
        <p>Manage your database connection parameters and run maintenance tasks.</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? styles.successBox : (message.type === 'info' ? styles.infoBox : styles.errorBox)} style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : message.type === 'info' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? 'var(--success)' : message.type === 'info' ? 'var(--accent-primary)' : 'var(--danger)',
          border: `1px solid ${message.type === 'success' ? 'var(--success)' : message.type === 'info' ? 'var(--accent-primary)' : 'var(--danger)'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Connection Details</h3>
          
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Database Type</label>
              <select name="dbType" value={dbSettings.dbType} onChange={handleChange}>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
                <option value="mongodb">MongoDB</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Database Host</label>
              <input type="text" name="host" value={dbSettings.host} onChange={handleChange} placeholder="e.g. localhost or db.example.com" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Port</label>
              <input type="number" name="port" value={dbSettings.port} onChange={handleChange} placeholder="5432" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Database Name</label>
              <input type="text" name="database" value={dbSettings.database} onChange={handleChange} placeholder="storeonline" />
            </div>

            <div className={styles.formGroup}>
              <label>Username</label>
              <input type="text" name="username" value={dbSettings.username} onChange={handleChange} />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" name="password" value={dbSettings.password} onChange={handleChange} placeholder="••••••••" />
            </div>
          </div>
          
          <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
            <label>Direct Connection URL (Overrides above fields)</label>
            <input type="url" name="connectionUrl" value={dbSettings.connectionUrl} onChange={handleChange} placeholder="postgresql://user:password@localhost:5432/mydb" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Warning: Modifying the active database connection can bring down the application if credentials are incorrect.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={handleTestConnection} disabled={testing} style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}>
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
