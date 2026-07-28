import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw, Key, Shield, Calendar, Video, Database, MessageSquare, Mail } from 'lucide-react';

export default function IntegrationsTab({
  onCancel,
  addNotification
}) {
  const [connections, setConnections] = useState({
    googleCalendar: true,
    msTeams: false,
    zoom: true,
    googleDrive: false,
    slack: true,
    outlook: false
  });

  const [apiKey, setApiKey] = useState('key_live_9f8d7c6b5a4a3b2c1d0e9f8d7c6b5a4a');
  const [webhookUrl, setWebhookUrl] = useState('https://api.oyengrid.com/v1/webhooks/oyg_9f3a8b');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookCopied, setWebhookCopied] = useState(false);

  const handleToggleConnection = (appKey, appName) => {
    const isConnecting = !connections[appKey];
    setConnections(prev => ({ ...prev, [appKey]: !prev[appKey] }));
    addNotification?.(
      isConnecting ? `${appName} connected successfully.` : `${appName} disconnected.`,
      isConnecting ? 'success' : 'info'
    );
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'api') {
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000);
    } else {
      setWebhookCopied(true);
      setTimeout(() => setWebhookCopied(false), 2000);
    }
    addNotification?.('Copied to clipboard.', 'success');
  };

  const handleRegenerateKey = () => {
    const confirmRegen = window.confirm(
      'Are you sure you want to regenerate your API Key? All current applications using this key will immediately lose access.'
    );
    if (confirmRegen) {
      const newKey = 'key_live_' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setApiKey(newKey);
      addNotification?.('New API Key generated successfully.', 'success');
    }
  };

  const handleSave = () => {
    addNotification?.('Integrations updated successfully.', 'success');
    onCancel();
  };

  const appData = [
    { key: 'googleCalendar', name: 'Google Calendar', desc: 'Sync session schedules and calendars dynamically.', icon: <Calendar size={22} color="#4285F4" /> },
    { key: 'msTeams', name: 'Microsoft Teams', desc: 'Auto-create Teams meetings for program sessions.', icon: <Video size={22} color="#6264A7" /> },
    { key: 'zoom', name: 'Zoom', desc: 'Generate unique video links for live sessions.', icon: <Video size={22} color="#2D8CFF" /> },
    { key: 'googleDrive', name: 'Google Drive', desc: 'Access and attach workspace assets directly.', icon: <Database size={22} color="#34A853" /> },
    { key: 'slack', name: 'Slack', desc: 'Broadcast program notifications to Slack channels.', icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.26a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.522H3.78a2.528 2.528 0 0 1-2.52-2.522V8.825a2.528 2.528 0 0 1 2.52-2.522h5.043zm10.135 3.78a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.78a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-3.78 10.134a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.522h-5.043z" fill="#4A154B"/>
      </svg>
    ) },
    { key: 'outlook', name: 'Microsoft Outlook', desc: 'Sync workspace communications and emails.', icon: <Mail size={22} color="#0078D4" /> },
  ];

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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Integrations</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Connect OYEN GRID with the tools your organization already uses.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Connected Apps Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', fontFamily: "'Inter', sans-serif" }}>Connected Apps</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {appData.map((app) => (
                <div key={app.key} style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem', boxShadow: '0 2px 10px rgba(100,90,75,0.04)' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #DDD6CB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {app.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#151515', fontFamily: "'Inter', sans-serif" }}>{app.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#5C5C5C', marginTop: '0.25rem', lineHeight: '1.35' }}>{app.desc}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: connections[app.key] ? '#16a34a' : '#7E7E7E', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: connections[app.key] ? '#16a34a' : '#7E7E7E' }} />
                      {connections[app.key] ? 'Connected' : 'Disconnected'}
                    </span>
                    <button
                      onClick={() => handleToggleConnection(app.key, app.name)}
                      style={{
                        background: connections[app.key] ? 'transparent' : '#F5C84C',
                        border: connections[app.key] ? '1px solid #DDD6CB' : 'none',
                        color: '#151515',
                        borderRadius: '6px',
                        padding: '0.45rem 1rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onMouseEnter={(e) => { if (connections[app.key]) e.currentTarget.style.backgroundColor = '#EDE8E0'; }}
                      onMouseLeave={(e) => { if (connections[app.key]) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {connections[app.key] ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: API Access & Log Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* API Access settings */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} color="#E2B235" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>API Access</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#151515' }}>Secret API Key</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={apiKey.slice(0, 12) + '••••••••••••••••'}
                  style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#EDE8E0', fontSize: '0.82rem', color: '#5C5C5C', fontFamily: 'monospace' }}
                />
                <button
                  onClick={() => handleCopy(apiKey, 'api')}
                  style={{ background: '#FFFFFF', border: '1px solid #DDD6CB', borderRadius: '8px', padding: '0 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {apiKeyCopied ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#151515" />}
                </button>
                <button
                  onClick={handleRegenerateKey}
                  style={{ background: '#FFFFFF', border: '1px solid #DDD6CB', borderRadius: '8px', padding: '0 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Regenerate API Key"
                >
                  <RefreshCw size={14} color="#151515" />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #DDD6CB', paddingTop: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#151515' }}>Webhook Endpoint URL</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#EDE8E0', fontSize: '0.82rem', color: '#5C5C5C', fontFamily: 'monospace' }}
                />
                <button
                  onClick={() => handleCopy(webhookUrl, 'webhook')}
                  style={{ background: '#FFFFFF', border: '1px solid #DDD6CB', borderRadius: '8px', padding: '0 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {webhookCopied ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#151515" />}
                </button>
              </div>
            </div>
          </div>

          {/* Security & Sync Audit panel */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Shield size={18} color="#E2B235" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Security & Sync</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #DDD6CB' }}>
                <span style={{ color: '#7E7E7E' }}>Connected Applications</span>
                <span style={{ fontWeight: 600, color: '#151515' }}>3 Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #DDD6CB' }}>
                <span style={{ color: '#7E7E7E' }}>Last Successful Sync</span>
                <span style={{ fontWeight: 600, color: '#151515' }}>14 mins ago</span>
              </div>
              <div>
                <span style={{ color: '#7E7E7E', display: 'block', marginBottom: '0.45rem' }}>Recent Integration Logs</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #DDD6CB', padding: '0.6rem 0.75rem', fontFamily: 'monospace', fontSize: '0.72rem', color: '#5C5C5C', lineHeight: '1.3' }}>
                  <div>[16:44:02] Slack webhook post verified (200 OK)</div>
                  <div>[16:30:11] Zoom session link generated for S_091a</div>
                  <div>[16:30:04] GCal auth session verified successfully</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Save Changes only */}
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
      </div>

    </div>
  );
}
