import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Search, User, PlusCircle, LogIn, X, ShieldCheck } from 'lucide-react';

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
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
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
    <nav className="fixed top-0 w-full z-50 bg-surface-container/10 backdrop-blur-md border-b border-outline-variant/20">
      <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-display font-bold text-primary">
            Zen-Gamer
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-base transition-colors hover:text-primary font-medium",
                  location.pathname === link.path 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-on-surface-variant"
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
              placeholder="Search marketplace..."
              className="bg-surface-container-highest/30 border border-transparent rounded-full py-2.5 px-12 text-sm w-48 focus:w-80 focus:ring-1 focus:ring-primary focus:bg-surface-container-highest focus:border-primary/20 outline-none transition-all shadow-inner"
            />
            {search && (
              <button 
                type="button" 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
          
          <div className="flex items-center gap-4 border-l border-outline-variant/20 pl-6">
            {loggedIn ? (
              <>
                {userRole === 'admin' && (
                  <Link to="/admin" className="hidden lg:flex items-center gap-2 text-primary hover:brightness-110 transition-all text-sm font-bold uppercase tracking-widest mr-2">
                    <ShieldCheck className="w-5 h-5" /> Admin
                  </Link>
                )}
                <Link to="/seller/add" className="hidden lg:flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                  <PlusCircle className="w-5 h-5" /> Sell
                </Link>



                <Link to="/messages" className="text-on-surface-variant hover:text-primary transition-colors relative">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(129,212,220,0.8)]" />
                  )}
                </Link>
                
                <NotificationBell />

                <Link to="/profile" className="w-9 h-9 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center hover:border-primary transition-all">
                  <User className="w-5 h-5 text-on-surface-variant" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                  <LogIn className="w-5 h-5" /> Login
                </Link>
                <Link to="/register" className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
