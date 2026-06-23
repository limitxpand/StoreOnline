'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'MT5 Expert Advisors', slug: 'mt5-ea', productCount: 12 },
    { id: 2, name: 'MT4 Indicators', slug: 'mt4-indicators', productCount: 8 },
    { id: 3, name: 'Android APKs', slug: 'android-apk', productCount: 45 },
    { id: 4, name: 'Templates', slug: 'templates', productCount: 5 }
  ]);
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const newCategory = {
      id: Date.now(),
      name: newCat,
      slug: newCat.toLowerCase().replace(/ /g, '-'),
      productCount: 0
    };
    setCategories([...categories, newCategory]);
    setNewCat('');
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className={styles.container}>
      <h2>Category Management</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add or remove categories for the marketplace.</p>

      <form onSubmit={handleAdd} className={styles.form} style={{ marginBottom: '2rem' }}>
        <div className={styles.section} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className={styles.formGroup} style={{ flex: 1, marginBottom: 0 }}>
            <label>New Category Name</label>
            <input 
              type="text" 
              value={newCat} 
              onChange={e => setNewCat(e.target.value)} 
              placeholder="e.g. Windows Software"
              required 
            />
          </div>
          <button type="submit" className={styles.saveBtn} style={{ padding: '0.75rem 1.5rem', height: 'fit-content' }}>
            Add Category
          </button>
        </div>
      </form>

      <div className={styles.section}>
        <h3>Existing Categories</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0' }}>Name</th>
              <th style={{ padding: '1rem 0' }}>Slug</th>
              <th style={{ padding: '1rem 0' }}>Products</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{cat.name}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{cat.slug}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{cat.productCount}</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
