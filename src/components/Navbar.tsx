import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Search, User, PlusCircle, LogIn, X, ShieldCheck, Wallet } from 'lucide-react';

import { cn } from '../lib/utils';
import { isLoggedIn, conversations } from '../lib/api';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const token = localStorage.getItem('zg_token');
  const userRole = token ? JSON.parse(atob(token.split('.')[1]))?.role : null;
  const [search, setSearch] = useState('');

  const [unreadCount, setUnreadCount] = useState(0);

  const navLinks = [
    { name: 'Үйлчилгээ', path: '/services' },
    { name: 'Бүтээгдэхүүн', path: '/products' },
  ];

  useEffect(() => {
    if (!loggedIn) return;
    
    const checkUnread = () => {
      conversations.list().then(data => {
        const total = data.reduce((acc, chat) => acc + Number(chat.unread || 0), 0);
        setUnreadCount(total);
      }).catch(() => {});
    };

    checkUnread();
    const interval = setInterval(checkUnread, 60000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/services?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container/40 backdrop-blur-2xl border-b border-primary/20 shadow-[0_4px_30px_rgba(0,255,204,0.15)]">
      <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-display font-black text-gradient-cyber tracking-wider hover:scale-105 transition-transform">
            ZEN-GAMER
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-primary",
                  location.pathname === link.path 
                    ? "text-primary border-b-2 border-primary pb-1 drop-shadow-[0_0_12px_rgba(0,255,204,0.8)]" 
                    : "text-on-surface-variant hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.4)]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative hidden lg:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Хайх..."
              className="bg-surface-container-highest/40 border border-primary/20 rounded-full py-2.5 px-12 text-sm w-48 focus:w-80 focus:ring-2 focus:ring-primary focus:bg-surface-container-highest focus:border-primary outline-none transition-all shadow-[0_0_15px_rgba(0,255,204,0.05)] focus:shadow-[0_0_25px_rgba(0,255,204,0.2)]"
            />
            {search && (
              <button 
                type="button" 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
          
          <div className="flex items-center gap-6 border-l border-outline-variant/40 pl-6">
            {loggedIn ? (
              <>
                {(userRole === 'admin' || userRole === 'owner' || userRole === 'moderator') && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-primary hover:drop-shadow-[0_0_12px_rgba(0,255,204,0.8)] transition-all text-xs font-black uppercase tracking-widest mr-2">
                    <ShieldCheck className="w-4 h-4" /> Админ
                  </Link>
                )}
                <Link to="/seller/add" className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all text-xs font-black uppercase tracking-widest mr-2">
                  <PlusCircle className="w-4 h-4" /> Нийтлэх
                </Link>

                <Link to="/wallet" className="text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all relative mr-1" title="Хэтэвч">
                  <Wallet className="w-5 h-5" />
                </Link>

                <Link to="/messages" className="text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all relative">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(0,255,204,1)]" />
                  )}
                </Link>
                
                <NotificationBell />

                <Link to="/profile" className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-primary/30 flex items-center justify-center hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:scale-105 transition-all">
                  <User className="w-5 h-5 text-on-surface" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all text-xs font-black uppercase tracking-widest">
                  <LogIn className="w-4 h-4" /> Нэвтрэх
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:shadow-[0_0_35px_rgba(0,255,204,0.7)] hover:scale-105 active:scale-95 transition-all">
                  Бүртгүүлэх
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
