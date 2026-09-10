import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

const formatTime = (time, timeframe) => {
  const date = new Date(time);
  if (timeframe === '1d') return date.toLocaleDateString();
  if (timeframe === '1h') return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getHours()}:00`;
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

export default function PriceChart({ history, activePair }) {
  const [timeframe, setTimeframe] = useState('realtime');
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (timeframe === 'realtime') return;
    
    setIsLoading(true);
    const fetchHistory = async () => {
      try {
        const symbol = activePair.toUpperCase();
        
        let interval = '1m';
        let limit = 60;
        
        if (timeframe === '15m') {
          interval = '1m';
          limit = 15;
        } else if (timeframe === '1h') {
          interval = '1m';
          limit = 60;
        } else if (timeframe === '1d') {
          interval = '30m';
          limit = 48;
        }

        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
        const data = await res.json();
        
        const formattedData = data.map(d => ({
          time: d[0],
          price: parseFloat(d[4]) // Close price
        }));
        setHistoricalData(formattedData);
      } catch (e) {
        console.error("Failed to fetch klines", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [timeframe, activePair]);

  const rtData = history[activePair.toUpperCase()] || [];
  const data = timeframe === 'realtime' ? rtData : historicalData;

  const timeframes = [
    { id: 'realtime', label: 'Real-Time' },
    { id: '15m', label: '15 Min' },
    { id: '1h', label: '1 Hour' },
    { id: '1d', label: '1 Day' }
  ];

  return (
    <div className="glass-panel p-6 flex-1 flex flex-col border border-white/5 w-full h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {timeframe === 'realtime' ? (
            <TrendingUp className="w-5 h-5 text-accent-purple" />
          ) : (
            <Clock className="w-5 h-5 text-accent-purple" />
          )}
          {activePair.toUpperCase()} {timeframe === 'realtime' ? 'Real-Time Trend' : 'Historical Data'}
        </h3>
        
        <div className="flex bg-black/20 p-1 rounded-lg">
          {timeframes.map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeframe === tf.id ? 'bg-accent-purple/20 text-accent-purple' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full relative flex-1 min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
            Loading historical data...
          </div>
        ) : (data.length < 2 && timeframe === 'realtime') ? (
          <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
            Accumulating market data... (need at least 2 trades)
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tickFormatter={(time) => formatTime(time, timeframe)} 
                stroke="#64748b" 
                fontSize={12}
                tickMargin={10}
              />
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                stroke="#64748b" 
                fontSize={12}
                tickFormatter={(val) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(12px)'
                }}
                labelFormatter={(time) => formatTime(time, timeframe)}
                itemStyle={{ color: '#00e5ff', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#00e5ff" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                isAnimationActive={timeframe !== 'realtime'}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
