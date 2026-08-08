import React, { useState } from 'react';
import { Settings, Shield, Bell, Lock, Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <Settings className="text-amber-400" /> Learner Workspace Settings
        </h1>
        <p className="text-xs text-slate-400">Manage account details, notification channels, password security, and visual preferences.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Notification Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Bell size={16} className="text-amber-400" /> Notifications & Alerts
          </h3>

          <div className="space-y-3 divide-y divide-slate-800">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Email Notifications</p>
                <p className="text-[10px] text-slate-400">Receive alerts when assignments are graded or live sessions start.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={(e) => setEmailNotifs(e.target.checked)}
                className="w-4 h-4 accent-amber-400"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Desktop Push Alerts</p>
                <p className="text-[10px] text-slate-400">Real-time alerts for direct messages and announcements.</p>
              </div>
              <input
                type="checkbox"
                checked={desktopNotifs}
                onChange={(e) => setDesktopNotifs(e.target.checked)}
                className="w-4 h-4 accent-amber-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
