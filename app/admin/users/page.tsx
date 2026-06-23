'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css';

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joined: '2023-10-15', purchases: 5 },
    { id: 2, name: 'Vendor Tech', email: 'contact@vendortech.com', role: 'contributor', status: 'active', joined: '2023-11-01', purchases: 0 },
    { id: 3, name: 'Spammer', email: 'spam@spam.com', role: 'customer', status: 'banned', joined: '2024-01-05', purchases: 0 }
  ]);

  const handleToggleBan = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'banned' ? 'active' : 'banned' };
      }
      return u;
    }));
  };

  const handleDelete = (id: number) => {
    if (confirm('WARNING: This will permanently delete the user and all their associated data. Continue?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <h2>User Management</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage all registered customers and vendors.</p>

      <div className={styles.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0' }}>Name / Email</th>
              <th style={{ padding: '1rem 0' }}>Role</th>
              <th style={{ padding: '1rem 0' }}>Status</th>
              <th style={{ padding: '1rem 0' }}>Purchases</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ fontWeight: 500 }}>{u.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: u.role === 'contributor' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: u.role === 'contributor' ? '#3b82f6' : 'var(--text-secondary)'
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: u.status === 'banned' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: u.status === 'banned' ? 'var(--danger)' : 'var(--success)'
                  }}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{u.purchases} items</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleToggleBan(u.id)}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {u.status === 'banned' ? 'Unban' : 'Ban'}
                  </button>
                  <button 
                    onClick={() => handleDelete(u.id)}
                    style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
