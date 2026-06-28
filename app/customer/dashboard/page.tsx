import styles from '../../dashboard/dashboard.module.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdBanner from '@/components/AdBanner';
import { getWebsiteSettings } from '@/lib/settings';

export default async function CustomerDashboard() {
  const settings = await getWebsiteSettings();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { uid: true }
  });

  // Fetch all completed transactions for this user
  const transactions = await prisma.transaction.findMany({
    where: { 
      userId: session.user.id,
      status: "completed"
    },
    include: {
      product: {
        select: {
          id: true,
          pid: true,
          title: true,
          logoUrl: true,
          sourceFileUrl: true,
          platform: true,
          developer: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const licenses = await prisma.license.findMany({
    where: { userId: session.user.id }
  });

  const purchases = transactions.map((t: any) => {
    const productLicense = licenses.find((l: any) => l.productId === t.productId);
    return {
      id: t.id,
      date: t.createdAt,
      amount: t.amount,
      product: t.product,
      licenseKey: productLicense?.key || null
    };
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>Already Downloaded Products</h1>
        <p>View all the products you have downloaded from Store Online.</p>
        {currentUser?.uid && (
          <div style={{ marginTop: '1rem', display: 'inline-block', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong>Your Buyer UID:</strong> <span style={{ color: 'var(--accent-neon)', fontFamily: 'monospace' }}>{currentUser.uid}</span>
          </div>
        )}
      </div>

      <div className={styles.panel}>
        {purchases.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>You haven't purchased any products yet.</p>
            <Link href="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>Browse Store</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {purchases.map((purchase: any) => (
              <div key={purchase.id} style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ height: '150px', backgroundImage: `url(${purchase.product.logoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!purchase.product.logoUrl && <span style={{ fontSize: '3rem' }}>📦</span>}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'white' }}>{purchase.product.title}</h3>
                  {purchase.product.pid && <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{purchase.product.pid}</div>}
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Platform: {purchase.product.platform} • Developer: {purchase.product.developer.name}</p>
                  
                  {purchase.licenseKey && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>License Key</p>
                      <code style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', userSelect: 'all' }}>{purchase.licenseKey}</code>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Purchased: {new Date(purchase.date).toLocaleDateString()}</span>
                    <a 
                      href={purchase.product.sourceFileUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {settings.enableAdsense && (
        <div style={{ marginTop: '3rem', width: '100%' }}>
          <AdBanner slotId="customer_dashboard_bottom" />
        </div>
      )}
    </div>
  );
}
