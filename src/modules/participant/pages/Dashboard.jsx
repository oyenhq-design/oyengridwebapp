import React, { useState } from 'react';
import { 
  Play, Calendar, Clock, FileCheck, ArrowRight, Sparkles, 
  CheckCircle2, BookOpen, AlertCircle, Award, Video, Megaphone,
  Check, Search, History, ChevronRight, GraduationCap, MessageSquare,
  HelpCircle, Download
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
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-200">
      
      {/* 1. Immersive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              ✨ {programme.name}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Good Morning, {programme.learnerName} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-medium">
              You're making great progress in your bootcamp.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('learning')}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-400/10 shrink-0 self-start md:self-center"
          >
            <Play size={14} className="fill-current" /> Continue Learning →
          </button>
        </div>

        {/* Hero Progress Bar */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">Week {programme.currentWeek} of {programme.totalWeeks}</span>
            <span className="text-amber-400 font-extrabold">{programme.progress}% Complete</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${programme.progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2. Large Featured Card — Continue Learning */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <BookOpen size={15} className="text-amber-400" /> Continue Learning
        </h3>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Week 4 • Active Module</span>
            <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-bold">65% Complete</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-100">Design Systems & Component Tokens</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Master cohesive component libraries, design tokens, typography scales, and auto-layout systems in Figma.
          </p>

          <button
            onClick={() => setActiveTab('learning')}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-amber-400/10"
          >
            Resume Lesson →
          </button>
        </div>
      </div>

      {/* 3. Today's Actionable Goal Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={15} className="text-amber-400" /> Today's Goal
          </h3>
          <span className="text-xs text-slate-500 font-bold">Estimated Time: {goalsData.estimatedTime}</span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          {goals.map(goal => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                goal.completed 
                  ? 'bg-slate-950/40 border-slate-800/60 text-slate-500 line-through' 
                  : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-400/30'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition-all ${
                goal.completed ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'border-slate-700 bg-slate-900'
              }`}>
                {goal.completed ? <Check size={12} /> : <span className="text-[10px] text-slate-600">○</span>}
              </div>
              <span className="text-xs font-bold">{goal.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Today's Agenda Timeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar size={15} className="text-amber-400" /> Today's Agenda
        </h3>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 font-black text-xs">
              10:00 AM
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 mb-1 inline-block">LIVE SESSION</span>
              <h4 className="text-sm font-extrabold text-slate-100">Design Systems & Component Tokens</h4>
              <p className="text-xs text-slate-400 mt-0.5">Facilitator: <span className="text-slate-200 font-semibold">Sarah Ahmed</span></p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('sessions')}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/10 transition-all shrink-0 self-start md:self-center"
          >
            Join Session
          </button>
        </div>
      </div>

      {/* 5. Workspace Announcements */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Megaphone size={15} className="text-amber-400" /> Announcements
        </h3>

        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-start gap-4 shadow-md">
              <span className="text-xl shrink-0">{ann.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{ann.title}</h4>
                  <span className="text-[10px] text-slate-500">{ann.time}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ann.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Programme Roadmap Journey */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <GraduationCap size={15} className="text-amber-400" /> Programme Roadmap
        </h3>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              { week: 1, label: 'Week 1', status: 'done' },
              { week: 2, label: 'Week 2', status: 'done' },
              { week: 3, label: 'Week 3', status: 'done' },
              { week: 4, label: 'Week 4', status: 'current' },
              { week: 5, label: 'Week 5', status: 'upcoming' },
              { week: 6, label: 'Week 6', status: 'upcoming' },
              { week: 7, label: 'Week 7', status: 'upcoming' },
              { week: 8, label: 'Week 8', status: 'upcoming' },
            ].map(step => (
              <div
                key={step.week}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  step.status === 'done' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : step.status === 'current' 
                      ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-black' 
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                <span className="text-xs font-bold block">{step.label}</span>
                <span className="text-xs block mt-1">
                  {step.status === 'done' ? '✓' : step.status === 'current' ? '●' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Assignments Due */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <FileCheck size={15} className="text-amber-400" /> Assignments Due
        </h3>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-[10px] uppercase mb-1 inline-block">Due Tomorrow</span>
            <h4 className="text-sm font-extrabold text-slate-100">UI Design Challenge — Design System Components</h4>
            <p className="text-xs text-slate-400 mt-0.5">Week 4: Design Systems</p>
          </div>

          <button
            onClick={() => setActiveTab('assignments')}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-400/10 transition-all shrink-0 self-start md:self-center"
          >
            Continue Submission →
          </button>
        </div>
      </div>

      {/* 8. Integrated OYEN AI Workspace */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border border-amber-400/30 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-lg shadow-amber-400/20">
            ✨
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">✨ OYEN AI</h3>
            <p className="text-xs text-amber-400 font-semibold">What would you like help with?</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setActiveTab('ai-assistant'); }} className="relative">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask anything about your coursework..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 shadow-inner"
          />
          <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs">
            Ask AI
          </button>
        </form>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Popular Prompts</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['• Explain Flexbox', '• Summarize Week 4', '• Help with Assignment'].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setActiveTab('ai-assistant')}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/40 text-xs text-slate-300 hover:text-amber-400 text-left transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <History size={15} className="text-amber-400" /> Recent Activity
        </h3>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          {recentActivity.map(act => (
            <div key={act.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="text-slate-200 font-medium">{act.title}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">{act.date}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
