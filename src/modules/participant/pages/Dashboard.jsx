import React, { useState } from 'react';
import { 
  Play, Calendar, Clock, FileCheck, ArrowRight, Sparkles, 
  CheckCircle2, BookOpen, AlertCircle, Award, Video, Megaphone,
  Check, Search, History, ChevronRight, GraduationCap, MessageSquare,
  HelpCircle, Users
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
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-200 selection:bg-amber-200">
      
      {/* 1. Serene Hero Section */}
      <div className="space-y-4 pt-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Good Morning, {programme.learnerName} 👋
        </h1>
        <p className="text-base text-slate-600 font-medium">
          Ready for today's session?
        </p>

        {/* Featured Continue Learning Card */}
        <div className="p-7 rounded-3xl bg-white border border-[#E5E5DF] shadow-sm space-y-4 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Continue Learning • Week {programme.currentWeek}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Design Systems</h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Master cohesive component libraries, design tokens, typography scales, and auto-layout systems in Figma.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('learning')}
            className="px-6 py-3 rounded-2xl bg-[#F5D76E] hover:bg-[#eacb5e] text-slate-950 font-extrabold text-xs inline-flex items-center gap-2 transition-all shadow-sm"
          >
            Resume Learning →
          </button>
        </div>
      </div>

      {/* 2. Today's Focus Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
            Today's Focus
          </h3>
          <span className="text-xs text-slate-500 font-semibold">{goalsData.estimatedTime}</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E5E5DF] space-y-3 shadow-sm">
          {goals.map(goal => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                goal.completed 
                  ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' 
                  : 'bg-white border-[#E5E5DF] text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition-all ${
                goal.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50'
              }`}>
                {goal.completed ? <Check size={12} /> : <span className="text-[10px] text-slate-400">○</span>}
              </div>
              <span className="text-xs font-semibold">{goal.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Next Live Session */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Live Session
        </h3>

        <div className="p-6 rounded-3xl bg-white border border-[#E5E5DF] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs">
              Today 10:00 AM
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Design Systems & Component Tokens</h4>
              <p className="text-xs text-slate-500 mt-0.5">Facilitator: <span className="text-slate-800 font-semibold">Sarah Ahmed</span></p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('sessions')}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all shrink-0 self-start md:self-center"
          >
            Join Session
          </button>
        </div>
      </div>

      {/* 4. Assignment Due */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Assignment
        </h3>

        <div className="p-6 rounded-3xl bg-white border border-[#E5E5DF] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[10px] uppercase mb-1 inline-block">Due Tomorrow</span>
            <h4 className="text-sm font-extrabold text-slate-900">UI Design Challenge — Design System Components</h4>
            <p className="text-xs text-slate-500 mt-0.5">Week 4: Design Systems</p>
          </div>

          <button
            onClick={() => setActiveTab('assignments')}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all shrink-0 self-start md:self-center"
          >
            Continue →
          </button>
        </div>
      </div>

      {/* 5. Workspace Announcements */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Announcements
        </h3>

        <div className="space-y-2.5">
          {announcements.map(ann => (
            <div key={ann.id} className="p-4 rounded-2xl bg-white border border-[#E5E5DF] flex items-start gap-3.5 shadow-sm">
              <span className="text-base shrink-0 mt-0.5">{ann.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{ann.title}</h4>
                  <span className="text-[10px] text-slate-400">{ann.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{ann.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Ask OYEN AI Companion */}
      <div className="p-8 rounded-3xl bg-white border border-[#E5E5DF] shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm">
            ✨
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">✨ Ask OYEN AI</h3>
            <p className="text-xs text-slate-500">Need help understanding today's lesson?</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setActiveTab('ai-assistant'); }} className="relative">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask anything about your coursework..."
            className="w-full bg-slate-50 border border-[#E5E5DF] rounded-2xl px-5 py-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white shadow-inner"
          />
          <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
            Ask AI
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          {['• Explain Flexbox', '• Summarize Week 4', '• Practice Quiz'].map((prompt, i) => (
            <button
              key={i}
              onClick={() => setActiveTab('ai-assistant')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs text-slate-700 font-medium transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Community Highlights */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Community
        </h3>

        <div className="p-5 rounded-3xl bg-white border border-[#E5E5DF] space-y-2 text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span><strong>3 learners</strong> completed today's design challenge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span><strong>Sarah Ahmed</strong> shared a new Figma auto-layout design template</span>
          </div>
        </div>
      </div>

      {/* 8. Progress (Placed LAST, Not First) */}
      <div className="space-y-3 pb-8">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Progress Overview
        </h3>

        <div className="p-6 rounded-3xl bg-white border border-[#E5E5DF] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Week {programme.currentWeek} of {programme.totalWeeks}</span>
            <h4 className="text-lg font-extrabold text-slate-900">{programme.name}</h4>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{programme.progress}%</span>
            <span className="text-xs text-slate-400 block font-medium">Completion Rate</span>
          </div>
        </div>
      </div>

    </div>
  );
}
