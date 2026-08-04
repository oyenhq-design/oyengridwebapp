import React, { useState, useMemo } from "react";
import {
  Plus, Search, Download, BookOpen, Users, Calendar,
  FileText, Award, ChevronDown, MoreHorizontal, Edit2, Trash2,
  Archive, Copy, UserCheck, X, Check,
  ArrowRight, Zap, BarChart3, CheckSquare, Square
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

const hlth = p => {
  const s = p.sessions || [];
  const l = p.learners || p.enrolledLearners || [];
  if (s.filter(x => x.status === "Overdue").length > 0) return { label: "Overdue Sessions", color: T.danger,   bg: T.dangerLight };
  if (!l.length && !s.length)                           return { label: "Needs Attention",  color: T.warning,  bg: T.warningLight };
  return                                                       { label: "Healthy",           color: T.success,  bg: T.successLight };
};

const calcPct = p => {
  const s = p.sessions || [];
  if (!s.length) return 0;
  return Math.round(s.filter(x => x.status === "Completed").length / s.length * 100);
};

const nextSess = p => (p.sessions || []).find(s => s.status !== "Completed") || null;

/* ── Programme Card ─────────────────────────────────────── */
function Card({ prog, selected, onSelect, onOpen, onEdit, onDuplicate, onArchive, onDelete }) {
  const [menu, setMenu] = useState(false);
  const sc = cfg(prog.status);
  const hb = hlth(prog);
  const pct = calcPct(prog);
  const nx = nextSess(prog);
  const learners    = prog.learners || prog.enrolledLearners || [];
  const fac         = (prog.assignedFacilitators || [])[0];
  const res         = prog.resources   || [];
  const ass         = prog.assessments || [];
  const isDraft     = prog.status === "Draft" || prog.status === "Planning";
  const isDone      = prog.status === "Completed";
  const borderCol   = selected ? T.gold : T.border;
  const shadow      = selected ? "0 0 0 2px " + T.gold : "0 4px 12px rgba(0,0,0,0.04)";
  const shadowHover = selected ? "0 0 0 2px " + T.gold : "0 8px 24px rgba(0,0,0,0.08)";

  return (
    <div
      style={{ backgroundColor: T.card, border: "1px solid " + borderCol, borderRadius: "20px", overflow: "hidden", boxShadow: shadow, transition: "all .2s ease", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = shadowHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = shadow; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ padding: "1.5rem 1.5rem 1rem", flex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem" }}>
            <button onClick={() => onSelect(prog.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", marginTop: "2px", color: selected ? T.gold : T.muted, flexShrink: 0 }}>
              {selected ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>
            <div>
              <h3 style={{ margin: "0 0 .4rem", fontSize: "1.05rem", fontWeight: 700, color: T.text, fontFamily: T.display, lineHeight: 1.3 }}>{prog.name || prog.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: ".72rem", fontWeight: 700, color: sc.color, backgroundColor: sc.bg, padding: ".2rem .55rem", borderRadius: "20px" }}>{sc.label}</span>
                <span style={{ fontSize: ".68rem", fontWeight: 600, color: hb.color, backgroundColor: hb.bg, padding: ".2rem .55rem", borderRadius: "20px" }}>
                  {hb.label === "Healthy" ? "🟢" : hb.label === "Needs Attention" ? "🟡" : "🔴"} {hb.label}
                </span>
              </div>
            </div>
          </div>
          {/* More Menu */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenu(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, padding: ".25rem", borderRadius: "6px" }}>
              <MoreHorizontal size={18} />
            </button>
            {menu && (
              <div
                style={{ position: "absolute", right: 0, top: "100%", marginTop: "4px", backgroundColor: T.card, border: "1px solid " + T.border, borderRadius: "12px", padding: ".4rem", zIndex: 50, minWidth: "150px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                onMouseLeave={() => setMenu(false)}
              >
                {[
                  { ic: <Edit2 size={13} />,   lb: "Edit",      fn: () => { onEdit(prog);        setMenu(false); } },
                  { ic: <Copy size={13} />,    lb: "Duplicate", fn: () => { onDuplicate(prog);   setMenu(false); } },
                  { ic: <Archive size={13} />, lb: "Archive",   fn: () => { onArchive(prog.id);  setMenu(false); } },
                  { ic: <Trash2 size={13} />,  lb: "Delete", danger: true, fn: () => { onDelete(prog.id); setMenu(false); } },
                ].map(it => (
                  <button key={it.lb} onClick={it.fn}
                    style={{ display: "flex", alignItems: "center", gap: ".6rem", width: "100%", padding: ".55rem .75rem", background: "none", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, color: it.danger ? T.danger : T.body, cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = it.danger ? T.dangerLight : "#F5F2ED"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >{it.ic} {it.lb}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", marginBottom: "1.25rem" }}>
          {prog.startDate && prog.endDate && (
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".82rem", color: T.muted }}><Calendar size={13} /> {prog.startDate} - {prog.endDate}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontSize: ".82rem", color: fac ? T.body : T.muted }}>
            <UserCheck size={13} color={fac ? T.goldDark : T.muted} />
            {fac ? (fac.name || fac.email || fac) : React.createElement("em", null, "No facilitator assigned")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: ".82rem", color: T.muted, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}><Users size={13} /> {learners.length ? learners.length + " Learner" + (learners.length !== 1 ? "s" : "") : "No learners yet"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}><FileText size={13} /> {res.length} Resource{res.length !== 1 ? "s" : ""}</span>
            <span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}><Award size={13} /> {ass.length} Assessment{ass.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        {/* Upcoming Session */}
        {nx && (
          <div style={{ backgroundColor: "#FAFAF8", border: "1px solid " + T.border, borderRadius: "10px", padding: ".65rem .9rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: ".7rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: ".2rem" }}>Upcoming Session</div>
            <div style={{ fontSize: ".85rem", fontWeight: 600, color: T.text }}>{nx.title}</div>
            <div style={{ fontSize: ".78rem", color: T.muted, marginTop: ".15rem" }}>{nx.date || "TBD"}{nx.time ? " - " + nx.time : ""}</div>
          </div>
        )}
        {/* Progress */}
        {!isDraft && (prog.sessions || []).length > 0 && (
          <div style={{ marginBottom: ".5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".75rem", fontWeight: 600, color: T.muted, marginBottom: ".4rem" }}>
              <span>Progress</span><span style={{ color: T.text }}>{pct}%</span>
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "#EBE5D9", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", backgroundColor: pct >= 80 ? T.success : pct >= 40 ? T.gold : T.warning, borderRadius: "3px", transition: "width .5s ease" }} />
            </div>
          </div>
        )}
      </div>
      {/* Footer */}
      <div style={{ borderTop: "1px solid " + T.border, padding: ".85rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: ".7rem", color: T.muted, display: "flex", gap: ".75rem" }}>
            {prog.createdBy && React.createElement("span", null, "By " + prog.createdBy)}
            {prog.updatedAt && React.createElement("span", null, "Updated " + prog.updatedAt)}
          </div>
          <div style={{ display: "flex", gap: ".5rem" }}>
            {isDraft
              ? <button onClick={() => onOpen(prog)} style={{ padding: ".4rem .9rem", backgroundColor: T.gold, color: "#111", border: "none", borderRadius: "8px", fontSize: ".8rem", fontWeight: 700, cursor: "pointer" }}>Continue Setup</button>
              : isDone
                ? <button onClick={() => onOpen(prog)} style={{ padding: ".4rem .9rem", backgroundColor: "#F5F2ED", color: T.text, border: "1px solid " + T.border, borderRadius: "8px", fontSize: ".8rem", fontWeight: 600, cursor: "pointer" }}>View Report</button>
                : <>
                    <button onClick={() => onOpen(prog)} style={{ padding: ".4rem .9rem", backgroundColor: T.text, color: "#fff", border: "none", borderRadius: "8px", fontSize: ".8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: ".3rem" }}>Open <ArrowRight size={13} /></button>
                    <button onClick={() => onEdit(prog)} style={{ padding: ".4rem .75rem", backgroundColor: "transparent", color: T.muted, border: "1px solid " + T.border, borderRadius: "8px", fontSize: ".8rem", fontWeight: 600, cursor: "pointer" }}>Edit</button>
                  </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Drawer ──────────────────────────────────────── */
function Drawer({ prog, onClose }) {
  const [tab, setTab] = useState("Overview");
  if (!prog) return null;
  const TABS = ["Overview", "Facilitators", "Learners", "Resources", "Sessions", "Assessments", "Reports", "Settings"];
  const sc = cfg(prog.status);
  const pct = calcPct(prog);
  const learners    = prog.learners  || prog.enrolledLearners  || [];
  const facs        = prog.assignedFacilitators || [];
  const sessions    = prog.sessions   || [];
  const res         = prog.resources  || [];
  const ass         = prog.assessments || [];
  const row = (icon, label, value) => (
    <div style={{ backgroundColor: "#FAFAF8", borderRadius: "12px", padding: "1rem", border: "1px solid " + T.border, textAlign: "center" }}>
      <div style={{ color: T.goldDark, marginBottom: ".35rem" }}>{icon}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: T.text }}>{value}</div>
      <div style={{ fontSize: ".72rem", color: T.muted, fontWeight: 600 }}>{label}</div>
    </div>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 200, backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: 0, right: 0, width: "520px", height: "100vh", backgroundColor: T.card, borderLeft: "1px solid " + T.border, boxShadow: "-8px 0 40px rgba(0,0,0,0.12)", zIndex: 201, display: "flex", flexDirection: "column", fontFamily: T.font }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid " + T.border, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: ".7rem", fontWeight: 700, color: sc.color, backgroundColor: sc.bg, padding: ".18rem .5rem", borderRadius: "20px", display: "inline-block", marginBottom: ".4rem" }}>{sc.label}</span>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: T.text, fontFamily: T.display }}>{prog.name || prog.title}</h2>
            <p style={{ margin: ".3rem 0 0", fontSize: ".85rem", color: T.muted }}>{prog.desc || "No description."}</p>
          </div>
          <button onClick={onClose} style={{ background: "#F5F2ED", border: "1px solid " + T.border, borderRadius: "8px", cursor: "pointer", color: T.muted, padding: ".4rem", display: "flex", alignItems: "center" }}><X size={16} /></button>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid " + T.border, padding: "0 1.5rem", overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: ".85rem 1rem", background: "none", border: "none", borderBottom: tab === t ? "2px solid " + T.gold : "2px solid transparent", fontWeight: tab === t ? 700 : 500, fontSize: ".82rem", color: tab === t ? T.text : T.muted, cursor: "pointer", whiteSpace: "nowrap", marginBottom: "-1px" }}>{t}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {tab === "Overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                {row(<Users size={16} />, "Learners", learners.length)}
                {row(<Calendar size={16} />, "Sessions", sessions.length)}
                {row(<FileText size={16} />, "Resources", res.length)}
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".85rem", fontWeight: 600, color: T.body, marginBottom: ".5rem" }}><span>Overall Progress</span><span>{pct}%</span></div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "#EBE5D9", borderRadius: "4px", overflow: "hidden" }}><div style={{ width: pct + "%", height: "100%", backgroundColor: T.gold, borderRadius: "4px" }} /></div>
              </div>
              {prog.desc && <div><h4 style={{ fontSize: ".85rem", fontWeight: 700, color: T.text, margin: "0 0 .5rem" }}>Description</h4><p style={{ fontSize: ".88rem", color: T.body, lineHeight: 1.6, margin: 0 }}>{prog.desc}</p></div>}
            </div>
          )}
          {tab === "Facilitators" && (
            <div>
              <h4 style={{ margin: "0 0 1rem", fontSize: ".9rem", fontWeight: 700, color: T.text }}>Assigned Facilitators</h4>
              {facs.length > 0 ? facs.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".85rem", backgroundColor: "#FAFAF8", borderRadius: "12px", border: "1px solid " + T.border, marginBottom: ".75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#374151,#111827)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".85rem", flexShrink: 0 }}>{(f.name || f.email || f).substring(0, 2).toUpperCase()}</div>
                  <div><div style={{ fontWeight: 600, fontSize: ".9rem", color: T.text }}>{f.name || f.email || f}</div><div style={{ fontSize: ".75rem", color: T.muted }}>Facilitator</div></div>
                </div>
              )) : <div style={{ textAlign: "center", padding: "2rem", color: T.muted }}><UserCheck size={32} style={{ marginBottom: ".75rem", opacity: .3 }} /><div style={{ fontSize: ".9rem", fontWeight: 600, color: T.text }}>No facilitators assigned</div></div>}
            </div>
          )}
          {tab === "Learners" && (
            <div>
              <h4 style={{ margin: "0 0 1rem", fontSize: ".9rem", fontWeight: 700, color: T.text }}>Enrolled Learners ({learners.length})</h4>
              {learners.length > 0 ? learners.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".85rem", backgroundColor: "#FAFAF8", borderRadius: "12px", border: "1px solid " + T.border, marginBottom: ".75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg," + T.gold + "," + T.goldDark + ")", color: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".85rem", flexShrink: 0 }}>{(l.name || l.email || l).substring(0, 2).toUpperCase()}</div>
                  <div><div style={{ fontWeight: 600, fontSize: ".9rem", color: T.text }}>{l.name || l.email || l}</div><div style={{ fontSize: ".75rem", color: T.muted }}>Learner</div></div>
                </div>
              )) : <div style={{ textAlign: "center", padding: "2rem", color: T.muted }}><Users size={32} style={{ marginBottom: ".75rem", opacity: .3 }} /><div style={{ fontSize: ".9rem", fontWeight: 600, color: T.text }}>No learners enrolled yet</div></div>}
            </div>
          )}
          {tab === "Sessions" && (
            <div>
              <h4 style={{ margin: "0 0 1rem", fontSize: ".9rem", fontWeight: 700, color: T.text }}>Sessions ({sessions.length})</h4>
              {sessions.length > 0 ? sessions.map((s, i) => {
                const sc2 = cfg(s.status || "Draft");
                return (
                  <div key={i} style={{ padding: "1rem", backgroundColor: "#FAFAF8", borderRadius: "12px", border: "1px solid " + T.border, marginBottom: ".75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: ".9rem", color: T.text }}>{s.title || "Session " + (i + 1)}</div>
                        <div style={{ fontSize: ".78rem", color: T.muted, marginTop: ".2rem" }}>{s.date || ""}{s.time ? " - " + s.time : ""}</div>
                      </div>
                      <span style={{ fontSize: ".7rem", fontWeight: 700, color: sc2.color, backgroundColor: sc2.bg, padding: ".18rem .5rem", borderRadius: "20px" }}>{s.status || "Scheduled"}</span>
                    </div>
                  </div>
                );
              }) : <div style={{ textAlign: "center", padding: "2rem", color: T.muted }}><Calendar size={32} style={{ marginBottom: ".75rem", opacity: .3 }} /><div style={{ fontSize: ".9rem", fontWeight: 600, color: T.text }}>No sessions yet</div></div>}
            </div>
          )}
          {tab === "Resources" && (
            <div>
              <h4 style={{ margin: "0 0 1rem", fontSize: ".9rem", fontWeight: 700, color: T.text }}>Resources ({res.length})</h4>
              {res.length > 0 ? res.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".85rem", backgroundColor: "#FAFAF8", borderRadius: "12px", border: "1px solid " + T.border, marginBottom: ".75rem" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: T.goldLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><FileText size={16} color={T.goldDark} /></div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: ".9rem", color: T.text }}>{r.name || r.title || "Resource " + (i + 1)}</div>{r.type && <div style={{ fontSize: ".75rem", color: T.muted }}>{r.type}</div>}</div>
                </div>
              )) : <div style={{ textAlign: "center", padding: "2rem", color: T.muted }}><FileText size={32} style={{ marginBottom: ".75rem", opacity: .3 }} /><div style={{ fontSize: ".9rem", fontWeight: 600, color: T.text }}>No resources yet</div></div>}
            </div>
          )}
          {tab === "Assessments" && (
            <div>
              <h4 style={{ margin: "0 0 1rem", fontSize: ".9rem", fontWeight: 700, color: T.text }}>Assessments ({ass.length})</h4>
              {ass.length > 0 ? ass.map((a, i) => (
                <div key={i} style={{ padding: "1rem", backgroundColor: "#FAFAF8", borderRadius: "12px", border: "1px solid " + T.border, marginBottom: ".75rem" }}>
                  <div style={{ fontWeight: 700, fontSize: ".9rem", color: T.text }}>{a.title || a.name || "Assessment " + (i + 1)}</div>
                  {a.due && <div style={{ fontSize: ".78rem", color: T.muted, marginTop: ".2rem" }}>Due: {a.due}</div>}
                </div>
              )) : <div style={{ textAlign: "center", padding: "2rem", color: T.muted }}><Award size={32} style={{ marginBottom: ".75rem", opacity: .3 }} /><div style={{ fontSize: ".9rem", fontWeight: 600, color: T.text }}>No assessments yet</div></div>}
            </div>
          )}
          {tab === "Reports" && (
            <div style={{ textAlign: "center", padding: "3rem 2rem", color: T.muted }}>
              <BarChart3 size={40} style={{ marginBottom: "1rem", opacity: .3 }} />
              <div style={{ fontSize: ".95rem", fontWeight: 600, color: T.text }}>Reports coming soon</div>
              <div style={{ fontSize: ".82rem", marginTop: ".5rem" }}>Programme analytics will appear here.</div>
            </div>
          )}
          {tab === "Settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ margin: "0 0 .5rem", fontSize: ".9rem", fontWeight: 700, color: T.text }}>Programme Settings</h4>
              {[
                { l: "Archive Programme", d: "Move this programme to the archive.", a: "Archive" },
                { l: "Duplicate Programme", d: "Create a copy as a template.", a: "Duplicate" },
                { l: "Delete Programme", d: "Permanently remove this programme.", a: "Delete", danger: true },
              ].map(it => (
                <div key={it.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: it.danger ? T.dangerLight : "#FAFAF8", borderRadius: "12px", border: "1px solid " + (it.danger ? T.danger + "44" : T.border) }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: ".88rem", color: it.danger ? T.danger : T.text }}>{it.l}</div>
                    <div style={{ fontSize: ".78rem", color: T.muted, marginTop: ".2rem" }}>{it.d}</div>
                  </div>
                  <button style={{ padding: ".4rem .85rem", backgroundColor: it.danger ? T.danger : "#F5F2ED", color: it.danger ? "#fff" : T.text, border: "none", borderRadius: "8px", fontSize: ".78rem", fontWeight: 700, cursor: "pointer" }}>{it.a}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Create Modal ───────────────────────────────────────── */
function CreateModal({ onClose, onCreate }) {
  const [name, setName]   = useState("");
  const [desc, setDesc]   = useState("");
  const [cat, setCat]     = useState("");
  const [status, setStatus] = useState("Draft");
  const inp = { width: "100%", padding: ".75rem 1rem", border: "1px solid " + T.border, borderRadius: "10px", fontSize: ".9rem", fontFamily: T.font, outline: "none", boxSizing: "border-box", color: T.text, backgroundColor: "#FAFAF8" };
  const sub = e => { e.preventDefault(); if (!name.trim()) return; onCreate({ name: name.trim(), desc: desc.trim(), category: cat, status }); onClose(); };
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 300, backdropFilter: "blur(3px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "480px", backgroundColor: T.card, borderRadius: "24px", padding: "2rem", zIndex: 301, fontFamily: T.font, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: T.text, fontFamily: T.display }}>Create Programme</h2>
            <p style={{ margin: ".25rem 0 0", fontSize: ".85rem", color: T.muted }}>Add a new programme to your workspace.</p>
          </div>
          <button onClick={onClose} style={{ background: "#F5F2ED", border: "1px solid " + T.border, borderRadius: "8px", cursor: "pointer", color: T.muted, padding: ".4rem", display: "flex", alignItems: "center" }}><X size={16} /></button>
        </div>
        <form onSubmit={sub} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: ".5rem" }}>Programme Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Battery Storage Systems" required style={inp} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: ".5rem" }}>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What is this programme about?" style={{ ...inp, resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: ".5rem" }}>Category</label>
              <input value={cat} onChange={e => setCat(e.target.value)} placeholder="e.g. Energy" style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".78rem", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: ".5rem" }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inp, cursor: "pointer" }}><option>Draft</option><option>Active</option></select>
            </div>
          </div>
          <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end", marginTop: ".5rem" }}>
            <button type="button" onClick={onClose} style={{ padding: ".75rem 1.5rem", backgroundColor: "transparent", color: T.muted, border: "1px solid " + T.border, borderRadius: "10px", fontWeight: 600, fontSize: ".9rem", cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ padding: ".75rem 1.75rem", backgroundColor: T.gold, color: "#111", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: ".9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".4rem" }}><Plus size={16} /> Create Programme</button>
          </div>
        </form>
      </div>
    </>
  );
}

/* ── Main ProgrammesPage ────────────────────────────────── */
export default function ProgrammesPage({ wsPrograms = [], wsLearners = [], wsTeam = [], setWsPrograms }) {
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("All");
  const [sortMode, setSort]         = useState("Newest");
  const [showSort, setShowSort]     = useState(false);
  const [selected, setSelected]     = useState([]);
  const [openProg, setOpenProg]     = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast]           = useState(null);
  const showT = msg => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const stats = useMemo(() => ({
    active:    wsPrograms.filter(p => p.status === "Active" || p.status === "Published").length,
    drafts:    wsPrograms.filter(p => p.status === "Draft"  || p.status === "Planning").length,
    completed: wsPrograms.filter(p => p.status === "Completed").length,
    archived:  wsPrograms.filter(p => p.status === "Archived").length,
  }), [wsPrograms]);

  const aiInsight = useMemo(() => {
    const noL = wsPrograms.find(p => !(p.learners || p.enrolledLearners || []).length && (p.status === "Active" || p.status === "Published"));
    if (noL) return { title: noL.name || noL.title, msg: "has no learners enrolled. Consider adding learners before the next session." };
    const od = wsPrograms.find(p => (p.sessions || []).some(s => s.status === "Overdue"));
    if (od) return { title: od.name || od.title, msg: "has overdue sessions. Review attendance before the next session." };
    return null;
  }, [wsPrograms]);

  const filtered = useMemo(() => {
    let list = [...wsPrograms];
    if (filterStatus !== "All") {
      list = list.filter(p => {
        if (filterStatus === "Active") return p.status === "Active" || p.status === "Published";
        if (filterStatus === "Draft")  return p.status === "Draft"  || p.status === "Planning";
        return p.status === filterStatus;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.name || p.title || "").toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q));
    }
    if (sortMode === "Newest")      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    if (sortMode === "Oldest")      list.sort((a, b) => (a.id || 0) - (b.id || 0));
    if (sortMode === "Alphabetical") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
  }, [wsPrograms, filterStatus, search, sortMode]);

  const toggleSel = id => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const clearSel  = () => setSelected([]);

  const create = data => {
    if (!setWsPrograms) { showT("Write access not available."); return; }
    setWsPrograms(prev => [{ id: Date.now(), ...data, sessions: [], resources: [], assessments: [], assignedFacilitators: [], activity: [], updatedAt: "Just now", createdBy: "Program Manager" }, ...prev]);
    showT("Programme \"" + data.name + "\" created");
  };
  const duplicate = prog => {
    if (!setWsPrograms) { showT("Write access not available."); return; }
    setWsPrograms(prev => [{ ...prog, id: Date.now(), name: (prog.name || prog.title) + " (Copy)", status: "Draft", updatedAt: "Just now" }, ...prev]);
    showT("Programme duplicated");
  };
  const archive = id => {
    if (!setWsPrograms) { showT("Write access not available."); return; }
    setWsPrograms(prev => prev.map(p => p.id === id ? { ...p, status: "Archived", updatedAt: "Just now" } : p));
    showT("Programme archived");
  };
  const del = id => {
    if (!setWsPrograms) { showT("Write access not available."); return; }
    setWsPrograms(prev => prev.filter(p => p.id !== id));
    showT("Programme deleted");
  };

  const FILTERS = ["All", "Active", "Draft", "Completed", "Archived"];
  const SORTS   = ["Newest", "Oldest", "Alphabetical", "Recently Updated"];

  return (
    <div style={{ padding: "2.5rem 3rem", fontFamily: T.font, minHeight: "100%", backgroundColor: T.bg, position: "relative" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "6rem", left: "50%", transform: "translateX(-50%)", backgroundColor: "#111", color: "#fff", padding: ".75rem 1.5rem", borderRadius: "12px", fontSize: ".88rem", fontWeight: 600, zIndex: 400, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <Check size={14} color={T.gold} /> {toast}
        </div>
      )}

      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: T.text, fontFamily: T.display }}>Programmes</h1>
          <p style={{ margin: ".4rem 0 0", fontSize: "1rem", color: T.muted }}>Manage all programmes assigned to your workspace. Create, organize and monitor delivery.</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap" }}>
          <button style={{ padding: ".65rem 1.1rem", backgroundColor: "transparent", color: T.body, border: "1px solid " + T.border, borderRadius: "10px", fontWeight: 600, fontSize: ".88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".4rem" }}><Download size={15} /> Export</button>
          <button onClick={() => setShowCreate(true)} style={{ padding: ".65rem 1.4rem", backgroundColor: T.gold, color: "#111", border: "none", borderRadius: "10px", fontWeight: 700, fontSize: ".88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".4rem", boxShadow: "0 4px 12px rgba(244,197,66,0.4)" }}><Plus size={16} /> Create Programme</button>
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", padding: "1.25rem 1.75rem", backgroundColor: T.card, borderRadius: "16px", border: "1px solid " + T.border, flexWrap: "wrap" }}>
        {[
          { label: "Active Programmes", value: stats.active,    color: T.success },
          { label: "Drafts",            value: stats.drafts,    color: T.warning },
          { label: "Completed",         value: stats.completed, color: T.info },
          { label: "Archived",          value: stats.archived,  color: T.muted },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div style={{ width: "1px", backgroundColor: T.border, flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: "100px" }}>
              <div style={{ fontSize: ".75rem", color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: ".3rem" }}>{s.label}</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.color, fontFamily: T.display }}>{s.value}</div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* AI Insight */}
      {aiInsight && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", padding: "1rem 1.5rem", backgroundColor: "#FFFBEA", border: "1px solid " + T.gold, borderRadius: "16px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg," + T.gold + "," + T.goldDark + ")", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Zap size={16} color="#111" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: T.goldDark, textTransform: "uppercase", letterSpacing: ".5px" }}>OYEN AI</div>
            <div style={{ fontSize: ".88rem", color: T.body, marginTop: ".15rem" }}><strong>{aiInsight.title}</strong> {aiInsight.msg}</div>
          </div>
          <button style={{ padding: ".4rem .85rem", backgroundColor: T.gold, color: "#111", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", whiteSpace: "nowrap" }}>Review</button>
        </div>
      )}

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
          <Search size={16} color={T.muted} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search programmes..." style={{ width: "100%", padding: ".75rem 1rem .75rem 2.75rem", border: "1px solid " + T.border, borderRadius: "12px", fontSize: ".9rem", outline: "none", backgroundColor: T.card, color: T.text, fontFamily: T.font, boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: ".35rem", backgroundColor: T.card, border: "1px solid " + T.border, borderRadius: "12px", padding: ".3rem" }}>
          {FILTERS.map(opt => (
            <button key={opt} onClick={() => setFilter(opt)} style={{ padding: ".4rem .85rem", borderRadius: "8px", border: "none", backgroundColor: filterStatus === opt ? T.text : "transparent", color: filterStatus === opt ? "#fff" : T.muted, fontWeight: filterStatus === opt ? 700 : 500, fontSize: ".82rem", cursor: "pointer", transition: "all .15s" }}>{opt}</button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowSort(v => !v)} style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".65rem 1rem", backgroundColor: T.card, border: "1px solid " + T.border, borderRadius: "12px", fontSize: ".85rem", fontWeight: 600, color: T.body, cursor: "pointer" }}>{sortMode} <ChevronDown size={14} /></button>
          {showSort && (
            <div style={{ position: "absolute", right: 0, top: "100%", marginTop: "4px", backgroundColor: T.card, border: "1px solid " + T.border, borderRadius: "12px", padding: ".4rem", zIndex: 50, minWidth: "160px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }} onMouseLeave={() => setShowSort(false)}>
              {SORTS.map(opt => (
                <button key={opt} onClick={() => { setSort(opt); setShowSort(false); }} style={{ display: "block", width: "100%", padding: ".55rem .75rem", background: sortMode === opt ? T.goldLight : "none", border: "none", borderRadius: "8px", fontSize: ".85rem", fontWeight: sortMode === opt ? 700 : 500, color: sortMode === opt ? T.goldDark : T.body, cursor: "pointer", textAlign: "left" }}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem", padding: ".85rem 1.25rem", backgroundColor: "#111", borderRadius: "14px", color: "#fff" }}>
          <span style={{ fontSize: ".85rem", fontWeight: 600, color: T.gold }}>{selected.length} selected</span>
          <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.15)", height: "20px" }} />
          <button onClick={() => { selected.forEach(id => { const p = wsPrograms.find(pr => pr.id === id); if (p) duplicate(p); }); clearSel(); }} style={{ padding: ".4rem .85rem", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, cursor: "pointer" }}>Duplicate</button>
          <button onClick={() => { selected.forEach(id => archive(id)); clearSel(); }} style={{ padding: ".4rem .85rem", backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, cursor: "pointer" }}>Archive</button>
          <button onClick={() => { selected.forEach(id => del(id)); clearSel(); }} style={{ padding: ".4rem .85rem", backgroundColor: T.danger, color: "#fff", border: "none", borderRadius: "8px", fontSize: ".82rem", fontWeight: 600, cursor: "pointer" }}>Delete</button>
          <button onClick={clearSel} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center" }}><X size={16} /></button>
        </div>
      )}

      {/* Grid or Empty */}
      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: "1.5rem" }}>
          {filtered.map(prog => (
            <Card key={prog.id} prog={prog} selected={selected.includes(prog.id)} onSelect={toggleSel} onOpen={setOpenProg} onEdit={setOpenProg} onDuplicate={duplicate} onArchive={archive} onDelete={del} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 2rem", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "24px", backgroundColor: T.goldLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}><BookOpen size={40} color={T.goldDark} strokeWidth={1.5} /></div>
          {search || filterStatus !== "All" ? (
            <>
              <h2 style={{ margin: "0 0 .75rem", fontSize: "1.4rem", fontWeight: 700, color: T.text, fontFamily: T.display }}>No programmes match your search.</h2>
              <p style={{ margin: "0 0 1.5rem", color: T.muted, fontSize: "1rem", maxWidth: "380px" }}>Try a different keyword or clear your filters.</p>
              <button onClick={() => { setSearch(""); setFilter("All"); }} style={{ padding: ".75rem 1.5rem", backgroundColor: T.card, color: T.text, border: "1px solid " + T.border, borderRadius: "12px", fontWeight: 600, fontSize: ".9rem", cursor: "pointer" }}>Clear Filters</button>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 .75rem", fontSize: "1.4rem", fontWeight: 700, color: T.text, fontFamily: T.display }}>No programmes yet.</h2>
              <p style={{ margin: "0 0 1.5rem", color: T.muted, fontSize: "1rem", maxWidth: "420px", lineHeight: 1.6 }}>Create your first programme to begin managing learners, sessions and resources.</p>
              <button onClick={() => setShowCreate(true)} style={{ padding: ".85rem 1.75rem", backgroundColor: T.gold, color: "#111", border: "none", borderRadius: "12px", fontWeight: 700, fontSize: ".95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: ".5rem", boxShadow: "0 4px 12px rgba(244,197,66,0.4)" }}><Plus size={18} /> Create Programme</button>
            </>
          )}
        </div>
      )}

      {openProg && <Drawer prog={openProg} onClose={() => setOpenProg(null)} />}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={create} />}
    </div>
  );
}
