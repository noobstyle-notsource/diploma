import React, { useState } from 'react';
import { Plus, Upload, Tag, DollarSign, Layers, CheckCircle, AlertCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { products, isLoggedIn } from '../lib/api';

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
    try {
      await products.create({
        title,
        description,
        category,
        wearCondition: category === 'Gear' ? wearCondition : 'Шинэ',
        tiers: tiers.map(t => ({ name: t.name, price: parseFloat(t.price) || 0 })),
        per_unit: priceUnit || (['Gear', 'Supplements'].includes(category) ? 'Fixed Price' : '/session'),
      });
      setSuccess(true);
      setTimeout(() => navigate('/services'), 1500);
    } catch (e: any) {
      setError(e.message ?? 'Failed to create listing');
    } finally { setLoading(false); }
  };

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
