'use client';
import { useState, useEffect } from 'react';
import styles from '../settings/settings.module.css';

export default function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to completely delete this product? This will also remove related transactions.')) {
      try {
        const res = await fetch(`/api/admin/products?id=${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setProducts(products.filter(p => p.id !== id));
        } else {
          alert('Failed to delete product.');
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading products...</div>;

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Product Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Approve or reject developer uploads.</p>
        </div>
      </div>

      <div className={styles.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 0' }}>Product</th>
              <th style={{ padding: '1rem 0' }}>Category</th>
              <th style={{ padding: '1rem 0' }}>Developer</th>
              <th style={{ padding: '1rem 0' }}>Price</th>
              <th style={{ padding: '1rem 0', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{p.title}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{p.platform} {p.category?.name}</td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{p.developer?.name}</td>
                <td style={{ padding: '1rem 0', color: 'var(--success)' }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: '1rem 0', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: p.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: p.status === 'published' ? '#10b981' : '#f59e0b'
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                  {p.status !== 'published' && (
                    <button 
                      onClick={() => handleUpdateStatus(p.id, 'published')}
                      style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                      Approve
                    </button>
                  )}
                  {p.status === 'published' && (
                    <button 
                      onClick={() => handleUpdateStatus(p.id, 'pending')}
                      style={{ background: 'var(--text-muted)', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}
                    >
                      Unpublish
                    </button>
                  )}
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
