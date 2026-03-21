// Visual 2-second countdown shown between TTS finish and recording start

/**
 * CountdownTimer — large animated countdown number.
 * Props: { count }  — current number (2 → 1 → 0)
 */
export default function CountdownTimer({ count = 2 }) {
  return (
    <>
      <style>{`
        @keyframes countBounce {
          0%   { transform: scale(1.4); opacity: 0.3; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        <span style={{
          fontSize: '80px', fontWeight: '900',
          color: '#f1f5f9', lineHeight: 1,
          animation: 'countBounce 0.5s ease-out',
          key: count,   // forces re-animation on each tick
        }}>
          {count}
        </span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          Get ready to speak…
        </span>
      </div>
    </>
  );
}
