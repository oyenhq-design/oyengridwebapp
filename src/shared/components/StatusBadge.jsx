import React from 'react';

/**
 * Standard StatusBadge component for OYEN GRID UI
 * Formats statuses such as Active, Draft, Completed, Suspended, In Progress across domain tables.
 */
export default function StatusBadge({ status, size = 'md' }) {
  const normalized = (status || '').toLowerCase().trim();
  
  let colorStyle = 'bg-slate-800/60 text-slate-400 border-slate-700/50';
  
  if (['active', 'published', 'verified', 'running', 'completed'].includes(normalized)) {
    colorStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (['draft', 'pending', 'upcoming', 'scheduled'].includes(normalized)) {
    colorStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (['suspended', 'inactive', 'failed', 'cancelled'].includes(normalized)) {
    colorStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (['in progress', 'live', 'in-progress'].includes(normalized)) {
    colorStyle = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  }

  const paddingStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${paddingStyle} ${colorStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      <span className="capitalize">{status || 'Unknown'}</span>
    </span>
  );
}
