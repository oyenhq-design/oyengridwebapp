import React from 'react';
import { Video, Calendar, Clock, User, ExternalLink, Play, FileText } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export default function Sessions({ user, wsPrograms }) {
  const upcomingSessions = [
    {
      id: 'sess-1',
      title: 'Design Systems & Component Tokens',
      date: 'Today',
      time: '10:00 AM - 11:30 AM',
      facilitator: 'Sarah Ahmed',
      link: 'https://meet.google.com/abc-defg-hij',
      isLive: true,
      description: 'Interactive workshop on building auto-layout components and color tokens.'
    },
    {
      id: 'sess-2',
      title: 'Figma Auto-Layout Advanced Masterclass',
      date: 'Tomorrow',
      time: '02:00 PM - 03:30 PM',
      facilitator: 'Michael Ibrahim',
      link: 'https://meet.google.com/xyz-uvwx-rst',
      isLive: false,
      description: 'Deep dive into responsive nested auto-layouts in Figma.'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <Video className="text-amber-400" /> Live Workshops & Sessions
        </h1>
        <p className="text-xs text-slate-400">Join upcoming live interactive sessions, watch past recordings, and download notes.</p>
      </div>

      {/* Live Now & Upcoming */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Live Sessions</h3>

        {upcomingSessions.map(session => (
          <div key={session.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {session.isLive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> LIVE NOW
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-bold text-[10px]">
                    UPCOMING
                  </span>
                )}
                <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {session.time}</span>
              </div>
              <h2 className="text-base font-bold text-slate-100">{session.title}</h2>
              <p className="text-xs text-slate-400">{session.description}</p>
              <p className="text-[11px] text-slate-500">Facilitator: <span className="text-slate-300 font-medium">{session.facilitator}</span></p>
            </div>

            <div>
              <a
                href={session.link}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-amber-400/10"
              >
                <ExternalLink size={14} /> Join Session Room
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Past Sessions & Recordings */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Past Recordings & Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Week 3: Micro-interactions Workshop</h4>
              <p className="text-[10px] text-slate-400">Recorded on Aug 1, 2026</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5">
              <Play size={12} /> Watch
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-1">Week 2: User Personas Synthesis</h4>
              <p className="text-[10px] text-slate-400">Recorded on Jul 25, 2026</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5">
              <Play size={12} /> Watch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
