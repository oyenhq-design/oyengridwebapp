import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, HelpCircle, AlertTriangle, Layers, Play, Cpu, TrendingUp, Download, RefreshCw } from "lucide-react";

export default function ExperimentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeExpId, setActiveExpId] = useState(null);
  const [expTab, setExpTab] = useState("Design");
  
  const [experiments, setExperiments] = useState([]);
  const [stats, setStats] = useState({
    activeOrgsCount: 2,
    usersCount: 0
  });

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];

      const totalUsers = team.length + learners.length + 52; // Primary + VoltPower

      setStats({
        activeOrgsCount: 2,
        usersCount: totalUsers
      });

      const primaryExp = {
        id: "exp_01",
        name: "Proactive AI Suggestions Onboarding",
        feature: "AI Suggestions Flow",
        status: "Running",
        env: "Production",
        target: "Enterprise Only",
        started: "June 25, 2026",
        ends: "Aug 25, 2026",
        owner: "Product Team",
        desc: "Prompts Program Managers with proactive AI checklist cards immediately after creating new learning structures.",
        hypothesis: "If Program Managers receive proactive AI suggestions after creating a session, they will complete setup faster.",
        flag: "ai_operational_assistant",
        usersAssigned: team.length + 10,
        usersCompleted: 0,
        split: "50% Control / 50% Variant A"
      };

      setExperiments([primaryExp]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handlePromote = (exp) => {
    if (confirm(`Confirm variant promotion for experiment: ${exp.name}? This rolls out Variant A to 100% of the target audience instantly.`)) {
      alert("Variant promoted to 100% production rollout.");
    }
  };

  const activeExp = experiments.find(e => e.id === activeExpId);

  const filteredExps = experiments.filter(e => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = e.name.toLowerCase().includes(query) ||
                          e.feature.toLowerCase().includes(query) ||
                          e.owner.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Running") return matchesSearch && e.status === "Running";
    return matchesSearch;
  });

  if (activeExp) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveExpId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Experiments Registry</span>
        </button>

        {/* Experiment Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeExp.name}</h3>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeExp.feature}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeExp.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Environment: <strong>{activeExp.env}</strong> • Owner: {activeExp.owner} • Started: {activeExp.started}
            </div>
          </div>
        </div>

        {/* Experiment split layout */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Tabs Navigation */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem" }}>
              {["Design", "Variants", "Audience", "Metrics", "Live Results", "Timeline"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setExpTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: expTab === tab ? 700 : 500,
                    color: expTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem",
                    borderBottom: expTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Viewports */}
            <div style={{ minHeight: "300px" }}>
              
              {expTab === "Design" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.82rem" }}>
                    <div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Hypothesis</span>
                      <p style={{ margin: "0.25rem 0 0 0", color: "#1B1B1B", fontStyle: "italic" }}>"{activeExp.hypothesis}"</p>
                    </div>

                    <div style={{ borderTop: "1px solid #E6DED0", paddingTop: "0.75rem" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Primary Success Metric</span>
                      <div style={{ marginTop: "0.25rem" }}>Time to Complete Program Setup (seconds)</div>
                    </div>
                  </div>
                </div>
              )}

              {expTab === "Variants" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Split variants Split</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E6DED0", paddingBottom: "0.4rem" }}>
                      <span>Control (Current Experience)</span>
                      <strong>50% split</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Variant A (Proactive AI Workflow)</span>
                      <strong>50% split</strong>
                    </div>
                  </div>
                </div>
              )}

              {expTab === "Audience" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Target Audience Segments</strong>
                  <div style={{ marginTop: "1rem", color: "#6B7280" }}>
                    <div>- Subscription Plan matches: <strong>{activeExp.target}</strong></div>
                  </div>
                </div>
              )}

              {expTab === "Metrics" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", fontSize: "0.8rem" }}>
                  <strong>Success Metrics Configuration</strong>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.50rem", marginTop: "1rem" }}>
                    <div>● Primary: Program Creation Completed event</div>
                    <div>● Secondary: AI Suggestions Acceptance rate</div>
                  </div>
                </div>
              )}

              {expTab === "Live Results" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "#6B7280" }}>
                  <TrendingUp size={24} style={{ marginBottom: "0.5rem", color: "#6B7280" }} />
                  <p style={{ margin: 0, fontSize: "0.8rem" }}>Results will appear as users interact with the experiment.</p>
                </div>
              )}

              {expTab === "Timeline" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "June 25, 2026", action: `Experiment started in Production`, meta: "Operations" },
                    { time: "June 20, 2026", action: `Hypothesis design approved by Product Team`, meta: "Product" }
                  ].map((act, i) => (
                    <div key={i} style={{ padding: "0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{act.time} - <strong>{act.action}</strong></span>
                      <span style={{ color: "#6B7280" }}>{act.meta}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Sidebar Action Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Decision Action
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handlePromote(activeExp)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Promote Variant A
              </button>

              <div style={{ borderTop: "1px solid #E6DED0", marginTop: "1rem", paddingTop: "1rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase" }}>Linked Flag</span>
                <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", fontFamily: "monospace" }}>
                  {activeExp.flag}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Experiments</h3>
          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Design, monitor, and evaluate controlled experiments across the OYEN Platform.</span>
        </div>
      </div>

      {/* Main Table grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden", backgroundColor: "#FCFBF8" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", display: "block", padding: "1.25rem 1.25rem 0.5rem 1.25rem" }}>
          Active Experimentations
        </span>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>EXPERIMENT</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>FEATURE TARGET</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>SPLIT RATIO</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STARTED</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>OWNER</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredExps.map((exp, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>{exp.name}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B" }}>{exp.feature}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: "rgba(24, 182, 122, 0.12)", color: "#18B67A"
                  }}>
                    {exp.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{exp.split}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{exp.started}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{exp.owner}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right" }}>
                  <button 
                    onClick={() => {
                      setActiveExpId(exp.id);
                      setExpTab("Design");
                    }}
                    style={{ background: "none", border: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    Open →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
