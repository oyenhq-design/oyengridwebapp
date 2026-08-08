import React, { useState, useMemo } from "react";
import {
  Plus, Search, Download, BookOpen, Users, Calendar,
  FileText, Award, ChevronDown, MoreHorizontal, Edit2, Trash2,
  Archive, Copy, UserCheck, X, Check,
  ArrowRight, Zap, BarChart3, CheckSquare, Square, Video, MessageSquare, Bell, Settings, Filter
} from "lucide-react";

const T = {
  bg: "#F8F5EF", card: "#FFFFFF", border: "#EBE5D9",
  gold: "#F4C542", goldDark: "#D8A325", goldLight: "rgba(244,197,66,0.12)",
  text: "#111111", body: "#2D2D2D", muted: "#6B7280",
  success: "#10B981", successLight: "rgba(16,185,129,0.1)",
  warning: "#F59E0B", warningLight: "rgba(245,158,11,0.1)",
  danger: "#EF4444", dangerLight: "rgba(239,68,68,0.08)",
  info: "#3B82F6", infoLight: "rgba(59,130,246,0.1)",
  font: "'Inter',sans-serif", display: "'Outfit',sans-serif",
};

const SC = {
  Active:    { color: T.success, bg: T.successLight, label: "Active" },
  Published: { color: T.success, bg: T.successLight, label: "Active" },
  Draft:     { color: T.warning, bg: T.warningLight, label: "Draft" },
  Planning:  { color: T.warning, bg: T.warningLight, label: "Planning" },
  Completed: { color: T.info,    bg: T.infoLight,    label: "Completed" },
  Archived:  { color: T.muted,   bg: "#F3F4F6",      label: "Archived" },
};
const cfg = s => SC[s] || SC["Draft"];

const calcPct = (prog, wsLearners = []) => {
  const sessions = prog.sessions || [];
  if (!sessions.length) return 0;
  return Math.round((sessions.filter(x => x.status === "Completed").length / sessions.length) * 100);
};

