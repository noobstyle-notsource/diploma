import React, { useState } from 'react';
import { AtSign, Lock, User, ShieldCheck, Headset, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { auth, setToken } from '../lib/api';
import { useGoogleLogin } from '@react-oauth/google';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();
        
        const apiRes = await auth.googleLogin(googleUser.email, googleUser.name);
        setToken(apiRes.token);
        navigate('/');
      } catch (err: any) {
        setError(err.message ?? 'Google Signup failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Signup failed')
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await auth.register(name.trim(), email.trim(), password);
      setToken(res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            <Link to="/" className="inline-block">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-headline-xl text-primary mb-4"
              >
                Zen-Gamer
              </motion.h1>
            </Link>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-on-surface-variant max-w-[320px] mx-auto font-medium"
            >
              Өнөөдөр нэгдээрэй. Тоглоомын шилдэг үйлчилгээ, бүтээгдэхүүнийг нэг дороос.
            </motion.p>
          </div>

          {/* Register Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-surface rounded-3xl p-10 shadow-2xl relative overflow-hidden glass-edge"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-40" />
            
            <div className="flex flex-col gap-8">
              <h2 className="text-headline-md text-on-surface text-center">Бүртгэл үүсгэх</h2>

              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                {/* Username */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant ml-1" htmlFor="name">Хэрэглэгчийн нэр</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      id="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alex_Vortex" 
                      className="w-full bg-surface-container-low/30 border border-outline-variant/40 rounded-xl py-4 pl-12 pr-4 font-body-md text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant ml-1" htmlFor="email">И-мэйл хаяг</label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="gamer@zen.com" 
                      className="w-full bg-surface-container-low/30 border border-outline-variant/40 rounded-xl py-4 pl-12 pr-4 font-body-md text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant ml-1" htmlFor="password">Нууц үг</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                    <input 
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-surface-container-low/30 border border-outline-variant/40 rounded-xl py-4 pl-12 pr-4 font-body-md text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 ml-1">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-outline-variant bg-transparent text-primary focus:ring-primary" required />
                  <label htmlFor="terms" className="text-xs text-on-surface-variant leading-relaxed">
                    Би <Link to="#" className="text-secondary hover:underline">Үйлчилгээний нөхцөл</Link> болон <Link to="#" className="text-secondary hover:underline">Нууцлалын бодлогыг</Link> зөвшөөрч байна.
                  </label>
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-bold text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] mt-4 shadow-xl shadow-primary/10 disabled:opacity-60 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />
                  ) : 'Бүртгүүлэх'}
                </button>
              </form>

              <div className="space-y-4">
                <button 
                  type="button"
                  onClick={() => handleGoogleSignup()}
                  className="w-full bg-white text-[#1f1f1f] font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google-ээр бүртгүүлэх
                </button>
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-grow h-[1px] bg-outline-variant/20" />
                <span className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em]">Бүртгэлтэй юу?</span>
                <div className="flex-grow h-[1px] bg-outline-variant/20" />
              </div>


              {/* Login Link */}
              <Link 
                to="/login"
                className="w-full text-center border border-outline-variant/40 text-on-surface font-bold text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-surface-variant/20 transition-all active:scale-[0.98]"
              >
                Нэвтрэх
              </Link>
            </div>
          </motion.div>

          {/* Footer Items */}
          <div className="mt-12 flex justify-center gap-12">
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
              <Headset className="w-5 h-5 group-hover:animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-widest">Тусламж</span>
            </button>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Баталгаа</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
