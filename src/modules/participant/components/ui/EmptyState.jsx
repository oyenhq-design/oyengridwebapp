import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title = 'No items found', description = 'There are currently no items available in this section.', icon: Icon = FolderOpen, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 mb-4">
        <Icon size={22} />
      </div>
      <h4 className="text-base font-semibold text-slate-200 mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
