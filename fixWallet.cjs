const fs = require('fs');
const originalOrders = fs.readFileSync('orders_original.tsx', 'utf16le');
const cleanOrders = originalOrders.replace(/^\uFEFF/, '');

const escrowMatch = cleanOrders.match(/\{activeTab === 'escrow' && \([\s\S]*?<div className="space-y-8">([\s\S]*?)<\/div>\r?\n      \)\}/);

if (!escrowMatch) {
  console.log("Failed to match escrow block");
  process.exit(1);
}

const escrowContent = escrowMatch[1];

const walletCode = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const updatedWallet = walletCode.replace(/\{activeTab === 'escrow' && \([\s\S]*?\)\}/, `{activeTab === 'escrow' && (
        <div className="space-y-8">
${escrowContent}
        </div>
      )}`);

fs.writeFileSync('src/pages/Wallet.tsx', updatedWallet, 'utf8');
console.log("Fixed Wallet.tsx");
