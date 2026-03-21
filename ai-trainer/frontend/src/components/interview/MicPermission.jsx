// Requests and confirms microphone access from the user

import { useState } from 'react';

/**
 * MicPermission — requests navigator.mediaDevices.getUserMedia.
 * Props: { onGranted, onDenied }
 */
export default function MicPermission({ onGranted, onDenied }) {
  const [state, setState] = useState('idle'); // idle | requesting | denied

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
      borderRadius: '20px',
      padding: '48px 40px',
      maxWidth: '480px', width: '100%',
      textAlign: 'center',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    },
    micCircle: {
      width: '96px', height: '96px', borderRadius: '50%',
      background: 'rgba(99,102,241,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 28px', fontSize: '44px',
      border: '2px solid rgba(99,102,241,0.3)',
    },
    title: {
      fontSize: '22px', fontWeight: '700', color: '#f1f5f9',
      marginBottom: '12px', letterSpacing: '-0.3px',
    },
    body: {
      fontSize: '14px', color: '#94a3b8', lineHeight: '1.7',
      marginBottom: '36px', padding: '0 8px',
    },
    btnAllow: {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '16px 36px',
      background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
      color: '#fff', fontWeight: '600', fontSize: '16px',
      border: 'none', borderRadius: '14px', cursor: 'pointer',
      transition: 'transform 0.15s,box-shadow 0.15s',
      boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
      width: '100%', justifyContent: 'center',
    },
    errorCard: {
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '12px', padding: '20px 24px',
      marginTop: '24px',
    },
    errorTitle: {
      color: '#f87171', fontWeight: '600', fontSize: '15px',
      marginBottom: '8px',
    },
    errorBody: {
      color: '#fca5a5', fontSize: '13px', lineHeight: '1.6',
      marginBottom: '16px',
    },
    btnRetry: {
      padding: '10px 24px',
      background: 'rgba(239,68,68,0.2)',
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: '8px', color: '#f87171',
      fontWeight: '600', fontSize: '13px', cursor: 'pointer',
      transition: 'background 0.15s',
    },
    requesting: {
      fontSize: '13px', color: '#94a3b8', marginTop: '16px',
      animation: 'pulse 1.5s infinite',
    },
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRequest = () => {
    setState('requesting');
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Stop the test stream immediately — we only needed the permission
        stream.getTracks().forEach((t) => t.stop());
        onGranted();
      })
      .catch(() => {
        setState('denied');
        onDenied();
      });
  };

  const handleRetry = () => {
    setState('idle');
    handleRequest();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={s.wrapper}>
      <div style={s.card}>

        {/* Microphone icon */}
        <div style={s.micCircle}>🎙️</div>

        <h2 style={s.title}>Allow Microphone Access</h2>
        <p style={s.body}>
          The interview needs your microphone. Click the button below,
          then click <strong style={{ color: '#f1f5f9' }}>Allow</strong> when
          your browser asks for permission.
        </p>

        {/* Main CTA button */}
        {state !== 'denied' && (
          <button
            style={{
              ...s.btnAllow,
              opacity: state === 'requesting' ? 0.7 : 1,
              cursor: state === 'requesting' ? 'not-allowed' : 'pointer',
            }}
            onClick={handleRequest}
            disabled={state === 'requesting'}
            onMouseEnter={e => {
              if (state !== 'requesting') {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.55)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)';
            }}
          >
            {state === 'requesting' ? '⏳ Waiting for permission…' : '🎙️ Allow Microphone & Continue'}
          </button>
        )}

        {state === 'requesting' && (
          <p style={s.requesting}>Waiting for your browser's permission prompt…</p>
        )}

        {/* Denied error card */}
        {state === 'denied' && (
          <div style={s.errorCard}>
            <p style={s.errorTitle}>Microphone access was denied</p>
            <p style={s.errorBody}>
              Please click the 🔒 lock icon in your browser's address bar,
              set <strong>Microphone</strong> to <strong>Allow</strong>,
              then click retry below.
            </p>
            <button
              style={s.btnRetry}
              onClick={handleRetry}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            >
              🔄 Retry Microphone Access
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
