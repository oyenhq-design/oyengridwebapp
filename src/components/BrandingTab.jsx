import React, { useState } from 'react';
import { Upload, Trash2, Copy, Check, ArrowLeft, Paintbrush, Globe, Mail, Phone, Info } from 'lucide-react';

export default function BrandingTab({
  orgLogo,
  setOrgLogo,
  orgName,
  setOrgName,
  onCancel,
  addNotification
}) {
  const [localLogo, setLocalLogo] = useState(orgLogo);
  const [localOrgName, setLocalOrgName] = useState(orgName || 'OYEN GROUP');
  const [workspaceName, setWorkspaceName] = useState('OYEN GRID');
  const [description, setDescription] = useState('Briefly describe your organization.');
  const [primaryColor, setPrimaryColor] = useState('#F5C84C');
  const [accentColor, setAccentColor] = useState('#151515');
  const [workspaceUrl, setWorkspaceUrl] = useState('workspace.oyengrid.com/oyengroup');
  const [email, setEmail] = useState('contact@oyengroup.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [website, setWebsite] = useState('www.oyengroup.com');
  const [copied, setCopied] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification?.('File size exceeds the 5MB limit.', 'error');
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      addNotification?.('Only PNG, JPG, JPEG, and SVG formats are supported.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setLocalLogo(uploadEvent.target.result);
      addNotification?.('Logo uploaded successfully.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    const confirmRemove = window.confirm(
      'Are you sure you want to remove your organization logo? This will revert the logo back to the default workspace icon.'
    );
    if (confirmRemove) {
      setLocalLogo(null);
      addNotification?.('Logo removed.', 'info');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(workspaceUrl);
    setCopied(true);
    addNotification?.('Workspace URL copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    // Update global app state
    setOrgLogo(localLogo);
    setOrgName(localOrgName);
    
    if (addNotification) {
      addNotification('Branding updated successfully.', 'success');
    }
    
    // Go back
    onCancel();
  };

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
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Workspace Branding</h1>
          <p style={{ color: '#5C5C5C', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Customize your organization's identity and appearance across the OYEN GRID workspace.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Settings Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Logo Management */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: '0 0 1.25rem 0', fontFamily: "'Inter', sans-serif" }}>Organization Logo</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              
              {/* Logo Preview box */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                border: '1.5px dashed #C8BFB2',
                backgroundColor: '#EDE8E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {localLogo ? (
                  <img src={localLogo} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#7E7E7E', fontSize: '0.72rem', fontWeight: 600, padding: '0.5rem' }}>No Logo</div>
                )}
              </div>

              {/* Upload Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <label style={{
                    background: '#F5C84C',
                    border: 'none',
                    color: '#151515',
                    borderRadius: '8px',
                    padding: '0.6rem 1.25rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'all 0.2s ease'
                  }}>
                    <Upload size={14} /> Upload New Logo
                    <input type="file" accept=".png,.jpg,.jpeg,.svg" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  </label>
                  {localLogo && (
                    <button
                      onClick={handleRemoveLogo}
                      style={{
                        background: 'transparent',
                        border: '1px solid #DDD6CB',
                        color: '#DC2626',
                        borderRadius: '8px',
                        padding: '0.6rem 1.25rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontFamily: "'Inter', sans-serif",
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.74rem', color: '#7E7E7E' }}>Supported formats: PNG, JPG, SVG. Max size: 5MB</span>
              </div>

            </div>
          </div>

          {/* Section 2: Organization Info */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Organization Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Organization Name</label>
                <input
                  type="text"
                  value={localOrgName}
                  onChange={(e) => setLocalOrgName(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515' }}>Organization Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your organization."
                style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif", resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Section 3: Brand Appearance */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Brand Appearance</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Paintbrush size={14} color="#E2B235" /> Primary Brand Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={primaryColor.toUpperCase()}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', width: '100px', textAlign: 'center', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Paintbrush size={14} color="#E2B235" /> Accent Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={accentColor.toUpperCase()}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', width: '100px', textAlign: 'center', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Workspace URL */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Workspace URL</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Globe size={16} color="#7E7E7E" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.35rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' }}
                />
              </div>
              <button
                onClick={handleCopyUrl}
                style={{
                  background: 'transparent',
                  border: '1px solid #DDD6CB',
                  borderRadius: '8px',
                  padding: '0 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#151515',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE8E0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copy URL
              </button>
            </div>
          </div>

          {/* Section 5: Contact Information */}
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '2rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151515', margin: 0, fontFamily: "'Inter', sans-serif" }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} color="#7E7E7E" /> Organization Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={14} color="#7E7E7E" /> Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#151515', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Globe size={14} color="#7E7E7E" /> Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #DDD6CB', backgroundColor: '#FFFFFF', fontSize: '0.88rem', color: '#151515', fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          </div>

          {/* Bottom Actions */}
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

        {/* Right Side: Live Appearance Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          
          <div style={{ backgroundColor: '#F5F2ED', border: '1px solid #DDD6CB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(100, 90, 75, 0.07)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#151515', margin: '0 0 1rem 0', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Info size={15} color="#E2B235" /> Live Appearance Preview
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#5C5C5C', lineHeight: '1.45', margin: '0 0 1.25rem 0' }}>
              Demonstrates how your custom brand and accent colors will look in workspace buttons, highlights, badges, and components.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Light Theme Preview Card */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #ECE6DC', borderRadius: '12px', padding: '1.25rem', textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7E7E7E', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Light Theme Preview</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ backgroundColor: primaryColor, border: 'none', color: '#151515', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'default' }}>
                      Primary Button
                    </button>
                    <button style={{ backgroundColor: 'transparent', border: `1px solid ${primaryColor}`, color: primaryColor, padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'default' }}>
                      Outline Link
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primaryColor }}></span>
                    <span style={{ fontSize: '0.76rem', color: '#151515', fontWeight: 600 }}>Active Navigation Element</span>
                  </div>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', fontSize: '0.68rem', fontWeight: 700, color: primaryColor, backgroundColor: `rgba(${parseInt(primaryColor.slice(1,3), 16)}, ${parseInt(primaryColor.slice(3,5), 16)}, ${parseInt(primaryColor.slice(5,7), 16)}, 0.12)`, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Accent Highlight Tag
                  </div>
                </div>
              </div>

              {/* Dark Theme Preview Card */}
              <div style={{ backgroundColor: '#151515', border: '1px solid #252525', borderRadius: '12px', padding: '1.25rem', textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Dark Theme Preview</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ backgroundColor: primaryColor, border: 'none', color: '#151515', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'default' }}>
                      Primary Button
                    </button>
                    <button style={{ backgroundColor: 'transparent', border: `1px solid ${accentColor}`, color: '#FFFFFF', padding: '0.45rem 1rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'default' }}>
                      Accent Outline
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primaryColor }}></span>
                    <span style={{ fontSize: '0.76rem', color: '#FFFFFF', fontWeight: 600 }}>Active Navigation Element</span>
                  </div>
                  <div style={{ display: 'inline-flex', alignSelf: 'flex-start', fontSize: '0.68rem', fontWeight: 700, color: primaryColor, backgroundColor: `rgba(${parseInt(primaryColor.slice(1,3), 16)}, ${parseInt(primaryColor.slice(3,5), 16)}, ${parseInt(primaryColor.slice(5,7), 16)}, 0.15)`, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Highlight Tag
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
