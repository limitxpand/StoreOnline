import styles from '../../dashboard/dashboard.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdminSearch from '@/components/AdminSearch';

export const dynamic = 'force-dynamic';

export default async function AdminSellersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const sellers = await prisma.user.findMany({
    where: { 
      role: 'developer',
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { bep20Address: { contains: q, mode: 'insensitive' } }
        ]
      } : {})
    },
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', fontSize: '1.5rem' }}>
            ⬅️
          </Link>
          <h1>Sellers Directory</h1>
        </div>
        <p>View all sellers, their BEP-20 deposit addresses, and QR codes for manual payout.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <AdminSearch placeholder="Search by name, email, or BEP-20 address..." />
      </div>

      <div className={styles.panel}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0' }}>Seller Name</th>
                <th style={{ padding: '1rem 0' }}>Email</th>
                <th style={{ padding: '1rem 0' }}>Products</th>
                <th style={{ padding: '1rem 0' }}>BEP-20 Address (USDT/BNB)</th>
                <th style={{ padding: '1rem 0' }}>QR Code</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => (
                <tr key={seller.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {seller.name?.charAt(0) || seller.email.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '500' }}>{seller.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{seller.email}</td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                      {seller._count.products}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {seller.bep20Address ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <code style={{ background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                          {seller.bep20Address}
                        </code>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Not provided</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {seller.bep20QrUrl ? (
                      <a href={seller.bep20QrUrl} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={seller.bep20QrUrl} 
                          alt="QR" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                          title="Click to view full size"
                        />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No QR</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sellers.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No sellers found on the platform yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
