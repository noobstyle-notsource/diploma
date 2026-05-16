import { ArrowRight, ShieldCheck, Zap, TrendingUp, Users, Trophy, Lock, Globe, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, type Product } from '../lib/api';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    products.list().then(data => {
      setFeaturedServices(data.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);


  const categories = [
    { label: 'Boosting', desc: 'Rank up with elite operators.', link: '/services?search=boosting', color: 'primary' },
    { label: 'Coaching', desc: 'Master classes from top 100.', link: '/services?search=coaching', color: 'secondary' },
    { label: 'Rentals', desc: 'Access legendary gear.', link: '/services?search=rentals', color: 'tertiary' },
    { label: 'Marketplace', desc: 'Trade digital assets.', link: '/services', color: 'primary' },
    { label: 'Gear', desc: 'Pro hardware & tech.', link: '/products?category=Gear', color: 'secondary' },
    { label: 'Supplements', desc: 'Neural focus & flow.', link: '/products?category=Supplements', color: 'tertiary' },
  ];

  const protocols = [
    { step: '01', title: 'Operator Selection', desc: 'Browse and select from our pool of verified global masters.', icon: Users },
    { step: '02', title: 'Secure Deployment', desc: 'Your assets are protected via encrypted Zen-Shield protocols.', icon: Lock },
    { step: '03', title: 'Elite Execution', desc: 'Real-time monitoring and delivery of your competitive edge.', icon: Zap },
  ];

  const trustBadges = [
    { title: 'Zen-Shield Protection', desc: 'Every transaction is encrypted and insured.', icon: ShieldCheck },
    { title: 'Global Infrastructure', desc: 'Low-latency node networks for all services.', icon: Globe },
    { title: 'Verified Operators', desc: 'Only the top 1% of talent is allowed to deploy.', icon: Trophy },
  ];

  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            alt="Hero Background"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-surface-container-high/50 border border-primary/20 backdrop-blur-xl mb-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(129,212,220,1)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Status: Operational</span>
            </div>
            
            <h1 className="text-headline-xxl md:text-[120px] font-display font-bold text-on-surface mb-8 leading-[0.9] tracking-tighter">
              BEYOND <br /> <span className="text-primary italic">THE LIMIT.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-on-surface-variant font-medium mb-12 leading-relaxed">
              The world's most curated sanctuary for competitive advantages. Connect with elite operators and deploy mastery.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/services" className="px-12 py-5 bg-primary text-on-primary rounded-[20px] font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Explore The Nexus
              </Link>
              <Link to="/about" className="px-12 py-5 bg-surface-container-high text-on-surface rounded-[20px] font-black uppercase tracking-[0.2em] text-sm border border-outline-variant/20 hover:bg-surface-variant transition-all">
                Learn The Mission
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative z-30 -mt-20 max-w-7xl mx-auto w-full px-6 md:px-10">
        <div className="glass-surface rounded-[40px] p-8 md:p-12 border border-outline-variant/10 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-outline-variant/10">
          <div className="flex flex-col items-center md:items-start px-8">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <span className="text-3xl font-display font-bold text-on-surface">1.2M+</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Deployments Handled</span>
          </div>
          <div className="flex flex-col items-center md:items-start px-8">
            <Users className="w-8 h-8 text-secondary mb-4" />
            <span className="text-3xl font-display font-bold text-on-surface">45K+</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Verified Operators</span>
          </div>
          <div className="flex flex-col items-center md:items-start px-8">
            <Trophy className="w-8 h-8 text-tertiary mb-4" />
            <span className="text-3xl font-display font-bold text-on-surface">99.8%</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Satisfaction Index</span>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-headline-xl text-on-surface mb-4">Elite Categories</h2>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed">
              Every listing in our sanctuary is parsed for quality, ensuring you only access the highest tier of services and hardware.
            </p>
          </div>
          <Link to="/services" className="text-primary text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 group hover:gap-5 transition-all pb-2 border-b-2 border-primary/20">
            View All Sectors
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <Link to="/services?search=coaching" className="md:col-span-2 lg:col-span-3 group relative h-[400px] rounded-[48px] overflow-hidden glass-card border-outline-variant/10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(129,212,220,0.15)]">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzYIoKsBQnt7HyYJCHw-GX7BfkLces7U-9gbuu-7dTiu7V4o80w8X7f2-T1-tA3DeIONu1CwXx1ypgvn3ibL_waQ2b9ZeQK8LeKyz0C_7JGGbzox5MLEhTp06Ogz1nGQEsDv6EfcswIZZAH8Z3tQ2E5rNk4eozkcsSY7LB-wnxhurTQ89wUKrhef2QzRTid7GPJv05IFbbIUSnkuHFJgHro12ByIJGGGKovtqW_GF1twbQmDKlftIAOl_cEpcz5PgJY8O_WlUKEYkW" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Coaching" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent p-12 flex flex-col justify-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Training</span>
              <h3 className="text-3xl font-display font-bold text-on-surface mb-2">Pro Coaching</h3>
              <p className="text-on-surface-variant font-medium">Master any meta with top-tier mentors.</p>
            </div>
          </Link>
          <Link to="/products" className="md:col-span-2 lg:col-span-3 group relative h-[400px] rounded-[48px] overflow-hidden glass-card border-outline-variant/10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(129,212,220,0.15)]">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA5quMhrHCiX_ektWAtkdB9KjvZ9s4h0MzPJAID07sZY9YhlYI8maN9WE3f2JC9LswBCyPGBOG1lSNKL1GrTQpO8W9Zf1yTJIYCsgoKP2Hv-JGSv3xa-YAUXHYpNStNSW-qtQBzB9kSNy5ewuUqYBSGb_ThFEpSQVEHupNCvPREHTodxve_HQi-cBtHmc11aEez4ixdXTpdF8MoOxBjdPpayXkBrSEmrzhRh5IBtVELIGEao6UxiJYumua78BhrHaKRqOPjF2IIgtp" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Gear" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent p-12 flex flex-col justify-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Hardware</span>
              <h3 className="text-3xl font-display font-bold text-on-surface mb-2">Premium Gear</h3>
              <p className="text-on-surface-variant font-medium">High-performance gear and neural supplements.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* The Deployment Protocol (How it Works) */}
      <section className="bg-surface-container-low py-32 border-y border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-20">
            <h2 className="text-headline-xl text-on-surface mb-4">The Deployment Protocol</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto font-medium">Our three-step lifecycle ensures every advantage is deployed with surgical precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />
            {protocols.map((step, i) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-[32px] bg-surface-container-high border border-outline-variant/20 flex items-center justify-center mb-8 group-hover:border-primary/50 transition-all shadow-xl group-hover:shadow-primary/10">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="text-xs font-black text-primary/40 uppercase tracking-[0.4em] mb-4">{step.step}</span>
                <h3 className="text-2xl font-display font-bold text-on-surface mb-4">{step.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-[280px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Featured Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32">
        <div className="glass-surface rounded-[64px] p-12 md:p-20 border border-outline-variant/10 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <h2 className="text-headline-lg text-on-surface mb-2">Trending Deployments</h2>
              <p className="text-on-surface-variant font-medium">The most requested services in the community right now.</p>
            </div>
            <Link to="/services" className="text-primary text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-2 group">
              View Nexus
            </Link>
          </div>

          {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-[400px] rounded-[40px] bg-surface-container-high/50 animate-pulse border border-outline-variant/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Trust & Security Protocol */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest mb-8">
              <ShieldCheck className="w-3.5 h-3.5" /> Zen-Shield active
            </div>
            <h2 className="text-headline-xl text-on-surface mb-6">Uncompromising <br /><span className="text-primary italic">Security.</span></h2>
            <p className="text-lg text-on-surface-variant font-medium mb-10 leading-relaxed">
              We've engineered a sanctuary that protects both operators and clients. Every deployment is handled within a secure, encrypted ecosystem.
            </p>
            <div className="space-y-4">
              {['End-to-end encrypted messaging', 'Insured transaction protection', 'Verified hardware supply chain'].map(item => (
                <div key={item} className="flex items-center gap-3 text-on-surface font-bold">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustBadges.map((badge, i) => (
              <div key={badge.title} className={cn(
                "glass-card p-10 rounded-[40px] border-outline-variant/10 hover:border-primary/20 transition-all",
                i === 0 ? "sm:col-span-2 bg-gradient-to-br from-primary/5 to-transparent" : ""
              )}>
                <badge.icon className="w-10 h-10 text-primary mb-6" />
                <h4 className="text-xl font-display font-bold text-on-surface mb-2">{badge.title}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 mb-32 bg-surface-container-high/20 rounded-[80px] border border-outline-variant/10">
        <div className="text-center mb-20">
          <h2 className="text-headline-lg text-on-surface mb-4">Sector Exploration</h2>
          <p className="text-on-surface-variant font-medium">Deep-dive into specialized competitive categories.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-12 pb-12">
          {categories.map((cat) => (
            <Link 
              key={cat.label}
              to={cat.link}
              className="group relative h-80 rounded-[40px] overflow-hidden glass-card border-outline-variant/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(129,212,220,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high/40 to-transparent" />
              <div className="relative p-10 h-full flex flex-col justify-between">
                <div>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                    cat.color === 'primary' ? "bg-primary/20 text-primary" : 
                    cat.color === 'secondary' ? "bg-secondary/20 text-secondary" : "bg-tertiary/20 text-tertiary"
                  )}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-display font-bold text-on-surface mb-2">{cat.label}</h4>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{cat.desc}</p>
                </div>
                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Deploy Sector
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
