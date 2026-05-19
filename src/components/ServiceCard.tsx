import React from 'react';
import { ArrowRight, Star, ShieldCheck, Zap, Brain, MessageSquare, ShoppingCart } from 'lucide-react';
import { Service } from '../types';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

import gearPlaceholder from '../assets/placeholders/gear.png';
import boostingPlaceholder from '../assets/placeholders/boosting.png';
import coachingPlaceholder from '../assets/placeholders/coaching.png';
import supplementsPlaceholder from '../assets/placeholders/supplements.png';

const CATEGORY_ICONS: Record<string, any> = {
  'Verified': ShieldCheck,
  'Popular': Star,
  'Speed': Zap,
  'Skill': Brain,
  'Support': MessageSquare,
};

const GET_PLACEHOLDER = (category: string) => {
  switch (category) {
    case 'Gear': return gearPlaceholder;
    case 'Supplements': return supplementsPlaceholder;
    case 'Coaching': return coachingPlaceholder;
    case 'Boosting': return boostingPlaceholder;
    default: return gearPlaceholder;
  }
};

export default function ServiceCard({ service }: { service: any; index?: number }) {
  const getServiceImg = () => service.image || service.images?.[0] || GET_PLACEHOLDER(service.category);
  const [imgSrc, setImgSrc] = React.useState(getServiceImg());

  React.useEffect(() => {
    setImgSrc(getServiceImg());
  }, [service.image, service.images]);

  const price = service.price ?? service.pro_price ?? service.basic_price ?? service.tiers?.[1]?.price ?? service.tiers?.[0]?.price ?? 0;
  const priceUnit = service.priceUnit ?? service.per_unit ?? 'From';
  const isVerified = service.verified ?? !!service.tag;

  return (
    <Link 
      to={`/services/${service.id}`}
      className="glass-card rounded-[36px] overflow-hidden group flex flex-col border border-primary/20 hover:border-primary hover:shadow-[0_12px_40px_rgba(0,255,204,0.25)] hover:-translate-y-2.5 transition-all duration-500 bg-surface-container-highest/20 backdrop-blur-xl cursor-pointer"
    >
      <div className="h-60 overflow-hidden relative bg-surface-container-highest/50">
        <img 
          src={imgSrc} 
          onError={() => setImgSrc(GET_PLACEHOLDER(service.category))}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal" 
          alt={service.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest/90 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 scanline opacity-30 group-hover:opacity-60 transition-opacity z-10" />
        
        <div className="absolute top-4 right-4 bg-surface-container-highest/90 backdrop-blur-2xl px-4 py-1.5 rounded-full border border-primary/40 shadow-[0_0_15px_rgba(0,255,204,0.2)] z-20">
          <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]">
            {service.category.toUpperCase()}
          </span>
        </div>
        {service.category === 'Gear' && (service.wearCondition || service.wear_condition) && (
          <div className="absolute top-4 left-4 bg-surface-container-highest/90 backdrop-blur-2xl px-4 py-1.5 rounded-full border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.2)] z-20">
            <span className="text-yellow-400 text-[10px] font-black tracking-[0.2em] uppercase drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">
              {service.wearCondition || service.wear_condition}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-20 -mt-6 bg-surface-container-highest/40 backdrop-blur-2xl rounded-t-[28px] border-t border-primary/20">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h4 className="text-xl font-display font-black text-on-surface group-hover:text-primary transition-colors line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{service.title}</h4>
          {isVerified && (
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shadow-[0_0_10px_rgba(0,255,204,0.3)] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-primary drop-shadow-[0_0_5px_rgba(0,255,204,1)]" />
            </div>
          )}
        </div>
        <p className="text-xs text-on-surface-variant mb-8 line-clamp-2 leading-relaxed font-medium">
          {service.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/40">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">
              {priceUnit}
            </span>
            <span className="text-2xl font-display font-black text-primary drop-shadow-[0_0_12px_rgba(0,255,204,0.8)] group-hover:scale-105 transition-transform origin-left">
              ₮{price.toLocaleString()}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-[0_0_25px_rgba(0,255,204,0.8)] group-hover:scale-110 transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(0,255,204,0.15)]">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );

}
