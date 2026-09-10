import { Wallet } from 'lucide-react';

export default function Portfolio({ prices }) {
  // Simulated static balances
  const balances = {
    BTC: 0.25,
    ETH: 4.5,
    BNB: 50
  };

  const calculateTotal = () => {
    let total = 0;
    if (prices['BTCUSDT']?.price) total += balances.BTC * prices['BTCUSDT'].price;
    if (prices['ETHUSDT']?.price) total += balances.ETH * prices['ETHUSDT'].price;
    if (prices['BNBUSDT']?.price) total += balances.BNB * prices['BNBUSDT'].price;
    return total;
  };

  const totalValue = calculateTotal();

  return (
    <div className="glass-panel p-6 flex flex-col border border-white/5 w-full h-full">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-accent-purple" />
        Simulated Portfolio
      </h3>
      
      <div className="mb-6">
        <div className="text-text-secondary text-sm mb-1">Total Balance</div>
        <div className="text-3xl font-extrabold tracking-tight">
          {totalValue > 0 ? (
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue)
          ) : (
            'Loading...'
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center font-bold">₿</div>
            <div className="flex flex-col">
              <span className="font-bold">Bitcoin</span>
              <span className="text-xs text-text-secondary">{balances.BTC} BTC</span>
            </div>
          </div>
          <div className="font-mono">
            {prices['BTCUSDT']?.price ? `$${(balances.BTC * prices['BTCUSDT'].price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center font-bold">Ξ</div>
            <div className="flex flex-col">
              <span className="font-bold">Ethereum</span>
              <span className="text-xs text-text-secondary">{balances.ETH} ETH</span>
            </div>
          </div>
          <div className="font-mono">
            {prices['ETHUSDT']?.price ? `$${(balances.ETH * prices['ETHUSDT'].price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}
          </div>
        </div>
        
        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center font-bold">B</div>
            <div className="flex flex-col">
              <span className="font-bold">BNB</span>
              <span className="text-xs text-text-secondary">{balances.BNB} BNB</span>
            </div>
          </div>
          <div className="font-mono">
            {prices['BNBUSDT']?.price ? `$${(balances.BNB * prices['BNBUSDT'].price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '---'}
          </div>
        </div>
      </div>
    </div>
  );
}
