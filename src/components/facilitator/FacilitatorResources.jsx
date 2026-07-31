import React from 'react';
import { FileText, Download, Folder, Search } from 'lucide-react';

export default function FacilitatorResources() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#F7F5F0', minHeight: '100vh', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Outfit', sans-serif" }}>Resources Library</h1>
        <p style={{ color: '#5C5C5C', fontSize: '0.92rem', marginTop: '0.35rem' }}>
          Access guides, slides, and files for your sessions.
        </p>
      </div>

      <div style={{ backgroundColor: '#111111', borderRadius: '16px', padding: '2rem', border: '1px solid #1F2937' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={14} color="#6B7280" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search resources..." 
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <FileText color="#94A3B8" />
              <div>
                <h4 style={{ color: '#FFFFFF', margin: 0, fontSize: '0.9rem' }}>Facilitation Guide 2024.pdf</h4>
                <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Added 2 days ago</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#F5C84C', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
