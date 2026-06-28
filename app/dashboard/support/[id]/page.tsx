import SupportChat from '@/components/SupportChat';

export default async function DeveloperSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupportChat ticketId={id} userRole="developer" />;
}
