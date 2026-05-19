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
    <div className="flex flex-col gap-0 overflow-hidden cyber-grid">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/90 to-background z-10" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/15 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-secondary/15 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-tertiary/15 blur-[140px] rounded-full animate-pulse" />
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105 animate-pulse"
            alt="Hero Background"
          />
          <div className="absolute inset-0 scanline opacity-40 z-15" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-surface-container-highest/60 border border-primary/40 backdrop-blur-2xl mb-8 shadow-[0_0_25px_rgba(0,255,204,0.2)] hover:shadow-[0_0_35px_rgba(0,255,204,0.4)] hover:border-primary transition-all">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(0,255,204,1)]" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]">ZEN-GAMER NEXUS: V2.0 ACTIVE</span>
            </div>
            
            <h1 className="text-headline-xxl font-display font-black text-on-surface mb-8 leading-[0.9] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              BEYOND <br /> <span className="text-gradient-cyber italic">THE LIMIT.</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-on-surface-variant font-medium mb-14 leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              The world's most premium sanctuary for elite competitive advantages. Deploy top-tier neural hardware and global master-class operators.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/services" className="px-12 py-5 bg-gradient-to-r from-primary via-tertiary to-secondary text-on-primary rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_rgba(0,255,204,0.5)] hover:shadow-[0_0_50px_rgba(0,255,204,0.8)] hover:scale-105 active:scale-95 transition-all duration-300">
                Explore The Nexus
              </Link>
              <Link to="/about" className="px-12 py-5 bg-surface-container-highest/40 text-on-surface rounded-[24px] font-black uppercase tracking-[0.2em] text-sm border border-primary/30 backdrop-blur-xl hover:bg-surface-container-highest/80 hover:border-primary hover:shadow-[0_0_25px_rgba(0,255,204,0.2)] hover:scale-105 active:scale-95 transition-all duration-300">
                Learn The Mission
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative z-30 -mt-24 max-w-7xl mx-auto w-full px-6 md:px-10">
        <div className="glass-surface rounded-[48px] p-8 md:p-14 border border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-primary/20 backdrop-blur-3xl bg-surface-container-highest/30">
          <div className="flex flex-col items-center md:items-start px-8 group">
            <TrendingUp className="w-10 h-10 text-primary mb-4 group-hover:scale-125 transition-transform drop-shadow-[0_0_12px_rgba(0,255,204,0.8)]" />
            <span className="text-4xl font-display font-black text-on-surface group-hover:text-primary transition-colors">1.2M+</span>
            <span className="text-xs font-black uppercase tracking-widest text-primary/70 mt-1">Deployments Handled</span>
          </div>
          <div className="flex flex-col items-center md:items-start px-8 group">
            <Users className="w-10 h-10 text-secondary mb-4 group-hover:scale-125 transition-transform drop-shadow-[0_0_12px_rgba(191,127,255,0.8)]" />
            <span className="text-4xl font-display font-black text-on-surface group-hover:text-secondary transition-colors">45K+</span>
            <span className="text-xs font-black uppercase tracking-widest text-secondary/70 mt-1">Verified Operators</span>
          </div>
          <div className="flex flex-col items-center md:items-start px-8 group">
            <Trophy className="w-10 h-10 text-tertiary mb-4 group-hover:scale-125 transition-transform drop-shadow-[0_0_12px_rgba(0,191,255,0.8)]" />
            <span className="text-4xl font-display font-black text-on-surface group-hover:text-tertiary transition-colors">99.8%</span>
            <span className="text-xs font-black uppercase tracking-widest text-tertiary/70 mt-1">Satisfaction Index</span>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-3xl">
            <h2 className="text-headline-xl text-on-surface mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Elite Categories</h2>
            <p className="text-on-surface-variant font-medium text-lg md:text-xl leading-relaxed">
              Every listing in our sanctuary is parsed for extreme fidelity, ensuring you only access the absolute highest tier of competitive advantages.
            </p>
          </div>
          <Link to="/services" className="text-primary text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 group hover:gap-5 transition-all pb-2 border-b-2 border-primary/40 hover:border-primary drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]">
            View All Sectors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Link to="/services?search=coaching" className="group relative h-[450px] rounded-[48px] overflow-hidden glass-card border border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:border-primary hover:shadow-[0_20px_50px_rgba(0,255,204,0.25)]">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzYIoKsBQnt7HyYJCHw-GX7BfkLces7U-9gbuu-7dTiu7V4o80w8X7f2-T1-tA3DeIONu1CwXx1ypgvn3ibL_waQ2b9ZeQK8LeKyz0C_7JGGbzox5MLEhTp06Ogz1nGQEsDv6EfcswIZZAH8Z3tQ2E5rNk4eozkcsSY7LB-wnxhurTQ89wUKrhef2QzRTid7GPJv05IFbbIUSnkuHFJgHro12ByIJGGGKovtqW_GF1twbQmDKlftIAOl_cEpcz5PgJY8O_WlUKEYkW" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" alt="Coaching" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-12 flex flex-col justify-end z-10">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-3 drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]">Tactical Training</span>
              <h3 className="text-4xl font-display font-black text-on-surface mb-3 group-hover:text-primary transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Pro Coaching</h3>
              <p className="text-on-surface-variant font-medium text-lg max-w-md leading-relaxed">Master any meta with top 100 global elite mentors.</p>
            </div>
            <div className="absolute inset-0 scanline opacity-30 group-hover:opacity-60 transition-opacity" />
          </Link>
          <Link to="/products" className="group relative h-[450px] rounded-[48px] overflow-hidden glass-card border border-secondary/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:border-secondary hover:shadow-[0_20px_50px_rgba(191,127,255,0.25)]">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA5quMhrHCiX_ektWAtkdB9KjvZ9s4h0MzPJAID07sZY9YhlYI8maN9WE3f2JC9LswBCyPGBOG1lSNKL1GrTQpO8W9Zf1yTJIYCsgoKP2Hv-JGSv3xa-YAUXHYpNStNSW-qtQBzB9kSNy5ewuUqYBSGb_ThFEpSQVEHupNCvPREHTodxve_HQi-cBtHmc11aEez4ixdXTpdF8MoOxBjdPpayXkBrSEmrzhRh5IBtVELIGEao6UxiJYumua78BhrHaKRqOPjF2IIgtp" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" alt="Gear" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-12 flex flex-col justify-end z-10">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-secondary mb-3 drop-shadow-[0_0_8px_rgba(191,127,255,0.8)]">Neural Hardware</span>
              <h3 className="text-4xl font-display font-black text-on-surface mb-3 group-hover:text-secondary transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Premium Gear</h3>
              <p className="text-on-surface-variant font-medium text-lg max-w-md leading-relaxed">High-performance esports hardware and neural supplements.</p>
            </div>
            <div className="absolute inset-0 scanline opacity-30 group-hover:opacity-60 transition-opacity" />
          </Link>
        </div>
      </section>

      {/* The Deployment Protocol (How it Works) */}
      <section className="bg-surface-container-highest/20 py-32 border-y border-primary/20 relative backdrop-blur-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-headline-xl text-on-surface mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">The Deployment Protocol</h2>
            <p className="text-on-surface-variant text-lg md:text-xl font-medium leading-relaxed">Our surgical three-step lifecycle ensures every competitive advantage is deployed with zero friction and absolute security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -translate-y-1/2 z-0 shadow-[0_0_15px_rgba(0,255,204,0.5)]" />
            {protocols.map((step, i) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group glass-card p-10 rounded-[40px] border-primary/20 hover:border-primary hover:shadow-[0_10px_35px_rgba(0,255,204,0.2)]"
              >
                <div className="w-24 h-24 rounded-[32px] bg-surface-container-highest border border-primary/40 flex items-center justify-center mb-8 group-hover:border-primary group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(0,255,204,0.2)] group-hover:shadow-[0_0_30px_rgba(0,255,204,0.5)]">
                  <step.icon className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]" />
                </div>
                <span className="text-sm font-black text-primary uppercase tracking-[0.5em] mb-4 drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]">{step.step}</span>
                <h3 className="text-2xl font-display font-black text-on-surface mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-on-surface-variant text-base leading-relaxed max-w-[280px] font-medium">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Featured Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 relative z-20">
        <div className="glass-surface rounded-[64px] p-12 md:p-20 border border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-3xl bg-surface-container-highest/30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-headline-lg text-on-surface mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Trending Deployments</h2>
              <p className="text-on-surface-variant font-medium text-lg leading-relaxed">The most highly requested elite services and hardware in the global sanctuary right now.</p>
            </div>
            <Link to="/services" className="text-primary text-sm font-black uppercase tracking-[0.2em] hover:drop-shadow-[0_0_12px_rgba(0,255,204,0.8)] transition-all flex items-center gap-3 group pb-2 border-b-2 border-primary/40 hover:border-primary">
              View Nexus <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-[450px] rounded-[40px] bg-surface-container-highest/40 animate-pulse border border-primary/20" />
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
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 border-t border-primary/20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_20px_rgba(0,255,204,0.2)]">
              <ShieldCheck className="w-4 h-4 animate-pulse drop-shadow-[0_0_8px_rgba(0,255,204,1)]" /> Zen-Shield active
            </div>
            <h2 className="text-headline-xl text-on-surface mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Uncompromising <br /><span className="text-gradient-cyber italic">Security.</span></h2>
            <p className="text-xl text-on-surface-variant font-medium mb-12 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              We've engineered an impenetrable fortress that protects both elite operators and clients. Every deployment is handled within a secure, fully encrypted ecosystem.
            </p>
            <div className="space-y-6">
              {['End-to-end encrypted messaging', 'Insured transaction protection', 'Verified hardware supply chain'].map(item => (
                <div key={item} className="flex items-center gap-4 text-on-surface font-bold text-lg glass-card px-6 py-4 rounded-2xl border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                  <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {trustBadges.map((badge, i) => (
              <div key={badge.title} className={cn(
                "glass-card p-10 rounded-[40px] border-primary/20 hover:border-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,255,204,0.2)] group",
                i === 0 ? "sm:col-span-2 bg-gradient-to-br from-primary/10 via-surface-container-highest/30 to-transparent border-primary/40 shadow-[0_10px_30px_rgba(0,255,204,0.15)]" : ""
              )}>
                <badge.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_12px_rgba(0,255,204,0.8)]" />
                <h4 className="text-2xl font-display font-black text-on-surface mb-3 group-hover:text-primary transition-colors">{badge.title}</h4>
                <p className="text-base text-on-surface-variant leading-relaxed font-medium">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 mb-32 glass-surface rounded-[80px] border border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden backdrop-blur-3xl bg-surface-container-highest/20 z-20">
        <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tertiary/10 blur-[160px] rounded-full pointer-events-none animate-pulse" />
        
        <div className="text-center mb-24 max-w-3xl mx-auto relative z-10">
          <h2 className="text-headline-lg text-on-surface mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">Sector Exploration</h2>
          <p className="text-on-surface-variant font-medium text-lg md:text-xl leading-relaxed">Deep-dive into specialized elite competitive categories and master-class sectors.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-12 pb-12 relative z-10">
          {categories.map((cat) => (
            <Link 
              key={cat.label}
              to={cat.link}
              className="group relative h-84 rounded-[40px] overflow-hidden glass-card border border-primary/20 hover:border-primary transition-all duration-500 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,255,204,0.25)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest/60 via-background/40 to-transparent z-0" />
              <div className="absolute inset-0 scanline opacity-30 group-hover:opacity-60 transition-opacity z-0" />
              <div className="relative p-10 h-full flex flex-col justify-between z-10">
                <div>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-125 transition-transform duration-500 shadow-lg",
                    cat.color === 'primary' ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_15px_rgba(0,255,204,0.3)]" : 
                    cat.color === 'secondary' ? "bg-secondary/20 text-secondary border border-secondary/40 shadow-[0_0_15px_rgba(191,127,255,0.3)]" : "bg-tertiary/20 text-tertiary border border-tertiary/40 shadow-[0_0_15px_rgba(0,191,255,0.3)]"
                  )}>
                    <Zap className="w-7 h-7 drop-shadow-[0_0_8px_currentColor]" />
                  </div>
                  <h4 className="text-3xl font-display font-black text-on-surface mb-3 group-hover:text-primary transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{cat.label}</h4>
                  <p className="text-base text-on-surface-variant font-medium leading-relaxed max-w-xs">{cat.desc}</p>
                </div>
                <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-15px] group-hover:translate-x-0 drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]">
                  Deploy Sector <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
