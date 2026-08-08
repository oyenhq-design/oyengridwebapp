import React from 'react';
import { 
  LayoutDashboard, BookOpen, Layers, Video, FileCheck, HelpCircle, 
  FolderArchive, MessageSquare, Users, Sparkles, Award, FileBadge, 
  User, Settings, LogOut, GraduationCap 
} from 'lucide-react';

export default function ParticipantSidebar({ activeTab, setActiveTab, onSignOut, userName = 'Shola Alabi' }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programme', label: 'My Programme', icon: GraduationCap },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'sessions', label: 'Live Sessions', icon: Video },
    { id: 'assignments', label: 'Assignments', icon: FileCheck },
    { id: 'assessments', label: 'Assessments', icon: HelpCircle },
    { id: 'resources', label: 'Resources', icon: FolderArchive },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'ai-assistant', label: 'OYEN AI', icon: Sparkles, badge: 'AI' },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: FileBadge },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-amber-500/10">
              OG
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm tracking-tight">OYEN GRID</h1>
              <p className="text-[10px] font-medium text-amber-400 uppercase tracking-widest">Learner Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/20 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider rounded-md bg-amber-400 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Footer & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-slate-800/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
              {userName ? userName.charAt(0) : 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate">Participant</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
