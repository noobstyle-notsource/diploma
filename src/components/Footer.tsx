import { Link } from 'react-router-dom';
import { Globe, Share2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest/20 backdrop-blur-xl border-t border-primary/20 shadow-[0_-4px_30px_rgba(0,255,204,0.1)]">
      <div className="max-w-7xl mx-auto px-10 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-display font-black text-gradient-cyber tracking-wider">ZEN-GAMER</span>
          <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed font-medium">
            Дижитал тоглоомын давуу тал болон шинэ үеийн тоног төхөөрөмжийг санал болгох дэлхийн хамгийн шилдэг платформ.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-12 md:gap-20">
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary drop-shadow-[0_0_8px_rgba(0,255,204,0.5)]">Платформ</span>
            <div className="flex flex-col gap-3">
              <Link to="/about" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all">Бидний тухай</Link>
              <Link to="/privacy" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all">Нууцлалын бодлого</Link>
              <Link to="/terms" className="text-sm font-medium text-on-surface-variant hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.5)] transition-all">Үйлчилгээний нөхцөл</Link>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary drop-shadow-[0_0_8px_rgba(191,127,255,0.5)]">Тусламж</span>
            <div className="flex flex-col gap-3">
              <Link to="/support" className="text-sm font-medium text-on-surface-variant hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(191,127,255,0.5)] transition-all">Тусламжийн төв</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-10 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline-variant/40 pt-8">
        <p className="text-xs text-on-surface-variant font-medium">
          © 2026 Zen-Gamer Sanctuary. Бүх эрх хуулиар хамгаалагдсан.
        </p>
        <div className="flex gap-6">
          <button className="w-10 h-10 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:scale-110 transition-all">
            <Globe className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:scale-110 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:scale-110 transition-all">
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
