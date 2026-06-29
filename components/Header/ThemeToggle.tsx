'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle({ className, faviconDark, faviconLight }: { className?: string, faviconDark?: string, faviconLight?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const updateFavicon = (themeValue: 'dark' | 'light') => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const iconUrl = themeValue === 'light' ? (faviconLight || faviconDark) : (faviconDark || faviconLight);
    if (iconUrl) {
      link.href = iconUrl;
    }
  };

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
      updateFavicon('light');
    } else {
      setTheme('dark');
      document.documentElement.removeAttribute('data-theme');
      updateFavicon('dark');
    }
  }, [faviconDark, faviconLight]);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
      updateFavicon('light');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.removeAttribute('data-theme');
      updateFavicon('dark');
    }
  };

  return (
    <button className={className} onClick={toggleTheme} aria-label="Toggle Theme" style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
