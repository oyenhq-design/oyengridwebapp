import React, { useState } from 'react';
import { 
  Play, Calendar, Clock, FileCheck, ArrowRight, Sparkles, 
  CheckCircle2, BookOpen, AlertCircle, Award, Video, Megaphone,
  Check, Search, History, ChevronRight, GraduationCap
} from 'lucide-react';
import { 
  getLearnerProgrammeData, 
  getLearnerAssignments, 
  getLearnerTodayGoals,
  getLearnerAnnouncements,
  getLearnerRecentActivity 
} from '../services/participantDataService';

export default function Dashboard({ setActiveTab, user, wsPrograms, wsLearners }) {
  const programme = getLearnerProgrammeData(user, wsPrograms, wsLearners);
  const assignments = getLearnerAssignments();
  const goalsData = getLearnerTodayGoals();
  const announcements = getLearnerAnnouncements();
  const recentActivity = getLearnerRecentActivity();

  const [aiQuery, setAiQuery] = useState('');
  const [goals, setGoals] = useState(goalsData.tasks);

  const toggleGoal = (id) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Immersive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} /> Active Programme
            </span>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Good Morning, {programme.learnerName} 👋
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              You're making great progress in <span className="text-slate-200 font-semibold">{programme.name}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-6 shrink-0">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                <span>Week {programme.currentWeek} of {programme.totalWeeks}</span>
                <span className="text-amber-400 font-bold ml-3">{programme.progress}% Complete</span>
              </div>
              <div className="w-48 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${programme.progress}%` }}></div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('learning')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-400/10 shrink-0"
            >
              <Play size={14} className="fill-current" /> Continue Learning
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Featured Card, Agenda, Announcements, Milestone Roadmap */}
        <div className="xl:col-span-2 space-y-6 min-w-0">
          
          {/* Featured Large Card: Continue Learning */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-xl group">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={15} /> Continue Learning
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-bold">
                65% Completed
              </span>
            </div>

            <span className="text-xs text-slate-500 font-semibold block mb-1">Week 4</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-100 mb-2">Design Systems & Component Tokens</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Master cohesive component libraries, design tokens, typography scales, and auto-layout systems in Figma.
            </p>

            <button
              onClick={() => setActiveTab('learning')}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-amber-400/10"
            >
              Resume Lesson: Component Libraries & Tokens <ArrowRight size={14} />
            </button>
          </div>

          {/* Today's Agenda Timeline Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={15} className="text-amber-400" /> Today's Agenda
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold">1 Live Session Scheduled</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="px-2.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-extrabold text-xs text-center shrink-0">
                  10:00 AM
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400">LIVE SESSION</span>
                    <h4 className="text-xs font-extrabold text-slate-100 truncate">Design Systems & Component Tokens</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">Facilitator: <span className="text-slate-300 font-semibold">Sarah Ahmed</span></p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('sessions')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-400/10 transition-all shrink-0 self-start sm:self-center"
              >
                Join Session
              </button>
            </div>
          </div>

          {/* Programme Roadmap Milestones */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap size={15} className="text-amber-400" /> Programme Roadmap Journey
              </h3>
              <span className="text-[10px] text-amber-400 font-bold">Week 4 Active</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
              {[
                { week: 1, label: 'W1', status: 'done' },
                { week: 2, label: 'W2', status: 'done' },
                { week: 3, label: 'W3', status: 'done' },
                { week: 4, label: 'W4', status: 'current' },
                { week: 5, label: 'W5', status: 'upcoming' },
                { week: 6, label: 'W6', status: 'upcoming' },
                { week: 7, label: 'W7', status: 'upcoming' },
                { week: 8, label: 'W8', status: 'upcoming' },
              ].map(step => (
                <div
                  key={step.week}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    step.status === 'done' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : step.status === 'current' 
                        ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black' 
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-extrabold block">{step.label}</span>
                  <span className="text-[9px] block opacity-80 mt-0.5">
                    {step.status === 'done' ? '✓' : step.status === 'current' ? '●' : '○'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace Announcements Feed */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Megaphone size={15} className="text-amber-400" /> Workspace Announcements
            </h3>

            <div className="space-y-2">
              {announcements.map(ann => (
                <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                  <span className="text-sm shrink-0 mt-0.5">{ann.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{ann.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{ann.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ann.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Today's Goal Checklist, ChatGPT-Style OYEN AI, Recent Activity */}
        <div className="space-y-6 min-w-0">
          
          {/* Today's Actionable Goal Checklist */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={15} className="text-amber-400" /> Today's Action Goal
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                Est. {goalsData.estimatedTime}
              </span>
            </div>

            <div className="space-y-2">
              {goals.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    goal.completed 
                      ? 'bg-slate-950/40 border-slate-800/60 text-slate-500 line-through' 
                      : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-amber-400/30'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 transition-all ${
                    goal.completed ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {goal.completed && <Check size={10} />}
                  </div>
                  <span className="text-xs font-medium truncate">{goal.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ChatGPT-Style OYEN AI Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border border-amber-400/20 shadow-xl space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-400/20 shrink-0">
                ✨
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-extrabold text-slate-100 truncate">OYEN AI Assistant</h3>
                <p className="text-[10px] text-amber-400/80 font-medium truncate">Instant study assistant</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">What would you like help with today?</p>

            <form onSubmit={(e) => { e.preventDefault(); setActiveTab('ai-assistant'); }} className="relative">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask anything about coursework..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-amber-400 text-slate-950 font-bold">
                <ArrowRight size={12} />
              </button>
            </form>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Popular Prompts</span>
              {['Explain Flexbox & Grid', 'Summarize Week 4 notes', 'Help with assignment rubric'].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab('ai-assistant')}
                  className="w-full text-left p-1.5 px-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-400/40 text-[11px] text-slate-400 hover:text-amber-400 transition-all flex items-center justify-between"
                >
                  <span className="truncate">• {prompt}</span>
                  <ChevronRight size={12} className="text-slate-600 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <History size={15} className="text-amber-400" /> Recent Activity Log
            </h3>

            <div className="space-y-2">
              {recentActivity.map(act => (
                <div key={act.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className="text-slate-300 font-medium truncate">{act.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{act.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
