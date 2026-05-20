import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, ArrowRight, Building2, User, CreditCard, AlertCircle, 
  Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, Loader2
} from 'lucide-react';
import { auth, withdrawals, type AuthUser, type Withdrawal } from '../lib/api';

export default function WalletPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [bankName, setBankName] = useState('Хаан Банк');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const banks = [
    'Хаан Банк',
    'Голомт Банк',
    'Төрийн Банк',
    'Худалдаа Хөгжлийн Банк',
    'Хас Банк',
    'Капитрон Банк',
    'Богд Банк',
    'М Банк'
  ];

  const fetchData = async () => {
    try {
      const [me, wHistory] = await Promise.all([
        auth.me(),
        withdrawals.mine()
      ]);
      setUser(me);
      setHistory(wHistory);
    } catch (err: any) {
      console.error('Wallet fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!accountNumber.trim()) { setError('Дансны дугаараа оруулна уу.'); return; }
    if (!accountHolder.trim()) { setError('Дансны эзэмшигчийн нэрээ оруулна уу.'); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { 
      setError('Зөв татах дүн оруулна уу.'); 
      return; 
    }
    
    const amt = Number(amount);
    if (user && (user.balance ?? 0) < amt) {
      setError('Таны баланс хүрэлцэхгүй байна.');
      return;
    }

    setSubmitLoading(true);
    try {
      await withdrawals.create(amt, bankName, accountNumber.trim(), accountHolder.trim());
      setSuccess(`💸 ₮${amt.toLocaleString()} татан авалтын хүсэлт амжилттай бүртгэгдлээ!`);
      setAccountNumber('');
      setAccountHolder('');
      setAmount('');
      // Refresh wallet data
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Хүсэлт илгээхэд алдаа гарлаа.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant font-black uppercase tracking-[0.2em] text-xs">Хэтэвчийг ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="p-3 rounded-full hover:bg-surface-container-high transition-colors">
            <ArrowRight className="w-6 h-6 rotate-180" />
          </Link>
          <div>
            <h1 className="text-headline-xl text-on-surface font-display">Миний Хэтэвч</h1>
            <p className="text-sm text-on-surface-variant">Баланс хянах болон хувийн данс руугаа мөнгө татах хэсэг</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl text-primary text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Санхүү хамгаалагдсан
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Balance Card & Form */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Glowing Balance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative glass-surface rounded-[32px] p-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,255,204,0.1)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">БОЛОМЖИТ ҮЛДЭГДЭЛ</span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,204,0.2)]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <span className="text-sm text-on-surface-variant font-medium">Нийт үлдэгдэл</span>
              <div className="text-5xl font-display font-black text-on-surface flex items-baseline gap-1">
                <span className="text-secondary font-sans text-4xl">₮</span>
                {(user?.balance ?? 0).toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/10 text-xs text-on-surface-variant leading-relaxed">
              ⚠️ Дундын данс (Escrow) гүйлгээ цуцлагдсан эсвэл борлуулалт амжилттай баталгаажсан тохиолдолд таны энэхүү балансад мөнгө орно. Та балансаасаа өөрийн данс руу хэзээд татан авах боломжтой.
            </div>
          </motion.div>

          {/* Withdrawal Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[32px] p-8 border border-outline-variant/10 shadow-xl"
          >
            <h3 className="text-lg font-display font-bold text-on-surface mb-6 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-secondary" /> Мөнгө татах хүсэлт
            </h3>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-3 mb-6">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-6">
              
              {/* Bank Name Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Сонгох Банк</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <select 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-xl py-3.5 pl-12 pr-6 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer text-on-surface"
                  >
                    {banks.map(b => (
                      <option key={b} value={b} className="bg-surface-container-highest text-on-surface">{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Дансны дугаар</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input 
                    type="text" 
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Жишээ: 5021XXXXXX" 
                    className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-xl py-3.5 pl-12 pr-6 text-sm focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Account Holder */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Дансны эзэмшигчийн нэр</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input 
                    type="text" 
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                    placeholder="Жишээ: БАТ ОЧИР" 
                    className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-xl py-3.5 pl-12 pr-6 text-sm focus:border-primary outline-none transition-all tracking-wide"
                  />
                </div>
              </div>

              {/* Amount to Withdraw */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Татах дүн (₮)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">₮</span>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="0" 
                    className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-xl py-3.5 pl-8 pr-20 text-sm focus:border-primary outline-none transition-all font-display font-bold text-secondary"
                  />
                  <button 
                    type="button"
                    onClick={() => setAmount(String(Math.floor(user?.balance ?? 0)))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-primary hover:brightness-110 px-2 py-1 rounded bg-primary/10"
                  >
                    БҮГД
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                disabled={submitLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-xs uppercase tracking-[0.2em] py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Хүсэлт илгээх <ArrowRight className="w-4 h-4" /></>}
              </button>

            </form>
          </motion.div>

        </div>

        {/* Right Column: Transaction & Withdrawal History */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[32px] p-8 border border-outline-variant/10 shadow-xl min-h-[600px] flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-8 flex items-center gap-3">
                <ArrowDownLeft className="w-6 h-6 text-primary" /> Татан авалтын түүх
              </h3>

              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-on-surface-variant">
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-on-surface-variant/40" />
                    </div>
                    <p className="text-sm font-medium">Одоогоор татан авалтын түүх байхгүй байна.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-5 rounded-2xl bg-surface-container-low/40 border border-outline-variant/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-surface-container-high/30 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant flex-shrink-0">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-on-surface flex items-center gap-2">
                            <span>{item.bank_name}</span>
                            <span className="text-xs font-mono font-medium text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                              {item.account_number}
                            </span>
                          </div>
                          <div className="text-[10px] text-on-surface-variant mt-1">
                            Эзэмшигч: {item.account_holder} • {new Date(item.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right w-full md:w-auto flex md:flex-col justify-between md:justify-start items-center md:items-end">
                        <div className="text-lg font-display font-bold text-secondary">
                          -₮{item.amount.toLocaleString()}
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-1 px-3 py-1 rounded-full border ${
                          item.status === 'COMPLETED' ? 'text-green-400 bg-green-400/5 border-green-400/10' :
                          item.status === 'CANCELLED' ? 'text-red-400 bg-red-400/5 border-red-400/10' :
                          'text-yellow-400 bg-yellow-400/5 border-yellow-400/10'
                        }`}>
                          {item.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> :
                           item.status === 'CANCELLED' ? <XCircle className="w-3 h-3" /> :
                           <Clock className="w-3 h-3 animate-pulse" />}
                          {item.status === 'COMPLETED' ? 'БАТАЛГААЖСАН' :
                           item.status === 'CANCELLED' ? 'ЦУЦЛАГДСАН' : 'ХҮЛЭЭГДЭЖ БУЙ'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-outline-variant/10 mt-8 text-center text-xs text-on-surface-variant font-medium">
              💡 Асуух зүйл гарвал <Link to="/support" className="text-primary hover:underline font-bold">Хэрэглэгчийн Дэмжлэг</Link>-тэй холбогдоно уу.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
