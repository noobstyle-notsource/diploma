import React, { useEffect, useState } from 'react';
import { ShoppingBag, Calendar, ArrowRight, Tag, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { orders, isLoggedIn, type Order } from '../lib/api';

export default function Orders() {
  const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const data = await orders.list();
        setUserOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-headline-xl text-on-surface mb-2">Order History</h1>
          <p className="text-on-surface-variant font-medium text-lg">Track and manage your elite service deployments.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-high/50 px-6 py-3 rounded-2xl border border-outline-variant/20">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <span className="text-lg font-display font-bold text-on-surface">{userOrders.length} Total Deployments</span>
        </div>
      </div>

      {error && (
        <div className="mb-10 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-6 py-4">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {userOrders.length === 0 ? (
        <div className="glass-surface rounded-[40px] p-20 text-center space-y-8 border-outline-variant/10 shadow-2xl">
          <div className="w-24 h-24 bg-surface-container-high rounded-[32px] flex items-center justify-center mx-auto shadow-xl">
            <ShoppingBag className="w-10 h-10 text-outline" />
          </div>
          <div className="space-y-2">
            <h3 className="text-headline-md text-on-surface">No Deployments Found</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto">Your tactical history is empty. Start your first deployment to see it here.</p>
          </div>
          <button onClick={() => navigate('/services')} className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
            Browse Services
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
                    {order.product_title || 'Zen Service'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-outline" />
                      {order.tier} Tier
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
                  <div className="text-[10px] font-black uppercase tracking-widest text-outline mt-1">Total Valuation</div>
                </div>
                
                <Link 
                  to={`/services/${order.product_id}`} 
                  className="p-4 bg-surface-container-high rounded-2xl text-on-surface hover:bg-primary hover:text-on-primary transition-all shadow-lg active:scale-95"
                >
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
