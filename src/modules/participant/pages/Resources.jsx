import React, { useState } from 'react';
import { FolderArchive, Download, Search, FileText, Video, ExternalLink } from 'lucide-react';

export default function Resources() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const resources = [
    { id: 1, name: 'Week 4 Design Systems Figma UI Kit', category: 'Templates', size: '14.2 MB', date: 'Aug 4, 2026' },
    { id: 2, name: 'Color Contrast Accessibility Guide PDF', category: 'PDFs', size: '2.8 MB', date: 'Aug 2, 2026' },
    { id: 3, name: 'Week 3 Micro-interactions Session Recording', category: 'Recordings', size: '340 MB', date: 'Aug 1, 2026' },
    { id: 4, name: 'Typography Scale Calculator Tool', category: 'Tools', size: 'Link', date: 'Jul 28, 2026' },
  ];

  const filtered = resources.filter(r => 
    (filter === 'All' || r.category === filter) &&
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <FolderArchive className="text-amber-400" /> Resource Library
        </h1>
        <p className="text-xs text-slate-400">Download slides, Figma design kits, PDFs, and session tools.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', 'Templates', 'PDFs', 'Recordings', 'Tools'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === cat ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(res => (
          <div key={res.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{res.name}</h4>
                <p className="text-[10px] text-slate-400">{res.category} • {res.size} • Uploaded {res.date}</p>
              </div>
            </div>

            <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors">
              <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
