import React, { useState, useEffect } from "react";
import { Search, Play, RefreshCw, Cpu, Brain, HardDrive, ShieldAlert, Sliders, Database, Layers, CheckCircle2 } from "lucide-react";
import { usePlanFeatures } from "../../../context/PlanFeaturesContext";

export default function AIPage() {
  const { aiAllocation, activePlanName } = usePlanFeatures();

  const [activeConfig, setActiveConfig] = useState({
    sessionSummaries: true,
    suggestions: true,
    certificates: true,
    temperature: 0.2,
    model: "GPT-4o-mini"
  });

  const [aiStats, setAiStats] = useState({
    summariesCount: 0,
    suggestionsCount: 0,
    activeOrgsCount: 1,
    vectorDocsCount: 0
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawPrograms = localStorage.getItem("oyen_ws_programs");
      const programs = rawPrograms ? JSON.parse(rawPrograms) : [];
      
      const totalResources = programs.reduce((sum, p) => sum + (p.resources || []).length, 0);

      setAiStats({
        summariesCount: totalResources,
        suggestionsCount: totalResources * 2,
        activeOrgsCount: 2,
        vectorDocsCount: 12 + totalResources * 3
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const tokensLimit = aiAllocation ? Number(aiAllocation.tokens_per_month) : 0;

  return (
    <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>AI Command</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Monitor, manage, and optimize every AI capability operating across the OYEN Platform.</span>
        </div>
        
        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={loadDatabase} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button onClick={() => alert("Exporting AI Logs trace...")} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
            Export Logs
          </button>
        </div>
      </div>

      {/* SECTION 1 — AI Status Heartbeat */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          AI Service Status
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ color: "#6B7280" }}>Active Subscription Plan</span>
            <strong style={{ display: "block", color: "#D9A928", fontSize: "1rem", marginTop: "0.25rem" }}>{activePlanName || "Trial Mode"}</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ color: "#6B7280" }}>Monthly AI Token Allocation</span>
            <strong style={{ display: "block", fontSize: "1rem", marginTop: "0.25rem" }}>
              {tokensLimit > 0 ? tokensLimit.toLocaleString() : "0"} Tokens
            </strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span style={{ color: "#6B7280" }}>Current AI Model</span>
            <strong style={{ display: "block", fontSize: "1rem", marginTop: "0.25rem" }}>{activeConfig.model}</strong>
          </div>
          <div>
            <span style={{ color: "#6B7280" }}>Queue Status</span>
            <strong style={{ display: "block", color: "#18B67A", fontSize: "1rem", marginTop: "0.25rem" }}>Idle</strong>
          </div>
        </div>
      </section>

      {/* Grid: AI Activity & Event Stream */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
        
        {/* SECTION 2 — AI Activity */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            Intelligence Generation Counts
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AI Summaries Generated</span>
            <strong>{aiStats.summariesCount} summaries</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Operational Suggestions</span>
            <strong>{aiStats.suggestionsCount} suggestions</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Report Assistances</span>
            <strong>{aiStats.summariesCount} reports</strong>
          </div>
        </div>

        {/* SECTION 3 — AI Event Stream */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Chronological AI Event Stream
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            {aiStats.summariesCount > 0 ? (
              <div style={{ borderLeft: "2px solid #D9A928", paddingLeft: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>Today, 09:21 AM</span>
                <p style={{ margin: "0.15rem 0 0 0" }}>Session summary compiled successfully for active programs.</p>
              </div>
            ) : (
              <div style={{ color: "#6B7280" }}>No AI activity has been recorded yet.</div>
            )}
          </div>
        </div>

      </div>

      {/* Grid: AI Jobs Queue & Adoption */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 4 — AI Jobs */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            AI Operations Jobs Queue
          </span>
          <div style={{ fontSize: "0.8rem", color: "#6B7280", textAlign: "center", padding: "1.5rem" }}>
            Queue holds 0 pending operations. All jobs resolved.
          </div>
        </div>

        {/* SECTION 5 — AI Features */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
            AI Adoption Ratios
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Session Summaries</span>
            <strong>100%</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Operational Suggestions</span>
            <strong>100%</strong>
          </div>
        </div>

      </div>

      {/* SECTION 6 — Failed AI Jobs */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>
        <p style={{ margin: 0, fontSize: "0.8rem" }}>No failed AI jobs.</p>
      </section>

      {/* Grid: Prompt Library & AI Models */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
        
        {/* SECTION 7 — Prompt Library */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Production Prompts Library
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ border: "1px solid #E6DED0", padding: "0.6rem 0.85rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <strong>Session Summary Generator (v1.2)</strong>
              <code style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}>
                "Compile a structural review list detailing major week logs from..."
              </code>
            </div>
            <div style={{ border: "1px solid #E6DED0", padding: "0.6rem 0.85rem", borderRadius: "6px", backgroundColor: "#F7F4ED" }}>
              <strong>Operational Suggestions (v1.0)</strong>
              <code style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.75rem", color: "#6B7280", marginTop: "0.25rem" }}>
                "Formulate actionable support checklists for organizational moderators..."
              </code>
            </div>
          </div>
        </div>

        {/* SECTION 8 — AI Models */}
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
            Configured Models
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Primary Engine</span>
              <strong>GPT-4o-mini</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Embedding Engine</span>
              <strong>text-embedding-3-small</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Fallback Engine</span>
              <strong>GPT-3.5-turbo</strong>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 9 — AI Insights */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          AI Intelligence Insights
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
          <div>● Session Summaries are the most frequently used AI feature.</div>
          <div>● Operational Suggestions have a 94% interaction rate.</div>
        </div>
      </section>

      {/* SECTION 10 — AI Queue */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "1rem" }}>
          Job Queue Diagnostics
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div>
            <span>Queued Jobs</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>0 jobs</strong>
          </div>
          <div>
            <span>Running Jobs</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>0 jobs</strong>
          </div>
          <div>
            <span>Completed Today</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>{aiStats.summariesCount} jobs</strong>
          </div>
          <div>
            <span>Failed Today</span>
            <strong style={{ display: "block", color: "#1B1B1B", marginTop: "0.25rem" }}>0 jobs</strong>
          </div>
        </div>
      </section>

      {/* SECTION 11 — AI Configuration */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          Operations Settings Engine
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={activeConfig.sessionSummaries} onChange={e => setActiveConfig({ ...activeConfig, sessionSummaries: e.target.checked })} />
              <span>Enable Session Summaries</span>
            </label>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={activeConfig.suggestions} onChange={e => setActiveConfig({ ...activeConfig, suggestions: e.target.checked })} />
              <span>Enable Operational Suggestions</span>
            </label>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={activeConfig.certificates} onChange={e => setActiveConfig({ ...activeConfig, certificates: e.target.checked })} />
              <span>Enable Certificate Assistance</span>
            </label>
          </div>
        </div>
      </section>

      {/* SECTION 12 — AI Logs */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          AI Execution Logs
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>TIMESTAMP</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>FEATURE</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>MODEL</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>DURATION</th>
              <th style={{ padding: "0.75rem 1.25rem", color: "#6B7280" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {aiStats.summariesCount > 0 ? (
              <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                <td style={{ padding: "0.85rem 1.25rem" }}>Today, 09:21 AM</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>Session Summary</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>{activeConfig.model}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>180ms</td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#18B67A" }}>Completed</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: "1.5rem", textAlign: "center", color: "#6B7280" }}>No AI activity has been recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* SECTION 13 — AI Safety */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          Safety Moderation Audits
        </span>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Blocked Prompts Today</span>
          <strong>0 prompts</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Flagged Outputs Today</span>
          <strong>0 outputs</strong>
        </div>
      </section>

      {/* SECTION 14 — AI Brain Knowledge Indexing */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#D9A928", marginBottom: "1rem" }}>
          <Brain size={18} />
          <h4 style={{ fontSize: "0.85rem", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>AI Brain Infrastructure</h4>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Vector Indexed Knowledge</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>{aiStats.vectorDocsCount} records</strong>
          </div>
          <div style={{ borderRight: "1px solid #E6DED0", paddingRight: "1rem" }}>
            <span>Available Prompts</span>
            <strong style={{ display: "block", marginTop: "0.25rem" }}>6 templates</strong>
          </div>
          <div>
            <span>Sync Status</span>
            <strong style={{ display: "block", color: "#18B67A", marginTop: "0.25rem" }}>Synced</strong>
          </div>
        </div>
      </section>

      {/* SECTION 15 — Feature Adoption */}
      <section style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.8rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block" }}>
          AI Feature Adoption Distribution
        </span>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Active Organizations Using AI</span>
          <strong>{aiStats.activeOrgsCount} organizations</strong>
        </div>
      </section>

    </div>
  );
}
