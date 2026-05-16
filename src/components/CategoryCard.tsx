import { GraduationCap, Keyboard, Key, TrendingUp, Tag, Zap, Package } from 'lucide-react';
import { ServiceCategory } from '../types';
import { cn } from '../lib/utils';

const CATEGORY_ICONS: Record<ServiceCategory, any> = {
  'Coaching': GraduationCap,
  'Gear': Keyboard,
  'Rentals': Key,
  'Boosting': TrendingUp,
  'Marketplace': Tag,
  'Supplements': Zap,
  'Products': Package,
};

interface CategoryCardProps {
  category: ServiceCategory;
  title: string;
  description: string;
  image?: string;
  span?: string;
}

export default function CategoryCard({ category, title, description, image, span }: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category];

  return (
    <div className={cn(
      "rounded-xl glass-surface p-8 relative group overflow-hidden flex flex-col justify-end transition-all duration-300",
      span ? span : "h-[240px] hover:bg-surface-container-high/40"
    )}>
      {image && (
        <>
          <img 
            src={image} 
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" 
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </>
      )}
      <div className="relative z-10">
        <Icon className="w-6 h-6 text-primary mb-3" />
        <h3 className="text-headline-md text-on-surface">{title}</h3>
        <p className="text-sm text-on-surface-variant font-medium mt-1">{description}</p>
      </div>
    </div>
  );
}
