'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ImpersonateButton({ userId, role }: { userId: string, role: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImpersonate = async () => {
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        impersonateId: userId,
        // We have to pass email/password to satisfy the type, but they won't be checked
        email: 'impersonate',
        password: 'impersonate'
      });

      if (res?.ok) {
        if (role === 'customer') {
          router.push('/customer/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        alert('Failed to impersonate user. Ensure you are logged in as admin.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleImpersonate}
      disabled={loading}
      style={{ 
        background: 'rgba(16, 185, 129, 0.1)', 
        color: '#10b981', 
        border: '1px solid #10b981', 
        padding: '0.4rem 0.8rem', 
        borderRadius: '4px', 
        cursor: 'pointer',
        marginRight: '0.5rem',
        opacity: loading ? 0.7 : 1
      }}
      title="Login as this user"
    >
      {loading ? '...' : 'View Dashboard'}
    </button>
  );
}
