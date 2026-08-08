import React from 'react';
import { 
  Home, GraduationCap, BookOpen, Video, FileCheck, HelpCircle, 
  FolderArchive, MessageSquare, Users, Sparkles, Award, FileBadge, 
  User, Settings, LogOut 
} from 'lucide-react';

export default function ParticipantSidebar({ activeTab, setActiveTab, onSignOut, userName = 'Blessing' }) {
  const groups = [
    {
      title: '',
      items: [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'programme', label: 'My Programme', icon: GraduationCap },
      ]
    },
    {
      title: 'LEARNING',
      items: [
        { id: 'learning', label: 'Modules', icon: BookOpen },
        { id: 'sessions', label: 'Live Sessions', icon: Video },
        { id: 'assignments', label: 'Assignments', icon: FileCheck },
        { id: 'assessments', label: 'Assessments', icon: HelpCircle },
      ]
    },
    {
      title: '',
      items: [
        { id: 'resources', label: 'Resources', icon: FolderArchive },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'ai-assistant', label: 'AI Tutor', icon: Sparkles, badge: '✨' },
      ]
    },
    {
      title: '',
      items: [
        { id: 'profile', label: 'Profile & Achievements', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-56 bg-[#F7F7F5] border-r border-[#EBEBE8] flex flex-col justify-between h-screen sticky top-0 z-30 select-none text-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#EBEBE8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-amber-400 text-xs shadow-sm">
              OG
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-sm tracking-tight">OYEN GRID</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">My Workspace</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-0.5">
              {group.title && (
                <h4 className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 mt-2">
                  {group.title}
                </h4>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive 
                        ? 'bg-slate-900 text-white font-semibold shadow-sm' 
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
      <div className="p-3 border-t border-[#EBEBE8] bg-[#F7F7F5]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#EBEBE8] shadow-sm">
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
