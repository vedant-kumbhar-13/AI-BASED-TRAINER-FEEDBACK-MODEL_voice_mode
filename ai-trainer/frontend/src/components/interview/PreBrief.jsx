// Pre-interview briefing screen — shows candidate name, question count, interview type, and rules

/**
 * PreBrief — shown before the interview starts.
 * Props: { questions, onBegin }
 */
export default function PreBrief({ questions = [], onBegin }) {
  // Derive type counts from questions array
  const hrCount   = questions.filter(q =>
    ['HR', 'Behavioral'].includes(q.type)
  ).length;
  const techCount = questions.filter(q => q.type === 'Technical').length;
  const total     = questions.length;

  const rules = [
    'Speak clearly after the countdown ends.',
    'Pause for 3 seconds to move to the next question automatically.',
    'You can also click "Next Question" to advance manually.',
    'All answers are saved automatically — refreshing is safe.',
  ];

  // ── Styles ──────────────────────────────────────────────────────────────
  const s = {
    wrapper: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh',
      background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)',
      fontFamily: "'Inter','Segoe UI',sans-serif", padding: '24px',
    },
    card: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px', padding: '48px 44px',
      maxWidth: '560px', width: '100%',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
    },
    header: {
      textAlign: 'center', marginBottom: '36px',
    },
    emoji: { fontSize: '48px', display: 'block', marginBottom: '16px' },
    title: {
      fontSize: '26px', fontWeight: '800', color: '#f1f5f9',
      letterSpacing: '-0.5px', marginBottom: '8px',
    },
    subtitle: { fontSize: '14px', color: '#64748b' },
    statsRow: {
      display: 'flex', gap: '12px', marginBottom: '32px',
    },
    statChip: (color) => ({
      flex: 1, padding: '14px', borderRadius: '12px',
      background: color, textAlign: 'center',
    }),
    statNum: { fontSize: '26px', fontWeight: '800', color: '#f1f5f9', lineHeight: 1 },
    statLabel: { fontSize: '11px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    divider: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 0 28px' },
    rulesTitle: {
      fontSize: '12px', fontWeight: '600', color: '#64748b',
      textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
    },
    ruleItem: {
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      marginBottom: '12px',
    },
    ruleNum: {
      minWidth: '24px', height: '24px', borderRadius: '50%',
      background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '11px', fontWeight: '700', color: '#818cf8', flexShrink: 0,
    },
    ruleText: { fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', paddingTop: '2px' },
    btnBegin: {
      width: '100%', padding: '18px',
      background: 'linear-gradient(135deg,#22c55e,#16a34a)',
      color: '#fff', fontWeight: '700', fontSize: '17px',
      border: 'none', borderRadius: '14px', cursor: 'pointer',
      marginTop: '32px', letterSpacing: '0.2px',
      boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
      transition: 'transform 0.15s, box-shadow 0.15s',
    },
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>

        {/* Header */}
        <div style={s.header}>
          <span style={s.emoji}>🎯</span>
          <h1 style={s.title}>Your Interview is Ready</h1>
          <p style={s.subtitle}>Read the rules below, then begin when you're ready.</p>
        </div>

        {/* Stats chips */}
        <div style={s.statsRow}>
          <div style={s.statChip('rgba(99,102,241,0.12)')}>
            <div style={s.statNum}>{total}</div>
            <div style={s.statLabel}>Total Questions</div>
          </div>
          <div style={s.statChip('rgba(59,130,246,0.12)')}>
            <div style={s.statNum}>{hrCount}</div>
            <div style={s.statLabel}>HR / Behavioral</div>
          </div>
          <div style={s.statChip('rgba(249,115,22,0.12)')}>
            <div style={s.statNum}>{techCount}</div>
            <div style={s.statLabel}>Technical</div>
          </div>
        </div>

        <hr style={s.divider} />

        {/* Rules */}
        <p style={s.rulesTitle}>Interview Rules</p>
        {rules.map((rule, i) => (
          <div key={i} style={s.ruleItem}>
            <div style={s.ruleNum}>{i + 1}</div>
            <p style={s.ruleText}>{rule}</p>
          </div>
        ))}

        {/* Begin button */}
        <button
          style={s.btnBegin}
          onClick={onBegin}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 32px rgba(34,197,94,0.55)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(34,197,94,0.4)';
          }}
        >
          🚀 Begin Interview
        </button>

      </div>
    </div>
  );
}
