import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello Shola! I am your OYEN AI Learning Assistant. How can I help with your Product Design Bootcamp today? I can summarize class notes, explain complex concepts, or generate practice quizzes!'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let replyText = 'Here is a quick overview based on your course material: Design tokens represent raw variables (colors, spacing, font sizes) that create a single source of truth across product design and engineering.';
      if (input.toLowerCase().includes('quiz')) {
        replyText = 'Practice Quiz Question 1: What is the main benefit of using 8pt grid spacing? \nA) Pixel precision \nB) Scalability & vertical rhythm \nC) Faster rendering';
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: replyText }]);
    }, 600);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col space-y-4 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-3">
          <Sparkles className="text-amber-400" /> OYEN AI Learning Workspace
        </h1>
        <p className="text-xs text-slate-400">Ask questions, summarize lessons, generate practice quizzes, and get assignment feedback.</p>
      </div>

      <div className="flex-1 min-h-0 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between p-6">
        {/* Messages Feed */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {messages.map(m => (
            <div key={m.id} className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                m.sender === 'ai' ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' : 'bg-slate-800 text-slate-300'
              }`}>
                {m.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>

              <div className={`p-4 rounded-2xl text-xs max-w-xl leading-relaxed ${
                m.sender === 'ai' ? 'bg-slate-950/80 border border-slate-800 text-slate-200' : 'bg-amber-400 text-slate-950 font-medium'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask OYEN AI anything about your course..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-400/10"
          >
            <Send size={14} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
