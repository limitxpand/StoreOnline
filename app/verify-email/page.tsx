import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white' }}>
        <div style={{ textAlign: 'center', padding: '2rem', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Invalid Request</h1>
          <p>No verification token was provided.</p>
          <Link href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#4F46E5', textDecoration: 'none' }}>Return Home</Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { verificationToken: token }
  });

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white' }}>
        <div style={{ textAlign: 'center', padding: '2rem', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Verification Failed</h1>
          <p>The verification link is invalid or has already been used.</p>
          <Link href="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#4F46E5', textDecoration: 'none' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null // Clear the token so it can't be used again
    }
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: 'white' }}>
      <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '12px', border: '1px solid #333', maxWidth: '500px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ color: '#10b981', marginBottom: '1rem' }}>Email Verified!</h1>
        <p style={{ color: '#9ca3af' }}>Your email address has been successfully verified. Your account is now active and you can log in.</p>
        <Link href="/login" style={{ 
          display: 'inline-block', 
          marginTop: '2rem', 
          background: '#4F46E5', 
          color: 'white', 
          padding: '0.75rem 2rem', 
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Proceed to Login
        </Link>
      </div>
    </div>
  );
}
