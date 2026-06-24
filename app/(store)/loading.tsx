export default function Loading() {
  return (
    <div style={{ padding: '2rem', width: '100%' }}>
      {/* Skeleton Header */}
      <div style={{ 
        width: '100%', 
        height: '100px', 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        animation: 'pulse 1.5s infinite ease-in-out'
      }}></div>

      {/* Skeleton Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{
            height: '320px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            animation: 'pulse 1.5s infinite ease-in-out',
            animationDelay: `${i * 0.1}s`
          }}></div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}} />
    </div>
  );
}
