import React, { useState } from 'react';
import { Search, Bell, Sparkles, Command } from 'lucide-react';

export default function ParticipantHeader({ activeTab, setActiveTab, userName = 'Blessing' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: '📢 Live Session "Design Systems" starts at 10:00 AM today.', time: '2 hours ago', unread: true },
    { id: 2, text: 'Your UI Design Challenge submission has been graded.', time: '5 hours ago', unread: true },
    { id: 3, text: 'Facilitator Sarah uploaded Week 4 design system slides.', time: '1 day ago', unread: false }
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Header */}
      <div className="flex-1 max-w-xl">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons, resources, facilitators..."
            className="w-full bg-slate-900/80 border border-slate-800/90 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-400 font-mono">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Ask OYEN AI ✨ button */}
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-bold hover:bg-amber-400/20 transition-all shadow-sm shadow-amber-400/5"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>Ask OYEN AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors relative"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200">Notifications</h4>
                <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-400/10">2 Unread</span>
              </div>
              <div className="divide-y divide-slate-800/40 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3.5 text-xs ${n.unread ? 'bg-amber-400/5' : ''}`}>
                    <p className="text-slate-200 font-medium mb-1">{n.text}</p>
                    <p className="text-[10px] text-slate-500">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
