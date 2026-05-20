import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Tag, DollarSign, Layers, CheckCircle, AlertCircle, Package, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { products, isLoggedIn, ai } from '../lib/api';

const CATEGORIES = ['Coaching', 'Boosting', 'Rentals', 'Gear', 'Marketplace', 'Supplements'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'pricing' | 'media'>('info');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [wearCondition, setWearCondition] = useState('Шинэ');
  const [tiers, setTiers] = useState<{ name: string; price: string }[]>([
    { name: 'ҮНДСЭН', price: '' },
    { name: 'ПРО', price: '' },
    { name: 'ЭЛИТ', price: '' }
  ]);
  const [priceUnit, setPriceUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [submittedData, setSubmittedData] = useState<{ title: string; category: string; wearCondition: string; tiers: { name: string; price: string }[] } | null>(null);

  // If Gear or Supplements, force a single tier
  React.useEffect(() => {
    const isSinglePrice = ['Gear', 'Supplements'].includes(category);
    if (isSinglePrice) {
      setTiers([{ name: 'Үнэ', price: tiers[0]?.price || '' }]);
    } else if (tiers.length === 1 && (tiers[0].name === 'Price' || tiers[0].name === 'Үнэ')) {
      setTiers([
        { name: 'ҮНДСЭН', price: tiers[0].price },
        { name: 'ПРО', price: '' },
        { name: 'ЭЛИТ', price: '' }
      ]);
    }
  }, [category]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) { navigate('/login'); return; }
    setError(''); setLoading(true);
    const isProductCat = ['Gear', 'Supplements'].includes(category);
    try {
      // Backend expects flat fields, not a tiers array
      const t0 = tiers[0] ?? { name: 'BASIC', price: '' };
      const t1 = tiers[1] ?? { name: 'PRO', price: '' };
      const t2 = tiers[2] ?? { name: 'ELITE', price: '' };
      await products.create({
        title,
        description,
        category,
        wearCondition: isProductCat ? wearCondition : 'Шинэ',
        basicName: t0.name,
        basicPrice: parseFloat(t0.price) || 0,
        proName: t1.name,
        proPrice: parseFloat(t1.price) || 0,
        eliteName: t2.name,
        elitePrice: parseFloat(t2.price) || 0,
        perUnit: priceUnit || (isProductCat ? 'Fixed Price' : '/session'),
      } as any);
      setSubmittedData({ title, category, wearCondition, tiers: [...tiers] });
      setSuccess(true);
      setCountdown(4);
    } catch (e: any) {
      setError(e.message ?? 'Failed to create listing');
    } finally { setLoading(false); }
  };

  const redirectPath = ['Gear', 'Supplements'].includes(category) ? '/products' : '/services';

  useEffect(() => {
    if (!success) return;
    if (countdown <= 0) { navigate(redirectPath); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, navigate, redirectPath]);

  const isProductCategory = ['Gear', 'Supplements'].includes(category);
  const priceLabel = isProductCategory ? 'Үнэ' : 'Үнэлгээ';

  const addTier = () => {
    if (tiers.length < 5) {
      setTiers([...tiers, { name: `Багц ${tiers.length + 1}`, price: '' }]);
    }
  };


  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const updateTier = (index: number, field: 'name' | 'price', value: string) => {
    const newTiers = [...tiers];
    newTiers[index][field] = value;
    setTiers(newTiers);
  };

  const categoryEmoji: Record<string, string> = {
    Coaching: '🎓', Boosting: '⚡', Rentals: '🎮', Gear: '🛒', Marketplace: '🏪', Supplements: '💊'
  };

  if (success && submittedData) {
    const isProduct = ['Gear', 'Supplements'].includes(submittedData.category);
    const totalPrice = submittedData.tiers.reduce((acc, t) => acc + (parseFloat(t.price) || 0), 0);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
        {/* Animated dark backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90"
          style={{ backdropFilter: 'blur(24px)' }}
        />
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.03) 2px, rgba(0,255,136,0.03) 4px)'
        }} />
        {/* Neon glow corner accents */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
          className="relative z-10 w-full max-w-lg mx-4"
        >
          <div className="rounded-3xl border border-green-500/30 bg-black/60 p-10 shadow-2xl"
            style={{ boxShadow: '0 0 80px rgba(0,255,136,0.15), 0 0 160px rgba(0,255,136,0.05), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

            {/* Top accent bar */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent" />

            {/* Animated check icon */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, rgba(0,255,136,0.05) 70%)', boxShadow: '0 0 40px rgba(0,255,136,0.4)' }}>
                  <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
                </div>
                {/* Pulse rings */}
                <motion.div
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-green-400/60"
                />
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                  className="absolute inset-0 rounded-full border border-green-400/40"
                />
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <p className="text-xs font-black uppercase tracking-[0.4em] text-green-400 mb-3">✦ АМЖИЛТТАЙ ✦</p>
              <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: '0 0 30px rgba(0,255,136,0.3)' }}>
                🎉 НИЙТЛЭГДЛЭЭ!
              </h2>
              <p className="text-green-300/60 text-sm font-medium">Таны зар манай платформд амжилттай нэмэгдлээ</p>
            </motion.div>

            {/* Product details card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 mb-8 space-y-4"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{categoryEmoji[submittedData.category] || '✨'}</span>
                <div className="min-w-0">
                  <h3 className="text-white font-black text-lg leading-tight truncate">{submittedData.title || 'Гарчиггүй'}</h3>
                  <p className="text-green-400/70 text-xs font-bold uppercase tracking-widest mt-1">{submittedData.category}</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 grid grid-cols-2 gap-4">
                {isProduct && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Төлөв</p>
                    <p className="text-white/80 text-sm font-bold">{submittedData.wearCondition}</p>
                  </div>
                )}
                <div className={isProduct ? '' : 'col-span-2'}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                    {isProduct ? 'Үнэ' : 'Багцын тоо'}
                  </p>
                  <p className="text-white/80 text-sm font-bold">
                    {isProduct
                      ? `₮${(totalPrice).toLocaleString()}`
                      : `${submittedData.tiers.length} багц`
                    }
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                </motion.div>
                {countdown}с-д автоматаар шилжинэ
              </div>
              <button
                onClick={() => navigate(redirectPath)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-bold hover:bg-green-500/30 transition-all"
                style={{ boxShadow: '0 0 20px rgba(0,255,136,0.1)' }}
              >
                Шилжих <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-headline-xl text-on-surface mb-2">Шинэ үйлчилгээ/бүтээгдэхүүн нэмэх</h1>
          <p className="text-on-surface-variant font-medium">Zen-Gamer платформд шинээр үйлчилгээ болон бүтээгдэхүүн байршуулах.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/services')} className="px-8 py-3 rounded-xl border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-variant/20 transition-all">
            Цуцлах
          </button>
          <button type="submit" form="add-product-form" disabled={loading || success}
            className="px-10 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin" /> : success ? <><CheckCircle className="w-4 h-4" /> Нийтлэгдлээ!</> : 'Нийтлэх'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <nav className="lg:col-span-3">
          <div className="glass-card rounded-3xl p-4 sticky top-28 space-y-2 border-outline-variant/10">
            {[{ id: 'info', label: 'Ерөнхий мэдээлэл', icon: Package }, { id: 'pricing', label: 'Үнийн санал', icon: DollarSign }, { id: 'media', label: 'Зураг болон медиа', icon: Upload }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={cn("w-full flex items-center gap-4 p-5 rounded-2xl transition-all group text-left",
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface")}>
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-outline")} />
                <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </nav>

        <div className="lg:col-span-9">
          <section className="glass-surface rounded-[40px] p-12 border-outline-variant/10 shadow-2xl relative overflow-hidden min-h-[600px]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-60" />
            <form id="add-product-form" onSubmit={handleSubmit} className="space-y-12">
              {activeTab === 'info' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-label-md text-primary ml-1">Гарчиг</label>
                      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Жнь: CS2 ганцаарчилсан сургалт" required
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-lg font-display font-medium text-on-surface focus:border-primary outline-none transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-label-md text-primary ml-1">Ангилал</label>
                      <div className="relative">
                        <select value={category} onChange={e => setCategory(e.target.value)}
                          className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-on-surface focus:border-primary outline-none appearance-none transition-all">
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <Layers className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {category === 'Gear' && (
                    <div className="space-y-4">
                      <label className="text-label-md text-primary ml-1">Бүтээгдэхүүний төлөв</label>
                      <div className="relative">
                        <select value={wearCondition} onChange={e => setWearCondition(e.target.value)}
                          className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-on-surface focus:border-primary outline-none appearance-none transition-all">
                          <option>Шинэ</option>
                          <option>Шинэвтэр / Задласан</option>
                          <option>Бага зэрэг ашигласан</option>
                          <option>Хуучин</option>
                        </select>
                        <Layers className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-outline pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-label-md text-primary ml-1">Дэлгэрэнгүй тайлбар</label>
                    <textarea rows={6} value={description} onChange={e => setDescription(e.target.value)} placeholder="Үйлчилгээ болон бүтээгдэхүүнийхээ талаар дэлгэрэнгүй бичнэ үү..."
                      className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-[32px] py-6 px-8 text-on-surface focus:border-primary outline-none transition-all resize-none leading-relaxed" />
                    <button type="button" onClick={async () => {
                      setLoading(true);
                      try {
                        const enhanced = await ai.chat(`Improve this service description. Title: ${title}. Current description: ${description}`);
                        setDescription(enhanced);
                      } catch (e) {
                        console.error('AI Enhance error', e);
                      } finally { setLoading(false); }
                    }} disabled={loading} className="mt-2 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/80 transition">
                      {loading ? 'Сайжруулж байна...' : 'AI-аар сайжруулах'}
                    </button>                  </div>
                  <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/20 flex gap-6 items-start">
                    <AlertCircle className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-secondary mb-2">Анхааруулга</h4>
                      <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Бүх тайлбарыг AI систем шалгах болно. Буруу ташаа эсвэл хэт богино мэдээллийг нийтлэх боломжгүй.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pricing' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                  <div className="flex justify-between items-end gap-4">
                    <div className="space-y-4 flex-grow">
                      <label className="text-label-md text-primary ml-1">Нэгж (Жнь: Цагийн, Ширхэгийн)</label>
                      <input type="text" value={priceUnit} onChange={e => setPriceUnit(e.target.value)} placeholder={isProductCategory ? "Тогтмол үнэ" : "Жнь: Цагийн"}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-on-surface focus:border-primary outline-none transition-all" />
                    </div>
                    {category !== 'Gear' && tiers.length < 5 && (
                      <button type="button" onClick={addTier} className="mb-1 p-5 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-2 font-bold text-sm uppercase tracking-widest">

                        <Plus className="w-5 h-5" /> Багц нэмэх
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {tiers.map((tier, idx) => (
                      <div key={idx} className="p-8 rounded-3xl bg-surface-container-low/30 border border-outline-variant/10 space-y-6 relative group/tier">
                        {category !== 'Gear' && tiers.length > 1 && (
                          <button type="button" onClick={() => removeTier(idx)} className="absolute top-6 right-6 p-2 text-outline hover:text-red-400 transition-colors">
                            <Plus className="w-5 h-5 rotate-45" />
                          </button>
                        )}
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-2xl">{['🥉', '🥈', '🥇', '🏆', '💎'][idx] || '✨'}</span>

                          <input 
                            type="text" value={tier.name} onChange={e => updateTier(idx, 'name', e.target.value)}
                            placeholder={`Багц ${idx + 1} нэр`}
                            className="bg-transparent border-b border-outline-variant/20 py-1 px-2 text-sm font-black uppercase tracking-[0.2em] text-primary focus:border-primary outline-none transition-all w-48"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">{priceLabel} (MNT)</label>
                            <div className="relative">
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-display font-bold text-outline">₮</div>
                              <input type="number" value={tier.price} onChange={e => updateTier(idx, 'price', e.target.value)} placeholder="0" 
                                className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 pl-16 pr-8 text-2xl font-display font-bold text-on-surface focus:border-primary outline-none transition-all" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="border-4 border-dashed border-outline-variant/20 rounded-[40px] p-20 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                    <div className="w-24 h-24 bg-surface-container-high rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-headline-md text-on-surface mb-2">Зураг оруулах</h3>
                    <p className="text-on-surface-variant font-medium max-w-xs">Зургаа чирж оруулах эсвэл сонгох.</p>
                    <input type="file" className="hidden" />
                  </div>
                </motion.div>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
