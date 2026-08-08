import React, { useState } from 'react';
import { BookOpen, Video, FileText, CheckCircle2, Lock, Play, Clock } from 'lucide-react';
import { getLearnerProgrammeData } from '../services/participantDataService';

export default function Learning({ user, wsPrograms }) {
  const programme = getLearnerProgrammeData(user, wsPrograms);
  const [selectedModule, setSelectedModule] = useState(programme.modules[3] || programme.modules[0]);
  const [activeLesson, setActiveLesson] = useState(selectedModule.lessons[0]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <BookOpen className="text-amber-400" /> Learning Workspace
        </h1>
        <p className="text-xs text-slate-400">Structured lessons, readings, and exercises for {programme.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modules Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Modules</h3>
          {programme.modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => { setSelectedModule(mod); setActiveLesson(mod.lessons[0]); }}
              className={`w-full text-left p-4 rounded-xl border text-xs transition-all ${
                selectedModule.id === mod.id 
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400 font-semibold' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <h4 className="font-bold mb-1">{mod.title}</h4>
              <p className="text-[10px] text-slate-400">{mod.lessons.length} Lessons</p>
            </button>
          ))}
        </div>

        {/* Lesson Player / Content View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lesson Header & Player Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                {activeLesson?.type || 'Lesson'}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {activeLesson?.duration}
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-100">{activeLesson?.title}</h2>

            {/* Video Placeholder / Content Box */}
            <div className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xl shadow-amber-400/20 group-hover:scale-105 transition-transform cursor-pointer">
                <Play size={24} className="fill-current ml-1" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-200">Lesson Overview</h4>
              <p>
                In this lesson, we cover core concepts of creating cohesive component libraries in Figma, leveraging variable design tokens for colors, spacing, and typography scale.
              </p>
            </div>
          </div>

          {/* Lessons List in Module */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Lessons in {selectedModule.title}</h3>
            <div className="space-y-2">
              {selectedModule.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    activeLesson?.id === lesson.id 
                      ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' 
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {lesson.status === 'Completed' ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : lesson.status === 'Locked' ? (
                      <Lock size={16} className="text-slate-600" />
                    ) : (
                      <Play size={16} className="text-amber-400" />
                    )}
                    <span className="text-xs font-bold">{lesson.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{lesson.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
