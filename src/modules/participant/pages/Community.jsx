import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Share2, Plus, Search } from 'lucide-react';

export default function Community() {
  const posts = [
    {
      id: 1,
      author: 'Ngozi Kalu',
      role: 'Participant • Product Design',
      avatar: 'N',
      time: '3 hours ago',
      content: 'Just finished setting up my Figma variables for color contrast mode in Week 4! Here is a tip: use semantically named tokens like surface-primary instead of hex codes directly.',
      likes: 12,
      comments: 4
    },
    {
      id: 2,
      author: 'Fatima Aliyu',
      role: 'Participant • Product Design',
      avatar: 'F',
      time: '6 hours ago',
      content: 'Does anyone want to form a study group tonight at 7 PM for the Figma auto-layout challenge?',
      likes: 8,
      comments: 6
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <Users className="text-amber-400" /> Learner Community & Feed
        </h1>
        <p className="text-xs text-slate-400">Connect with peers, share project tips, organize study groups, and ask questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map(post => (
            <div key={post.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                  {post.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{post.author}</h4>
                  <p className="text-[10px] text-slate-500">{post.role} • {post.time}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-6 border-t border-slate-800/80 pt-3 text-slate-400 text-xs">
                <button className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Heart size={14} /> <span>{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <MessageCircle size={14} /> <span>{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Community Sidebar */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Study Groups</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="font-bold text-slate-200">Figma Auto-Layout Squad</h4>
                <p className="text-[10px] text-slate-400">8 Members • Meets Tuesdays</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h4 className="font-bold text-slate-200">Design Systems Deep Dive</h4>
                <p className="text-[10px] text-slate-400">14 Members • Meets Thursdays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
