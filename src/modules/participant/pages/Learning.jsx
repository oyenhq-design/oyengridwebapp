import React, { useState } from 'react';
import { BookOpen, Video, FileText, CheckCircle2, Lock, Play, Clock } from 'lucide-react';
import { getLearnerProgrammeData } from '../services/participantDataService';

export default function Learning({ user, wsPrograms }) {
  const programme = getLearnerProgrammeData(user, wsPrograms);
  const [selectedModule, setSelectedModule] = useState(programme.modules[1] || programme.modules[0]);
  const [activeLesson, setActiveLesson] = useState(selectedModule.lessons[0]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200 selection:bg-amber-200">
      <div className="space-y-1">
        <span className="text-xs font-bold text-[#737373] uppercase tracking-widest">
          {programme.name}
        </span>
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
          Learning Modules
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Modules Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-[#737373] uppercase tracking-widest">Course Modules</h3>
          {programme.modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => { setSelectedModule(mod); setActiveLesson(mod.lessons[0]); }}
              className={`w-full text-left p-4 rounded-2xl border text-xs transition-all ${
                selectedModule.id === mod.id 
                  ? 'bg-slate-900 text-white font-bold shadow-sm' 
                  : 'bg-white border-[#ECE8E1] text-[#111111] hover:border-slate-300'
              }`}
            >
              <h4 className="font-bold mb-1">{mod.title}</h4>
              <p className={`text-[10px] ${selectedModule.id === mod.id ? 'text-amber-400 font-medium' : 'text-[#737373]'}`}>
                {mod.lessons.length} Lessons
              </p>
            </button>
          ))}
        </div>

        {/* Lesson Player / Content View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lesson Header & Player Card */}
          <div className="p-7 rounded-3xl bg-white border border-[#ECE8E1] space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider">
                {activeLesson?.type || 'Lesson'}
              </span>
              <span className="text-xs text-[#737373] flex items-center gap-1 font-semibold">
                <Clock size={13} /> {activeLesson?.duration}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-[#111111]">{activeLesson?.title}</h2>

            {/* Video Player */}
            <div className="w-full aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-full bg-[#F5D76E] text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform cursor-pointer">
                <Play size={24} className="fill-current ml-1" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#ECE8E1] text-xs text-[#737373] leading-relaxed space-y-1.5">
              <h4 className="font-bold text-[#111111]">Lesson Overview</h4>
              <p>
                In this lesson, we cover core concepts of creating cohesive component libraries in Figma, leveraging variable design tokens for colors, spacing, and typography scale.
              </p>
            </div>
          </div>

          {/* Lessons List in Module */}
          <div className="p-6 rounded-3xl bg-white border border-[#ECE8E1] space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#737373] uppercase tracking-widest">Lessons in {selectedModule.title}</h3>
            <div className="space-y-2">
              {selectedModule.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    activeLesson?.id === lesson.id 
                      ? 'bg-slate-950 text-white border-slate-950' 
                      : 'bg-white border-[#ECE8E1] text-[#111111] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {lesson.status === 'Completed' ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : lesson.status === 'Locked' ? (
                      <Lock size={16} className="text-slate-400" />
                    ) : (
                      <Play size={16} className={activeLesson?.id === lesson.id ? 'text-amber-400' : 'text-slate-700'} />
                    )}
                    <span className="text-xs font-semibold">{lesson.title}</span>
                  </div>
                  <span className={`text-[10px] ${activeLesson?.id === lesson.id ? 'text-slate-400' : 'text-[#737373]'}`}>
                    {lesson.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