/* ── Programme Card ─────────────────────────────────────── */
function ProgrammeCard({ prog, wsLearners = [], selected, onSelect, onOpen, onEdit, onDuplicate, onArchive, onDelete }) {
  const [menu, setMenu] = useState(false);
  const sc = cfg(prog.status);
  const pct = calcPct(prog, wsLearners);
  
  // Real database relationships
  const enrolledLearners = wsLearners.filter(l => l.program === (prog.name || prog.title) || l.programId === prog.id);
  const leadFacilitator   = (prog.assignedFacilitators || [])[0] || prog.facilitator || "Unassigned";
  const modulesCount      = (prog.modules || []).length;
  const sessionsCount     = (prog.sessions || []).length;

  return (
    <div
      style={{
        backgroundColor: T.card,
        border: `1px solid ${selected ? T.gold : T.border}`,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: selected ? `0 0 0 2px ${T.gold}` : "0 4px 12px rgba(0,0,0,0.04)",
        transition: "all .2s ease",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ padding: "1.5rem 1.5rem 1rem", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
            <button onClick={() => onSelect(prog.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: selected ? T.gold : T.muted }}>
              {selected ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>
            <div>
              <h3 style={{ margin: "0 0 .4rem", fontSize: "1.05rem", fontWeight: 700, color: T.text, fontFamily: T.display }}>
                {prog.name || prog.title}
              </h3>
              <span style={{ fontSize: ".72rem", fontWeight: 700, color: sc.color, backgroundColor: sc.bg, padding: ".2rem .55rem", borderRadius: "20px" }}>
                {sc.label}
              </span>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={() => setMenu(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted }}>
              <MoreHorizontal size={18} />
            </button>
            {menu && (
              <div
                style={{
                  position: "absolute", right: 0, top: "100%", marginTop: "4px",
                  backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "12px",
                  padding: ".4rem", zIndex: 50, minWidth: "150px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                }}
                onMouseLeave={() => setMenu(false)}
              >
                <button onClick={() => { onEdit(prog); setMenu(false); }} style={{ display: "flex", alignItems: "center", gap: ".6rem", width: "100%", padding: ".55rem .75rem", background: "none", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, color: T.body, cursor: "pointer" }}><Edit2 size={13} /> Edit</button>
                <button onClick={() => { onDuplicate(prog); setMenu(false); }} style={{ display: "flex", alignItems: "center", gap: ".6rem", width: "100%", padding: ".55rem .75rem", background: "none", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, color: T.body, cursor: "pointer" }}><Copy size={13} /> Duplicate</button>
                <button onClick={() => { onArchive(prog.id); setMenu(false); }} style={{ display: "flex", alignItems: "center", gap: ".6rem", width: "100%", padding: ".55rem .75rem", background: "none", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, color: T.body, cursor: "pointer" }}><Archive size={13} /> Archive</button>
                <button onClick={() => { onDelete(prog.id); setMenu(false); }} style={{ display: "flex", alignItems: "center", gap: ".6rem", width: "100%", padding: ".55rem .75rem", background: "none", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, color: T.danger, cursor: "pointer" }}><Trash2 size={13} /> Delete</button>
              </div>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p style={{ fontSize: ".85rem", color: T.muted, margin: "0 0 1rem", lineHeight: "1.4" }}>
          {prog.desc || prog.description || "No description provided."}
        </p>

        {/* Database Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".82rem", color: T.muted }}>
            <Calendar size={13} />
            <span>{prog.startDate || "TBD"} — {prog.endDate || "TBD"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".82rem", color: T.body }}>
            <UserCheck size={13} color={T.goldDark} />
            <span>Lead: {typeof leadFacilitator === "object" ? leadFacilitator.name : leadFacilitator}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: ".82rem", color: T.muted, flexWrap: "wrap", marginTop: ".25rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}><Users size={13} /> {enrolledLearners.length} Participants</span>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}><FileText size={13} /> {modulesCount} Modules</span>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}><Video size={13} /> {sessionsCount} Sessions</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", fontWeight: 600, color: T.muted, marginBottom: ".4rem" }}>
            <span>Completion Rate</span>
            <span style={{ color: T.text }}>{pct}%</span>
          </div>
          <div style={{ width: "100%", height: "6px", backgroundColor: "#EBE5D9", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", backgroundColor: T.gold, borderRadius: "3px", transition: "width .5s ease" }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: ".85rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: ".75rem", color: T.muted }}>
          Updated {prog.updatedAt || "recently"}
        </span>
        <button
          onClick={() => onOpen(prog)}
          style={{
            padding: ".45rem 1rem", backgroundColor: T.text, color: "#fff",
            border: "none", borderRadius: "8px", fontSize: ".8rem", fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: ".35rem"
          }}
        >
          <span>Open Workspace</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Full Programme Workspace View (11 Tabs) ──────────────── */
function ProgrammeWorkspaceView({ prog, wsLearners = [], onBack }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [participantSearch, setParticipantSearch] = useState("");

  const enrolledLearners = useMemo(() => {
    return wsLearners.filter(l => l.program === (prog.name || prog.title) || l.programId === prog.id);
  }, [wsLearners, prog]);

  const filteredParticipants = useMemo(() => {
    if (!participantSearch.trim()) return enrolledLearners;
    const q = participantSearch.toLowerCase();
    return enrolledLearners.filter(l =>
      l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
    );
  }, [enrolledLearners, participantSearch]);

  const sessions    = prog.sessions    || [];
  const modules     = prog.modules     || [];
  const resources   = prog.resources   || [];
  const assignments = prog.assignments || [];
  const assessments = prog.assessments || [];

  const WSTABS = [
    "Overview", "Participants", "Modules", "Sessions", "Assignments",
    "Assessments", "Resources", "Announcements", "Certificates", "Analytics", "Settings"
  ];

  return (
    <div style={{ padding: "2rem 2.5rem", fontFamily: T.font }}>
      {/* Header Back & Workspace Info */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: ".4rem",
            background: "none", border: "none", color: T.muted, cursor: "pointer",
            fontSize: ".85rem", fontWeight: 600, marginBottom: "1rem"
          }}
        >
          ← Back to Programmes
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: T.text, fontFamily: T.display }}>
              {prog.name || prog.title}
            </h1>
            <p style={{ margin: ".3rem 0 0", fontSize: ".9rem", color: T.muted }}>
              {prog.desc || prog.description || "Programme Workspace"}
            </p>
          </div>
          <span style={{ fontSize: ".8rem", fontWeight: 700, color: T.success, backgroundColor: T.successLight, padding: ".3rem .8rem", borderRadius: "20px" }}>
            {prog.status || "Active"}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: ".5rem", borderBottom: `1px solid ${T.border}`, marginBottom: "2rem", overflowX: "auto" }}>
        {WSTABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: ".75rem 1.1rem",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab ? `2px solid ${T.gold}` : "2px solid transparent",
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: ".85rem",
              color: activeTab === tab ? T.text : T.muted,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "Overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "1.25rem" }}>
            <div style={{ fontSize: ".72rem", color: T.muted, fontWeight: 700, textTransform: "uppercase" }}>Enrolled Participants</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: T.text, fontFamily: T.display, marginTop: ".3rem" }}>{enrolledLearners.length}</div>
          </div>
          <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "1.25rem" }}>
            <div style={{ fontSize: ".72rem", color: T.muted, fontWeight: 700, textTransform: "uppercase" }}>Learning Modules</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: T.text, fontFamily: T.display, marginTop: ".3rem" }}>{modules.length}</div>
          </div>
          <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "1.25rem" }}>
            <div style={{ fontSize: ".72rem", color: T.muted, fontWeight: 700, textTransform: "uppercase" }}>Live Sessions</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: T.text, fontFamily: T.display, marginTop: ".3rem" }}>{sessions.length}</div>
          </div>
          <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "14px", padding: "1.25rem" }}>
            <div style={{ fontSize: ".72rem", color: T.muted, fontWeight: 700, textTransform: "uppercase" }}>Program Resources</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: T.text, fontFamily: T.display, marginTop: ".3rem" }}>{resources.length}</div>
          </div>
        </div>
      )}

      {activeTab === "Participants" && (
        <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Program Participants ({filteredParticipants.length})</h3>
            <div style={{ position: "relative", width: "240px" }}>
              <Search size={14} color={T.muted} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search participants..."
                value={participantSearch}
                onChange={e => setParticipantSearch(e.target.value)}
                style={{ width: "100%", padding: "6px 12px 6px 30px", border: `1px solid ${T.border}`, borderRadius: "8px", fontSize: ".82rem", outline: "none" }}
              />
            </div>
          </div>

          {filteredParticipants.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {filteredParticipants.map(l => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".75rem 1rem", backgroundColor: "#FAFAF8", border: `1px solid ${T.border}`, borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: T.goldLight, color: T.goldDark, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem" }}>
                      {(l.name?.[0] || "L").toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: ".85rem", fontWeight: 600, color: T.text }}>{l.name}</div>
                      <div style={{ fontSize: ".75rem", color: T.muted }}>{l.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: ".72rem", fontWeight: 700, color: T.success, backgroundColor: T.successLight, padding: ".2rem .55rem", borderRadius: "12px" }}>
                    {l.status || "Active"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "3rem 1rem", textAlign: "center", color: T.muted, fontSize: ".88rem" }}>
              No participants enrolled in this programme.
            </div>
          )}
        </div>
      )}

      {activeTab !== "Overview" && activeTab !== "Participants" && (
        <div style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: "16px", padding: "4rem 2rem", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: T.goldLight, color: T.goldDark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ margin: "0 0 .5rem", fontSize: "1.1rem", fontWeight: 700 }}>{activeTab} Workspace</h3>
          <p style={{ margin: 0, fontSize: ".85rem", color: T.muted, maxWidth: "400px", margin: "0 auto" }}>
            No {activeTab.toLowerCase()} data uploaded or configured for this programme yet.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main ProgrammesPage Component ──────────────────────── */
