'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminSearch({ placeholder = 'Search...' }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Update input if URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-tertiary)',
          color: 'white'
        }}
      />
      <button 
        type="submit"
        style={{
          background: 'var(--accent-neon)',
          color: 'black',
          border: 'none',
          padding: '0 1rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Search
      </button>
      {searchParams.get('q') && (
        <button 
          type="button"
          onClick={handleClear}
          style={{
            background: 'var(--bg-tertiary)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-color)',
            padding: '0 0.8rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      )}
    </form>
  );
}
