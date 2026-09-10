import { useState, useEffect, useRef } from 'react';

const PAIRS = ['btcusdt', 'ethusdt', 'bnbusdt'];
const STREAMS = PAIRS.map(pair => `${pair}@trade/${pair}@ticker/${pair}@depth10@100ms`).join('/');
const WS_URL = `wss://stream.binance.com:9443/stream?streams=${STREAMS}`;

export function useBinanceWebSocket(isPaused = false) {
  const [prices, setPrices] = useState({});
  const [history, setHistory] = useState({});
  const [stats, setStats] = useState({});
  const [orderBooks, setOrderBooks] = useState({});
  
  const wsRef = useRef(null);

  useEffect(() => {
    if (isPaused) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (!message.stream || !message.data) return;
        
        const pairLower = message.stream.split('@')[0];
        const pair = pairLower.toUpperCase();
        
        // --- TRADE STREAM ---
        if (message.stream.includes('@trade')) {
          const price = parseFloat(message.data.p);
          const time = message.data.E;

          setPrices((prev) => {
            const oldPrice = prev[pair]?.price || price;
            return {
              ...prev,
              [pair]: {
                price,
                change: price >= oldPrice ? 'up' : 'down',
              }
            };
          });

          setHistory((prev) => {
            const currentHistory = prev[pair] || [];
            if (currentHistory.length > 0) {
              const lastPoint = currentHistory[currentHistory.length - 1];
              if (time - lastPoint.time < 2000) {
                const updatedHistory = [...currentHistory];
                updatedHistory[updatedHistory.length - 1] = { time: lastPoint.time, price };
                return { ...prev, [pair]: updatedHistory };
              }
            }
            const newHistory = [...currentHistory, { time, price }];
            if (newHistory.length > 60) newHistory.shift();
            return { ...prev, [pair]: newHistory };
          });
        }
        
        // --- TICKER STREAM ---
        if (message.stream.includes('@ticker')) {
          setStats((prev) => ({
            ...prev,
            [pair]: {
              changePercent: parseFloat(message.data.P),
              volume: parseFloat(message.data.q) // Quote volume in USD
            }
          }));
        }
        
        // --- DEPTH STREAM ---
        if (message.stream.includes('@depth10')) {
          // depth stream returns bids/asks as arrays of [price, quantity]
          setOrderBooks((prev) => ({
            ...prev,
            [pair]: {
              bids: message.data.bids.map(b => ({ price: parseFloat(b[0]), qty: parseFloat(b[1]) })),
              asks: message.data.asks.map(a => ({ price: parseFloat(a[0]), qty: parseFloat(a[1]) }))
            }
          }));
        }
      };

      ws.onclose = () => {
        if (!isPaused) {
          setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        // Prevent reconnect loop on unmount
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isPaused]);

  return { prices, history, stats, orderBooks };
}
