import { Layers } from 'lucide-react';

export default function OrderBook({ orderBooks, activePair }) {
  const data = orderBooks?.[activePair.toUpperCase()];
  
  if (!data || !data.bids || !data.asks) {
    return (
      <div className="glass-panel p-6 flex-1 flex flex-col items-center justify-center text-text-secondary min-h-[300px]">
        Loading order book...
      </div>
    );
  }

  // Actually, we want lowest ask (best ask) at the bottom of the asks list, closest to the spread.
  // Binance returns asks sorted by price ascending (best ask first).
  // So we reverse it to put the highest price at the top.
  const asksDisplay = [...data.asks].reverse();
  const bidsDisplay = data.bids; // Bids are returned sorted descending (best bid first). We want best bid at the top of the bids list.

  const maxAskQty = Math.max(...asksDisplay.map(a => a.qty));
  const maxBidQty = Math.max(...bidsDisplay.map(b => b.qty));
  const maxQty = Math.max(maxAskQty, maxBidQty);

  return (
    <div className="glass-panel p-6 flex-1 flex flex-col border border-white/5">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-accent-blue" />
        Order Book (Depth)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Bids (Buys) */}
        <div>
          <div className="flex text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">
            <div className="flex-1">Bid Price</div>
            <div className="flex-1 text-right">Amount</div>
          </div>
          <div className="flex flex-col gap-1">
            {bidsDisplay.map((bid, i) => {
              const width = (bid.qty / maxQty) * 100;
              return (
                <div key={`bid-${i}`} className="relative flex justify-between text-sm py-0.5 z-10 group">
                  <div 
                    className="absolute inset-0 bg-green-500/10 -z-10 transition-all duration-300 origin-right" 
                    style={{ width: `${width}%`, right: 0 }}
                  />
                  <span className="text-green-400 font-mono">{bid.price.toFixed(2)}</span>
                  <span className="text-text-primary font-mono">{bid.qty.toFixed(4)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asks (Sells) */}
        <div>
          <div className="flex text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">
            <div className="flex-1">Ask Price</div>
            <div className="flex-1 text-right">Amount</div>
          </div>
          <div className="flex flex-col gap-1">
            {asksDisplay.map((ask, i) => {
              const width = (ask.qty / maxQty) * 100;
              return (
                <div key={`ask-${i}`} className="relative flex justify-between text-sm py-0.5 z-10 group">
                  <div 
                    className="absolute inset-0 bg-red-500/10 -z-10 transition-all duration-300 origin-left" 
                    style={{ width: `${width}%`, left: 0 }}
                  />
                  <span className="text-red-400 font-mono">{ask.price.toFixed(2)}</span>
                  <span className="text-text-primary font-mono">{ask.qty.toFixed(4)}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      
      {/* Spread Indicator */}
      <div className="text-center text-sm font-medium text-text-secondary mt-6 pt-4 border-t border-white/10">
        Spread: <span className="text-white">{Math.abs(asksDisplay[asksDisplay.length - 1]?.price - bidsDisplay[0]?.price).toFixed(2)}</span>
      </div>
    </div>
  );
}
