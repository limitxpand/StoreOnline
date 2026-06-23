'use client';
import { useState } from 'react';
import styles from '../settings/settings.module.css';

export default function ProductManagement() {
  const [products, setProducts] = useState([
    { id: 1, title: 'Gold Scalper Pro EA', category: 'MT5 Expert Advisors', price: 149.00, isHidden: false, isFeatured: true },
    { id: 2, title: 'Advanced Indicator', category: 'MT4 Indicators', price: 29.00, isHidden: false, isFeatured: false },
    { id: 3, title: 'Utility Script', category: 'Scripts & Tools', price: 19.00, isHidden: true, isFeatured: false }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', category: '', price: '' });

  const handleToggleHide = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
  };

  const handleToggleFeature = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to completely delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([...products, { 
      id: Date.now(), 
      title: newProduct.title, 
      category: newProduct.category, 
      price: parseFloat(newProduct.price), 
      isHidden: false, 
      isFeatured: false 
    }]);
    setIsAdding(false);
    setNewProduct({ title: '', category: '', price: '' });
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Product Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Full control over all products on the marketplace.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={styles.saveBtn}
          style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
        >
          {isAdding ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className={styles.form} style={{ marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px' }}>
          <h3>Add Product Directly (Super Admin)</h3>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Product Title</label>
              <input type="text" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
            </div>
            <div className={styles.formGroup}>
              <label>Price ($)</label>
              <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            </div>
          </div>
          <button type="submit" className={styles.saveBtn} style={{ width: 'auto', padding: '0.75rem 2rem' }}>Publish Product</button>
        </form>
      )}

      <div className={styles.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0' }}>Product</th>
              <th style={{ padding: '1rem 0' }}>Category</th>
              <th style={{ padding: '1rem 0' }}>Price</th>
              <th style={{ padding: '1rem 0', textAlign: 'center' }}>Featured</th>
              <th style={{ padding: '1rem 0', textAlign: 'center' }}>Hidden</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{p.title}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{p.category}</td>
                <td style={{ padding: '1rem 0', color: 'var(--success)' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '1rem 0', textAlign: 'center' }}>
                  <input type="checkbox" checked={p.isFeatured} onChange={() => handleToggleFeature(p.id)} style={{ cursor: 'pointer' }} />
                </td>
                <td style={{ padding: '1rem 0', textAlign: 'center' }}>
                  <input type="checkbox" checked={p.isHidden} onChange={() => handleToggleHide(p.id)} style={{ cursor: 'pointer' }} />
                </td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(p.id)}
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
