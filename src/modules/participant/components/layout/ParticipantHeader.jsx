import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, Calendar, BookOpen, Video } from 'lucide-react';

export default function ParticipantHeader({ activeTab, setActiveTab, userName = 'Shola Alabi' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Your UI Design Challenge submission has been graded.', time: '2 hours ago', unread: true },
    { id: 2, text: 'Live Session "Design Systems" starts at 10:00 AM today.', time: '5 hours ago', unread: true },
    { id: 3, text: 'Facilitator Sarah uploaded Week 4 slides.', time: '1 day ago', unread: false }
  ];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Page Title & Search Bar */}
      <div className="flex items-center gap-6">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider capitalize">
          {activeTab.replace('-', ' ')}
        </h2>

        {/* Global Search */}
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons, assignments, resources..."
            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 transition-colors"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Quick OYEN AI Assistant Launcher */}
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium hover:bg-amber-400/20 transition-all shadow-sm"
        >
          <Sparkles size={14} />
          <span>Ask OYEN AI</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors relative"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200">Notifications</h4>
                <span className="text-[10px] text-amber-400 font-semibold">2 New</span>
              </div>
              <div className="divide-y divide-slate-800/40 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 text-xs ${n.unread ? 'bg-amber-400/5' : ''}`}>
                    <p className="text-slate-300 font-medium mb-1">{n.text}</p>
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
