'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';

export default function AdminSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/admin/support/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTicket(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    const interval = setInterval(fetchTicket, 10000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/support/${id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
      });

      if (res.ok) {
        setMessage('');
        fetchTicket();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!confirm('Are you sure you want to resolve this ticket?')) return;
    try {
      const res = await fetch(`/api/admin/support/${id}/resolve`, {
        method: 'POST'
      });
      if (res.ok) fetchTicket();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading ticket...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Link href="/admin/support" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back</Link>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{ticket.subject}</h2>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ticket ID: {ticket.id} • User: {ticket.user.name || ticket.user.email} ({ticket.user.role}) {ticket.user.uid && `• UID: ${ticket.user.uid}`}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {ticket.status === 'resolved' ? (
            <span style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }}>Resolved</span>
          ) : (
            <>
              <span style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 600 }}>Open</span>
              <button 
                onClick={handleResolve}
                style={{ background: 'var(--success)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Mark Resolved
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ticket.messages.map((msg: any) => {
          const isAdmin = msg.isAdmin;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '70%', 
                padding: '1rem', 
                borderRadius: '12px', 
                background: isAdmin ? 'var(--accent-primary)' : 'var(--bg-dark)',
                color: 'white',
                border: isAdmin ? 'none' : '1px solid var(--border-color)'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.content}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                {isAdmin ? 'You (Admin)' : (ticket.user.name || ticket.user.email)} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={ticket.status === 'resolved' ? "Reply to reopen ticket..." : "Type your reply..."}
          style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', color: 'white' }}
        />
        <button 
          type="submit"
          disabled={submitting || !message.trim()}
          style={{ background: 'var(--accent-primary)', color: 'white', padding: '0 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: (!message.trim() || submitting) ? 0.5 : 1 }}
        >
          Send Reply
        </button>
      </form>
    </div>
  );
}
