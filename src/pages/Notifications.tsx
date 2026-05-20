import React, { useEffect, useState } from 'react';
import { notifications, type Notification } from '../lib/api';
import { Bell, ShoppingBag, MessageSquare, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notifications.list().then(data => {
      setNotifs(data);
      setLoading(false);
      // Auto read all when opened
      notifications.readAll().catch(() => {});
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <ShoppingBag className="w-5 h-5 text-secondary" />;
      case 'MESSAGE': return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'SYSTEM': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'ESCROW': return <ShieldCheck className="w-5 h-5 text-yellow-400" />;
      default: return <Bell className="w-5 h-5 text-outline" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,204,0.2)]">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-headline-xl text-on-surface font-display">Мэдэгдлүүд</h1>
          <p className="text-sm text-on-surface-variant">Системийн болон гүйлгээний сүүлийн 20 мэдэгдэл</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant">Уншиж байна...</div>
        ) : notifs.length === 0 ? (
          <div className="bg-surface rounded-[32px] py-20 text-center text-on-surface-variant border border-outline-variant/10">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Одоогоор мэдэгдэл байхгүй байна.</p>
          </div>
        ) : (
          notifs.map((n, idx) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={n.link || '#'}
                className={cn(
                  "flex gap-6 p-6 rounded-3xl bg-surface-container-low transition-all hover:bg-surface-container-high border border-outline-variant/10 hover:border-primary/20 group",
                  !n.read && "bg-primary/10"
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {getIcon(n.type)}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-on-surface">{n.title}</h4>
                    <span className="flex items-center gap-1 text-[10px] text-on-surface-variant font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{n.message}</p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
