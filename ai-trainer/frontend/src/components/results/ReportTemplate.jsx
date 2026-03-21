// Hidden PDF report template — captured by html2canvas; ALL styles must be inline (no className)

/**
 * ReportTemplate — rendered off-screen, revealed only during PDF export.
 * id='interview-report-pdf' is required by generateInterviewPDF().
 * Props: { results, userName, sessionDate }
 */
export default function ReportTemplate({
  results      = {},
  userName     = 'Candidate',
  sessionDate  = new Date().toLocaleDateString('en-IN'),
}) {
  const scores   = results.scores || {};
  const qResults = results.question_results || [];

  // Parse recommendations — may be array or JSON string
  const recommendations = (() => {
    try {
      const r = results.recommendations;
      return Array.isArray(r) ? r : JSON.parse(r || '[]');
    } catch { return []; }
  })();

  // Overall score colour
  const overallNum = parseFloat(results.overall_score || 0);
  const scoreColor = overallNum >= 7 ? '#2e7d32' : overallNum >= 5 ? '#e65100' : '#b71c1c';

  // Placement readiness labels
  const readinessLabel = {
    not_ready:    'Not Ready',
    needs_work:   'Needs Work',
    almost_ready: 'Almost Ready',
    ready:        'Ready',
    highly_ready: 'Highly Ready',
  }[results.placement_readiness] || 'Needs Work';

  // ── Inline style objects (html2canvas requires inline — no className) ────
  const root = {
    display:    'none',           // revealed by generateInterviewPDF()
    width:      '800px',
    padding:    '24px',
    background: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    fontSize:   '13px',
    color:      '#1a1a2e',
    boxSizing:  'border-box',
  };

  const header = {
    background:   '#0f172a',
    color:        '#ffffff',
    padding:      '24px 28px',
    borderRadius: '8px',
    marginBottom: '20px',
    display:      'flex',
    justifyContent: 'space-between',
    alignItems:   'center',
  };

  const headerTitle = { fontSize: '20px', fontWeight: 'bold', color: '#93c5fd' };
  const headerSub   = { fontSize: '13px', color: '#94a3b8', marginTop: '4px' };
  const headerRight = { textAlign: 'right', fontSize: '12px', color: '#94a3b8' };

  const scoreBlock = {
    textAlign:    'center',
    margin:       '20px 0',
    padding:      '20px',
    background:   '#f8fafc',
    borderRadius: '8px',
    border:       '1px solid #e2e8f0',
  };

  const scoreNum = {
    fontSize:   '64px',
    fontWeight: 'bold',
    color:      scoreColor,
    lineHeight: 1,
  };

  const readinessBadge = {
    display:      'inline-block',
    marginTop:    '8px',
    padding:      '4px 14px',
    borderRadius: '999px',
    background:   '#dbeafe',
    color:        '#1d4ed8',
    fontWeight:   'bold',
    fontSize:     '12px',
  };

  const sectionTitle = {
    fontSize:     '13px',
    fontWeight:   'bold',
    color:        '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '8px',
    marginTop:    '20px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '4px',
  };

  const table = {
    width:          '100%',
    borderCollapse: 'collapse',
    marginBottom:   '16px',
  };

  const th = {
    background:  '#f1f5f9',
    padding:     '8px 12px',
    textAlign:   'left',
    fontSize:    '12px',
    fontWeight:  'bold',
    color:       '#475569',
    border:      '1px solid #e2e8f0',
  };

  const td = {
    padding:   '8px 12px',
    fontSize:  '13px',
    border:    '1px solid #e2e8f0',
    color:     '#1e293b',
  };

  const tdScore = (val) => {
    const n = parseFloat(val || 0);
    const c = n >= 7 ? '#15803d' : n >= 5 ? '#c2410c' : '#dc2626';
    return { ...td, fontWeight: 'bold', color: c };
  };

  const summaryBox = {
    background:   '#f8fafc',
    border:       '1px solid #e2e8f0',
    borderRadius: '6px',
    padding:      '14px',
    lineHeight:   '1.7',
    marginBottom: '12px',
  };

  const strengthBox = {
    background:   '#f0fdf4',
    border:       '1px solid #bbf7d0',
    borderRadius: '6px',
    padding:      '12px 14px',
    marginBottom: '8px',
    color:        '#15803d',
  };

  const weakBox = {
    background:   '#fffbeb',
    border:       '1px solid #fde68a',
    borderRadius: '6px',
    padding:      '12px 14px',
    marginBottom: '16px',
    color:        '#b45309',
  };

  const qCard = {
    border:       '1px solid #e2e8f0',
    borderRadius: '6px',
    padding:      '14px',
    marginBottom: '10px',
    background:   '#fafafa',
  };

  const qHeader = {
    display:       'flex',
    justifyContent: 'space-between',
    fontWeight:    'bold',
    fontSize:      '13px',
    marginBottom:  '6px',
    color:         '#0f172a',
  };

  const qScoreBadge = (val) => {
    const n = parseFloat(val || 0);
    const bg = n >= 7 ? '#dcfce7' : n >= 5 ? '#ffedd5' : '#fee2e2';
    const cl = n >= 7 ? '#15803d' : n >= 5 ? '#c2410c' : '#dc2626';
    return { padding: '2px 10px', borderRadius: '999px', background: bg, color: cl, fontSize: '12px', fontWeight: 'bold' };
  };

  const qText  = { fontSize: '13px', color: '#334155', marginBottom: '6px', lineHeight: '1.5' };
  const qLabel = { fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px', marginTop: '8px' };
  const qBody  = { fontSize: '12px', color: '#475569', lineHeight: '1.6' };

  const footer = {
    marginTop:  '28px',
    borderTop:  '1px solid #e2e8f0',
    paddingTop: '12px',
    textAlign:  'center',
    fontSize:   '11px',
    color:      '#94a3b8',
  };

  return (
    <div id="interview-report-pdf" style={root}>

      {/* ── Header ── */}
      <div style={header}>
        <div>
          <div style={headerTitle}>AI Pre-Placement Trainer</div>
          <div style={headerSub}>Interview Performance Report</div>
        </div>
        <div style={headerRight}>
          <div style={{ fontWeight: 'bold', color: '#f1f5f9' }}>{userName}</div>
          <div>{sessionDate}</div>
        </div>
      </div>

      {/* ── Overall score ── */}
      <div style={scoreBlock}>
        <div style={scoreNum}>{overallNum.toFixed(1)}</div>
        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Overall Score / 10</div>
        <div style={readinessBadge}>{readinessLabel}</div>
      </div>

      {/* ── Dimension scores table ── */}
      <div style={sectionTitle}>Score Breakdown</div>
      <table style={table}>
        <thead>
          <tr>
            {['Dimension', 'Score', 'Rating'].map(h => <th key={h} style={th}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {[
            ['HR',            scores.hr],
            ['Technical',     scores.technical],
            ['Communication', scores.communication],
            ['Confidence',    scores.confidence],
            ['Structure',     scores.structure],
          ].map(([dim, val]) => {
            const n = parseFloat(val || 0);
            const rating = n >= 7 ? 'Good' : n >= 5 ? 'Average' : 'Needs Work';
            return (
              <tr key={dim}>
                <td style={td}>{dim}</td>
                <td style={tdScore(val)}>{n.toFixed(1)}</td>
                <td style={td}>{rating}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ── AI Summary ── */}
      <div style={sectionTitle}>AI Assessment Summary</div>
      <div style={summaryBox}>{results.summary || '—'}</div>

      {/* ── Strength + Weakness ── */}
      <div style={sectionTitle}>Key Observations</div>
      <div style={strengthBox}><strong>💪 Top Strength: </strong>{results.top_strength || '—'}</div>
      <div style={weakBox}><strong>⚡ Top Weakness: </strong>{results.top_weakness || '—'}</div>

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <>
          <div style={sectionTitle}>Recommendations</div>
          <ol style={{ paddingLeft: '18px', margin: '0 0 16px' }}>
            {recommendations.map((rec, i) => (
              <li key={i} style={{ ...qBody, marginBottom: '6px' }}>{rec}</li>
            ))}
          </ol>
        </>
      )}

      {/* ── Per-question breakdown ── */}
      {qResults.length > 0 && (
        <>
          <div style={sectionTitle}>Question Breakdown</div>
          {qResults.map((qr, i) => (
            <div key={i} style={qCard}>
              <div style={qHeader}>
                <span>Q{qr.question_index || i + 1}. {qr.questionText || `Question ${i + 1}`}</span>
                <span style={qScoreBadge(qr.score)}>{parseFloat(qr.score || 0).toFixed(1)}/10</span>
              </div>
              {qr.answerText && (
                <>
                  <div style={qLabel}>Your Answer</div>
                  <div style={qText}>{qr.answerText}</div>
                </>
              )}
              {qr.feedback && (
                <>
                  <div style={qLabel}>AI Feedback</div>
                  <div style={qBody}>{qr.feedback}</div>
                </>
              )}
              {qr.strength && (
                <div style={{ ...qBody, color: '#15803d', marginTop: '6px' }}>💪 {qr.strength}</div>
              )}
              {qr.improvement && (
                <div style={{ ...qBody, color: '#b45309', marginTop: '4px' }}>💡 {qr.improvement}</div>
              )}
            </div>
          ))}
        </>
      )}

      {/* ── Footer ── */}
      <div style={footer}>
        Generated by AI Pre-Placement Trainer · YSPM's Yashoda Technical Campus, Satara · {sessionDate}
      </div>

    </div>
  );
}
