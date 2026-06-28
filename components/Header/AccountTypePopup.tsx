'use client';
import Link from 'next/link';

export default function AccountTypePopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="popupOverlay">
      <div className="popupContent">
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '15px', right: '15px', 
            background: 'var(--bg-primary)', 
            border: '1px solid var(--border-color)', 
            fontSize: '1.2rem', 
            cursor: 'pointer', 
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >×</button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Join Store Online</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Choose your account type to get started</p>
        </div>
        
        <div className="popupGrid">
          {/* Buyer Card */}
          <div className="popupCard" style={{ transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍️</div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.4rem' }}>I want to Buy</h3>
            
            <ul style={{ textAlign: 'left', margin: '0 0 2rem 0', paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1 }}>
              <li style={{ marginBottom: '0.8rem' }}>Purchase digital products instantly</li>
              <li style={{ marginBottom: '0.8rem' }}>Lifetime access to your downloads</li>
              <li style={{ marginBottom: '0.8rem' }}>Manage your product licenses</li>
              <li>Fast 24/7 customer support</li>
            </ul>
            
            <Link 
              href="/register?role=customer" 
              onClick={onClose}
              style={{ 
                display: 'block', 
                padding: '0.8rem', 
                background: 'var(--accent-primary)', 
                color: 'var(--text-primary)', 
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: 600,
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)'
              }}
            >
              Create Buyer Account
            </Link>
          </div>

          {/* Seller Card */}
          <div className="popupCard">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.4rem' }}>I want to Sell</h3>
            
            <ul style={{ textAlign: 'left', margin: '0 0 2rem 0', paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1 }}>
              <li style={{ marginBottom: '0.8rem' }}>Sell your source code & scripts</li>
              <li style={{ marginBottom: '0.8rem' }}>Earn up to 80% commission</li>
              <li style={{ marginBottom: '0.8rem' }}>Track sales & earnings in real-time</li>
              <li>Participate in Royalty Program</li>
            </ul>
            
            <Link 
              href="/register?role=contributor" 
              onClick={onClose}
              style={{ 
                display: 'block', 
                padding: '0.8rem', 
                background: 'var(--accent-secondary)', 
                color: 'var(--text-primary)', 
                textDecoration: 'none', 
                borderRadius: '8px', 
                fontWeight: 600,
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)'
              }}
            >
              Create Seller Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
