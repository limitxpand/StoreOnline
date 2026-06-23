'use client';
import { useState, useEffect } from 'react';
import styles from '../../dashboard/dashboard.module.css';

interface Product {
  id: string;
  title: string;
  platform: string;
  sourceFileUrl: string;
  logoUrl: string;
  developer: {
    name: string;
  };
}

export default function PendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [approving, setApproving] = useState<string | null>(null);
  const [autoInjecting, setAutoInjecting] = useState<string | null>(null);
  const [autoStatus, setAutoStatus] = useState<string>('');

  const fetchPendingProducts = async () => {
    try {
      const res = await fetch('/api/admin/pending-products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      } else {
        setError('Failed to load pending products.');
      }
    } catch (err) {
      setError('An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (id: string, isAuto: boolean) => {
    if (!isAuto) {
      const fileInput = document.getElementById(`upload-${id}`) as HTMLInputElement;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('Error: Uploading a compiled file (.ex4, .ex5, .zip, .apk) is required before publishing!');
        return;
      }
      const fileName = fileInput.files[0].name.toLowerCase();
      if (!fileName.endsWith('.ex4') && !fileName.endsWith('.ex5') && !fileName.endsWith('.zip') && !fileName.endsWith('.apk')) {
        alert('Error: Invalid format! Only .ex4, .ex5, .zip or .apk are allowed.');
        return;
      }
      setApproving(id);
    } else {
      setAutoInjecting(id);
      setAutoStatus('Opening File...');
      await new Promise(r => setTimeout(r, 1000));
      setAutoStatus('Injecting License...');
      await new Promise(r => setTimeout(r, 1500));
      setAutoStatus('Compiling Code...');
      await new Promise(r => setTimeout(r, 1500));
      setAutoStatus('Publishing...');
      await new Promise(r => setTimeout(r, 1000));
    }

    try {
      const res = await fetch(`/api/admin/pending-products/${id}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('Product successfully published to the marketplace!');
        // Remove from list
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Error approving product.');
      }
    } catch (err) {
      alert('An error occurred while publishing.');
    } finally {
      if (isAuto) {
        setAutoInjecting(null);
        setAutoStatus('');
      } else {
        setApproving(null);
      }
    }
  };

  if (loading) return <div className={styles.panel}><p>Loading pending products...</p></div>;
  if (error) return <div className={styles.panel}><p style={{color: 'var(--danger)'}}>{error}</p></div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Review Pending Uploads</h1>
        <p><strong>Manual Option:</strong> 1. Download source 2. Manually inject & compile 3. Upload protected file.<br/>
           <strong>Auto Option:</strong> Click "Auto Inject & Publish" to let the system do everything in one click!</p>
      </div>

      <div className={styles.panel}>
        {products.length === 0 ? (
          <p>No pending products to review.</p>
        ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>Product Details</th>
                <th style={{ padding: '1rem 0' }}>Original Source</th>
                <th style={{ padding: '1rem 0' }}>Injection & Publish Options <span style={{color: 'var(--danger)'}}>*</span></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const isApk = product.platform.toLowerCase() === 'android';
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={product.logoUrl} 
                          alt="Logo" 
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: 'var(--bg-tertiary)' }} 
                        />
                        <div>
                          <div style={{ fontWeight: '500', color: 'white' }}>{product.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>By {product.developer.name} • {product.platform}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <a href={product.sourceFileUrl} download style={{ 
                        display: 'inline-block',
                        background: 'var(--bg-tertiary)', 
                        textDecoration: 'none',
                        color: 'white', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', 
                        borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer'
                      }}>⬇️ Download File</a>
                    </td>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {!isApk && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-color)' }}>
                            <button 
                              onClick={() => handleApprove(product.id, true)}
                              disabled={autoInjecting === product.id}
                              style={{ 
                                background: 'var(--accent-neon)', 
                                color: '#000', border: 'none', padding: '0.5rem 1rem', 
                                borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
                                opacity: autoInjecting === product.id ? 0.7 : 1
                              }}>
                              {autoInjecting === product.id ? `⚙️ ${autoStatus}` : '⚡ Auto Inject & Publish'}
                            </button>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {!isApk && <input type="file" id={`upload-${product.id}`} accept=".ex4,.ex5,.zip" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} required />}
                          {isApk && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>(No injection needed)</span>}
                          <button 
                            onClick={() => handleApprove(product.id, false)}
                            style={{ 
                              background: isApk ? 'transparent' : 'var(--success)', 
                              color: 'white', 
                              border: isApk ? '1px solid var(--success)' : 'none', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '6px', fontWeight: '600', cursor: 'pointer' 
                            }}>
                            {approving === product.id ? 'Publishing...' : (isApk ? 'Approve & Publish' : 'Publish Protected File')}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
