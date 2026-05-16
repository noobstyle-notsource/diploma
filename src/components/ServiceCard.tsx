import React from 'react';
import { ArrowRight, Star, ShieldCheck, Zap, Brain, MessageSquare } from 'lucide-react';
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

export default function ServiceCard({ service }: { service: Service; key?: string }) {
  const [imgSrc, setImgSrc] = React.useState(service.image || GET_PLACEHOLDER(service.category));

  React.useEffect(() => {
    if (service.image) setImgSrc(service.image);
  }, [service.image]);

  return (
    <Link 
      to={`/services/${service.id}`}
      className="glass-card rounded-[24px] overflow-hidden flex flex-col group hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(129,212,220,0.15)] hover:-translate-y-2 hover:scale-[1.03] border border-outline-variant/10 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imgSrc} 
          onError={() => setImgSrc(GET_PLACEHOLDER(service.category))}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          alt={service.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 right-4 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20">
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
            {service.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-display font-semibold text-on-surface group-hover:text-primary transition-colors">
            {service.title}
          </h4>
          {service.verified && (
            <ShieldCheck className="w-5 h-5 text-primary fill-primary/10" />
          )}
        </div>
        
        <p className="text-on-surface-variant text-sm mb-8 flex-grow leading-relaxed line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              {service.priceUnit || 'From'}
            </span>
            <span className="text-xl font-display font-bold text-secondary">
              ₮{service.price.toLocaleString()}
            </span>
          </div>
          <div className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
            View Details
          </div>
        </div>

      </div>
    </Link>
  );

}
