import { Link } from 'react-router-dom';
import { Globe, Share2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-10 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-display font-bold text-on-surface">Zen-Gamer</span>
          <p className="text-label-md text-on-surface-variant max-w-xs leading-relaxed">
            The world's most curated marketplace for elite digital gaming services and gear.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-12 md:gap-20">
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Platform</span>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline transition-all">About Us</Link>
              <Link to="/privacy" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline transition-all">Privacy Policy</Link>
              <Link to="/terms" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline transition-all">Terms of Service</Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Infrastructure</span>
            <div className="flex flex-col gap-3">
              <Link to="/status" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline transition-all">System Status</Link>
              <Link to="/support" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:underline transition-all">Help Center</Link>
            </div>
          </div>



        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 pb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant/10 pt-8">
        <p className="text-label-md text-on-surface-variant">
          © 2024 Zen-Gamer Marketplace. All rights reserved.
        </p>
        <div className="flex gap-6">
          <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">
            <Globe className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
