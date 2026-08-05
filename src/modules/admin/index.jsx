import React from 'react';

export default function AdminModule({
  activeTab,
  setActiveTab,
  children
}) {
  return (
    <div className="admin-module-container" style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
}
