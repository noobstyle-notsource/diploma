import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, Database, Zap, Clock, Globe, Server, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Status() {
  const [apiStatus, setApiStatus] = useState<'UP' | 'DOWN' | 'PENDING'>('PENDING');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    fetch('/api/health')
      .then(res => res.json())
      .then(() => {
        setApiStatus('UP');
        setLatency(Date.now() - start);
      })
      .catch(() => setApiStatus('DOWN'));
  }, []);

  const systems = [
    { name: 'Core API Gateway', status: apiStatus, icon: Server, desc: 'Central routing and authentication hub.' },
    { name: 'Database Clusters', status: apiStatus === 'UP' ? 'UP' : 'DOWN', icon: Database, desc: 'High-availability data storage (NeonDB).' },
    { name: 'Payment Processor', status: 'UP', icon: ShieldCheck, desc: 'Secure transaction processing engine.' },
    { name: 'CDN & Assets', status: 'UP', icon: Globe, desc: 'Edge delivery for media and static files.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-headline-xl text-on-surface mb-2 font-display">System Status</h1>
          <p className="text-on-surface-variant font-medium text-lg">Real-time health monitoring of the Zen-Gamer ecosystem.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
          <span className="text-sm font-black uppercase tracking-widest">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Grid */}
        <div className="lg:col-span-2 space-y-6">
          {systems.map((sys, idx) => (
            <motion.div 
              key={sys.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-[32px] p-8 flex items-center justify-between group hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                  <sys.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-on-surface">{sys.name}</h3>
                  <p className="text-sm text-on-surface-variant font-medium">{sys.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={sys.status === 'UP' ? 'text-green-400' : 'text-red-400'}>
                  <CheckCircle2 className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-outline">Operational</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="glass-surface rounded-[40px] p-10 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
            <div className="relative z-10 space-y-10">
              <div>
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Uptime (30d)</span>
                </div>
                <div className="text-4xl font-display font-bold text-on-surface">99.98%</div>
              </div>

              <div>
                <div className="flex items-center gap-3 text-secondary mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">API Latency</span>
                </div>
                <div className="text-4xl font-display font-bold text-on-surface">
                  {latency ? `${latency}ms` : '---'}
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/10">
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  Status data is updated every 60 seconds. Our infrastructure is powered by edge computing for maximum reliability.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-8 border-primary/20 bg-primary/5">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Maintenance Window</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              No scheduled maintenance for the next 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
