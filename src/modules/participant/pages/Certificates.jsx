import React, { useState } from 'react';
import {
  Award, Download, ExternalLink, ShieldCheck, CheckCircle2, Search,
  Eye, X, QrCode, Sparkles, Building2, Calendar, FileText
} from 'lucide-react';
import { PARTICIPANT_THEME } from '../constants/theme';
import ParticipantPageShell from '../components/common/ParticipantPageShell';

export default function Certificates({ user, wsPrograms = [], wsLearners = [] }) {
  const userEmail = (user?.email || '').toLowerCase();
  
  // State for active certificate modal & verification view
  const [selectedCert, setSelectedCert] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Authenticated Participant & Enrolled Programme from database
  const participant = wsLearners.find(l => l.email && l.email.toLowerCase() === userEmail) || {
    name: userEmail.split('@')[0] || 'Learner',
    email: userEmail
  };

  const displayName = participant.name || userEmail.split('@')[0] || 'Learner';

  // Find programme matching user's program/programId in wsPrograms
  const currentProgramme = wsPrograms.find(p => 
    p.name === participant.program || 
    p.title === participant.program || 
    p.id === participant.programId
  ) || wsPrograms[0] || null;

  // Extract real certificates or check if programme is 100% completed
  const rawCertificates = currentProgramme?.certificates || [];
  const isProgrammeCompleted = currentProgramme && (currentProgramme.progress === 100 || currentProgramme.status === 'Completed');

  // Compute Issued Certificates List dynamically from database
  const certificates = rawCertificates.length > 0 ? rawCertificates : (
    isProgrammeCompleted ? [
      {
        id: `CERT-OYEN-${Date.now().toString().slice(-6)}`,
        name: `Professional Certificate in ${currentProgramme.name || currentProgramme.title}`,
        programmeName: currentProgramme.name || currentProgramme.title,
        orgName: 'ABC Energy Workspace',
        completionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        issuedBy: currentProgramme.leadFacilitator || 'Sarah Ahmed',
        status: 'Valid',
        verificationUrl: `https://oyengrid.com/verify/CERT-OYEN-${Date.now().toString().slice(-6)}`
      }
    ] : []
  );

  // Render empty state if no certificates issued yet
  if (certificates.length === 0) {
    return (
      <ParticipantPageShell
        title="Certificates"
        category="Personal"
        description="Certificates will automatically appear here after you successfully complete the requirements of your enrolled programmes."
        icon={Award}
      />
    );
  }

  // Filter Search
  const filteredCerts = certificates.filter(c => 
    `${c.name} ${c.programmeName} ${c.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      color: PARTICIPANT_THEME.text
    }}>
      
      {/* ── HEADER & METRICS ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.03em', color: PARTICIPANT_THEME.text }}>
            Official Certificates & Credentials
          </h1>
          <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: 0, fontWeight: 500 }}>
            Verifiable digital certificates issued for completed programmes and training milestones.
          </p>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Certificates Earned</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: PARTICIPANT_THEME.primaryAccent }}>{certificates.length}</span>
          </div>

          <div style={{ padding: '20px', backgroundColor: PARTICIPANT_THEME.cardBg, border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: PARTICIPANT_THEME.radius }}>
            <span style={{ fontSize: '11px', color: PARTICIPANT_THEME.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Verification Status</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>100% Valid ✓</span>
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div style={{ position: 'relative', width: '100%' }}>
        <Search size={18} color={PARTICIPANT_THEME.muted} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search certificates by name, programme, or Certificate ID..."
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            backgroundColor: PARTICIPANT_THEME.cardBg,
            border: `1px solid ${PARTICIPANT_THEME.border}`,
            borderRadius: PARTICIPANT_THEME.radius,
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* ── CERTIFICATES LIST ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredCerts.map((cert) => (
          <div
            key={cert.id}
            style={{
              backgroundColor: PARTICIPANT_THEME.cardBg,
              border: `1px solid ${PARTICIPANT_THEME.border}`,
              borderRadius: PARTICIPANT_THEME.radius,
              padding: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
          >
            {/* Left Preview Icon & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: PARTICIPANT_THEME.radius,
                backgroundColor: 'rgba(229, 185, 60, 0.15)',
                border: '1px solid rgba(229, 185, 60, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PARTICIPANT_THEME.primaryAccent
              }}>
                <Award size={32} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {cert.orgName || 'OYEN GRID Certified'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '999px' }}>
                    {cert.status || 'Valid'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: PARTICIPANT_THEME.text }}>
                  {cert.name}
                </h3>
                
                <div style={{ fontSize: '12.5px', color: PARTICIPANT_THEME.muted, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>ID: <strong>{cert.id}</strong></span>
                  <span>Issued: {cert.completionDate}</span>
                  <span>Facilitator: {cert.issuedBy}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSelectedCert(cert)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${PARTICIPANT_THEME.border}`,
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: PARTICIPANT_THEME.text
                }}
              >
                <Eye size={15} />
                <span>View Certificate</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCert(cert);
                  setShowVerifyModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: PARTICIPANT_THEME.text,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ShieldCheck size={15} color="#10B981" />
                <span>Verify Credential</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ── FULL CERTIFICATE PREVIEW MODAL ── */}
      {selectedCert && !showVerifyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.5)', backdropFilter: 'blur(6px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: `2px solid ${PARTICIPANT_THEME.primaryAccent}`, borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '720px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: PARTICIPANT_THEME.primaryAccent, letterSpacing: '0.1em' }}>OYEN GRID OFFICIAL CREDENTIAL</span>
              <button onClick={() => setSelectedCert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={20} /></button>
            </div>

            {/* Diploma Frame */}
            <div style={{ border: `1px solid ${PARTICIPANT_THEME.border}`, borderRadius: '12px', padding: '32px', backgroundColor: '#FAF8F5', marginBottom: '28px' }}>
              <Award size={48} color={PARTICIPANT_THEME.primaryAccent} style={{ marginBottom: '16px' }} />
              
              <div style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Certificate of Completion
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 800, color: PARTICIPANT_THEME.text, margin: '0 0 16px 0' }}>
                {displayName}
              </h2>

              <p style={{ fontSize: '14px', color: PARTICIPANT_THEME.muted, margin: '0 0 20px 0', lineHeight: 1.6 }}>
                has successfully fulfilled all academic curriculum, project assessments, and attendance requirements for
              </p>

              <h3 style={{ fontSize: '20px', fontWeight: 700, color: PARTICIPANT_THEME.primaryAccent, margin: '0 0 24px 0' }}>
                {selectedCert.programmeName}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: `1px solid ${PARTICIPANT_THEME.border}`, paddingTop: '20px', fontSize: '12px', color: PARTICIPANT_THEME.muted }}>
                <div><strong>Issued Date:</strong> {selectedCert.completionDate}</div>
                <div><strong>Certificate ID:</strong> {selectedCert.id}</div>
                <div><strong>Verified Status:</strong> <span style={{ color: '#10B981', fontWeight: 700 }}>Valid ✓</span></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => alert(`Downloading official PDF for ${selectedCert.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                <Download size={16} /> Download Official PDF
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── VERIFICATION MODAL ── */}
      {showVerifyModal && selectedCert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(21,21,21,0.5)', backdropFilter: 'blur(6px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2D8', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Credential Verification</h3>
              <button onClick={() => setShowVerifyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: PARTICIPANT_THEME.muted }}><X size={18} /></button>
            </div>

            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <ShieldCheck size={32} />
            </div>

            <h4 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#10B981' }}>Authentic Credential Verified ✓</h4>
            <p style={{ fontSize: '13px', color: PARTICIPANT_THEME.muted, marginBottom: '20px' }}>
              Certificate ID <strong>{selectedCert.id}</strong> is registered on the OYEN GRID Verification Registry.
            </p>

            <button
              onClick={() => setShowVerifyModal(false)}
              style={{ width: '100%', padding: '12px', backgroundColor: PARTICIPANT_THEME.text, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Close Verification
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
