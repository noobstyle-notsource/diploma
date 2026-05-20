const fs = require('fs');

const ordersCode = fs.readFileSync('orders_backup.tsx', 'utf16le'); 
const walletCode = fs.readFileSync('src/pages/Wallet.tsx', 'utf8'); 

const cleanOrdersCode = ordersCode.replace(/^\uFEFF/, '');

const getStatusLabelMatch = cleanOrdersCode.match(/const getStatusLabel = \(status: string\) => \{[\s\S]*?\};/);
const getStatusLabel = getStatusLabelMatch ? getStatusLabelMatch[0] : '';

const escrowMatch = cleanOrdersCode.match(/\{activeTab === 'escrow' && \(([\s\S]*?\n      )\}\)/);
const escrowRender = escrowMatch ? escrowMatch[1] : '';

let newWallet = walletCode;

newWallet = newWallet.replace(/import \{ \r?\n  Wallet, ArrowRight/, 'import { \n  Wallet, ArrowRight, Tag, Key, CheckCircle, Clock');
newWallet = newWallet.replace(/import \{ auth, withdrawals, type AuthUser, type Withdrawal \} from '\.\.\/lib\/api';/, 
  'import { auth, withdrawals, escrow, type AuthUser, type Withdrawal, type EscrowTrade } from \'../lib/api\';\nimport { cn } from \'../lib/utils\';\nimport { useSearchParams } from \'react-router-dom\';');

newWallet = newWallet.replace(/const \[history, setHistory\] = useState<Withdrawal\[\]>\(\[\]\);/, 
  'const [history, setHistory] = useState<Withdrawal[]>([]);\n  const [escrowTrades, setEscrowTrades] = useState<EscrowTrade[]>([]);\n  const [credsInput, setCredsInput] = useState<Record<string, string>>({});\n  const [searchParams] = useSearchParams();\n  const [activeTab, setActiveTab] = useState<\'wallet\' | \'escrow\'>(searchParams.get(\'tab\') === \'escrow\' ? \'escrow\' : \'wallet\');');

newWallet = newWallet.replace(/const banks = \[/, getStatusLabel + '\n\n  const banks = [');

newWallet = newWallet.replace(/withdrawals\.mine\(\)/, 'withdrawals.mine(),\n        escrow.list().catch(() => [])');
newWallet = newWallet.replace(/const \[me, wHistory\] = await Promise\.all\(\[/, 'const [me, wHistory, eData] = await Promise.all([');
newWallet = newWallet.replace(/setHistory\(wHistory\);/, 'setHistory(wHistory);\n      setEscrowTrades(eData || []);');

const handleCredsFunc = `const handleSubmitCreds = async (id: string) => {
    const creds = credsInput[id];
    if (!creds?.trim()) { alert('Дансны мэдээллээ оруулна уу'); return; }
    try {
      await escrow.submitCreds(id, creds);
      setEscrowTrades(prev => prev.map(t => t.id === id ? { ...t, status: 'PENDING_MIDDLEMAN_VERIFICATION', account_credentials: creds } : t));
      alert('Мэдээллийг дундын дансны зохицуулагчид амжилттай илгээлээ!');
    } catch (err: any) { alert(err.message || 'Failed to submit credentials'); }
  };

  const handleWithdraw = async`;

newWallet = newWallet.replace(/const handleWithdraw = async/, handleCredsFunc);

const tabsUI = `
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
`;

newWallet = newWallet.replace(/<div className=\"grid grid-cols-1 lg:grid-cols-12 gap-10\">/, tabsUI + '\n      {activeTab === \'wallet\' && (\n      <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-10\">');

// Find the last closing tags and replace them.
const endReplacement = `      </div>
      )}

      {activeTab === 'escrow' && (
${escrowRender}
      )}
    </div>
  );
}`;

newWallet = newWallet.replace(/<\/div>\r?\n    <\/div>\r?\n  \);\r?\n\}/, endReplacement);

fs.writeFileSync('src/pages/Wallet.tsx', newWallet, 'utf8');
console.log('Wallet.tsx updated successfully');
