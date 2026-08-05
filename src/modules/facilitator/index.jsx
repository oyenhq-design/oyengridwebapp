import React from 'react';

export default function FacilitatorModule({
  activeTab,
  setActiveTab,
  children
}) {
  return (
    <div className="facilitator-module-container" style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
}
