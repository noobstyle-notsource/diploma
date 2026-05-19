import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ChevronRight, CheckCircle, Shield, UserCheck, Video, Globe, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { products as productsApi, conversations, orders as ordersApi, isLoggedIn, type Product } from '../lib/api';

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

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi.get(id)
      .then(data => {
        setProduct(data);
        if (data.images && data.images.length > 0) setImgSrc(data.images[0]);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleOrder = (index: number) => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    navigate(`/checkout?product=${id}&tier=${index}`);
  };

  const handleEscrowOrder = (index: number) => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    navigate(`/checkout?product=${id}&tier=${index}&escrow=true`);
  };

  const handleContact = async () => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    if (!product) return;
    try {
      const res = await conversations.create(product.user_id, product.id);
      navigate('/messages');
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-xs">Мэдээллийн сангаас уншиж байна...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-display font-bold text-on-surface mb-4">Олдсонгүй</h2>
        <p className="text-on-surface-variant max-w-sm mb-8">Уг үйлчилгээ олдсонгүй эсвэл устгагдсан байна.</p>
        <Link to="/services" className="px-10 py-4 bg-primary text-on-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Буцах</Link>
      </div>
    );
  }

  const currentPlaceholder = GET_PLACEHOLDER(product.category);
  const finalImgSrc = imgSrc || currentPlaceholder;

  const benefits = [
    { text: 'Баталгаатай Үр Дүн', icon: Shield },
    { text: 'Шууд Холбоо', icon: Globe },
    { text: 'Бичлэгт Дүн Шинжилгээ', icon: Video },
    { text: 'VPN & Нууцлал хамгаалалт', icon: UserCheck },
  ];

  const pricingTiers = product.tiers && product.tiers.length > 0 
    ? product.tiers.map((t, idx) => ({
        ...t,
        index: idx,
        description: idx === 0 ? 'Энгийн' : idx === 1 ? 'Сайжруулсан' : idx === 2 ? 'Мастер' : idx === 3 ? 'Очир эрдэнэ' : 'Төгс',
        buttonText: `Сонгох: ${t.name}`,
        popular: idx === 1,
        style: idx === 1 ? 'primary' : idx === 2 ? 'outline' : 'glass'
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <nav className="flex items-center gap-2 text-on-surface-variant mb-12 text-sm font-medium">
        <Link to="/services" className="hover:text-primary transition-colors">Үйлчилгээнүүд</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-primary">{product.title}</span>
      </nav>

      <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <h1 className="text-headline-xl text-on-surface mb-8 font-display leading-[1.1]">{product.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-primary/20">
              {product.category}
            </span>
            {product.category === 'Gear' && (product.wearCondition || product.wear_condition) && (
              <span className="bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-yellow-500/20">
                {product.wearCondition || product.wear_condition}
              </span>
            )}
            <div className="flex text-primary">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary" />)}
            </div>
          </div>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl font-medium">
            {product.description}
          </p>
        </div>
        <div className="lg:col-span-5 h-[400px] rounded-[40px] overflow-hidden glass-surface border border-outline-variant/10 shadow-2xl relative group">
          <img 
            src={finalImgSrc} 
            onError={() => setImgSrc(currentPlaceholder)}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt={product.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </div>
      </section>
        
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-xl border-primary/10"
            >
              <div className="relative">
                <Link to={`/profile/${product.user_id}`}>
                  {product.seller_avatar ? (
                    <img src={product.seller_avatar} className="w-24 h-24 rounded-2xl bg-surface-container-high object-cover shadow-lg hover:scale-105 transition-transform" alt={product.seller_name} />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary shadow-lg hover:scale-105 transition-transform">
                      {product.seller_name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </Link>
                <div className="absolute -bottom-2 -right-2 bg-primary p-1.5 rounded-lg border-2 border-background">
                  <CheckCircle className="w-4 h-4 text-on-primary fill-on-primary" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Link to={`/profile/${product.user_id}`} className="hover:text-primary transition-colors">
                    <h2 className="text-headline-md text-on-surface">{product.seller_name}</h2>
                  </Link>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                    {product.seller_rank || 'БАТАЛГААЖСАН ОПЕРАТОР'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary" />)}
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">4.9 (1.2K+ Үнэлгээ)</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">{product.category} чиглэлээр мэргэшсэн, өндөр зэрэглэлийн үйлчилгээ үзүүлэгч.</p>
              </div>
              
              <button onClick={handleContact} className="bg-surface-container-high hover:bg-surface-variant text-on-surface px-6 py-3 rounded-xl transition-all border border-outline/20 font-bold text-sm active:scale-95 whitespace-nowrap flex items-center gap-2 cursor-pointer">
                <MessageSquare className="w-4 h-4" /> Худалдагчтай холбогдох
              </button>
            </motion.div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-primary rounded-full" />
                <h3 className="text-headline-md">Үйлчилгээний тухай</h3>
              </div>
              <div className="text-lg text-on-surface-variant leading-relaxed space-y-6">
                <p>{product.description}</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 group">
                      <benefit.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-on-surface">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8 pt-8">
              <div className="flex justify-between items-center">
                <h3 className="text-headline-md">Сэтгэгдлүүд</h3>
                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Зөвхөн баталгаажсан хэрэглэгчид</span>
              </div>
              <div className="py-20 text-center glass-surface rounded-3xl border border-outline-variant/10">
                <MessageSquare className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                <p className="text-on-surface-variant font-medium">Одоогоор сэтгэгдэл байхгүй байна.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {pricingTiers.map((tier, idx) => {
                const isPro = idx === 1;
                const isElite = idx === 2;
                const isDiamond = idx === 3;
                const isZenith = idx === 4;

                const themeColor = isZenith ? 'text-red-500' : isDiamond ? 'text-purple-400' : isElite ? 'text-amber-500' : isPro ? 'text-primary' : 'text-on-surface-variant';
                const buttonBg = isZenith ? 'bg-red-500 text-white' : isDiamond ? 'bg-purple-500 text-white' : isElite ? 'bg-amber-500 text-black' : isPro ? 'bg-primary text-on-primary' : 'bg-surface-container-highest/50 text-on-surface';
                const shadowColor = isZenith ? 'shadow-red-500/20' : isDiamond ? 'shadow-purple-500/20' : isElite ? 'shadow-amber-500/20' : isPro ? 'shadow-primary/20' : 'shadow-black/10';

                return (
                  <div key={tier.name}
                    className={cn(
                      "rounded-[32px] p-8 relative overflow-hidden transition-all duration-300 cursor-default group/tier shadow-xl",
                      isZenith ? "bg-gradient-to-br from-red-500/10 to-black/40 border-2 border-red-500/40" :
                      isDiamond ? "bg-gradient-to-br from-purple-500/10 to-transparent border-2 border-purple-500/40" :
                      isElite ? "bg-gradient-to-br from-amber-500/10 to-transparent border-2 border-amber-500/40" :
                      isPro ? "bg-surface-container-high/60 border-2 border-primary/40" :
                      "glass-card border-outline-variant/10"
                    )}
                  >
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-on-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-xl shadow-lg">Түгээмэл</div>
                    )}
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-2xl font-display font-bold text-on-surface">{tier.name}</h4>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{tier.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-2xl font-display font-bold", themeColor)}>₮{tier.price.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{product.per_unit || '/ удаа'}</div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                       <li className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                          <CheckCircle className={cn("w-4 h-4", themeColor)} /> Бүрэн эрхт хандалт
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                          <CheckCircle className={cn("w-4 h-4", themeColor)} /> Аюулгүй холболт
                        </li>
                    </ul>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleOrder(tier.index)}
                        className={cn(
                          "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer",
                          buttonBg, shadowColor
                        )}
                      >
                        {tier.buttonText}
                      </button>
                      <button
                        onClick={() => handleEscrowOrder(tier.index)}
                        className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500 hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <Shield className="w-4 h-4" /> Баталгаат дундын дансаар авах
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="p-8 rounded-2xl bg-surface-container-lowest/50 border border-outline-variant/10 shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-on-surface">Zen-Gamer Баталгаа</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                  Таны мөнгө үйлчилгээ бүрэн дуусах хүртэл дундын дансанд хадгалагдана. 100% мөнгөө буцааж авах баталгаатай.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
