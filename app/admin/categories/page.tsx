'use client';
import { useState, useEffect } from 'react';
import styles from '../settings/settings.module.css';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPlatform, setNewCatPlatform] = useState('MT4');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullSlug = `${newCatPlatform.toLowerCase()}-${slug}`;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, platform: newCatPlatform, slug: fullSlug })
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.category]);
        setNewCatName('');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete API not yet implemented. This is just a UI update.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading categories...</div>;

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
              value={newCatName} 
              onChange={e => setNewCatName(e.target.value)} 
              placeholder="e.g. Indicators"
              required 
            />
          </div>
          <div className={styles.formGroup} style={{ width: '150px', marginBottom: 0 }}>
            <label>Platform</label>
            <select value={newCatPlatform} onChange={e => setNewCatPlatform(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'white' }}>
              <option value="MT4">MT4</option>
              <option value="MT5">MT5</option>
              <option value="Android">Android</option>
            </select>
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
              <th style={{ padding: '1rem 0' }}>Platform</th>
              <th style={{ padding: '1rem 0' }}>Slug</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{cat.name}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{cat.platform}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{cat.slug}</td>
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
