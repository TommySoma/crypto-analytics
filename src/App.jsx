import { useState, useEffect, useRef } from 'react';
import Background3D from './components/Background3D';
import LiveTicker from './components/LiveTicker';
import PriceChart from './components/PriceChart';
import OrderBook from './components/OrderBook';
import Portfolio from './components/Portfolio';
import { useBinanceWebSocket } from './hooks/useBinanceWebSocket';

function App() {
  const [activePair, setActivePair] = useState('btcusdt');
  const [isBackgroundPaused, setIsBackgroundPaused] = useState(false);
  const containerRef = useRef(null);

  // We only pause websocket if the entire dashboard goes offscreen, but typically a dashboard is full height.
  // For the sake of modern web guidance, we'll apply it and track the event.
  const { prices, history, stats, orderBooks } = useBinanceWebSocket(isBackgroundPaused);

  // Calculate short-term market trend (last 2 minutes) based on history
  const currentHistory = history[activePair.toUpperCase()] || [];
  let marketTrend = 'neutral';
  if (currentHistory.length > 0) {
    const firstPrice = currentHistory[0].price;
    const lastPrice = currentHistory[currentHistory.length - 1].price;
    marketTrend = lastPrice >= firstPrice ? 'up' : 'down';
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isSupported = 'contentVisibility' in document.documentElement.style;

    if (isSupported) {
      const handleStateChange = (event) => setIsBackgroundPaused(event.skipped);
      el.addEventListener('contentvisibilityautostatechange', handleStateChange);
      return () => el.removeEventListener('contentvisibilityautostatechange', handleStateChange);
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => setIsBackgroundPaused(!entry.isIntersecting));
      }, { rootMargin: '200px' });
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full text-text-primary overflow-hidden font-sans">
      <Background3D isVisible={!isBackgroundPaused} marketTrend={marketTrend} />

      <main
        ref={containerRef}
        className="heavy-component relative z-10 w-full max-w-[1400px] mx-auto p-4 md:p-8 flex flex-col min-h-screen"
      >
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-purple pb-2">
              Crypto Analytics
            </h1>
            <p className="text-text-secondary mt-1">Real-time market intelligence.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium">
              Network: <span className="text-green-400">Connected</span>
            </div>
          </div>
        </header>

        <LiveTicker
          prices={prices}
          stats={stats}
          activePair={activePair}
          setActivePair={setActivePair}
        />

        <div className="mt-6 flex flex-col gap-6 flex-1">
          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
            <div className="lg:col-span-2 flex h-full">
              <PriceChart
                history={history}
                activePair={activePair}
              />
            </div>
            <div className="lg:col-span-1 flex h-full">
              <Portfolio prices={prices} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="w-full">
            <OrderBook orderBooks={orderBooks} activePair={activePair} />
          </div>
        </div>

        <footer className="mt-8 text-center text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} Crypto dashboard. Built with React Three Fiber, Recharts, and Binance WS.
        </footer>
      </main>
    </div>
  );
}

export default App;
