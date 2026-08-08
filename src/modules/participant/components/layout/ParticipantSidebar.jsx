import React from 'react';
import { 
  LayoutDashboard, BookOpen, Video, FileCheck, HelpCircle, 
  FolderArchive, MessageSquare, Users, Sparkles, Award, FileBadge, 
  User, Settings, LogOut, GraduationCap 
} from 'lucide-react';

export default function ParticipantSidebar({ activeTab, setActiveTab, onSignOut, userName = 'Blessing' }) {
  const groups = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'PROGRAMME',
      items: [
        { id: 'learning', label: 'Modules', icon: BookOpen },
        { id: 'sessions', label: 'Live Sessions', icon: Video },
        { id: 'assignments', label: 'Assignments', icon: FileCheck },
        { id: 'assessments', label: 'Assessments', icon: HelpCircle },
        { id: 'resources', label: 'Resources', icon: FolderArchive },
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'ai-assistant', label: 'OYEN AI', icon: Sparkles, badge: '✨' },
      ]
    },
    {
      title: 'ME',
      items: [
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'certificates', label: 'Certificates', icon: FileBadge },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-60 bg-[#F5F5F0] border-r border-[#E5E5DF] flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E5E5DF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-amber-400 text-xs shadow-sm">
              OG
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-sm tracking-tight">OYEN GRID</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">My Workspace</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                {group.title}
              </h4>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-slate-100 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={15} className={isActive ? 'text-amber-400' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-400 text-slate-950">
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
      <div className="p-3 border-t border-[#E5E5DF] bg-[#F5F5F0]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E5E5DF] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'B'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate capitalize">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate">Learner</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
