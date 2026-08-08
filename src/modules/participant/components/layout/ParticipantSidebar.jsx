import React from 'react';
import { 
  LayoutDashboard, BookOpen, Video, FileCheck, HelpCircle, 
  FolderArchive, MessageSquare, Users, Sparkles, Award, FileBadge, 
  User, Settings, LogOut, GraduationCap, Megaphone 
} from 'lucide-react';

export default function ParticipantSidebar({ activeTab, setActiveTab, onSignOut, userName = 'Blessing' }) {
  const groups = [
    {
      title: 'LEARNING',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'programme', label: 'My Programme', icon: GraduationCap },
        { id: 'learning', label: 'Learning Modules', icon: BookOpen },
        { id: 'sessions', label: 'Live Sessions', icon: Video },
        { id: 'resources', label: 'Resources', icon: FolderArchive },
      ]
    },
    {
      title: 'PROGRAMME WORK',
      items: [
        { id: 'assignments', label: 'Assignments', icon: FileCheck },
        { id: 'assessments', label: 'Assessments', icon: HelpCircle },
      ]
    },
    {
      title: 'COMMUNITY & AI',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'community', label: 'Community Feed', icon: Users },
        { id: 'ai-assistant', label: 'OYEN AI', icon: Sparkles, badge: '✨' },
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'certificates', label: 'Certificates', icon: FileBadge },
        { id: 'profile', label: 'Profile & Portfolio', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 select-none backdrop-blur-xl">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              OG
            </div>
            <div>
              <h1 className="font-extrabold text-slate-100 text-sm tracking-tight">OYEN GRID</h1>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> My Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Grouped Navigation List */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                {group.title}
              </h4>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                      isActive 
                        ? 'bg-amber-400/10 text-amber-400 font-semibold border border-amber-400/30 shadow-md shadow-amber-400/5' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black rounded-md bg-amber-400 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* User Footer & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 border border-amber-400/40 flex items-center justify-center text-slate-950 text-xs font-bold shrink-0 shadow-md">
              {userName ? userName.charAt(0).toUpperCase() : 'B'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate capitalize">{userName}</p>
              <p className="text-[10px] font-medium text-amber-400/80 truncate">Learner Workspace</p>
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
