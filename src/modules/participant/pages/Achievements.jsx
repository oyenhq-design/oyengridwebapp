import React from 'react';
import { Award, Zap, CheckCircle2, Users, Star, Lock } from 'lucide-react';
import { getLearnerAchievements } from '../services/participantDataService';

export default function Achievements() {
  const achievements = getLearnerAchievements();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <Award className="text-amber-400" /> Learner Achievements & Streaks
        </h1>
        <p className="text-xs text-slate-400">Earn badges for perfect attendance, assignment streaks, and top quiz scores.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map(ach => (
          <div
            key={ach.id}
            className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              ach.unlocked 
                ? 'bg-slate-900/80 border-amber-400/30 shadow-lg shadow-amber-400/5' 
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                ach.unlocked ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' : 'bg-slate-800 text-slate-500'
              }`}>
                {ach.unlocked ? <Star size={22} className="fill-current" /> : <Lock size={22} />}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{ach.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">{ach.desc}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className={`font-semibold ${ach.unlocked ? 'text-amber-400' : 'text-slate-500'}`}>
                {ach.unlocked ? 'Unlocked' : 'Locked'}
              </span>
              <span className="text-slate-500">{ach.date || 'In Progress'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
