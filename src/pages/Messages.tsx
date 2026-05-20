import React, { useEffect, useState, useRef } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Image as ImageIcon, Paperclip, Smile, Circle } from 'lucide-react';
import { cn } from '../lib/utils';
import { conversations, isLoggedIn, type Conversation, type ApiMessage } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Messages() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const token = localStorage.getItem('zg_token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;

  const emojis = ['🎮', '⚡', '💎', '👑', '🔥', '🎯', '✨', '🧘', '🤝', '🚀', '💪', '🏆', '💯', '👾', '🎧', '🖱️'];

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    conversations.list().then(data => {
      setChats(data);
      if (data.length > 0) setSelectedChat(data[0]);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    conversations.messages(selectedChat.id).then(setMessages).catch(() => {});
  }, [selectedChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    setSending(true);
    try {
      await conversations.send(selectedChat.id, newMessage.trim());
      setNewMessage('');
      const updated = await conversations.messages(selectedChat.id);
      setMessages(updated);
      setShowEmojiPicker(false);
    } finally { setSending(false); }
  };

  const handleFileClick = (type: 'file' | 'image') => {
    if (type === 'file') fileInputRef.current?.click();
    else imageInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMessage(prev => `${prev} [Хавсралт: ${file.name}] `);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 h-[calc(100vh-120px)]">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
      <input type="file" accept="image/*" ref={imageInputRef} onChange={handleFileUpload} className="hidden" />
      
      <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/10 rounded-3xl h-full flex overflow-hidden shadow-2xl">
        {/* Chat List */}
        <aside className="w-full md:w-96 border-r border-outline-variant/10 flex flex-col bg-surface-container-low/20">
          <div className="p-8 space-y-6">
            <h2 className="text-headline-md text-on-surface">Зурвас</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input type="text" placeholder="Харилцан яриа хайх..." className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary outline-none transition-all placeholder:text-outline" />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto px-4 pb-8 space-y-2">
            {chats.length === 0 && <p className="text-center text-sm text-on-surface-variant py-8">Харилцан яриа байхгүй байна.</p>}
            {chats.map(chat => {
              const other = chat.other_name || (currentUserId === chat.buyer_id ? chat.seller_name : chat.buyer_name) || 'Хэрэглэгч';
              const isSelected = selectedChat?.id === chat.id;
              return (
                <button key={chat.id} onClick={() => setSelectedChat(chat)}
                  className={cn("w-full p-6 rounded-3xl flex items-center gap-5 transition-all text-left group",
                    isSelected ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "hover:bg-surface-container-high/50")}>
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">{other?.[0]?.toUpperCase()}</div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-background rounded-full" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn("font-bold truncate text-lg", isSelected ? "text-on-primary" : "text-on-surface")}>{other}</span>
                      {Number(chat.unread) > 0 && !isSelected && (
                        <div className="w-6 h-6 bg-secondary text-on-secondary text-[10px] font-black rounded-full flex items-center justify-center">{chat.unread}</div>
                      )}
                    </div>
                    <p className={cn("text-sm truncate", isSelected ? "text-on-primary/80" : "text-on-surface-variant")}>{chat.product_title ?? 'Шууд зурвас'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="flex-grow flex flex-col relative">
          {selectedChat ? (
            <>
              <header className="p-8 border-b border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary shadow-lg">
                      {(selectedChat.other_name || (currentUserId === selectedChat.buyer_id ? selectedChat.seller_name : selectedChat.buyer_name))?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-green-500" />
                  </div>
                  <div>
                    <h3 className="text-headline-md text-on-surface">{selectedChat.other_name || (currentUserId === selectedChat.buyer_id ? selectedChat.seller_name : selectedChat.buyer_name) || 'Хэрэглэгч'}</h3>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Идэвхтэй байна</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <button className="p-3 rounded-2xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all"><Phone className="w-5 h-5" /></button>
                  <button className="p-3 rounded-2xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all"><Video className="w-5 h-5" /></button>
                  <button className="p-3 rounded-2xl hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </header>

              <div className="flex-grow overflow-y-auto p-12 space-y-10">
                {messages.length === 0 && <p className="text-center text-sm text-on-surface-variant">Зурвас байхгүй байна. Эхлээд мэндчилээрэй!</p>}
                {messages.map(msg => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                      <div className={cn("flex items-end gap-4 max-w-[70%]", isMe ? "flex-row-reverse" : "flex-row")}>
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-sm font-bold text-primary mb-2">{msg.sender_name?.[0]?.toUpperCase()}</div>
                        <div className={cn("p-6 rounded-3xl text-sm leading-relaxed shadow-xl", isMe ? "bg-secondary text-on-secondary rounded-tr-none" : "glass-card text-on-surface rounded-tl-none border-outline-variant/10")}>
                          {msg.text}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mt-3 px-14">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Emoji Picker Popover */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-32 right-32 z-50 glass-card p-6 rounded-3xl shadow-2xl border border-primary/20 w-64"
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {emojis.map(emoji => (
                        <button 
                          key={emoji} 
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <footer className="p-8 border-t border-outline-variant/10 bg-background/50">
                <form onSubmit={handleSend} className="bg-surface-container-high/50 border border-outline-variant/20 rounded-3xl p-3 flex items-center gap-3 shadow-inner">
                  <button type="button" onClick={() => handleFileClick('file')} className="p-3 text-on-surface-variant hover:text-primary transition-colors"><Paperclip className="w-5 h-5" /></button>
                  <button type="button" onClick={() => handleFileClick('image')} className="p-3 text-on-surface-variant hover:text-primary transition-colors"><ImageIcon className="w-5 h-5" /></button>
                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Зурвас бичих..." className="flex-grow bg-transparent border-none py-3 px-2 text-sm text-on-surface focus:ring-0 outline-none placeholder:text-outline/60" />
                  <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={cn("p-3 transition-colors", showEmojiPicker ? "text-primary" : "text-on-surface-variant hover:text-primary")}><Smile className="w-5 h-5" /></button>
                  <button type="submit" disabled={sending || !newMessage.trim()} className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"><Send className="w-6 h-6" /></button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-on-surface-variant text-sm">Харилцах хүнээ сонгоно уу.</div>
          )}
        </main>
      </div>
    </div>
  );
}
