import React, { useState } from 'react';
import { Search, Bell, Sparkles, Command } from 'lucide-react';

export default function ParticipantHeader({ activeTab, setActiveTab, userName = 'Blessing' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: '📢 Live Workshop "Design Systems" starts at 10:00 AM today.', time: '2 hours ago', unread: true },
    { id: 2, text: 'Your UI Design Challenge submission has been graded.', time: '5 hours ago', unread: true },
    { id: 3, text: 'Facilitator Sarah uploaded Week 4 slides.', time: '1 day ago', unread: false }
  ];

  return (
    <header className="h-16 border-b border-[#EBEBE8] bg-[#FAFAF8]/90 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20 text-slate-800">
      {/* Search Header */}
      <div className="flex-1 max-w-xl">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons, resources, facilitators..."
            className="w-full bg-white border border-[#EBEBE8] rounded-xl pl-10 pr-12 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-mono">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
        >
          <Sparkles size={14} />
          <span>Ask OYEN AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white border border-[#EBEBE8] text-slate-600 hover:text-slate-900 transition-colors relative shadow-sm"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#EBEBE8] rounded-2xl shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded-full bg-slate-100">2 Unread</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3.5 text-xs ${n.unread ? 'bg-amber-50/50' : ''}`}>
                    <p className="text-slate-800 font-medium mb-1">{n.text}</p>
                    <p className="text-[10px] text-slate-400">{n.time}</p>
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
