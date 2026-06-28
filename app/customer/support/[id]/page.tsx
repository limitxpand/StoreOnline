import SupportChat from '@/components/SupportChat';

export default async function CustomerSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupportChat ticketId={id} userRole="customer" />;
}
