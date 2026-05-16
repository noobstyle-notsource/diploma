import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { ServiceCategory, Service } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { products as productsApi, type Product } from '../lib/api';

// Map backend categories to frontend categories
function mapCategory(cat: string): ServiceCategory {
  const map: Record<string, ServiceCategory> = {
    'BOOSTING': 'Boosting', 'Boosting': 'Boosting',
    'COACHING': 'Coaching', 'Coaching': 'Coaching',
    'GEAR': 'Gear', 'Gear': 'Gear',
    'RENTING': 'Rentals', 'Rentals': 'Rentals',
    'MARKETPLACE': 'Marketplace', 'Marketplace': 'Marketplace',
    'SUPPLEMENTS': 'Supplements', 'Supplements': 'Supplements',
  };
  return map[cat] ?? 'Marketplace';
}

// Convert a backend product to the frontend Service shape
function toService(p: Product): Service {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: mapCategory(p.category),
    price: p.pro_price || p.basic_price || (p.tiers?.[1]?.price) || (p.tiers?.[0]?.price) || 0,
    priceUnit: p.per_unit ?? '',
    image: (p.images?.[0]) || '',
    verified: !!p.tag,
    featured: p.tag === 'FEATURED',
    trending: p.tag === 'HOT' || p.tag === 'TRENDING',
  };
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'All'>('All');
  const [priceRange, setPriceRange] = useState(5000000); // 5M for real currency
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL search param
  useEffect(() => {
    const q = searchParams.get('search') || '';
    if (q !== searchQuery) setSearchQuery(q);
  }, [searchParams]);

  // Update URL when search changes locally
  const handleLocalSearch = (val: string) => {
    setSearchQuery(val);
    if (val) {
      setSearchParams({ search: val });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      setSearchParams(newParams);
    }
  };

  const categories: { id: string; label: string }[] = [
    { id: 'All', label: 'Total Nexus' },
    { id: 'Boosting', label: 'Rank Boosting' },
    { id: 'Coaching', label: 'Pro Coaching' },
    { id: 'Gear', label: 'Elite Gear' },
    { id: 'Rentals', label: 'Account Rentals' },
    { id: 'Supplements', label: 'Bio-Hacking' },
  ];

  useEffect(() => {
    setLoading(true);
    productsApi.list().then(data => {
      const services = data.map(toService);
      setAllServices(services);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = allServices.filter(service => {
      const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
      const matchesPrice = service.price <= priceRange;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
    setFilteredServices(filtered);
  }, [allServices, selectedCategory, priceRange, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <section className="mb-16">
        <h1 className="text-headline-xl text-on-surface mb-4 font-display">Zen Nexus</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-medium">
          The ultimate clearing house for competitive advantages. From neural-linked gear to master-class coaching.
        </p>
      </section>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <div className="glass-card rounded-[32px] p-8 sticky top-28 shadow-2xl border-outline-variant/10">
            <div className="flex flex-col gap-12">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 ml-1">Selection Mode</h3>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all group cursor-pointer",
                        selectedCategory === cat.id 
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                          : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                      )}
                    >
                      <span className="text-sm font-bold uppercase tracking-widest">{cat.label}</span>
                      {selectedCategory === cat.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 ml-1">Valuation Caps</h3>
                <div className="px-1">
                  <input 
                    type="range" min="0" max="5000000" step="50000" value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary" 
                  />
                  <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    <span>Min ₮0</span>
                    <span className="text-primary">₮{priceRange.toLocaleString()} Max</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedCategory('All'); setPriceRange(5000000); handleLocalSearch(''); }}
                className="w-full flex items-center justify-center gap-3 py-5 bg-surface-container-high/50 border border-outline-variant/10 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface rounded-2xl hover:bg-surface-variant transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" /> Purge Filters
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
              <input 
                type="text" placeholder="Query the database..."
                value={searchQuery} onChange={(e) => handleLocalSearch(e.target.value)}
                className="w-full bg-surface-container-low/30 border border-outline-variant/10 rounded-[28px] pl-16 pr-6 py-5 text-sm focus:border-primary/50 outline-none transition-all shadow-inner backdrop-blur-md"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl glass-card border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(129,212,220,1)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {loading ? 'Syncing...' : `${filteredServices.length} Assets Found`}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[400px] rounded-[40px] bg-surface-container-high/50 animate-pulse border border-outline-variant/10" />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredServices.map((service, i) => (
                  <motion.div
                    key={service.id} layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-surface-container-high rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-outline-variant/10">
                <Search className="w-10 h-10 text-on-surface-variant opacity-20" />
              </div>
              <h3 className="text-2xl font-display font-bold text-on-surface mb-2">No results found</h3>
              <p className="text-on-surface-variant max-w-xs mx-auto">Query returned zero results. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
