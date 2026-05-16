import React, { useState } from 'react';
import { AtSign, ArrowLeft, Send, ShieldCheck, Headset } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-[#10131a] relative flex flex-col font-sans text-on-surface overflow-hidden">
      {/* Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-mesh opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none">
          <div className="w-full h-full bg-primary blur-[160px] rounded-full absolute -top-1/4 -left-1/4" />
          <div className="w-full h-full bg-secondary blur-[160px] rounded-full absolute -bottom-1/4 -right-1/4" />
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[440px]">
          {/* Brand Identity */}
          <div className="text-center mb-12">
            <Link to="/login" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Back to Login</span>
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-headline-xl text-primary mb-4"
            >
              Access Recovery
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-on-surface-variant max-w-[320px] mx-auto font-medium"
            >
              Lost your access key? No problem. Provide your registered identifier to reset.
            </motion.p>
          </div>

          {/* Reset Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-surface rounded-3xl p-10 shadow-2xl relative overflow-hidden glass-edge"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-40" />
            
            {!emailSent ? (
              <div className="flex flex-col gap-8">
                <h2 className="text-headline-md text-on-surface text-center">Reset Access</h2>
                
                <form className="flex flex-col gap-6" onSubmit={handleReset}>
                  <div className="flex flex-col gap-2">
                    <label className="text-label-md text-on-surface-variant ml-1" htmlFor="email">Account Email</label>
                    <div className="relative group">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                      <input 
                        id="email"
                        type="email" 
                        placeholder="gamer@zen.com" 
                        className="w-full bg-surface-container-low/30 border border-outline-variant/40 rounded-xl py-4 pl-12 pr-4 font-body-md text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-on-primary font-bold text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] mt-4 shadow-xl shadow-primary/10 flex items-center justify-center gap-3"
                  >
                    <Send className="w-4 h-4" /> Send Recovery Key
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-8 text-center py-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-headline-md text-on-surface mb-4">Check Your Inbox</h2>
                  <p className="text-on-surface-variant font-medium leading-relaxed">
                    If an account exists for that email, we've sent instructions to reset your access key.
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-surface-container-highest/50 text-on-surface font-bold text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-surface-variant transition-all active:scale-[0.98] mt-4"
                >
                  Return to Login
                </button>
              </div>
            )}
          </motion.div>

          {/* Footer Items */}
          <div className="mt-12 flex justify-center gap-12">
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
              <Headset className="w-5 h-5 group-hover:animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-widest">Support</span>
            </button>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Trust</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