export default function ProgrammesPage({ wsPrograms = [], wsLearners = [], setWsPrograms }) {
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("All");
  const [selected, setSelected]     = useState([]);
  const [openProg, setOpenProg]     = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProgName, setNewProgName] = useState("");
  const [newProgDesc, setNewProgDesc] = useState("");

  const filteredProgrammes = useMemo(() => {
    let list = [...wsPrograms];
    if (filterStatus !== "All") {
      list = list.filter(p => p.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.name || p.title || "").toLowerCase().includes(q));
    }
    return list;
  }, [wsPrograms, filterStatus, search]);

  const handleCreateProgramme = (e) => {
    e.preventDefault();
    if (!newProgName.trim()) return;
    const newProg = {
      id: Date.now(),
      name: newProgName.trim(),
      desc: newProgDesc.trim(),
      status: "Active",
      startDate: new Date().toLocaleDateString('en-GB'),
      endDate: "TBD",
      modules: [],
      sessions: [],
      resources: [],
      updatedAt: "Just now"
    };
    if (setWsPrograms) {
      setWsPrograms(prev => [newProg, ...prev]);
    }
    setNewProgName("");
    setNewProgDesc("");
    setShowCreate(false);
  };

  if (openProg) {
    return <ProgrammeWorkspaceView prog={openProg} wsLearners={wsLearners} onBack={() => setOpenProg(null)} />;
  }

  return (
    <div style={{ padding: "2.5rem 3rem", fontFamily: T.font, minHeight: "100%", backgroundColor: T.bg }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: T.text, fontFamily: T.display }}>Programmes</h1>
          <p style={{ margin: ".4rem 0 0", fontSize: "1rem", color: T.muted }}>Manage all programmes assigned to your workspace.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            padding: ".65rem 1.4rem", backgroundColor: T.gold, color: "#111",
            border: "none", borderRadius: "10px", fontWeight: 700, fontSize: ".88rem",
            cursor: "pointer", display: "flex", alignItems: "center", gap: ".4rem"
          }}
        >
          <Plus size={16} /> Create Programme
        </button>
      </div>

      {/* Zero Programmes Assigned Empty State (Matching Screenshot) */}
      {wsPrograms.length === 0 ? (
        <div style={{
          backgroundColor: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: "20px",
          padding: "6rem 2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "720px",
          margin: "3rem auto"
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            backgroundColor: T.bg, border: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1.5rem"
          }}>
            <BookOpen size={32} color={T.muted} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.text, margin: "0 0 .75rem", fontFamily: T.display }}>
            No programmes assigned
          </h2>
          <p style={{ fontSize: ".95rem", color: T.muted, margin: "0 0 1.5rem", maxWidth: "480px", lineHeight: "1.6" }}>
            A Workspace Administrator has not assigned you to any programmes yet. Once programmes are assigned, learner information will appear here automatically.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: ".75rem 1.5rem", backgroundColor: T.gold, color: "#111",
              border: "none", borderRadius: "10px", fontWeight: 700, fontSize: ".9rem",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: ".5rem"
            }}
          >
            <Plus size={16} /> Create Programme
          </button>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} color={T.muted} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search programmes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: ".75rem 1rem .75rem 2.75rem", border: `1px solid ${T.border}`, borderRadius: "12px", fontSize: ".9rem", outline: "none", backgroundColor: T.card }}
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {filteredProgrammes.map(prog => (
              <ProgrammeCard
                key={prog.id}
                prog={prog}
                wsLearners={wsLearners}
                selected={selected.includes(prog.id)}
                onSelect={id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                onOpen={setOpenProg}
                onEdit={setOpenProg}
                onDuplicate={() => {}}
                onArchive={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal Create Programme */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: T.card, borderRadius: "20px", padding: "2rem", width: "440px", border: `1px solid ${T.border}` }}>
            <h3 style={{ margin: "0 0 1rem", fontSize: "1.2rem", fontWeight: 700 }}>Create Programme</h3>
            <form onSubmit={handleCreateProgramme} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Programme Name *"
                required
                value={newProgName}
                onChange={e => setNewProgName(e.target.value)}
                style={{ width: "100%", padding: ".75rem", border: `1px solid ${T.border}`, borderRadius: "8px", outline: "none" }}
              />
              <textarea
                placeholder="Short Description"
                rows={3}
                value={newProgDesc}
                onChange={e => setNewProgDesc(e.target.value)}
                style={{ width: "100%", padding: ".75rem", border: `1px solid ${T.border}`, borderRadius: "8px", outline: "none", resize: "none" }}
              />
              <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end", marginTop: ".5rem" }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding: ".6rem 1.2rem", background: "none", border: `1px solid ${T.border}`, borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: ".6rem 1.2rem", backgroundColor: T.gold, border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
