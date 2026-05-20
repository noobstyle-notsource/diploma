import React, { useEffect, useState, useRef } from 'react';
import { Bell, ShoppingBag, MessageSquare, Info, CircleAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { notifications, type Notification } from '../lib/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function NotificationBell() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifs.filter(n => !n.read).length;

  const fetchNotifs = async () => {
    try {
      const data = await notifications.list();
      setNotifs(data);
    } catch (e) {
      console.warn('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReadAll = async () => {
    try {
      await notifications.readAll();
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag className="w-4 h-4 text-secondary" />;
      case 'MESSAGE': return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'SYSTEM': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'ESCROW': return <ShieldCheck className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-outline" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className={cn(
          "relative p-2 rounded-xl transition-all hover:bg-surface-container-high group",
          open ? "bg-surface-container-high text-primary" : "text-on-surface-variant"
        )}
      >
        <Bell className={cn("w-5 h-5", unreadCount > 0 && "animate-pulse")} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(129,212,220,0.8)] border border-background" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-surface border border-outline-variant/20 shadow-2xl overflow-hidden z-[100] rounded-3xl"
          >
            <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-highest">
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface">Мэдэгдлүүд</h3>
              {unreadCount > 0 && (
                <button onClick={handleReadAll} className="text-[10px] font-bold text-primary hover:underline">Бүгдийг уншсанаар тэмдэглэх</button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-2xl flex items-center justify-center mx-auto text-outline">
                    <Bell className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-on-surface-variant">Одоогоор мэдэгдэл байхгүй байна.</p>
                </div>
              ) : (
                <div className="divide-y divide-outline-variant/5">
                  {notifs.map((n) => (
                    <Link 
                      key={n.id} 
                      to={n.link || '#'} 
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex gap-4 p-4 transition-all hover:bg-surface-container-high relative group",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                      <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {getIcon(n.type)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-on-surface leading-tight">{n.title}</h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-outline font-medium block">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {notifs.length > 0 && (
              <Link 
                to="/notifications" 
                onClick={() => setOpen(false)}
                className="block p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-outline hover:text-primary transition-colors bg-surface-container-highest border-t border-outline-variant/10"
              >
                Бүх мэдэгдлийг харах
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
