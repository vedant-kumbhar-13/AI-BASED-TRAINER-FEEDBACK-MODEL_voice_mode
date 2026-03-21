// Loading/spinner screen shown while questions are being fetched or answers are being submitted

/**
 * LoadingScreen — full-page animated loading indicator.
 * Props: { message }
 */
export default function LoadingScreen({ message = 'Loading…' }) {
  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse2 {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh',
        background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
        fontFamily: "'Inter','Segoe UI',sans-serif",
      }}>
        {/* Spinner ring */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          border: '4px solid rgba(99,102,241,0.15)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.9s linear infinite',
          marginBottom: '28px',
        }} />

        {/* Message */}
        <p style={{
          fontSize: '16px', fontWeight: '600', color: '#94a3b8',
          animation: 'pulse2 2s ease-in-out infinite',
          textAlign: 'center', padding: '0 24px',
          maxWidth: '360px', lineHeight: '1.6',
        }}>
          {message}
        </p>
      </div>
    </>
  );
}
