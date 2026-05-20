import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { products as productsApi, type Product } from '../lib/api';

const PRODUCT_CATEGORIES = ['Gear', 'Supplements'];

function mapCategory(cat: string): string {
  const map: Record<string, string> = {
    'HARDWARE': 'Gear', 'Gear': 'Gear',
    'SUPPLEMENTS': 'Supplements', 'Supplements': 'Supplements',
  };
  return map[cat] ?? cat;
}

function toService(p: Product): Service {
  return {
    id: p.id, title: p.title, description: p.description,
    category: mapCategory(p.category) as any,
    price: p.basic_price || p.pro_price || 0,
    priceUnit: p.per_unit ?? '', image: p.images?.[0] || '',
    verified: !!p.tag, featured: p.tag === 'FEATURED',
    trending: p.tag === 'HOT' || p.tag === 'TRENDING' || p.tag === 'NEW',
  };
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState(5000000);
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsApi.list().then(data => {
      setAllProducts(data.filter(p => PRODUCT_CATEGORIES.includes(mapCategory(p.category))).map(toService));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'All', label: 'Бүх бүтээгдэхүүн' },
    { id: 'Gear', label: 'Тоног төхөөрөмж' },
    { id: 'Supplements', label: 'Нэмэлт бүтээгдэхүүн' },
  ];

  const filtered = allProducts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= priceRange;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesPrice && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <section className="mb-16">
        <h1 className="text-headline-xl text-on-surface mb-4 font-display">Бүтээгдэхүүнүүд</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-medium">
          Цахим спортын өндөр үзүүлэлттэй техник хэрэгсэл болон нэмэлт бүтээгдэхүүнүүд.
        </p>
      </section>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <div className="glass-card rounded-[32px] p-8 sticky top-28 shadow-2xl border-outline-variant/10">
            <div className="flex flex-col gap-12">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 ml-1">Бүтээгдэхүүний төрөл</h3>
                <div className="flex flex-col gap-3">
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                      className={cn("w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                        selectedCategory === cat.id
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                          : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface")}>
                      <span className="text-sm font-bold uppercase tracking-widest">{cat.label}</span>
                      {selectedCategory === cat.id && <ChevronLeft className="w-4 h-4 rotate-180" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 ml-1">Үнийн хязгаар</h3>
                <div className="px-1">
                  <input type="range" min="0" max="5000000" step="50000" value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary" />
                  <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    <span>Доод ₮0</span>
                    <span className="text-primary">₮{priceRange.toLocaleString()} Дээд</span>
                  </div>
                </div>
              </div>

              <button onClick={() => { setSelectedCategory('All'); setPriceRange(5000000); setSearchQuery(''); }}
                className="w-full flex items-center justify-center gap-3 py-5 bg-surface-container-high/50 border border-outline-variant/10 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface rounded-2xl hover:bg-surface-variant transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Filter className="w-3.5 h-3.5" /> Шүүлтүүр цэвэрлэх
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Бүтээгдэхүүн хайх..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low/30 border border-outline-variant/10 rounded-[28px] pl-16 pr-6 py-5 text-sm focus:border-primary/50 outline-none transition-all shadow-inner backdrop-blur-md" />
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-card border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(129,212,220,1)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {loading ? 'Уншиж байна...' : `${filtered.length} Бүтээгдэхүүн олдлоо`}
              </span>
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filtered.map(product => (
                <motion.div key={product.id} layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}>
                  <ServiceCard service={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && !loading && (
            <div className="text-center py-20 text-on-surface-variant">
              <p className="text-lg font-medium">Шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй.</p>
              <button onClick={() => { setSelectedCategory('All'); setPriceRange(5000000); setSearchQuery(''); }}
                className="mt-4 text-primary font-bold hover:underline">Шүүлтүүр цэвэрлэх</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
