'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  
  // Simulated initial fetch - for now it's empty
  useEffect(() => {
    // We would fetch cart from localStorage or DB here
  }, []);

  return (
    <>
      {/* We need a simple header here, or since we don't have access to the async Server Component Header here, 
          we can just use the global layout which already has Header and Footer! */}
      <div className="container" style={{ minHeight: '60vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>Your Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Your cart is currently empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added any products to your cart yet.</p>
            <Link 
              href="/" 
              style={{ 
                padding: '0.8rem 2rem', 
                background: 'var(--accent-primary)', 
                color: 'white', 
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            {/* Cart items list would go here */}
            <p>You have items in your cart.</p>
          </div>
        )}
      </div>
    </>
  );
}
