'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('WARNING: This will permanently delete the user and all their associated data. Continue?')) {
      return;
    }
    setLoading(true);
    try {
      // Assuming a DELETE /api/admin/users route exists, if not it will fail gracefully 
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete user.');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      style={{ 
        background: 'var(--danger)', 
        color: 'white', 
        border: 'none', 
        padding: '0.4rem 0.8rem', 
        borderRadius: '4px', 
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
