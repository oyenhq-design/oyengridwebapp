import React from 'react';
import { 
  Play, Calendar, Clock, FileCheck, ArrowRight, Sparkles, 
  CheckCircle2, BookOpen, AlertCircle, Award, Video 
} from 'lucide-react';
import { getLearnerProgrammeData, getLearnerAssignments } from '../services/participantDataService';

export default function Dashboard({ setActiveTab, user, wsPrograms, wsLearners }) {
  const programme = getLearnerProgrammeData(user, wsPrograms, wsLearners);
  const assignments = getLearnerAssignments();
  const pendingAssignment = assignments.find(a => a.status === 'Pending');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* 1. Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles size={13} /> Active Enrollment
            </span>
            <h1 className="text-2xl font-bold text-slate-100 mb-1">
              Good Morning, {programme.learnerName} 👋
            </h1>
            <p className="text-sm text-slate-400">
              You are currently enrolled in <span className="text-slate-200 font-semibold">{programme.name}</span> (Week {programme.currentWeek} of {programme.totalWeeks})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('learning')}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-400/10"
            >
              <Play size={14} className="fill-current" /> Continue Learning
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Agenda & Continue Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Learning & Agenda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Learning Featured Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Current Module</span>
              <span className="text-xs text-slate-400 font-medium">65% Completed</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Week 4: Design Systems</h3>
            <p className="text-xs text-slate-400 mb-4">
              Learn how to construct accessible component libraries, design tokens, typography scales, and auto-layout systems in Figma.
            </p>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-6">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
            </div>

            <button
              onClick={() => setActiveTab('learning')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700/60"
            >
              Resume Lesson: Component Libraries & Tokens <ArrowRight size={14} />
            </button>
          </div>

          {/* Today's Agenda */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" /> Today's Agenda
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400 font-bold text-xs">
                    10:00 AM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Live Session: Design Systems & Component Tokens</h4>
                    <p className="text-[11px] text-slate-400">Facilitator: Sarah Ahmed</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Join Session
                </button>
              </div>

              {pendingAssignment && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-xs">
                      Due Tomorrow
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{pendingAssignment.title}</h4>
                      <p className="text-[11px] text-slate-400">{pendingAssignment.module}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700"
                  >
                    Continue Submission
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Performance & Pending Tasks & OYEN AI */}
        <div className="space-y-6">
          {/* Performance Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 mb-4">Programme Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-medium block">Attendance</span>
                <span className="text-lg font-bold text-emerald-400">95%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-medium block">Assignments</span>
                <span className="text-lg font-bold text-amber-400">7 / 8</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-medium block">Average Score</span>
                <span className="text-lg font-bold text-slate-100">88%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-medium block">Current Rank</span>
                <span className="text-lg font-bold text-slate-100">14 / 200</span>
              </div>
            </div>
          </div>

          {/* OYEN AI Quick Prompts Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-400/10 to-slate-900 border border-amber-400/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-amber-400" />
              <h3 className="text-xs font-bold text-slate-100">Ask OYEN AI</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Instant assistant for your coursework, practice quizzes, and assignment guidance.</p>
            
            <div className="space-y-2">
              {['Summarize today\'s class', 'Explain Flexbox & Grid', 'Generate practice quiz', 'Help with assignment rubric'].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab('ai-assistant')}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-400/40 text-xs text-slate-300 hover:text-amber-400 transition-all flex items-center justify-between"
                >
                  <span>{prompt}</span>
                  <ArrowRight size={12} className="text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
