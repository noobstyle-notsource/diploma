import React, { useEffect, useState } from 'react';
import { ShoppingBag, Calendar, ArrowRight, Tag, Clock, AlertCircle, ShieldCheck, Key, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { orders, auth, escrow, isLoggedIn, type Order, type EscrowTrade } from '../lib/api';
import { cn } from '../lib/utils';

export default function Orders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'escrow'>('orders');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [escrowTrades, setEscrowTrades] = useState<EscrowTrade[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [credsInput, setCredsInput] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const [oData, eData, me] = await Promise.all([
          orders.list(),
          escrow.list().catch(() => []),
          auth.me().catch(() => null)
        ]);
        setUserOrders(oData);
        setEscrowTrades(eData);
        setCurrentUser(me);
      } catch (err: any) {
        setError(err.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleSubmitCreds = async (id: string) => {
    const creds = credsInput[id];
    if (!creds?.trim()) { alert('Дансны мэдээллээ оруулна уу'); return; }
    try {
      await escrow.submitCreds(id, creds);
      setEscrowTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'PENDING_MIDDLEMAN_VERIFICATION', account_credentials: creds } : t));
      alert('Мэдээллийг дундын дансны зохицуулагчид амжилттай илгээлээ!');
    } catch (err: any) { alert(err.message || 'Failed to submit credentials'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-headline-xl text-on-surface mb-2">Захиалга & Дундын данс</h1>
          <p className="text-on-surface-variant font-medium text-lg">Өөрийн захиалгууд болон дундын дансны гүйлгээгээ хянах, удирдах.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-high/50 px-6 py-3 rounded-2xl border border-outline-variant/20">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <span className="text-lg font-display font-bold text-on-surface">{userOrders.length + escrowTrades.length} Нийт гүйлгээ</span>
        </div>
      </div>

      {error && (
        <div className="mb-10 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-6 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low border border-outline-variant/10 rounded-3xl mb-12 w-fit">
        {(['orders', 'escrow'] as const).map((tab) => (
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
            {tab === 'escrow' ? 'Дундын дансны гүйлгээ' : 'Шууд захиалгууд'}
          </button>
        ))}
      </div>

      {activeTab === 'orders' && (
        userOrders.length === 0 ? (
          <div className="glass-surface rounded-[40px] p-20 text-center space-y-8 border-outline-variant/10 shadow-2xl">
            <div className="w-24 h-24 bg-surface-container-high rounded-[32px] flex items-center justify-center mx-auto shadow-xl">
              <ShoppingBag className="w-10 h-10 text-outline" />
            </div>
            <div className="space-y-2">
              <h3 className="text-headline-md text-on-surface">Захиалга олдсонгүй</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto">Таны захиалгын түүх хоосон байна. Эхний захиалгаа хийгээд эндээс хянаарай.</p>
            </div>
            <button onClick={() => navigate('/services')} className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer">
              Үйлчилгээнүүд үзэх
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userOrders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-[32px] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all border-outline-variant/5 hover:bg-surface-container-high/30"
              >
                <div className="flex items-center gap-8 w-full lg:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{order.status}</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">#{order.id.slice(0, 8)}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-on-surface group-hover:text-primary transition-colors">
                      {order.product_title || 'Zen Үйлчилгээ'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-outline" />
                        Түвшин: {order.tier}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-outline" />
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-12 w-full lg:w-auto border-t lg:border-t-0 border-outline-variant/10 pt-6 lg:pt-0">
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-secondary">₮{order.total.toLocaleString()}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-outline mt-1">Нийт үнэ</div>
                  </div>
                  
                  <Link 
                    to={`/services/${order.product_id}`} 
                    className="p-4 bg-surface-container-high rounded-2xl text-on-surface hover:bg-primary hover:text-on-primary transition-all shadow-lg active:scale-95 cursor-pointer"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {activeTab === 'escrow' && (
        <div className="space-y-8">
          <div className="glass-card rounded-[48px] border border-outline-variant/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">Миний дундын дансны гүйлгээнүүд</h3>
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                Дундын дансны найдвартай гүйлгээгээ хянах. Худалдан авагч мөнгөө байршуулж, худалдагч дансны мэдээллээ оруулж шалгуулна.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-6 py-3 rounded-2xl text-yellow-400 text-xs font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Дундын дансаар хамгаалагдсан
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {escrowTrades.length === 0 ? (
              <div className="glass-surface rounded-[40px] p-16 text-center border border-outline-variant/10">
                <ShieldCheck className="w-12 h-12 text-outline mx-auto mb-4 opacity-40" />
                <h4 className="text-lg font-bold text-on-surface mb-2">Дундын дансны гүйлгээ олдсонгүй</h4>
                <p className="text-xs text-on-surface-variant">Танд идэвхтэй эсвэл өмнөх дундын дансны гүйлгээ байхгүй байна.</p>
              </div>
            ) : (
              escrowTrades.map((trade) => {
                const isBuyer = trade.buyer_id === currentUser?.id;
                const isSeller = trade.seller_id === currentUser?.id;

                return (
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
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                            isBuyer ? "bg-secondary/10 text-secondary" : "bg-purple-500/10 text-purple-400"
                          )}>
                            {isBuyer ? 'ХУДАЛДАН АВАГЧ' : 'ХУДАЛДАГЧ'}
                          </span>
                        </div>
                        <h4 className="text-lg font-display font-bold text-on-surface">{trade.product_title}</h4>
                        <div className="text-xs text-on-surface-variant mt-1">
                          Худалдан авагч: <span className="text-on-surface font-bold">{trade.buyer_name}</span> | Худалдагч: <span className="text-on-surface font-bold">{trade.seller_name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-on-surface-variant block mb-1">Дундын дансан дахь дүн</span>
                        <span className="text-2xl font-display font-bold text-primary">₮{trade.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {isSeller && trade.status === 'PENDING_SELLER_CREDS' && (
                      <div className="bg-surface-container-high/60 border border-outline-variant/10 rounded-3xl p-6 mb-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-400">
                          <Key className="w-4 h-4" /> Шаардлагатай үйлдэл: Дансны мэдээллээ оруулах
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          Нэвтрэх нэр, нууц үг болон бусад шаардлагатай зааврыг оруулна уу. Эдгээрийг дундын дансны зохицуулагч шалгах болно.
                        </p>
                        <textarea
                          rows={4}
                          value={credsInput[trade.id] || ''}
                          onChange={e => setCredsInput({ ...credsInput, [trade.id]: e.target.value })}
                          placeholder="Нэвтрэх нэр: elite_gamer&#10;Нууц үг: ********&#10;Нэмэлт: Steam-ээр нэвтэрнэ..."
                          className="w-full bg-black/50 border border-outline-variant/20 rounded-2xl py-4 px-6 text-xs font-mono text-primary focus:border-primary outline-none transition-all resize-none"
                        />
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => handleSubmitCreds(trade.id)}
                            className="px-8 py-3 bg-primary text-on-primary font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            Мэдээллийг дундын дансанд илгээх
                          </button>
                        </div>
                      </div>
                    )}

                    {isBuyer && trade.status === 'PENDING_SELLER_CREDS' && (
                      <div className="bg-surface-container-high/40 border border-outline-variant/5 rounded-3xl p-6 text-xs text-on-surface-variant flex items-center gap-3 font-medium">
                        <Clock className="w-5 h-5 text-primary animate-pulse flex-shrink-0" /> Худалдагч дансны мэдээллээ оруулахыг хүлээж байна.
                      </div>
                    )}

                    {trade.status === 'PENDING_MIDDLEMAN_VERIFICATION' && (
                      <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-3xl p-6 text-xs text-yellow-400 flex items-center gap-3 font-medium">
                        <ShieldCheck className="w-5 h-5 animate-pulse flex-shrink-0" /> Мэдээлэл илгээгдсэн. Дундын дансны зохицуулагч бүртгэлийг шалгаж байна.
                      </div>
                    )}

                    {trade.status === 'COMPLETED' && (
                      <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-6 space-y-3 text-xs text-green-400 font-medium">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 flex-shrink-0" /> Гүйлгээг дундын дансны зохицуулагч амжилттай баталгаажууллаа.
                        </div>
                        {isBuyer && trade.account_credentials && (
                          <div className="bg-black/50 p-4 rounded-2xl font-mono text-xs text-primary border border-primary/20 whitespace-pre-wrap select-all mt-2">
                            <div className="text-[10px] text-outline uppercase tracking-widest mb-1">Баталгаажсан дансны мэдээлэл:</div>
                            {trade.account_credentials}
                          </div>
                        )}
                      </div>
                    )}

                    {trade.status === 'CANCELLED' && (
                      <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 text-xs text-red-400 flex items-center gap-3 font-medium">
                        <XCircle className="w-5 h-5 flex-shrink-0" /> Гүйлгээг цуцаллаа. Дундын дансан дахь мөнгийг худалдан авагчийн үлдэгдэлд буцаав.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
