'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SupportChat({ ticketId, userRole }: { ticketId: string, userRole: 'customer' | 'developer' }) {
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseUrl = userRole === 'customer' ? '/customer/support' : '/dashboard/support';

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/support/${ticketId}/message`);
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
    // Optional: simple polling for new messages every 10 seconds
    const interval = setInterval(fetchTicket, 10000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/support/${ticketId}/message`, {
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

  if (loading) return <div>Loading ticket...</div>;
  if (!ticket) return <div>Ticket not found</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Link href={baseUrl} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back</Link>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{ticket.subject}</h2>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ticket ID: {ticket.id} • Created: {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div>
          {ticket.status === 'resolved' ? (
            <span style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }}>Resolved</span>
          ) : (
            <span style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontWeight: 600 }}>Open</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ticket.messages.map((msg: any) => {
          const isMe = !msg.isAdmin;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '70%', 
                padding: '1rem', 
                borderRadius: '12px', 
                background: isMe ? 'var(--accent-primary)' : 'var(--bg-dark)',
                color: 'var(--text-primary)',
                border: isMe ? 'none' : '1px solid var(--border-color)'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.content}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                {isMe ? 'You' : 'Admin'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {ticket.status !== 'resolved' ? (
        <form onSubmit={handleSend} style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          />
          <button 
            type="submit"
            disabled={submitting || !message.trim()}
            style={{ background: 'var(--accent-primary)', color: 'white', padding: '0 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, opacity: (!message.trim() || submitting) ? 0.5 : 1 }}
          >
            Send
          </button>
        </form>
      ) : (
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', textAlign: 'center', color: 'var(--text-muted)' }}>
          This ticket has been marked as resolved by the admin.
        </div>
      )}
    </div>
  );
}
