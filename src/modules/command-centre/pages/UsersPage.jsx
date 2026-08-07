import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, MoreHorizontal, Settings, ShieldAlert, Key, UserCheck, HardDrive, HelpCircle, Activity, Globe, ClipboardList, ShieldCheck } from "lucide-react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("Recently Active");
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [profileTab, setProfileTab] = useState("Overview");
  
  const [users, setUsers] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const loadDatabase = () => {
    try {
      const orgName = localStorage.getItem("oyen_org_name") || "ABC Energy Workspace";
      const orgSlug = orgName.toLowerCase().replace(/[^a-z0-9]/g, "-");
      
      const rawTeam = localStorage.getItem("oyen_ws_team");
      const team = rawTeam ? JSON.parse(rawTeam) : [];
      
      const rawLearners = localStorage.getItem("oyen_ws_learners");
      const learners = rawLearners ? JSON.parse(rawLearners) : [];
      
      const ownerEmail = localStorage.getItem("oyen_owner_email") || "owner@oyengrid.com";
      const ownerFirstName = localStorage.getItem("oyen_owner_first_name") || "Shola";
      const ownerLastName = localStorage.getItem("oyen_owner_last_name") || "Oyewole";

      const parsedUsers = [];

      // Add Platform Super Admin (The Owner)
      const primarySuspended = localStorage.getItem(`oyen_suspended_${orgSlug}`) === "true";
      const primaryUserSuspended = localStorage.getItem(`oyen_user_suspended_${ownerEmail}`) === "true";
      parsedUsers.push({
        id: "usr_a93B28",
        name: `${ownerFirstName} ${ownerLastName}`,
        email: ownerEmail,
        role: "Platform Super Admin",
        organizations: orgName,
        workspaces: orgSlug,
        status: primaryUserSuspended ? "Suspended" : "Active",
        lastActive: "Today, 10:14 AM",
        created: "June 12, 2026",
        phone: "+234 809 123 4567",
        country: "Nigeria",
        timezone: "GMT+1",
        language: "English",
        emailVerified: "Yes",
        mfa: "Disabled"
      });

      // Add team members
      team.forEach((member, i) => {
        const email = member.email;
        const memberSuspended = localStorage.getItem(`oyen_user_suspended_${email}`) === "true";
        parsedUsers.push({
          id: `usr_t_${i}`,
          name: member.name || email.split("@")[0].toUpperCase(),
          email: email,
          role: member.role || "Member",
          organizations: orgName,
          workspaces: orgSlug,
          status: memberSuspended ? "Suspended" : "Active",
          lastActive: "Today, 09:20 AM",
          created: "June 15, 2026",
          phone: "+234 809 987 6543",
          country: "Nigeria",
          timezone: "GMT+1",
          language: "English",
          emailVerified: "Yes",
          mfa: "Disabled"
        });
      });

      // Add learners
      learners.forEach((learner, i) => {
        const email = learner.email;
        const learnerSuspended = localStorage.getItem(`oyen_user_suspended_${email}`) === "true";
        parsedUsers.push({
          id: `usr_l_${i}`,
          name: learner.name || email.split("@")[0].toUpperCase(),
          email: email,
          role: "Participant",
          organizations: orgName,
          workspaces: orgSlug,
          status: learnerSuspended ? "Suspended" : "Active",
          lastActive: "2 days ago",
          created: "June 18, 2026",
          phone: "-",
          country: "Nigeria",
          timezone: "GMT+1",
          language: "English",
          emailVerified: "Yes",
          mfa: "Disabled"
        });
      });

      // Static VoltPower user if needed
      const voltOwnerEmail = "sarah@voltpower.co";
      const voltOwnerSuspended = localStorage.getItem(`oyen_user_suspended_${voltOwnerEmail}`) === "true";
      parsedUsers.push({
        id: "usr_v_0",
        name: "Sarah Jenkins",
        email: voltOwnerEmail,
        role: "Organization Administrator",
        organizations: "VoltPower Ltd",
        workspaces: "voltpower-ltd",
        status: voltOwnerSuspended ? "Suspended" : "Active",
        lastActive: "Yesterday, 4:30 PM",
        created: "March 12, 2026",
        phone: "-",
        country: "United Kingdom",
        timezone: "GMT",
        language: "English",
        emailVerified: "Yes",
        mfa: "Disabled"
      });

      setUsers(parsedUsers);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDatabase();
    window.addEventListener("storage", loadDatabase);
    return () => window.removeEventListener("storage", loadDatabase);
  }, []);

  const handleToggleSuspend = (user) => {
    const nextStatus = user.status === "Active" ? "true" : "false";
    localStorage.setItem(`oyen_user_suspended_${user.email}`, nextStatus);
    loadDatabase();
    window.dispatchEvent(new Event("storage"));
    setActiveMenuId(null);
  };

  const handleImpersonate = (user) => {
    alert(`Audit Logged: Impersonating ${user.name} (${user.email})`);
    localStorage.setItem("oyen_impersonating", "true");
    localStorage.setItem("oyen_impersonated_org", user.organizations);
    window.location.href = "/";
  };

  const activeUser = users.find(u => u.id === activeProfileId);

  const sortedUsers = [...users].sort((a, b) => {
    if (sortOption === "Name (A–Z)") return a.name.localeCompare(b.name);
    if (sortOption === "Name (Z–A)") return b.name.localeCompare(a.name);
    return 0;
  });

  const filteredUsers = sortedUsers.filter(u => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(query) ||
                          u.email.toLowerCase().includes(query) ||
                          u.role.toLowerCase().includes(query);
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "Active") return matchesSearch && u.status === "Active";
    if (activeFilter === "Suspended") return matchesSearch && u.status === "Suspended";
    return matchesSearch;
  });

  if (activeUser) {
    return (
      <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
        
        {/* Back Link */}
        <button 
          onClick={() => setActiveProfileId(null)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "none", color: "#6B7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700, padding: 0 }}
        >
          <ChevronLeft size={14} />
          <span>Back to Users Directory</span>
        </button>

        {/* Profile Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E6DED0", paddingBottom: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#E6DED0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 800 }}>
                {activeUser.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>{activeUser.name}</h3>
                <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>{activeUser.email}</span>
              </div>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: "#FFF7E4", border: "1px solid #E6DED0", color: "#D9A928", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                {activeUser.role}
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, backgroundColor: activeUser.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)", color: activeUser.status === "Active" ? "#18B67A" : "#E15D5D", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
                Account {activeUser.status}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "0.4rem" }}>
              Created: {activeUser.created} • Last Login: {activeUser.lastActive} • ID: <span style={{ fontFamily: "monospace" }}>{activeUser.id}</span>
            </div>
          </div>
        </div>

        {/* CRM Tabs Grid Layout */}
        <div style={{ display: "flex", gap: "3rem" }}>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "1.25rem", borderBottom: "1px solid #E6DED0", fontSize: "0.82rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
              {["Overview", "Organizations", "Authentication", "Permissions", "Sessions", "Activity", "Support", "Audit Logs"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setProfileTab(tab)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", fontWeight: profileTab === tab ? 700 : 500,
                    color: profileTab === tab ? "#1B1B1B" : "#6B7280", paddingBottom: "0.5rem", whiteSpace: "nowrap",
                    borderBottom: profileTab === tab ? "2px solid #D9A928" : "none"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Viewport */}
            <div style={{ minHeight: "300px" }}>
              
              {profileTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem", fontSize: "0.8rem" }}>
                    <div>Full Name: <strong>{activeUser.name}</strong></div>
                    <div>Email: <strong>{activeUser.email}</strong></div>
                    <div>Phone: <strong>{activeUser.phone}</strong></div>
                    <div>Country: <strong>{activeUser.country}</strong></div>
                    <div>Timezone: <strong>{activeUser.timezone}</strong></div>
                    <div>Language: <strong>{activeUser.language}</strong></div>
                  </div>

                  <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", fontSize: "0.8rem" }}>
                    <div>Email Verified: <strong>{activeUser.emailVerified}</strong></div>
                    <div>MFA Enabled: <strong>{activeUser.mfa}</strong></div>
                    <div>Status: <strong>{activeUser.status}</strong></div>
                  </div>
                </div>
              )}

              {profileTab === "Organizations" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>ORGANIZATION</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>WORKSPACE</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>ROLE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>{activeUser.organizations}</td>
                        <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace" }}>{activeUser.workspaces}</td>
                        <td style={{ padding: "0.75rem 1rem" }}>{activeUser.role}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Authentication" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem" }}>
                  <div>Provider: <strong>Password (Email Verification)</strong></div>
                  <div>Password Last Changed: <strong>June 12, 2026</strong></div>
                  <div>MFA Status: <strong>{activeUser.mfa}</strong></div>
                  <div>Account Status: <strong>{activeUser.status}</strong></div>
                </div>
              )}

              {profileTab === "Sessions" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>DEVICE</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>IP ADDRESS</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>LOCATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                        <td style={{ padding: "0.75rem 1rem" }}>MacBook Pro (Chrome)</td>
                        <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace" }}>192.168.1.101</td>
                        <td style={{ padding: "0.75rem 1rem" }}>Nigeria</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {profileTab === "Permissions" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8rem" }}>
                  <div>✓ Can Manage Workspace Settings</div>
                  <div>✓ Can View System Analytics</div>
                  <div>✓ Can Manage Billing Tiers</div>
                  <div>✓ Can Impersonate Tenant Owners</div>
                </div>
              )}

              {profileTab === "Activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { time: "09:21", action: `Logged into Command Centre cockpit`, meta: "IAM Audit" },
                    { time: "08:30", action: "API key mounted successfully", meta: "IAM Audit" }
                  ].map((act, i) => (
                    <div key={i} style={{ padding: "0.75rem", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#FCFBF8", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{act.time} - <strong>{act.action}</strong></span>
                      <span style={{ color: "#6B7280" }}>{act.meta}</span>
                    </div>
                  ))}
                </div>
              )}

              {profileTab === "Support" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", fontSize: "0.8rem" }}>
                  <div>
                    <strong>Support Notes</strong>
                    <textarea placeholder="Enter operational notes here..." style={{ width: "100%", height: "80px", border: "1px solid #E6DED0", borderRadius: "6px", backgroundColor: "#F7F4ED", padding: "0.55rem", boxSizing: "border-box", outline: "none", resize: "none", fontSize: "0.8rem", color: "#1B1B1B", marginTop: "0.25rem" }} />
                  </div>
                  <button onClick={() => alert("Support notes committed")} style={{ padding: "0.45rem 0.85rem", backgroundColor: "#D9A928", border: "none", borderRadius: "6px", color: "#FFFFFF", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", width: "max-content" }}>Commit Note</button>
                </div>
              )}

              {profileTab === "Audit Logs" && (
                <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F7F4ED", borderBottom: "1px solid #E6DED0" }}>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>PERFORMED BY</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>ACTION</th>
                        <th style={{ padding: "0.75rem 1rem", color: "#6B7280" }}>TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #E6DED0" }}>
                        <td style={{ padding: "0.75rem 1rem" }}>System Operator</td>
                        <td style={{ padding: "0.75rem 1rem" }}>Administrative Access Verified</td>
                        <td style={{ padding: "0.75rem 1rem" }}>Today, 08:30 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Admin Actions Sidebar Panel */}
          <div style={{ width: "260px", backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "8px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6B7280", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Access Controls
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => handleImpersonate(activeUser)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: "#1B1B1B", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                Impersonate User
              </button>

              <button 
                onClick={() => handleToggleSuspend(activeUser)}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E6DED0", borderRadius: "6px",
                  backgroundColor: "#F7F4ED", color: activeUser.status === "Active" ? "#E15D5D" : "#18B67A", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left"
                }}
              >
                {activeUser.status === "Active" ? "Suspend Account" : "Reactivate Account"}
              </button>

              <button 
                onClick={() => {
                  if(confirm("Confirm account deletion? This action soft deletes the platform record.")) {
                    localStorage.removeItem(`oyen_user_suspended_${activeUser.email}`);
                    alert("Account deletion instruction scheduled.");
                    setActiveProfileId(null);
                    loadDatabase();
                  }
                }}
                style={{
                  width: "100%", padding: "0.6rem 0.85rem", border: "1px solid #E15D5D", borderRadius: "6px",
                  backgroundColor: "rgba(225, 93, 93, 0.08)", color: "#E15D5D", fontSize: "0.78rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "left", marginTop: "1rem"
                }}
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem", boxSizing: "border-box", backgroundColor: "#F7F4ED", minHeight: "100%" }}>
      
      {/* Header */}
      <div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#1B1B1B", fontFamily: "'Outfit', sans-serif" }}>Identity & Access</h3>
        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage every user identity, authentication, permissions, and platform access across OYEN.</span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Total Users</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>{users.length}</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Verified Users</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#18B67A" }}>
            {users.filter(u => u.status === "Active").length}
          </h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Pending Invitations</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>0</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Locked Accounts</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800 }}>0</h4>
        </div>
        <div style={{ backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", padding: "1.25rem", borderRadius: "8px" }}>
          <span style={{ fontSize: "0.72rem", color: "#6B7280" }}>Suspended Accounts</span>
          <h4 style={{ fontSize: "1.5rem", margin: "0.25rem 0 0 0", fontWeight: 800, color: "#E15D5D" }}>
            {users.filter(u => u.status === "Suspended").length}
          </h4>
        </div>
      </div>

      {/* Action Controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        
        {/* Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={14} color="#6B7280" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search platform users by name, email or role..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #E6DED0", backgroundColor: "#FCFBF8", color: "#1B1B1B", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "Active", "Suspended"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                border: "1px solid #E6DED0", borderRadius: "6px", fontSize: "0.78rem",
                padding: "0.45rem 0.85rem", cursor: "pointer",
                backgroundColor: activeFilter === tab ? "#D9A928" : "#FCFBF8",
                color: activeFilter === tab ? "#FFFFFF" : "#1B1B1B", fontWeight: 700
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select 
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          style={{ border: "1px solid #E6DED0", padding: "0.45rem 0.85rem", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "#FCFBF8", outline: "none" }}
        >
          <option>Recently Active</option>
          <option>Name (A–Z)</option>
          <option>Name (Z–A)</option>
        </select>
      </div>

      {/* Main Table Grid */}
      <div style={{ border: "1px solid #E6DED0", borderRadius: "8px", overflow: "visible", backgroundColor: "#FCFBF8", position: "relative" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E6DED0", backgroundColor: "#F7F4ED" }}>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>NAME</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>EMAIL</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>PLATFORM ROLE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>ORGANIZATION</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>WORKSPACE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}>LAST ACTIVE</th>
              <th style={{ padding: "0.85rem 1.25rem", color: "#6B7280", fontWeight: 700 }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #E6DED0" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "#1B1B1B" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#E6DED0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem" }}>
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{user.email}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#1B1B1B", fontWeight: 600 }}>{user.role}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{user.organizations}</td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280", fontFamily: "monospace" }}>{user.workspaces}</td>
                <td style={{ padding: "1.1rem 1.25rem" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.45rem", borderRadius: "4px",
                    backgroundColor: user.status === "Active" ? "rgba(24, 182, 122, 0.12)" : "rgba(225, 93, 93, 0.12)",
                    color: user.status === "Active" ? "#18B67A" : "#E15D5D"
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "1.1rem 1.25rem", color: "#6B7280" }}>{user.lastActive}</td>
                <td style={{ padding: "1.1rem 1.25rem", textAlign: "right", position: "relative" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => {
                        setActiveProfileId(user.id);
                        setProfileTab("Overview");
                      }}
                      style={{ border: "none", background: "none", color: "#D9A928", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                    >
                      Open
                    </button>
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                      style={{ border: "none", background: "none", color: "#6B7280", cursor: "pointer" }}
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    {activeMenuId === user.id && (
                      <div style={{
                        position: "absolute", top: "30px", right: "1.25rem", width: "180px",
                        backgroundColor: "#FCFBF8", border: "1px solid #E6DED0", borderRadius: "6px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.05)", zIndex: 100, padding: "0.25rem",
                        display: "flex", flexDirection: "column", textAlign: "left"
                      }}>
                        <button 
                          onClick={() => { setActiveProfileId(user.id); setProfileTab("Overview"); setActiveMenuId(null); }}
                          style={{ border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          Open Profile
                        </button>
                        <button 
                          onClick={() => handleImpersonate(user)}
                          style={{ border: "none", background: "none", color: "#1B1B1B", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          Impersonate User
                        </button>
                        <button 
                          onClick={() => handleToggleSuspend(user)}
                          style={{ border: "none", background: "none", color: user.status === "Active" ? "#E15D5D" : "#18B67A", fontSize: "0.75rem", padding: "0.5rem 0.75rem", textAlign: "left", cursor: "pointer", borderRadius: "4px" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FFF7E4"}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                          {user.status === "Active" ? "Suspend Account" : "Reactivate Account"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
