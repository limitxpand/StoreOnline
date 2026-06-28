import styles from '../settings/settings.module.css';
import { prisma } from '@/lib/prisma';
import AdminSearch from '@/components/AdminSearch';
import DeleteUserButton from './DeleteUserButton';
import ImpersonateButton from './ImpersonateButton';
import BanToggle from './BanToggle';

export const dynamic = 'force-dynamic';

export default async function UserManagement({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : '';

  const users = await prisma.user.findMany({
    where: q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { uid: { contains: q, mode: 'insensitive' } }
      ]
    } : {},
    include: {
      _count: {
        select: { transactions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={styles.container}>
      <h2>User Management</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manage all registered users across the platform.</p>

      <div style={{ marginBottom: '2rem' }}>
        <AdminSearch placeholder="Search by name, email, username, or UID..." />
      </div>

      <div className={styles.section}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem 0' }}>User</th>
              <th style={{ padding: '1rem 0' }}>UID</th>
              <th style={{ padding: '1rem 0' }}>Role</th>
              <th style={{ padding: '1rem 0' }}>Purchases</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: u.isBanned ? 0.6 : 1 }}>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ fontWeight: 500 }}>
                    {u.name || u.username || 'Unnamed'} 
                    {u.isBanned && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginLeft: '0.5rem', fontWeight: 'bold' }}>BANNED</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{u.uid || '-'}</span>
                </td>
                <td style={{ padding: '1rem 0' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    background: u.role === 'developer' ? 'rgba(59, 130, 246, 0.1)' : u.role === 'admin' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    color: u.role === 'developer' ? '#3b82f6' : u.role === 'admin' ? '#8b5cf6' : 'var(--text-secondary)'
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{u._count.transactions} items</td>
                <td style={{ padding: '1rem 0', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  {u.role !== 'admin' && <BanToggle userId={u.id} isBanned={u.isBanned} />}
                  {u.role !== 'admin' && <ImpersonateButton userId={u.id} role={u.role} />}
                  <DeleteUserButton userId={u.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
