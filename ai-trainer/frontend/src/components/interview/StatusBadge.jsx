// Displays the current interview phase/status as a visual badge (e.g. RECORDING, SPEAKING, SUBMITTING)

const PHASE_CONFIG = {
  SPEAKING:      { label: 'Speaking',      bg: 'rgba(99,102,241,0.2)',  color: '#a5b4fc', icon: '🔊' },
  COUNTDOWN:     { label: 'Get Ready',     bg: 'rgba(245,158,11,0.2)',  color: '#fcd34d', icon: '⏳' },
  RECORDING:     { label: 'Recording',     bg: 'rgba(239,68,68,0.2)',   color: '#fca5a5', icon: '🔴' },
  SAVING_ANSWER: { label: 'Saved',         bg: 'rgba(34,197,94,0.2)',   color: '#86efac', icon: '✅' },
  SUBMITTING:    { label: 'Submitting',    bg: 'rgba(59,130,246,0.2)',  color: '#93c5fd', icon: '⏳' },
};

/**
 * StatusBadge — shows current interview phase as a coloured pill.
 * Props: { phase }  — one of the PHASES constants
 */
export default function StatusBadge({ phase = '' }) {
  const cfg = PHASE_CONFIG[phase?.toUpperCase()] || null;
  if (!cfg) return null;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 12px', borderRadius: '999px',
      background: cfg.bg, color: cfg.color,
      fontSize: '12px', fontWeight: '600',
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
