import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, ArrowRight, CheckCircle, Lock, Layers, Zap, Globe, Wallet, QrCode, Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { orders as ordersApi, auth as authApi, products as productsApi, isLoggedIn, type Product } from '../lib/api';

import gearPlaceholder from '../assets/placeholders/gear.png';
import boostingPlaceholder from '../assets/placeholders/boosting.png';
import coachingPlaceholder from '../assets/placeholders/coaching.png';
import supplementsPlaceholder from '../assets/placeholders/supplements.png';

const GET_PLACEHOLDER = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('gear')) return gearPlaceholder;
  if (cat.includes('supp')) return supplementsPlaceholder;
  if (cat.includes('coach')) return coachingPlaceholder;
  if (cat.includes('boost')) return boostingPlaceholder;
  return gearPlaceholder;
};

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qpay' | 'socialpay' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const productId = searchParams.get('product');
  const tierIndex = parseInt(searchParams.get('tier') ?? '1');

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [me, p] = await Promise.all([
          authApi.me(),
          productId ? productsApi.get(productId) : Promise.reject('No product ID')
        ]);
        setUser(me);
        setProduct(p);
      } catch (err) {
        console.error('Checkout fetch failed:', err);
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, navigate]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-xs">Preparing Secure Transaction...</p>
      </div>
    );
  }

  if (!product) return null;

  const selectedTier = product.tiers?.[tierIndex] || product.tiers?.[0] || { name: 'PRO', price: product.pro_price || 0 };
  const displayPrice = selectedTier.price;
  const totalWithFee = Math.round(displayPrice * 1.025);

  const handlePay = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    try {
      await ordersApi.create(product.id, selectedTier.name.toUpperCase());
      // Show success animation/state
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      console.error('Payment failed:', err);
      setIsProcessing(false);
    }
  };

  const methods = [
    { id: 'card', label: 'Bank Card', icon: CreditCard },
    { id: 'qpay', label: 'QPay / Bank', icon: QrCode },
    { id: 'socialpay', label: 'SocialPay', icon: Smartphone },
    { id: 'wallet', label: 'Gamer Wallet', icon: Wallet },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link to={`/services/${productId}`} className="p-3 rounded-full hover:bg-surface-container-high transition-colors">
          <ArrowRight className="w-6 h-6 rotate-180" />
        </Link>
        <h1 className="text-headline-xl text-on-surface font-display">Secure Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-6">
            <h2 className="text-label-md text-primary uppercase tracking-[0.2em] font-black ml-1">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {methods.map((method) => (
                <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                  className={cn("p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 group text-center h-32 cursor-pointer",
                    paymentMethod === method.id ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" : "glass-card border-outline-variant/10 hover:border-primary/30")}>
                  <method.icon className={cn("w-6 h-6 transition-colors", paymentMethod === method.id ? "text-primary" : "text-on-surface-variant group-hover:text-primary")} />
                  <span className={cn("text-[10px] font-black uppercase tracking-widest leading-tight", paymentMethod === method.id ? "text-primary" : "text-on-surface-variant")}>{method.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="glass-surface rounded-[40px] p-10 border-outline-variant/10 shadow-2xl relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-40" />
            
            <AnimatePresence mode="wait">
              {paymentMethod === 'card' && (
                <motion.form key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handlePay} className="space-y-8">
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 text-primary">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">Sandbox Active</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary/60 uppercase italic tracking-tighter">Demo transaction for testing</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-label-md text-on-surface-variant ml-1">Cardholder Name</label>
                      <input type="text" placeholder="TEST USER" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl py-4 px-6 text-sm focus:border-primary outline-none transition-all font-display font-medium tracking-wide uppercase" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label-md text-on-surface-variant ml-1">Email for Receipt</label>
                      <input type="email" value={user?.email || ''} readOnly className="w-full bg-surface-container-high/30 border border-outline-variant/10 rounded-xl py-4 px-6 text-sm text-outline cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-label-md text-on-surface-variant ml-1">Card Identification</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                      <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl py-4 pl-14 pr-6 text-sm focus:border-primary outline-none transition-all font-mono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-label-md text-on-surface-variant ml-1">Expiration</label>
                      <input type="text" placeholder="12/28" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl py-4 px-6 text-sm focus:border-primary outline-none transition-all font-mono" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-label-md text-on-surface-variant ml-1">CVC Code</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                        <input type="text" placeholder="000" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl py-4 pl-12 pr-6 text-sm focus:border-primary outline-none transition-all font-mono" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={isProcessing} className="w-full bg-primary text-on-primary font-bold text-sm uppercase tracking-[0.2em] py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-4 cursor-pointer">
                    {isProcessing ? <div className="w-6 h-6 border-4 border-on-primary/20 border-t-on-primary rounded-full animate-spin" /> : <>Complete Transaction <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </motion.form>
              )}

              {['qpay', 'socialpay'].includes(paymentMethod) && (
                <motion.div key="qr" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center justify-center py-10 space-y-8 text-center">
                  <div className="p-8 rounded-[40px] bg-white border border-outline-variant/10 shadow-2xl group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZEN_GAMER_PAYMENT_${product.id}_${totalWithFee}`} className="w-64 h-64 relative z-10" alt="Payment QR" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-on-surface">Scan to Pay with {paymentMethod === 'qpay' ? 'QPay' : 'SocialPay'}</h3>
                    <p className="text-on-surface-variant max-w-xs mx-auto">Open your bank application and scan the dynamic QR code for ₮{totalWithFee.toLocaleString()}.</p>
                  </div>
                  <button onClick={() => handlePay()} disabled={isProcessing} className="bg-primary text-on-primary px-12 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all cursor-pointer">
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Verify Payment"}
                  </button>
                </motion.div>
              )}

              {paymentMethod === 'wallet' && (
                <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="p-10 rounded-[32px] bg-secondary/5 border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <Wallet className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant block mb-1">Available Balance</span>
                        <span className="text-4xl font-display font-bold text-secondary">₮{(user?.balance ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  { (user?.balance ?? 0) < totalWithFee ? (
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-medium flex items-center gap-4">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      Insufficient funds. Your wallet balance (₮{(user?.balance ?? 0).toLocaleString()}) is lower than the required ₮{totalWithFee.toLocaleString()}.
                    </div>
                  ) : (
                    <button onClick={() => handlePay()} disabled={isProcessing} className="w-full bg-secondary text-on-secondary font-bold text-sm uppercase tracking-[0.2em] py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-4 cursor-pointer">
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Pay with Balance <ArrowRight className="w-5 h-5" /></>}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="glass-card rounded-3xl p-10 border-outline-variant/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-label-md text-primary uppercase tracking-[0.2em] font-black mb-8">Order Narrative</h3>
              <div className="space-y-6 mb-10 pb-10 border-b border-outline-variant/10">
                <div className="flex gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-surface-container-high overflow-hidden border border-outline-variant/10 flex-shrink-0">
                    <img src={product.images?.[0] || GET_PLACEHOLDER(product.category)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-grow">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-1">{product.category}</span>
                    <h4 className="text-lg font-display font-bold text-on-surface leading-tight mb-1">{product.title}</h4>
                    <span className="text-xs font-black text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/10 uppercase tracking-tighter">
                      {selectedTier.name} TIER
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Base Valuation</span><span>₮{displayPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-on-surface-variant">
                  <span>Escrow & Gas Fee (2.5%)</span><span>₮{Math.round(displayPrice * 0.025).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-display font-bold text-on-surface pt-6 border-t border-outline-variant/10 mt-6">
                  <span>Total Payload</span>
                  <span className="text-secondary">₮{totalWithFee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-secondary/5 border border-secondary/20">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-secondary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Zero-Knowledge Escrow</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                Your credits are locked in a digital vault and only released upon successful delivery verification. 100% money-back guarantee.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
