import React, { useState } from 'react';
import { MessageSquare, Send, Paperclip, Search, User, Shield, CheckCheck } from 'lucide-react';

export default function Messages({ user }) {
  const [activeChannel, setActiveChannel] = useState('Sarah Ahmed (Facilitator)');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sarah Ahmed (Facilitator)', text: 'Hi Shola! Let me know if you have any questions on the Week 4 Figma design tokens assignment.', time: '10:14 AM' },
    { id: 2, sender: 'You', text: 'Thanks Sarah! Quick question on spacing scales—should we stick to 8pt grid strictly?', time: '10:16 AM' },
    { id: 3, sender: 'Sarah Ahmed (Facilitator)', text: 'Yes, 8pt grid is standard! You can use 4pt step for small icon padding.', time: '10:18 AM' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: input, time: 'Just now' }]);
    setInput('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <MessageSquare className="text-amber-400" /> Learner Messaging Workspace
        </h1>
        <p className="text-xs text-slate-400">Direct communication with your facilitators, programme managers, and study peers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="border-r border-slate-800/80 p-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200"
            />
          </div>

          <div className="space-y-1">
            {['Sarah Ahmed (Facilitator)', 'Michael Ibrahim (Mentor)', 'Programme Announcements', 'Support Desk'].map(contact => (
              <button
                key={contact}
                onClick={() => setActiveChannel(contact)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                  activeChannel === contact 
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' 
                    : 'text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs">
                  {contact.charAt(0)}
                </div>
                <span className="truncate">{contact}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-950/40 min-h-0">
          <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200">{activeChannel}</h3>
            <span className="text-[10px] text-emerald-400 font-semibold">• Online</span>
          </div>

          {/* Messages Feed */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {messages.map(m => {
              const isMe = m.sender === 'You';
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-xs space-y-1 ${
                    isMe ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none shadow-md' : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[9px] block text-right ${isMe ? 'text-slate-900/70' : 'text-slate-500'}`}>{m.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-2 border-t border-slate-800/80 flex items-center gap-2">
            <button type="button" className="p-2 rounded-xl text-slate-500 hover:text-slate-300">
              <Paperclip size={16} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md shadow-amber-400/10"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
