import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, UserPlus, Check, X, Shield, Lock, Users } from 'lucide-react';

export default function RolesTab({
  wsTeam = [],
  setWsTeam,
  onCancel,
  addNotification
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Default system roles
  const [selectedRole, setSelectedRole] = useState('Owner');
  const [rolesPermissions, setRolesPermissions] = useState({
    Owner: {
      manageWorkspace: true,
      manageTeam: true,
      createProgrammes: true,
      editProgrammes: true,
      manageLearners: true,
      scheduleSessions: true,
      viewReports: true,
      manageCertificates: true,
      billing: true
    },
    Administrator: {
      manageWorkspace: true,
      manageTeam: true,
      createProgrammes: true,
      editProgrammes: true,
      manageLearners: true,
      scheduleSessions: true,
      viewReports: true,
      manageCertificates: true,
      billing: false
    },
    'Programme Manager': {
      manageWorkspace: false,
      manageTeam: false,
      createProgrammes: true,
      editProgrammes: true,
      manageLearners: true,
      scheduleSessions: true,
      viewReports: true,
      manageCertificates: true,
      billing: false
    },
    Facilitator: {
      manageWorkspace: false,
      manageTeam: false,
      createProgrammes: false,
      editProgrammes: true,
      manageLearners: true,
      scheduleSessions: true,
      viewReports: true,
      manageCertificates: false,
      billing: false
    },
    Reviewer: {
      manageWorkspace: false,
      manageTeam: false,
      createProgrammes: false,
      editProgrammes: false,
      manageLearners: false,
      scheduleSessions: false,
      viewReports: true,
      manageCertificates: false,
      billing: false
    },
    Viewer: {
      manageWorkspace: false,
      manageTeam: false,
      createProgrammes: false,
      editProgrammes: false,
      manageLearners: false,
      scheduleSessions: false,
      viewReports: true,
      manageCertificates: false,
      billing: false
    }
  });

  const handleTogglePermission = (permissionKey) => {
    if (selectedRole === 'Owner') {
      addNotification?.('Owner permissions are absolute and cannot be modified.', 'info');
      return;
    }
    setRolesPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [permissionKey]: !prev[selectedRole][permissionKey]
      }
    }));
  };

  const filteredMembers = wsTeam.filter(member => {
    const matchesSearch = 
      (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSave = () => {
    addNotification?.('Roles and permissions updated successfully.', 'success');
    onCancel();
  };

  const renderToggle = (label, value, key) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid #E8E2DA' }}>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#151515' }}>{label}</div>
      </div>
      <button
        type="button"
        onClick={() => handleTogglePermission(key)}
        style={{
          width: '40px',
          height: '22px',
          borderRadius: '99px',
          backgroundColor: value ? '#F5C84C' : '#E8E2DA',
          border: 'none',
          cursor: selectedRole === 'Owner' ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s ease',
          padding: 0
        }}
      >
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '3px',
          left: value ? '21px' : '3px',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
        }} />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #DDD6CB', paddingBottom: '1.5rem' }}>
        <button 
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: '1px solid #DDD6CB',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            color: '#151515'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8E0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Roles & Permissions</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage team access, assign roles, and control permissions across your workspace.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Team Members Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            
            {/* Table Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
                  <Search size={15} color="#7E7E7E" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem 0.55rem 2.25rem',
                      borderRadius: '8px',
                      border: '1px solid #DDD6CB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      color: '#151515',
                      fontFamily: "'Inter', sans-serif",
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{
                      padding: '0.55rem 2.2rem 0.55rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #DDD6CB',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.82rem',
                      color: '#151515',
                      fontFamily: "'Inter', sans-serif', sans-serif",
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                  >
                    <option value="All">All Roles</option>
                    <option value="Owner">Owner</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Programme Manager">Programme Manager</option>
                    <option value="Facilitator">Facilitator</option>
                    <option value="Reviewer">Reviewer</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <Filter size={12} color="#7E7E7E" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
              <button
                onClick={() => {
                  const trigger = document.querySelector('[data-testid="invite-team-trigger"]') || document.getElementById('invite-team-btn');
                  if (trigger) trigger.click();
                  else addNotification?.('Invite panel triggered.', 'info');
                }}
                style={{
                  background: '#F5C84C',
                  border: 'none',
                  color: '#151515',
                  borderRadius: '8px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                <UserPlus size={14} /> Invite Member
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #DDD6CB' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E8E2DA' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>{member.name}</td>
                      <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.82rem', color: '#5C5C5C' }}>{member.email}</td>
                      <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.82rem', color: '#151515' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B8891A', backgroundColor: 'rgba(245,200,76,0.12)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {member.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.82rem' }}>
                        <span style={{ color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                          Active
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', fontSize: '0.82rem', color: '#7E7E7E' }}>Today</td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#7E7E7E', fontSize: '0.85rem' }}>No team members found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

        {/* Right Side: Role Permissions Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Roles Selector & Config */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif" }}>Roles</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
              {Object.keys(rolesPermissions).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedRole === role ? '#F5C84C' : '#DDD6CB',
                    backgroundColor: selectedRole === role ? 'rgba(245,200,76,0.08)' : '#FFFFFF',
                    color: '#151515',
                    fontSize: '0.82rem',
                    fontWeight: selectedRole === role ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={14} color={selectedRole === role ? '#B8891A' : '#7E7E7E'} /> {role}
                  </span>
                  {selectedRole === role && <Check size={14} color="#B8891A" />}
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #DDD6CB', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                <Lock size={15} color="#E2B235" />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                  Permissions for {selectedRole}
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {renderToggle('Manage Workspace', rolesPermissions[selectedRole].manageWorkspace, 'manageWorkspace')}
                {renderToggle('Manage Team', rolesPermissions[selectedRole].manageTeam, 'manageTeam')}
                {renderToggle('Create Programmes', rolesPermissions[selectedRole].createProgrammes, 'createProgrammes')}
                {renderToggle('Edit Programmes', rolesPermissions[selectedRole].editProgrammes, 'editProgrammes')}
                {renderToggle('Manage Learners', rolesPermissions[selectedRole].manageLearners, 'manageLearners')}
                {renderToggle('Schedule Sessions', rolesPermissions[selectedRole].scheduleSessions, 'scheduleSessions')}
                {renderToggle('View Reports', rolesPermissions[selectedRole].viewReports, 'viewReports')}
                {renderToggle('Manage Certificates', rolesPermissions[selectedRole].manageCertificates, 'manageCertificates')}
                {renderToggle('Billing & Subscription', rolesPermissions[selectedRole].billing, 'billing')}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Save/Cancel */}
      <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #DDD6CB', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleSave}
          style={{
            background: '#F5C84C',
            border: '1px solid #F5C84C',
            color: '#151515',
            borderRadius: '8px',
            padding: '0.75rem 1.75rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(245, 200, 76, 0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Save Changes
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: '1px solid #DDD6CB',
            color: '#5C5C5C',
            borderRadius: '8px',
            padding: '0.75rem 1.75rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8E0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Cancel
        </button>
      </div>

    </div>
  );
}
