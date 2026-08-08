import React from 'react';
import { User, Briefcase, Code, Link as LinkIcon, FileText, Award } from 'lucide-react';

export default function Profile({ user }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <User className="text-amber-400" /> Learner Portfolio & Profile
        </h1>
        <p className="text-xs text-slate-400">Your professional portfolio showcasing projects, skills, and completed programme achievements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-400 text-2xl mx-auto">
            S
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-100">Shola Alabi</h2>
            <p className="text-xs text-slate-400">Aspiring Product Designer • UX Researcher</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 text-left">
            <span className="font-bold text-slate-200 block mb-1">Bio</span>
            Passionate about accessible design systems, user-centric micro-interactions, and design-to-engineering handoffs.
          </div>
        </div>

        {/* Portfolio Projects & Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Briefcase size={16} className="text-amber-400" /> Featured Projects & Deliverables
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Figma Auto-Layout Component System</h4>
                  <p className="text-[10px] text-slate-400">Week 4 Deliverable • Product Design Bootcamp</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5">
                  <LinkIcon size={12} /> View Figma
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">User Persona & Interview Synthesis Map</h4>
                  <p className="text-[10px] text-slate-400">Week 2 Deliverable • Product Design Bootcamp</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5">
                  <LinkIcon size={12} /> View PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
