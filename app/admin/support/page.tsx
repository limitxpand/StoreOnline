'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTickets = async () => {
    try {
      const url = statusFilter ? `/api/admin/support?status=${statusFilter}` : '/api/admin/support';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Support Tickets</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and respond to user queries.</p>
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'white' }}
        >
          <option value="">All Tickets</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>User</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Subject</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Last Updated</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tickets found.</td></tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{ticket.user.name || ticket.user.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ticket.user.role.toUpperCase()}</div>
                    {ticket.user.uid && <div style={{ fontSize: '0.8rem', color: 'var(--accent-neon)', fontFamily: 'monospace' }}>{ticket.user.uid}</div>}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{ticket.subject}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {ticket.messages?.[0]?.content.substring(0, 50)}...
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {ticket.status === 'resolved' ? (
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem' }}>Resolved</span>
                    ) : (
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.8rem' }}>Open</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <Link href={`/admin/support/${ticket.id}`} style={{ padding: '6px 12px', background: 'var(--bg-dark)', borderRadius: '6px', color: 'white', textDecoration: 'none', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
