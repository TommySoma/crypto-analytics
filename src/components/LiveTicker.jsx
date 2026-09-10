import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const formatPrice = (price) => {
  if (!price) return '---';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(price);
};

export default function LiveTicker({ prices, stats, activePair, setActivePair }) {
  const pairsList = [
    { id: 'btcusdt', name: 'BTC/USDT', icon: '₿' },
    { id: 'ethusdt', name: 'ETH/USDT', icon: 'Ξ' },
    { id: 'bnbusdt', name: 'BNB/USDT', icon: 'B' },
  ];

  const formatVolume = (vol) => {
    if (!vol) return '---';
    if (vol > 1000000) return `$${(vol / 1000000).toFixed(2)}M`;
    if (vol > 1000) return `$${(vol / 1000).toFixed(2)}K`;
    return `$${vol.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-accent-blue animate-pulse" />
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Live Markets</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pairsList.map(pair => {
          const data = prices[pair.id.toUpperCase()];
          const statData = stats?.[pair.id.toUpperCase()];
          const isUp = data?.change === 'up';
          const isActive = activePair === pair.id;
          
          const changePct = statData?.changePercent;
          const is24hUp = changePct >= 0;

          return (
            <button
              key={pair.id}
              onClick={() => setActivePair(pair.id)}
              className={`relative glass-panel p-5 flex flex-col text-left transition-all duration-300 ${
                isActive 
                  ? 'border-accent-blue shadow-[0_0_20px_rgba(0,229,255,0.2)] bg-gradient-to-br from-accent-blue/10 to-transparent scale-[1.02]' 
                  : 'hover:border-accent-blue/50 hover:bg-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-t-xl" />
              )}
              
              <div className="flex justify-between items-start mb-2 mt-1">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className={`text-lg font-mono font-bold ${isActive ? 'text-white' : ''}`}>{pair.icon}</span>
                  <span className={`font-medium ${isActive ? 'text-accent-blue' : ''}`}>{pair.name}</span>
                </div>
                {data && (
                  <div className={`p-1 rounded-full bg-opacity-20 ${isUp ? 'bg-green-500 text-green-400' : 'bg-red-500 text-red-400'}`}>
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                )}
              </div>
              
              <div className={`text-2xl font-bold tracking-tight mb-2 ${isActive ? 'text-white' : ''}`}>
                {formatPrice(data?.price)}
              </div>
              
              <div className="flex justify-between text-xs mt-auto">
                <div className="flex flex-col">
                  <span className="text-text-secondary">24h Change</span>
                  <span className={`font-semibold ${changePct !== undefined ? (is24hUp ? 'text-green-400' : 'text-red-400') : 'text-text-secondary'}`}>
                    {changePct !== undefined ? `${is24hUp ? '+' : ''}${changePct.toFixed(2)}%` : '---'}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-text-secondary">24h Vol</span>
                  <span className={`font-semibold ${isActive ? 'text-white' : 'text-text-primary'}`}>
                    {formatVolume(statData?.volume)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
