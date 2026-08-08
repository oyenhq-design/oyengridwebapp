import React from 'react';
import { HelpCircle, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function Assessments() {
  const quizzes = [
    {
      id: 'q-1',
      title: 'Week 4 Knowledge Check: Design Systems',
      status: 'Available',
      duration: '15 Mins',
      questions: 10,
      passMark: '80%',
      attemptsAllowed: 3,
      attemptsUsed: 0,
      score: null
    },
    {
      id: 'q-2',
      title: 'Week 3 Quiz: Micro-interactions & Motion',
      status: 'Completed',
      duration: '20 Mins',
      questions: 15,
      passMark: '75%',
      attemptsAllowed: 3,
      attemptsUsed: 1,
      score: '93%'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <HelpCircle className="text-amber-400" /> Quizzes & Knowledge Checks
        </h1>
        <p className="text-xs text-slate-400">Validate your understanding ofweekly course concepts with timed quizzes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                quiz.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'
              }`}>
                {quiz.status}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {quiz.duration}</span>
            </div>

            <h3 className="text-base font-bold text-slate-100">{quiz.title}</h3>

            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block">Questions</span>
                <span className="text-xs font-bold text-slate-200">{quiz.questions}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Pass Mark</span>
                <span className="text-xs font-bold text-slate-200">{quiz.passMark}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Score</span>
                <span className="text-xs font-bold text-emerald-400">{quiz.score || 'N/A'}</span>
              </div>
            </div>

            <button
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                quiz.status === 'Completed'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/10'
              }`}
            >
              {quiz.status === 'Completed' ? 'Review Answers' : 'Start Assessment'} <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
