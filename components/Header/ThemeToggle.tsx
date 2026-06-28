'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setTheme('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <button className={className} onClick={toggleTheme} aria-label="Toggle Theme" style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
