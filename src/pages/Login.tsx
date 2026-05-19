import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Headset, ShieldCheck, AtSign, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { auth, setToken } from '../lib/api';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Fetch user info from Google
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();
        
        const apiRes = await auth.googleLogin(googleUser.email, googleUser.name);
        setToken(apiRes.token);
        navigate('/');
      } catch (err: any) {
        setError(err.message ?? 'Google Login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Login failed')
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await auth.login(email, password);
      setToken(res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
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
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-headline-xl text-primary mb-4"
            >
              Zen-Gamer
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-on-surface-variant max-w-[320px] mx-auto font-medium"
            >
              Тавтай морил. Жинхэнэ тоглогчдод зориулсан орчин.
            </motion.p>
          </div>

          {/* Login Card */}
          <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-surface rounded-3xl p-10 shadow-2xl relative overflow-hidden glass-edge"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-40" />
          
          <div className="flex flex-col gap-8">
            <h2 className="text-headline-md text-on-surface text-center">Тавтай морил</h2>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              {/* Account ID */}
              <div className="flex flex-col gap-2">
                <label className="text-label-md text-on-surface-variant ml-1" htmlFor="email">Бүртгэлтэй И-мэйл</label>
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
                <div className="flex justify-between items-center ml-1">
                  <label className="text-label-md text-on-surface-variant" htmlFor="password">Нууц үг</label>
                  <Link to="/forgot-password" className="text-label-md text-secondary hover:text-secondary-fixed-dim transition-colors lowercase tracking-normal">Нууц үгээ мартсан уу?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-surface-container-low/30 border border-outline-variant/40 rounded-xl py-4 pl-12 pr-12 font-body-md text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-on-secondary font-bold text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-secondary/90 transition-all active:scale-[0.98] mt-4 shadow-xl shadow-secondary/10 disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-on-secondary/20 border-t-on-secondary rounded-full animate-spin" />
                ) : 'Нэвтрэх'}
              </button>
            </form>

            <div className="space-y-4">
              <button 
                type="button"
                onClick={() => handleGoogleLogin()}
                className="w-full bg-white text-[#1f1f1f] font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google-ээр нэвтрэх
              </button>
            </div>


              <div className="flex items-center gap-4 my-2">
                <div className="flex-grow h-[1px] bg-outline-variant/20" />
                <span className="text-[10px] font-black text-outline-variant uppercase tracking-[0.2em]">Шинэ хэрэглэгч үү?</span>
                <div className="flex-grow h-[1px] bg-outline-variant/20" />
              </div>


              {/* Register */}
              <Link
                to="/register"
                className="w-full text-center border border-outline-variant/40 text-on-surface font-bold text-sm uppercase tracking-widest py-5 rounded-xl hover:bg-surface-variant/20 transition-all active:scale-[0.98]"
              >
                Бүртгүүлэх
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
