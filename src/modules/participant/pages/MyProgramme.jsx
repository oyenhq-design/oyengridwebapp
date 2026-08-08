import React from 'react';
import { GraduationCap, Calendar, Users, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { getLearnerProgrammeData } from '../services/participantDataService';

export default function MyProgramme({ user, wsPrograms }) {
  const programme = getLearnerProgrammeData(user, wsPrograms);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <GraduationCap className="text-amber-400" /> My Programme Roadmap
        </h1>
        <p className="text-xs text-slate-400">Track your weekly learning trajectory, facilitators, and overall completion milestone.</p>
      </div>

      {/* Programme Overview Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
            Enrolled
          </span>
          <h2 className="text-lg font-bold text-slate-100">{programme.name}</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{programme.description}</p>
          
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar size={14} className="text-amber-400" /> <span>Duration: {programme.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock size={14} className="text-amber-400" /> <span>Current: Week {programme.currentWeek} of {programme.totalWeeks}</span>
            </div>
          </div>
        </div>

        {/* Facilitators List */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Users size={14} className="text-amber-400" /> Programme Facilitators
          </h4>
          <div className="space-y-3">
            {programme.facilitators.map((fac, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                  {fac.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{fac.name}</p>
                  <p className="text-[10px] text-slate-400">{fac.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programme Timeline Roadmap */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-4">Programme Roadmap & Timeline</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(week => {
            const isDone = week < programme.currentWeek;
            const isCurrent = week === programme.currentWeek;
            return (
              <div
                key={week}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent 
                    ? 'bg-amber-400/10 border-amber-400/30 text-amber-400 shadow-md shadow-amber-400/5' 
                    : isDone 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300' 
                      : 'bg-slate-950/40 border-slate-900 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    isDone ? 'bg-emerald-500/20 text-emerald-400' : isCurrent ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? <CheckCircle2 size={16} /> : `W${week}`}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">
                      Week {week}: {week === 4 ? 'Design Systems & Component Tokens' : `Core Module Step ${week}`}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {isDone ? 'Completed' : isCurrent ? 'Active Week' : 'Locked — Opens soon'}
                    </p>
                  </div>
                </div>

                <div>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-semibold ${
                    isDone ? 'bg-emerald-500/10 text-emerald-400' : isCurrent ? 'bg-amber-400/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? '100% Passed' : isCurrent ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
