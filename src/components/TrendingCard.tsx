import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Service } from '../types';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

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

export default function TrendingCard({ service }: { service: Service; key?: string }) {
  const [imgSrc, setImgSrc] = React.useState(service.image || GET_PLACEHOLDER(service.category));

  React.useEffect(() => {
    if (service.image) setImgSrc(service.image);
  }, [service.image]);

  return (
    <div className="glass-surface rounded-xl overflow-hidden glass-edge group flex flex-col hover:border-primary/40 transition-all duration-300">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={imgSrc} 
          onError={() => setImgSrc(GET_PLACEHOLDER(service.category))}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          alt={service.title}
        />
        <div className="absolute top-3 right-3 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20">
          <span className="text-secondary text-[10px] font-bold tracking-widest uppercase">
            {service.category.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-display font-semibold text-on-surface">{service.title}</h4>
          {service.verified && (
            <Star className="w-4 h-4 text-primary fill-primary" />
          )}
        </div>
        <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
          {service.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              {service.priceUnit || 'Starting at'}
            </span>
            <span className="text-xl font-display font-bold text-secondary">
              ₮{service.price.toLocaleString()}
            </span>
          </div>
          <Link 
            to={`/services/${service.id}`}
            className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-90"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
