import React, { useEffect, useState } from 'react';
import { 
  Settings, ShoppingBag, ShieldCheck, Clock, CreditCard, LogOut, Edit, Mail, Trophy, AlertCircle, Calendar, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { auth, orders, users, products, clearToken, type AuthUser, type Order } from '../lib/api';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwnProfile = !id;

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isOwnProfile) {
        // Fetch everything, but catch individual errors for debugging
        const me = await auth.me();
        setUser(me);
        
        try {
          const ords = await orders.list();
          setUserOrders(ords);
        } catch (e: any) { console.warn('Order fetch failed:', e); }

        try {
          const prods = await products.mine();
          setMyProducts(prods);
        } catch (e: any) { 
          console.error('Product fetch failed:', e);
          setError(`Product Error: ${e.message}`);
        }
      } else {
        const u = await users.get(id!);
        setUser(u);
        setUserOrders([]); 
        setMyProducts([]);
      }
    } catch (e: any) {
      setError(e.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, isOwnProfile]);

  const handleRefresh = () => {
    fetchData().then(() => {
      alert(`Мэдээлэл шинэчлэгдлээ! Таны бүртгэлд ${myProducts.length} үйлчилгээ байна.`);
    });
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!window.confirm('Та энэ үйлчилгээг устгахдаа итгэлтэй байна уу?')) return;
    try {
      await products.delete(prodId);
      setMyProducts(prev => prev.filter(p => p.id !== prodId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };


  const stats = isOwnProfile ? [
    { label: 'Захиалга', value: String(userOrders.length), icon: ShoppingBag },
    { label: 'Зэрэг', value: user?.rank ?? '—', icon: Trophy },
    { label: 'Баталгаажилт', value: 'Идэвхтэй', icon: ShieldCheck },
  ] : [
    { label: 'Зэрэг', value: user?.rank ?? '—', icon: Trophy },
    { label: 'Нэгдсэн огноо', value: String(new Date(user?.created_at ?? Date.now()).getFullYear()), icon: Calendar },
    { label: 'Баталгаажилт', value: 'Баталгаажсан', icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-on-surface-variant">{error || 'Профайлаа үзэхийн тулд нэвтэрнэ үү.'}</p>
        <button onClick={() => navigate('/login')} className="mt-6 bg-primary text-on-primary px-8 py-3 rounded-xl font-bold text-sm">
          Нэвтрэх
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-surface rounded-3xl p-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-60" />
            
            <div className="relative inline-block mb-6">
              {user.avatar && user.avatar.length > 0 ? (
                <img src={user.avatar} className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-2 border-primary/20" alt={user.username} />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary shadow-2xl border-2 border-primary/20">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-xl border-4 border-background text-on-primary hover:scale-110 active:scale-95 transition-all shadow-lg">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <h2 className="text-headline-md text-on-surface mb-1">{user.username}</h2>
            <p className="text-sm font-medium text-on-surface-variant mb-6">{user.email}</p>
            
            <div className="flex gap-3 justify-center mb-10">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {user.rank}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full flex items-center justify-between p-4 bg-surface-container-high rounded-2xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-on-surface text-left">Нэгдсэн огноо</span>
                </div>
                <span className="text-lg font-display font-bold text-secondary">{new Date(user.created_at).getFullYear()}</span>
              </div>
              
              {isOwnProfile && (
                <>
                  <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 p-4 hover:bg-surface-container-high/50 text-on-surface-variant hover:text-on-surface rounded-2xl transition-all group">
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                    <span className="text-sm font-bold text-left">Бүртгэлийн тохиргоо</span>
                  </button>
                  
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-bold text-left">Гарах</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>

          <div className="glass-card rounded-3xl p-8 border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-label-md text-primary">Системийн мэдээлэл</h3>
              <button onClick={handleRefresh} className="p-1 hover:bg-primary/10 rounded-lg transition-all text-primary">
                <Clock className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-[10px] break-all">
              <div className="flex flex-col gap-1">
                <span className="text-outline uppercase">Идэвхтэй ID</span>
                <span className="text-on-surface bg-surface-container-high/50 p-2 rounded-lg">{user.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-outline-variant/10">
                <span className="text-outline uppercase">Таны үйлчилгээнүүд</span>
                <span className="text-secondary font-bold text-sm">{myProducts.length}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border-outline-variant/10">
            <h3 className="text-label-md text-primary mb-6">Аюулгүй байдал</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-outline-variant">
                <AlertCircle className="w-5 h-5 text-yellow-500/50" /> 2 алхамт баталгаажилт (WIP)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-outline-variant">
                <AlertCircle className="w-5 h-5 text-yellow-500/50" /> И-мэйл баталгаажилт (WIP)
              </div>
              <div className="text-[10px] text-yellow-500/70 uppercase tracking-widest mt-4">
                * Хөгжүүлэгдэж байна
              </div>
            </div>
          </div>

        </aside>

        {/* Main Content */}
        <main className="lg:col-span-8 space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-8 border-outline-variant/10 group hover:border-primary/20 transition-all">
                <stat.icon className="w-6 h-6 text-primary mb-4" />
                <div className="text-3xl font-display font-bold text-on-surface mb-1">{stat.value}</div>
                <div className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          {user.bio && (
            <section className="space-y-6">
              <h3 className="text-headline-md text-on-surface">Танилцуулга</h3>
              <div className="glass-card rounded-3xl p-10 text-lg text-on-surface-variant leading-relaxed italic border-outline-variant/10">
                "{user.bio}"
              </div>
            </section>
          )}

          {/* My Deployments (Products) */}
          {isOwnProfile && (
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-headline-md text-on-surface">Идэвхтэй үйлчилгээнүүд</h3>
                <Link to="/seller/add" className="text-sm font-bold text-primary hover:underline transition-all active:scale-95">+ Шинэ үйлчилгээ</Link>
              </div>
              
              {myProducts.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant text-sm border-dashed border-2 border-outline-variant/10">
                  Та одоогоор үйлчилгээ нэмээгүй байна. <Link to="/seller/add" className="text-primary hover:underline font-bold">Эхний үйлчилгээгээ нэмэх</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myProducts.map((prod) => (

                    <div 
                      key={prod.id} 
                      onClick={() => navigate(`/services/${prod.id}`)}
                      className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-primary/20 transition-all border-outline-variant/5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                            {prod.icon || '🎮'}
                          </div>
                          <div>
                            <h4 className="font-bold text-on-surface line-clamp-1">{prod.title}</h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{prod.category}</span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteProduct(prod.id); }}
                          className="p-2 text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          title="Remove Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-display font-bold text-secondary">₮{(prod.tiers?.[0]?.price ?? 0).toLocaleString()}</span>
                        <span className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Үзэх</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Recent Orders */}

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-headline-md text-on-surface">Сүүлийн захиалгууд</h3>
              <button onClick={() => navigate('/orders')} className="text-sm font-bold text-primary hover:underline transition-all active:scale-95">Бүгдийг үзэх</button>

            </div>
            
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center text-on-surface-variant text-sm">
                  Захиалга байхгүй байна. <a href="/services" className="text-primary hover:underline">Үйлчилгээнүүд үзэх</a>.
                </div>
              ) : (
                userOrders.slice(0, 5).map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => navigate(`/orders`)}
                    className="glass-card rounded-2xl p-6 flex items-center justify-between group hover:bg-surface-container-high transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface mb-1">{order.product_title ?? 'Үйлчилгээ'}</h4>
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                          <span className="font-bold uppercase tracking-widest text-primary">{order.status}</span>
                          <span>{order.tier}</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-display font-bold text-secondary">₮{order.total.toLocaleString()}</div>
                      <span className="text-xs font-bold text-primary hover:underline uppercase tracking-widest mt-1">Дэлгэрэнгүй</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
