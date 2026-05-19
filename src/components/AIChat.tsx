import React, { useState, useEffect, useRef } from 'react';
import { ai, debounce } from '../lib/api';
import { Bot, X, Sparkles, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const AIChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: "Greetings, Operative. I am Nexus AI, your elite tactical assistant. How can I optimize your marketplace deployment today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen(!open);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const debouncedChat = debounce(ai.chat, 800);
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    try {
      const response = await debouncedChat(userMsg);
      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'ai', text: '⚠️ Nexus AI unavailable. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Button fixed to bottom‑right */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!open && (
          <div className="hidden md:flex items-center gap-2 bg-surface-container-highest/80 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary shadow-[0_0_15px_rgba(0,255,204,0.2)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Ask Nexus AI
          </div>
        )}
        <button
          onClick={toggle}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-tertiary text-black shadow-[0_0_25px_rgba(0,255,204,0.5)] hover:shadow-[0_0_35px_rgba(0,255,204,0.8)] hover:scale-110 active:scale-95 transition-all cursor-pointer group"
          aria-label="Open Nexus AI Assistant"
        >
          <Bot className="w-7 h-7 text-black group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:justify-end bg-black/40 backdrop-blur-sm p-0 sm:p-6 sm:pr-12 animate-in fade-in duration-200">
          <div className="relative w-full sm:w-[440px] h-[85vh] sm:h-[600px] rounded-t-[32px] sm:rounded-[32px] bg-surface-container-lowest/90 border border-primary/20 shadow-[0_0_50px_rgba(0,255,204,0.15)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-6 bg-surface-container-highest/50 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(0,255,204,0.3)]">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-on-surface flex items-center gap-2">
                    Nexus AI <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,255,204,1)]" />
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 block">Elite Tactical Assistant</span>
                </div>
              </div>
              <button
                onClick={toggle}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
                aria-label="Close Nexus AI"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-4 text-xs font-medium leading-relaxed shadow-lg",
                    m.role === 'user'
                      ? "bg-primary text-black font-semibold rounded-br-none shadow-primary/20"
                      : "bg-surface-container-high text-on-surface border border-outline-variant/10 rounded-bl-none font-sans"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-high text-primary border border-primary/20 rounded-2xl rounded-bl-none p-4 text-xs font-medium flex items-center gap-3 shadow-lg">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> Nexus AI is analyzing marketplace vectors...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-6 bg-surface-container-highest/40 border-t border-outline-variant/10 flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Nexus AI..."
                className="flex-1 bg-surface-container-highest border border-outline-variant/20 rounded-2xl py-3.5 px-5 text-xs text-on-surface placeholder-on-surface-variant focus:border-primary focus:bg-black/40 outline-none transition-all shadow-inner"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 cursor-pointer flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
