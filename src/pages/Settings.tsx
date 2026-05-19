import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Save, Bell, Globe, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'security' | 'profile' | 'preferences'>('security');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'security', label: 'Аюулгүй байдал', icon: ShieldCheck },
    { id: 'profile', label: 'Хэрэглэгчийн мэдээлэл', icon: User },
    { id: 'preferences', label: 'Тохиргоо', icon: Globe },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <h1 className="text-headline-xl text-on-surface mb-2">Системийн тохиргоо</h1>
          <p className="text-on-surface-variant font-medium">Өөрийн бүртгэл болон аюулгүй байдлын тохиргоог удирдах.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/profile')} className="px-8 py-3 rounded-xl border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-variant/20 transition-all">
            Профайл руу буцах
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3">
          <div className="glass-card rounded-3xl p-4 sticky top-28 space-y-2 border-outline-variant/10">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-2xl transition-all group text-left",
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                )}
              >
                <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-outline")} />
                <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
        </nav>

        {/* Settings Content */}
        <div className="lg:col-span-9">
          <section className="glass-surface rounded-[40px] p-12 border-outline-variant/10 shadow-2xl relative overflow-hidden min-h-[600px]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-60" />
            
            <form onSubmit={handleSave} className="space-y-12">
              {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-on-surface mb-6 flex items-center gap-3">
                      <Key className="w-6 h-6 text-primary" /> Нэвтрэх мэдээлэл
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-8">Нууц үгээ шинэчлэх. Найдвартай нууц үг ашиглахыг зөвлөж байна.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-3">
                      <label className="text-label-md text-primary ml-1">Одоогийн нууц үг</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 pl-16 pr-8 text-on-surface focus:border-primary outline-none transition-all font-mono" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-label-md text-primary ml-1">Шинэ нууц үг</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 pl-16 pr-8 text-on-surface focus:border-primary outline-none transition-all font-mono" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-label-md text-primary ml-1">Шинэ нууц үг давтах</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                        <input type="password" placeholder="••••••••" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 pl-16 pr-8 text-on-surface focus:border-primary outline-none transition-all font-mono" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-on-surface mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-primary" /> Хэрэглэгчийн мэдээлэл
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-8">Энэ мэдээлэл нь бусад хэрэглэгчдэд харагдах болно.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="space-y-3">
                      <label className="text-label-md text-primary ml-1">Хэрэглэгчийн нэр</label>
                      <input type="text" placeholder="e.g. Neon_Samurai" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-on-surface focus:border-primary outline-none transition-all font-display font-medium tracking-wide" />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-label-md text-primary ml-1">И-мэйл хаяг</label>
                      <input type="email" placeholder="samurai@zen-gamer.com" className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-on-surface focus:border-primary outline-none transition-all" />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-label-md text-primary ml-1">Танилцуулга</label>
                      <textarea rows={4} placeholder="Your legacy starts here..." className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-2xl py-5 px-8 text-on-surface focus:border-primary outline-none transition-all resize-none leading-relaxed" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-on-surface mb-6 flex items-center gap-3">
                      <Globe className="w-6 h-6 text-primary" /> Системийн тохиргоо
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-8">Мэдэгдэл болон бусад тохиргоог удирдах.</p>
                  </div>
                  
                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between p-6 bg-surface-container-high/50 rounded-2xl border border-outline-variant/20">
                      <div>
                        <h4 className="text-sm font-bold text-on-surface mb-1">Захиалгын мэдэгдэл (И-мэйл)</h4>
                        <p className="text-xs text-on-surface-variant">Захиалгын төлөв өөрчлөгдөх үед и-мэйл хүлээн авах.</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="w-5 h-5 bg-on-primary rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-surface-container-high/50 rounded-2xl border border-outline-variant/20">
                      <div>
                        <h4 className="text-sm font-bold text-on-surface mb-1">Зах зээлийн мэдээ</h4>
                        <p className="text-xs text-on-surface-variant">Шинэ үйлчилгээ, урамшууллын мэдээлэл авах.</p>
                      </div>
                      <div className="w-12 h-6 bg-surface-container-highest rounded-full relative cursor-pointer border border-outline-variant/30">
                        <div className="w-5 h-5 bg-outline rounded-full absolute left-0.5 top-0.5 shadow-md"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="pt-8 mt-8 border-t border-outline-variant/10">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-10 py-4 bg-primary text-on-primary font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />
                  ) : success ? (
                    <>Тохиргоо хадгалагдлаа <ShieldCheck className="w-5 h-5" /></>
                  ) : (
                    <>Хадгалах <Save className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
