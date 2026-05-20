import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Package, ShoppingCart, 
  ShieldAlert, Activity, ArrowUpRight, 
  Search, Filter, MoreVertical, CheckCircle, 
  Clock, XCircle, Terminal, RefreshCcw, ShieldCheck, Key
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { admin, auth, escrow, withdrawals, type Order, type AuthUser, type EscrowTrade, type Withdrawal } from '../lib/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'escrow' | 'withdrawals'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userList, setUserList] = useState<AuthUser[]>([]);
  const [escrowTrades, setEscrowTrades] = useState<EscrowTrade[]>([]);
  const [withdrawList, setWithdrawList] = useState<Withdrawal[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, o, u, me, esc, w] = await Promise.all([
        admin.stats(),
        admin.orders(),
        admin.users(),
        auth.me().catch(() => null),
        escrow.list().catch(() => []),
        withdrawals.list().catch(() => [])
      ]);
      setStats(s);
      setOrders(o);
      setUserList(u);
      setCurrentUser(me);
      setEscrowTrades(esc);
      setWithdrawList(w);
      setError(null);
    } catch (err: any) {
      setError(err.message === 'Administrative clearance required' || err.message === 'Admin access restricted' ? 'ACCESS_DENIED' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetRank = async (userId: string, newRank: 'OPERATOR' | 'moderator' | 'admin' | 'BANNED') => {
    try {
      const res = await admin.setRank(userId, newRank);
      setUserList(prev => prev.map(u => u.id === userId ? { ...u, rank: res.rank } : u));
    } catch (err: any) {
      alert(err.message || 'Failed to update rank');
    }
  };

  const handleVerifyEscrow = async (id: string) => {
    if (!window.confirm('Та энэ гүйлгээг баталгаажуулж, төлбөрийг борлуулагч руу шилжүүлэхдээ итгэлтэй байна уу?')) return;
    try {
      await escrow.verify(id);
      setEscrowTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'COMPLETED' } : t));
      alert('✅ Данс солилцоо баталгаажиж, төлбөр борлуулагч руу шилжлээ!');
    } catch (err: any) { alert(err.message || 'Failed to verify trade'); }
  };

  const handleCancelEscrow = async (id: string) => {
    if (!window.confirm('Та энэ гүйлгээг цуцлаж, мөнгийг худалдан авагчид буцаахдаа итгэлтэй байна уу?')) return;
    try {
      await escrow.cancel(id);
      setEscrowTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'CANCELLED' } : t));
      alert('❌ Данс солилцоо цуцлагдаж, төлбөр худалдан авагч руу буцлаа!');
    } catch (err: any) { alert(err.message || 'Failed to cancel trade'); }
  };

  const handleApproveWithdrawal = async (id: string) => {
    if (!window.confirm('Та энэ татан авалтын хүсэлтийг зөвшөөрч, шилжүүлэг хийсэн гэдгээ баталгаажуулж байна уу?')) return;
    try {
      await withdrawals.approve(id);
      setWithdrawList(prev => prev.map(w => w.id === id ? { ...w, status: 'COMPLETED' } : w));
      alert('✅ Татан авалт амжилттай баталгаажлаа!');
    } catch (err: any) { alert(err.message || 'Failed to approve withdrawal'); }
  };

  const handleRejectWithdrawal = async (id: string) => {
    if (!window.confirm('Та энэ татан авалтын хүсэлтийг цуцлахдаа итгэлтэй байна уу? Баланс нь буцаж орох болно.')) return;
    try {
      await withdrawals.reject(id);
      setWithdrawList(prev => prev.map(w => w.id === id ? { ...w, status: 'CANCELLED' } : w));
      alert('❌ Татан авалт цуцлагдаж, баланс нь буцаж орлоо!');
    } catch (err: any) { alert(err.message || 'Failed to reject withdrawal'); }
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
        <h2 className="text-3xl font-display font-bold text-on-surface mb-4">Эрх хүрэлцэхгүй байна</h2>
        <p className="text-on-surface-variant max-w-sm font-medium leading-relaxed mb-8">
          Таны бүртгэлд энэ хэсэгт нэвтрэх админы эрх байхгүй байна.
        </p>
        <button onClick={() => window.location.href = '/'} className="px-10 py-4 bg-primary text-on-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
          Буцах
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
    { label: 'Нийт орлого', value: `₮${stats?.totalRevenue?.toLocaleString()}`, trend: '+12.5%', icon: BarChart3, color: 'text-primary' },
    { label: 'Нийт захиалга', value: stats?.totalOrders, trend: '+5.2%', icon: Activity, color: 'text-secondary' },
    { label: 'Бүртгэлтэй хэрэглэгчид', value: stats?.totalUsers, trend: '+0.8%', icon: Users, color: 'text-tertiary' },
    { label: 'Идэвхтэй зарууд', value: stats?.activeListings, trend: '-2.1%', icon: Package, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(239,68,68,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant">Удирдлагын төв</span>
          </div>
          <h1 className="text-headline-xl font-display font-bold text-on-surface">Админ самбар</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchData} className="p-3 bg-surface-container-high rounded-2xl text-on-surface hover:text-primary transition-all cursor-pointer">
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button className="px-6 py-3 bg-primary text-on-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
            Систем шинэчлэх
          </button>
        </div>
      </div>

      {/* Admin Nav */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low border border-outline-variant/10 rounded-3xl mb-12 w-fit">
        {(['overview', 'orders', 'users', 'escrow', 'withdrawals'] as const).map((tab) => (
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
            {tab === 'overview' ? 'Тойм' : tab === 'orders' ? 'Захиалгууд' : tab === 'users' ? 'Хэрэглэгчид' : tab === 'escrow' ? 'Данс солилцоо (Escrow)' : 'Татан авалтууд'}
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
                <h3 className="text-xl font-display font-bold text-on-surface">Сүүлийн захиалгууд</h3>
                <button onClick={() => setActiveTab('orders')} className="text-primary text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer">Бүгдийг үзэх</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-high/50 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                      <th className="px-8 py-6">Код</th>
                      <th className="px-8 py-6">Хэрэглэгч</th>
                      <th className="px-8 py-6">Үйлчилгээ</th>
                      <th className="px-8 py-6">Төлөв</th>
                      <th className="px-8 py-6 text-right">Дүн</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {orders.slice(0, 5).map((order: any) => (
                      <tr key={order.id} className="hover:bg-surface-container-high/30 transition-colors group">
                        <td className="px-8 py-6 font-mono text-xs text-primary">{order.id.slice(0, 8)}</td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">{order.buyer_name}</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">➔ {order.seller_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-on-surface-variant">{order.product_title}</td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            order.status === 'COMPLETED' ? "bg-green-50-500/10 text-green-400" : 
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
                <h3 className="text-xl font-display font-bold text-on-surface">Системийн лог</h3>
              </div>
              <div className="flex-grow space-y-4 font-mono text-[11px] overflow-y-auto max-h-[400px] scrollbar-hide">
                <div className="text-primary/60">[СИСТЕМ] Систем амжилттай шинэчлэгдлээ.</div>
                <div className="text-green-500/80">[СИСТЕМ] NeonDB өгөгдлийн сантай холбогдсон.</div>
                <div className="text-green-500/80">[СИСТЕМ] Сүүлийн өгөгдлүүдийг татаж байна...</div>
                {orders.slice(0, 5).map((order, i) => (
                  <div key={i} className="text-green-500/60 leading-relaxed">
                    [{new Date(order.created_at).toLocaleTimeString()}] ШИНЭ_ЗАХИАЛГА: {order.id.slice(0, 8)} | ₮{order.total}
                  </div>
                ))}
                <div className="animate-pulse text-green-500">_ СИСТЕМ_БЭЛЭН</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-surface rounded-[48px] border border-outline-variant/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-outline-variant/10">
            <h3 className="text-xl font-display font-bold text-on-surface">Бүх захиалгын жагсаалт</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-high/50 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                  <th className="px-8 py-6">ID</th>
                  <th className="px-8 py-6">Худалдан авагч</th>
                  <th className="px-8 py-6">Борлуулагч</th>
                  <th className="px-8 py-6">Үйлчилгээ</th>
                  <th className="px-8 py-6 text-right">Дүн</th>
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
      {activeTab === 'escrow' && (
        <div className="space-y-8">
          <div className="glass-card rounded-[48px] border border-outline-variant/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">Данс солилцоо (Escrow) хяналт</h3>
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                Админ эсвэл модератор нь дундын баталгаа гаргагч болно. Борлуулагчийн оруулсан дансны мэдээллийг шалгаж, зөв бол баталгаажуулан төлбөрийг борлуулагчид шилжүүлнэ.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl text-primary text-xs font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Escrow идэвхтэй
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {escrowTrades.length === 0 ? (
              <div className="glass-surface rounded-[40px] p-16 text-center border border-outline-variant/10">
                <Key className="w-12 h-12 text-outline mx-auto mb-4 opacity-40" />
                <h4 className="text-lg font-bold text-on-surface mb-2">Идэвхтэй данс солилцоо байхгүй байна</h4>
                <p className="text-xs text-on-surface-variant">Бүх данс солилцооны гүйлгээ шалгагдаж дууссан байна.</p>
              </div>
            ) : (
              escrowTrades.map((trade) => (
                <div key={trade.id} className="glass-card rounded-[40px] border border-outline-variant/10 p-8 shadow-2xl relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 pb-6 border-b border-outline-variant/5">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-primary font-bold">#{trade.id.slice(0, 8)}</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          trade.status === 'COMPLETED' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                          trade.status === 'CANCELLED' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          trade.status === 'PENDING_MIDDLEMAN_VERIFICATION' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse" :
                          "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {trade.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-display font-bold text-on-surface">{trade.product_title}</h4>
                      <div className="text-xs text-on-surface-variant mt-1">
                        Худалдан авагч: <span className="text-on-surface font-bold">{trade.buyer_name}</span> | Борлуулагч: <span className="text-on-surface font-bold">{trade.seller_name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-on-surface-variant block mb-1">Хүлээгдэж буй дүн</span>
                      <span className="text-2xl font-display font-bold text-primary">₮{trade.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {(trade.status === 'PENDING_MIDDLEMAN_VERIFICATION' || trade.status === 'PENDING_SELLER_CREDS') && (
                    <div className="bg-surface-container-high/60 border border-outline-variant/10 rounded-3xl p-6 mb-6 space-y-4">
                      {trade.status === 'PENDING_SELLER_CREDS' && (
                        <div className="text-xs text-yellow-500 font-bold bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                          ⚠️ Борлуулагч одоогоор системд дансны мэдээллээ оруулаагүй байна (Чатаар илгээсэн байж магадгүй).
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-400">
                        <Key className="w-4 h-4" /> Борлуулагчийн илгээсэн дансны мэдээлэл:
                      </div>
                      <div className="bg-black/50 p-4 rounded-2xl font-mono text-xs text-primary border border-primary/20 whitespace-pre-wrap select-all">
                        {trade.account_credentials || 'Мэдээлэл оруулаагүй байна.'}
                      </div>
                      <div className="flex flex-wrap gap-4 justify-end pt-2">
                        <button
                          onClick={() => handleCancelEscrow(trade.id)}
                          className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          Цуцлах & Буцаалт хийх
                        </button>
                        <button
                          onClick={() => handleVerifyEscrow(trade.id)}
                          className="px-8 py-3 bg-green-500 text-black font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Баталгаажуулах & Төлбөр шилжүүлэх
                        </button>
                      </div>
                    </div>
                  )}

                  {trade.status === 'COMPLETED' && (
                    <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-6 text-xs text-green-400 flex items-center gap-3 font-medium">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" /> Гүйлгээг админ баталгаажуулж, төлбөр борлуулагчийн дансанд орлоо.
                    </div>
                  )}

                  {trade.status === 'CANCELLED' && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 text-xs text-red-400 flex items-center gap-3 font-medium">
                      <XCircle className="w-5 h-5 flex-shrink-0" /> Гүйлгээг админ цуцалж, төлбөр худалдан авагчийн дансанд буцлаа.
                    </div>
                  )}
                </div>
              ))
            )}
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
                <div className="flex-grow">
                  <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{user.username}</h4>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest", 
                    user.rank === 'BANNED' ? "text-red-500" : 
                    user.rank === 'moderator' ? "text-yellow-400" :
                    user.rank === 'admin' ? "text-primary" : "text-on-surface-variant"
                  )}>{user.rank}</span>
                </div>
                <button 
                  onClick={() => window.location.href = `/profile/${user.id}`}
                  className="p-2.5 bg-surface-container-high rounded-xl text-on-surface hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                  title="View Profile"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 pt-4 border-t border-outline-variant/5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">И-мэйл</span>
                  <span className="text-on-surface font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Үлдэгдэл</span>
                  <span className="text-primary font-bold">₮{user.balance?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Бүртгүүлсэн</span>
                  <span className="text-on-surface-variant">{new Date(user.created_at as any).toLocaleDateString()}</span>
                </div>

                {(currentUser?.rank === 'owner' || currentUser?.rank === 'admin') && user.rank !== 'owner' && (
                  <div className="pt-4 border-t border-outline-variant/10 flex flex-wrap gap-2 mt-4 justify-end items-center">
                    {user.rank === 'BANNED' ? (
                      <button 
                        onClick={() => handleSetRank(user.id, 'OPERATOR')}
                        className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all cursor-pointer"
                      >
                        Бан салгах
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleSetRank(user.id, 'BANNED')}
                          className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          Бандах
                        </button>
                        
                        {user.rank === 'moderator' ? (
                          <button 
                            onClick={() => handleSetRank(user.id, 'OPERATOR')}
                            className="px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all cursor-pointer"
                          >
                            Мод бууруулах
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleSetRank(user.id, 'moderator')}
                            className="px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all cursor-pointer"
                          >
                            Мод болгох
                          </button>
                        )}

                        {currentUser.rank === 'owner' && (
                          user.rank === 'admin' ? (
                            <button 
                              onClick={() => handleSetRank(user.id, 'OPERATOR')}
                              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                            >
                              Админ бууруулах
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleSetRank(user.id, 'admin')}
                              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                            >
                              Админ болгох
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="space-y-8">
          <div className="glass-card rounded-[48px] border border-outline-variant/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">Татан авалтын хүсэлтүүд</h3>
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                Хэрэглэгчдийн балансаас мөнгө татах хүсэлтүүд энд харагдана. Та банкны шилжүүлгийг хийж дууссаны дараа <strong>Шилжүүлсэн</strong> товчийг дарж хүсэлтийг COMPLETED болгоно. Хэрэв цуцалбал мөнгийг хэрэглэгчийн баланс руу буцаах болно.
              </p>
            </div>
          </div>

          <div className="glass-surface rounded-[48px] border border-outline-variant/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high/50 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
                    <th className="px-8 py-6">Хүсэлт ID</th>
                    <th className="px-8 py-6">Хэрэглэгч (ID)</th>
                    <th className="px-8 py-6">Банк</th>
                    <th className="px-8 py-6">Данс</th>
                    <th className="px-8 py-6">Дансны нэр</th>
                    <th className="px-8 py-6">Дүн</th>
                    <th className="px-8 py-6">Огноо</th>
                    <th className="px-8 py-6">Төлөв</th>
                    <th className="px-8 py-6 text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {withdrawList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-8 py-16 text-center text-xs text-on-surface-variant">
                        Татан авалтын хүсэлт одоогоор байхгүй байна.
                      </td>
                    </tr>
                  ) : (
                    withdrawList.map((withdraw) => {
                      const user = userList.find(u => u.id === withdraw.user_id);
                      return (
                        <tr key={withdraw.id} className="hover:bg-surface-container-high/30 transition-colors group text-xs">
                          <td className="px-8 py-6 font-mono text-primary font-bold">#{withdraw.id.slice(0, 8)}</td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface">{user ? user.username : 'Тодорхойгүй'}</span>
                              <span className="text-[10px] text-on-surface-variant font-mono">{withdraw.user_id.slice(0, 8)}...</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-on-surface font-medium">{withdraw.bank_name}</td>
                          <td className="px-8 py-6 font-mono text-on-surface">{withdraw.account_number}</td>
                          <td className="px-8 py-6 text-on-surface font-medium">{withdraw.account_holder}</td>
                          <td className="px-8 py-6 font-display font-bold text-primary text-sm">₮{withdraw.amount.toLocaleString()}</td>
                          <td className="px-8 py-6 text-on-surface-variant">{new Date(withdraw.created_at).toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              withdraw.status === 'COMPLETED' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                              withdraw.status === 'CANCELLED' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse"
                            )}>
                              {withdraw.status === 'PENDING' ? 'Хүлээгдэж буй' : 
                               withdraw.status === 'COMPLETED' ? 'Шилжүүлсэн' : 'Цуцлагдсан'}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            {withdraw.status === 'PENDING' && (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleRejectWithdrawal(withdraw.id)}
                                  className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                >
                                  Цуцлах
                                </button>
                                <button
                                  onClick={() => handleApproveWithdrawal(withdraw.id)}
                                  className="px-3 py-1.5 bg-green-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                  Шилжүүлсэн
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
