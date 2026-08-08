import React from 'react';
import { FileBadge, Download, Share2, ExternalLink, ShieldCheck } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

export default function Certificates() {
  const certificates = [
    {
      id: 'cert-1',
      title: 'Professional Product Design Certificate',
      issuer: 'OYEN GRID Academy',
      issueDate: 'Pending Completion (Week 8)',
      status: 'In Progress',
      verificationId: 'OG-CERT-2026-8842',
      ready: false
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <FileBadge className="text-amber-400" /> Certificates & Verified Credentials
        </h1>
        <p className="text-xs text-slate-400">Earn shareable certificates verified on the blockchain upon programme graduation.</p>
      </div>

      <div className="space-y-6">
        {certificates.map(cert => (
          <div key={cert.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                <FileBadge size={28} />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-400 mb-1 inline-block">
                  {cert.status}
                </span>
                <h3 className="text-base font-bold text-slate-100">{cert.title}</h3>
                <p className="text-xs text-slate-400">{cert.issuer} • {cert.issueDate}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">Verification ID: {cert.verificationId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={!cert.ready}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  cert.ready ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Download size={14} /> Download PDF
              </button>
              <button
                disabled={!cert.ready}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                  cert.ready ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'border-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Share2 size={14} /> Share on LinkedIn
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
