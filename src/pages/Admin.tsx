import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Package, ShoppingCart, 
  ShieldAlert, Activity, ArrowUpRight, 
  Search, Filter, MoreVertical, CheckCircle, 
  Clock, XCircle, Terminal, RefreshCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { admin, type Order, type AuthUser } from '../lib/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userList, setUserList] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, o, u] = await Promise.all([
        admin.stats(),
        admin.orders(),
        admin.users()
      ]);
      setStats(s);
      setOrders(o);
      setUserList(u);
      setError(null);
    } catch (err: any) {
      setError(err.message === 'Administrative clearance required' ? 'ACCESS_DENIED' : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error === 'ACCESS_DENIED') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-display font-bold text-on-surface mb-4">Clearance Required</h2>
        <p className="text-on-surface-variant max-w-sm font-medium leading-relaxed mb-8">
          Your current neural signature does not have administrative clearance for this sector.
        </p>
        <button onClick={() => window.location.href = '/'} className="px-10 py-4 bg-primary text-on-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
          Evacuate Sector
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `₮${stats?.totalRevenue?.toLocaleString()}`, trend: '+12.5%', icon: BarChart3, color: 'text-primary' },
    { label: 'Total Deployments', value: stats?.totalOrders, trend: '+5.2%', icon: Activity, color: 'text-secondary' },
    { label: 'Registered Users', value: stats?.totalUsers, trend: '+0.8%', icon: Users, color: 'text-tertiary' },
    { label: 'Active Listings', value: stats?.activeListings, trend: '-2.1%', icon: Package, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant">Live Ops: Command Center</span>
          </div>
          <h1 className="text-headline-xl font-display font-bold text-on-surface">Nexus Control</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchData} className="p-3 bg-surface-container-high rounded-2xl text-on-surface hover:text-primary transition-all cursor-pointer">
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 bg-primary text-on-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            System Sync
          </button>
        </div>
      </div>

      {/* Admin Nav */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low border border-outline-variant/10 rounded-3xl mb-12 w-fit">
        {(['overview', 'orders', 'users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
              activeTab === tab 
                ? "bg-primary text-on-primary shadow-lg" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-[40px] border border-outline-variant/10 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <stat.icon className="w-16 h-16" />
                </div>
                <div className="relative z-10">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-surface-container-high", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant block mb-2">{stat.label}</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-display font-bold text-on-surface">{stat.value}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2 glass-surface rounded-[48px] border border-outline-variant/10 overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-on-surface">Critical Deployments</h3>
                <button onClick={() => setActiveTab('orders')} className="text-primary text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer">View Matrix</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-high/50 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                      <th className="px-8 py-6">Reference</th>
                      <th className="px-8 py-6">Operator/User</th>
                      <th className="px-8 py-6">Protocol</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {orders.slice(0, 5).map((order: any) => (
                      <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors group">
                        <td className="px-8 py-6 font-mono text-xs text-primary">{order.id.slice(0, 8)}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">{order.buyer_name}</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">to {order.seller_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-on-surface-variant">{order.product_title}</td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            order.status === 'COMPLETED' ? "bg-green-500/10 text-green-400" : 
                            order.status === 'PENDING' ? "bg-primary/10 text-primary" : "bg-yellow-500/10 text-yellow-400"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-display font-bold text-on-surface">₮{order.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Logs */}
            <div className="glass-card rounded-[48px] border border-outline-variant/10 p-8 flex flex-col shadow-2xl bg-black/40 backdrop-blur-3xl">
              <div className="flex items-center gap-3 mb-8">
                <Terminal className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-display font-bold text-on-surface">System Logs</h3>
              </div>
              <div className="flex-grow space-y-4 font-mono text-[11px] overflow-y-auto max-h-[400px] scrollbar-hide">
                <div className="text-primary/60">[SYSTEM] Neural synchronization complete.</div>
                <div className="text-green-500/80">[LIVE] Connected to Neon PostgreSQL Cluster.</div>
                <div className="text-green-500/80">[LIVE] Fetching latest deployment vectors...</div>
                {orders.slice(0, 5).map((order, i) => (
                  <div key={i} className="text-green-500/60 leading-relaxed">
                    [{new Date(order.created_at).toLocaleTimeString()}] NEW_ORDER: {order.id.slice(0, 8)} | ₮{order.total}
                  </div>
                ))}
                <div className="animate-pulse text-green-500">_ SYSTEM_IDLE_READY</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-surface rounded-[48px] border border-outline-variant/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-outline-variant/10">
            <h3 className="text-xl font-display font-bold text-on-surface">Master Deployment Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high/50 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                  <th className="px-8 py-6">ID</th>
                  <th className="px-8 py-6">Buyer</th>
                  <th className="px-8 py-6">Seller</th>
                  <th className="px-8 py-6">Service</th>
                  <th className="px-8 py-6 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors">
                    <td className="px-8 py-6 font-mono text-xs text-primary">{order.id.slice(0, 8)}</td>
                    <td className="px-8 py-6 text-sm font-bold text-on-surface">{order.buyer_name}</td>
                    <td className="px-8 py-6 text-sm font-bold text-on-surface">{order.seller_name}</td>
                    <td className="px-8 py-6 text-sm text-on-surface-variant">{order.product_title}</td>
                    <td className="px-8 py-6 text-right font-display font-bold text-on-surface">₮{order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userList.map((user) => (
            <div key={user.id} className="glass-card p-8 rounded-[40px] border border-outline-variant/10 hover:border-primary/20 transition-all group">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{user.username}</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{user.rank}</span>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-outline-variant/5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Email</span>
                  <span className="text-on-surface font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Balance</span>
                  <span className="text-primary font-bold">₮{user.balance?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Joined</span>
                  <span className="text-on-surface-variant">{new Date(user.created_at as any).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
