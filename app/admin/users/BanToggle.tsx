'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BanToggle({ userId, isBanned }: { userId: string, isBanned: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    const action = isBanned ? 'unban' : 'ban';
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBanned: !isBanned })
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert(`Failed to ${action} user.`);
      }
    } catch (e) {
      console.error(e);
      alert(`Error trying to ${action} user.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      style={{ 
        background: isBanned ? 'var(--success)' : 'var(--warning)', 
        color: 'white', 
        border: 'none', 
        padding: '0.4rem 0.8rem', 
        borderRadius: '4px', 
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        marginRight: '0.5rem'
      }}
    >
      {loading ? '...' : isBanned ? 'Unban' : 'Ban'}
    </button>
  );
}
