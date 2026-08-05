import React from 'react';
import { Zap } from 'lucide-react';

export default function OyenAiInsight({ insight, onAction }) {
  if (!insight) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(244, 197, 66, 0.15)',
      border: '1px solid #F4C542',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F4C542', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} color="#111" />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F4C542', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OYEN AI</div>
          <div style={{ fontSize: '0.95rem', color: '#111' }}>
            <strong style={{ color: '#111' }}>{insight.title}</strong> <span style={{ color: '#555' }}>{insight.msg}</span>
          </div>
        </div>
      </div>
      {onAction && (
        <button onClick={onAction} style={{ padding: '0.6rem 1.25rem', backgroundColor: '#F4C542', color: '#111', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(244, 197, 66, 0.2)' }}>
          Review
        </button>
      )}
    </div>
  );
}
