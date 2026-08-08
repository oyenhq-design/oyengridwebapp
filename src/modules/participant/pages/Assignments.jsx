import React, { useState } from 'react';
import { FileCheck, Upload, Github, Link, FileText, CheckCircle2, Clock, Award } from 'lucide-react';
import { getLearnerAssignments } from '../services/participantDataService';

export default function Assignments() {
  const assignments = getLearnerAssignments();
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0]);
  const [submissionType, setSubmissionType] = useState('figma');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <FileCheck className="text-amber-400" /> Assignment Workspace
        </h1>
        <p className="text-xs text-slate-400">Review project instructions, submit deliverables via Figma/GitHub/PDF, and view facilitator rubrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assignments</h3>
          {assignments.map(asg => (
            <div
              key={asg.id}
              onClick={() => { setSelectedAssignment(asg); setSubmitted(false); }}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedAssignment.id === asg.id
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  asg.status === 'Graded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'
                }`}>
                  {asg.status}
                </span>
                <span className="text-[10px] text-slate-400">{asg.dueDate}</span>
              </div>
              <h4 className="font-bold text-slate-200 mb-1">{asg.title}</h4>
              <p className="text-[10px] text-slate-400">{asg.module}</p>
            </div>
          ))}
        </div>

        {/* Selected Assignment Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{selectedAssignment.module}</span>
                <h2 className="text-lg font-bold text-slate-100">{selectedAssignment.title}</h2>
              </div>
              {selectedAssignment.score !== null && (
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Score</span>
                  <span className="text-xl font-extrabold text-emerald-400">{selectedAssignment.score} / {selectedAssignment.maxScore}</span>
                </div>
              )}
            </div>

            {/* Instructions & Rubric */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Instructions</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                {selectedAssignment.instructions}
              </p>
            </div>

            {/* Feedback section if graded */}
            {selectedAssignment.feedback && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5"><Award size={14} /> Facilitator Feedback</span>
                <p className="text-slate-200">{selectedAssignment.feedback}</p>
              </div>
            )}

            {/* Submission Form */}
            {selectedAssignment.status === 'Pending' && !submitted && (
              <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-200">Submit Your Work</h4>
                
                {/* Method selector */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'figma', label: 'Figma URL', icon: Link },
                    { id: 'github', label: 'GitHub', icon: Github },
                    { id: 'file', label: 'Upload File', icon: Upload },
                    { id: 'text', label: 'Text Response', icon: FileText }
                  ].map(m => {
                    const Icon = m.icon;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSubmissionType(m.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          submissionType === m.id 
                            ? 'bg-amber-400/20 border-amber-400/40 text-amber-400' 
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon size={12} /> {m.label}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  required
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder={submissionType === 'figma' ? 'Paste your Figma prototype URL here...' : 'Enter URL or response link...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/10 transition-all"
                >
                  Submit Deliverable
                </button>
              </form>
            )}

            {submitted && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 size={24} className="text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-emerald-400">Assignment Submitted Successfully</h4>
                <p className="text-[11px] text-slate-400">Your facilitator has been notified and will grade your submission soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
