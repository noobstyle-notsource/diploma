import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, ArrowRight, Tag, Key, CheckCircle, Building2, User, CreditCard, AlertCircle, 
  Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, Loader2
} from 'lucide-react';
import { auth, withdrawals, escrow, type AuthUser, type Withdrawal, type EscrowTrade } from '../lib/api';
import { cn } from '../lib/utils';
import { useSearchParams } from 'react-router-dom';

export default function WalletPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [escrowTrades, setEscrowTrades] = useState<EscrowTrade[]>([]);
  const [credsInput, setCredsInput] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'wallet' | 'escrow'>(searchParams.get('tab') === 'escrow' ? 'escrow' : 'wallet');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [bankName, setBankName] = useState('Хаан Банк');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING_SELLER_CREDS': return 'Ð¢Ó¨Ð›Ð‘Ó¨Ð  ÐžÐ Ð¡ÐžÐ - Ð¥Ð£Ð”ÐÐ›Ð”ÐÐ“Ð§Ð˜Ð™Ð“ Ð¥Ò®Ð›Ð­Ð­Ð– Ð‘Ð£Ð™';
      case 'PENDING_MIDDLEMAN_VERIFICATION': return 'Ð—Ð£Ð£Ð§Ð›ÐÐ“Ð§ Ð¥Ð¯ÐÐÐ– Ð‘ÐÐ™ÐÐ';
      case 'COMPLETED': return 'ÐÐœÐ–Ð˜Ð›Ð¢Ð¢ÐÐ™ Ð”Ð£Ð£Ð¡Ð¡ÐÐ';
      case 'CANCELLED': return 'Ð¦Ð£Ð¦Ð›ÐÐ“Ð”Ð¡ÐÐ';
      default: return status;
    }
  };

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
      const [me, wHistory, eData] = await Promise.all([
        auth.me(),
        withdrawals.mine(),
        escrow.list().catch(() => [])
      ]);
      setUser(me);
      setHistory(wHistory);
      setEscrowTrades(eData || []);
    } catch (err: any) {
      console.error('Wallet fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitCreds = async (id: string) => {
    const creds = credsInput[id];
    if (!creds?.trim()) { alert('Дансны мэдээллээ оруулна уу'); return; }
    try {
      await escrow.submitCreds(id, creds);
      setEscrowTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'PENDING_MIDDLEMAN_VERIFICATION', account_credentials: creds } : t));
      alert('Мэдээллийг дундын дансны зохицуулагчид амжилттай илгээлээ!');
    } catch (err: any) { alert(err.message || 'Failed to submit credentials'); }
  };

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

      
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-low border border-outline-variant/10 rounded-3xl mb-12 w-fit">
        {(['wallet', 'escrow'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer",
              activeTab === tab 
                ? "bg-primary text-on-primary shadow-lg" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            )}
          >
            {tab === 'escrow' ? 'Дундын данс' : 'Хэтэвч & Татан авалт'}
          </button>
        ))}
      </div>

      {activeTab === 'wallet' && (
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
      )}

      {activeTab === 'escrow' && (
        <div className="space-y-8">

          <div className="glass-card rounded-[48px] border border-outline-variant/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">╨£╨╕╨╜╨╕╨╣ ╨┤╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨│╥»╨╣╨╗╨│╤ì╤ì╨╜╥»╥»╨┤</h3>
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                ╨ö╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨╜╨░╨╣╨┤╨▓╨░╤Ç╤é╨░╨╣ ╨│╥»╨╣╨╗╨│╤ì╤ì╨│╤ì╤ì ╤à╤Å╨╜╨░╤à. ╨Ñ╤â╨┤╨░╨╗╨┤╨░╨╜ ╨░╨▓╨░╨│╤ç ╨╝╙⌐╨╜╨│╙⌐╙⌐ ╨▒╨░╨╣╤Ç╤ê╤â╤â╨╗╨╢, ╤à╤â╨┤╨░╨╗╨┤╨░╨│╤ç ╨┤╨░╨╜╤ü╨╜╤ï ╨╝╤ì╨┤╤ì╤ì╨╗╨╗╤ì╤ì ╨╛╤Ç╤â╤â╨╗╨╢ ╤ê╨░╨╗╨│╤â╤â╨╗╨╜╨░.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-6 py-3 rounded-2xl text-yellow-400 text-xs font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> ╨ö╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨░╨░╤Ç ╤à╨░╨╝╨│╨░╨░╨╗╨░╨│╨┤╤ü╨░╨╜
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {escrowTrades.length === 0 ? (
              <div className="glass-surface rounded-[40px] p-16 text-center border border-outline-variant/10">
                <ShieldCheck className="w-12 h-12 text-outline mx-auto mb-4 opacity-40" />
                <h4 className="text-lg font-bold text-on-surface mb-2">╨ö╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨│╥»╨╣╨╗╨│╤ì╤ì ╨╛╨╗╨┤╤ü╨╛╨╜╨│╥»╨╣</h4>
                <p className="text-xs text-on-surface-variant">╨ó╨░╨╜╨┤ ╨╕╨┤╤ì╨▓╤à╤é╤ì╨╣ ╤ì╤ü╨▓╤ì╨╗ ╙⌐╨╝╨╜╙⌐╤à ╨┤╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨│╥»╨╣╨╗╨│╤ì╤ì ╨▒╨░╨╣╤à╨│╥»╨╣ ╨▒╨░╨╣╨╜╨░.</p>
              </div>
            ) : (
              escrowTrades.map((trade) => {
                const isBuyer = trade.buyer_id === user?.id;
                const isSeller = trade.seller_id === user?.id;

                return (
                  <div key={trade.id} className="glass-card rounded-[40px] border border-outline-variant/10 p-8 shadow-2xl relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 pb-6 border-b border-outline-variant/5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs text-primary font-bold">#{trade.id.slice(0, 8)}</span>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            trade.status === 'COMPLETED' ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                            trade.status === 'CANCELLED' ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                            trade.status === 'PENDING_MIDDLEMAN_VERIFICATION' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse" :
                            "bg-green-500/10 text-green-400 border border-green-500/20"
                          )}>
                            {getStatusLabel(trade.status)}
                          </span>
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest",
                            isBuyer ? "bg-secondary/10 text-secondary" : "bg-purple-500/10 text-purple-400"
                          )}>
                            {isBuyer ? '╨Ñ╨ú╨ö╨É╨¢╨ö╨É╨¥ ╨É╨Æ╨É╨ô╨º' : '╨Ñ╨ú╨ö╨É╨¢╨ö╨É╨ô╨º'}
                          </span>
                        </div>
                        <h4 className="text-lg font-display font-bold text-on-surface">{trade.product_title}</h4>
                        <div className="text-xs text-on-surface-variant mt-1">
                          ╨Ñ╤â╨┤╨░╨╗╨┤╨░╨╜ ╨░╨▓╨░╨│╤ç: <span className="text-on-surface font-bold">{trade.buyer_name}</span> | ╨Ñ╤â╨┤╨░╨╗╨┤╨░╨│╤ç: <span className="text-on-surface font-bold">{trade.seller_name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-on-surface-variant block mb-1">╨ö╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨░╨╜ ╨┤╨░╤à╤î ╨┤╥»╨╜</span>
                        <span className="text-2xl font-display font-bold text-primary">Γé«{trade.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {isSeller && trade.status === 'PENDING_SELLER_CREDS' && (
                      <div className="bg-surface-container-high/60 border border-outline-variant/10 rounded-3xl p-6 mb-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-yellow-400">
                          <Key className="w-4 h-4" /> ╨¿╨░╨░╤Ç╨┤╨╗╨░╨│╨░╤é╨░╨╣ ╥»╨╣╨╗╨┤╤ì╨╗: ╨ö╨░╨╜╤ü╨╜╤ï ╨╝╤ì╨┤╤ì╤ì╨╗╨╗╤ì╤ì ╨╛╤Ç╤â╤â╨╗╨░╤à
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          ╨¥╤ì╨▓╤é╤Ç╤ì╤à ╨╜╤ì╤Ç, ╨╜╤â╤â╤å ╥»╨│ ╨▒╨╛╨╗╨╛╨╜ ╨▒╤â╤ü╨░╨┤ ╤ê╨░╨░╤Ç╨┤╨╗╨░╨│╨░╤é╨░╨╣ ╨╖╨░╨░╨▓╤Ç╤ï╨│ ╨╛╤Ç╤â╤â╨╗╨╜╨░ ╤â╤â. ╨¡╨┤╨│╤ì╤ì╤Ç╨╕╨╣╨│ ╨┤╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨╖╨╛╤à╨╕╤å╤â╤â╨╗╨░╨│╤ç ╤ê╨░╨╗╨│╨░╤à ╨▒╨╛╨╗╨╜╨╛.
                        </p>
                        <textarea
                          rows={4}
                          value={credsInput[trade.id] || ''}
                          onChange={e => setCredsInput({ ...credsInput, [trade.id]: e.target.value })}
                          placeholder="╨¥╤ì╨▓╤é╤Ç╤ì╤à ╨╜╤ì╤Ç: elite_gamer&#10;╨¥╤â╤â╤å ╥»╨│: ********&#10;╨¥╤ì╨╝╤ì╨╗╤é: Steam-╤ì╤ì╤Ç ╨╜╤ì╨▓╤é╤ì╤Ç╨╜╤ì..."
                          className="w-full bg-black/50 border border-outline-variant/20 rounded-2xl py-4 px-6 text-xs font-mono text-primary focus:border-primary outline-none transition-all resize-none"
                        />
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => handleSubmitCreds(trade.id)}
                            className="px-8 py-3 bg-primary text-on-primary font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          >
                            ╨£╤ì╨┤╤ì╤ì╨╗╨╗╨╕╨╣╨│ ╨┤╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨░╨╜╨┤ ╨╕╨╗╨│╤ì╤ì╤à
                          </button>
                        </div>
                      </div>
                    )}

                    {isBuyer && trade.status !== 'CANCELLED' && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-[0_0_20px_rgba(34,197,94,0.08)]">
                        <div className="flex items-center gap-3 text-green-400">
                          <ShieldCheck className="w-6 h-6 animate-pulse flex-shrink-0" />
                          <div>
                            <div className="font-display font-black text-sm uppercase tracking-wide">
                              ≡ƒöÆ ╨ó╙¿╨¢╨æ╙¿╨á ╨ö╨ú╨¥╨ö╨½╨¥ ╨ö╨É╨¥╨í╨É╨¥╨ö ╨É╨£╨û╨ÿ╨¢╨ó╨ó╨É╨Ö ╨æ╨É╨Ö╨á╨¿╨¢╨É╨É!
                            </div>
                            <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                              ╨ó╨░╨╜╤ï Γé«{trade.amount.toLocaleString()} ╤é╙⌐╨╗╨▒╙⌐╤Ç ╨╝╨░╨╜╨░╨╣ ╨┤╤â╨╜╨┤╤ï╨╜ ╤à╨░╨╝╨│╨░╨░╨╗╨░╨╗╤é╤ï╨╜ ╨┤╨░╨╜╤ü╨░╨╜╨┤ ╨░╨╝╨╢╨╕╨╗╤é╤é╨░╨╣ ╨╛╤Ç╨╢ ╨░╤Ä╤â╨╗╨│╥»╨╣ ╤à╨░╨┤╨│╨░╨╗╨░╨│╨┤╨╗╨░╨░. ╨Ñ╤â╨┤╨░╨╗╨┤╨░╨│╤ç ╨┤╨░╨╜╤ü╨╜╤ï ╨╝╤ì╨┤╤ì╤ì╨╗╨╗╤ì╤ì ╨╛╤Ç╤â╤â╨╗╨╝╨░╨│╤å ╨╖╤â╤â╤ç╨╗╨░╨│╤ç ╤à╤Å╨╜╨░╨╜ ╨▒╨░╤é╨░╨╗╨│╨░╨░╨╢╤â╤â╨╗╨╜╨░.
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-xl">
                          ╨ó╙¿╨¢╨æ╙¿╨á ╨æ╨É╨ó╨É╨¢╨ô╨É╨É╨û╨í╨É╨¥
                        </span>
                      </div>
                    )}

                    {isBuyer && trade.status === 'PENDING_SELLER_CREDS' && (
                      <div className="bg-surface-container-high/40 border border-outline-variant/5 rounded-3xl p-6 text-xs text-on-surface-variant flex items-center gap-3 font-medium">
                        <Clock className="w-5 h-5 text-primary animate-pulse flex-shrink-0" /> ╨Ñ╤â╨┤╨░╨╗╨┤╨░╨│╤ç ╨┤╨░╨╜╤ü╨╜╤ï ╨╝╤ì╨┤╤ì╤ì╨╗╨╗╤ì╤ì ╨╛╤Ç╤â╤â╨╗╨░╤à╤ï╨│ ╤à╥»╨╗╤ì╤ì╨╢ ╨▒╨░╨╣╨╜╨░.
                      </div>
                    )}

                    {trade.status === 'PENDING_MIDDLEMAN_VERIFICATION' && (
                      <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-3xl p-6 text-xs text-yellow-400 flex items-center gap-3 font-medium">
                        <ShieldCheck className="w-5 h-5 animate-pulse flex-shrink-0" /> ╨£╤ì╨┤╤ì╤ì╨╗╤ì╨╗ ╨╕╨╗╨│╤ì╤ì╨│╨┤╤ü╤ì╨╜. ╨ö╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨╖╨╛╤à╨╕╤å╤â╤â╨╗╨░╨│╤ç ╨▒╥»╤Ç╤é╨│╤ì╨╗╨╕╨╣╨│ ╤ê╨░╨╗╨│╨░╨╢ ╨▒╨░╨╣╨╜╨░.
                      </div>
                    )}

                    {trade.status === 'COMPLETED' && (
                      <div className="bg-green-500/5 border border-green-500/10 rounded-3xl p-6 space-y-3 text-xs text-green-400 font-medium">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 flex-shrink-0" /> ╨ô╥»╨╣╨╗╨│╤ì╤ì╨│ ╨┤╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨╖╨╛╤à╨╕╤å╤â╤â╨╗╨░╨│╤ç ╨░╨╝╨╢╨╕╨╗╤é╤é╨░╨╣ ╨▒╨░╤é╨░╨╗╨│╨░╨░╨╢╤â╤â╨╗╨╗╨░╨░.
                        </div>
                        {isBuyer && trade.account_credentials && (
                          <div className="bg-black/50 p-4 rounded-2xl font-mono text-xs text-primary border border-primary/20 whitespace-pre-wrap select-all mt-2">
                            <div className="text-[10px] text-outline uppercase tracking-widest mb-1">╨æ╨░╤é╨░╨╗╨│╨░╨░╨╢╤ü╨░╨╜ ╨┤╨░╨╜╤ü╨╜╤ï ╨╝╤ì╨┤╤ì╤ì╨╗╤ì╨╗:</div>
                            {trade.account_credentials}
                          </div>
                        )}
                      </div>
                    )}

                    {trade.status === 'CANCELLED' && (
                      <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 text-xs text-red-400 flex items-center gap-3 font-medium">
                        <XCircle className="w-5 h-5 flex-shrink-0" /> ╨ô╥»╨╣╨╗╨│╤ì╤ì╨│ ╤å╤â╤å╨░╨╗╨╗╨░╨░. ╨ö╤â╨╜╨┤╤ï╨╜ ╨┤╨░╨╜╤ü╨░╨╜ ╨┤╨░╤à╤î ╨╝╙⌐╨╜╨│╨╕╨╣╨│ ╤à╤â╨┤╨░╨╗╨┤╨░╨╜ ╨░╨▓╨░╨│╤ç╨╕╨╣╨╜ ╥»╨╗╨┤╤ì╨│╨┤╤ì╨╗╨┤ ╨▒╤â╤å╨░╨░╨▓.
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        
        </div>
      )}
    </div>
  );
}
