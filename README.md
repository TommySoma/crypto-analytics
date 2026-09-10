# Crypto Analytics

A professional, real-time cryptocurrency dashboard inspired by cutting-edge web design (Igloo.inc style). Built with React, Tailwind CSS 4, and WebGL (React Three Fiber), this application connects directly to the Binance WebSocket network to deliver zero-latency market data.

## Features

- **Real-Time Data Streaming:** Connects to Binance WebSockets (`@trade`, `@ticker`, and `@depth10` streams) to deliver tick-by-tick prices, 24-hour volume, and market depth without polling delays.
- **Reactive 3D Background:** The WebGL particle swarm in the background dynamically interpolates its color based on the short-term market trend (Cyan for bullish, Purple for bearish) using `three.js`.
- **Interactive Price Charts:** High-performance area charts built with `recharts`. Supports both instant real-time tick plotting and historical Kline data fetching (15m, 1h, 1d) via the Binance REST API.
- **Live Order Book:** A visual market depth representation (Bids and Asks) updating every 100ms, styled like professional trading terminals.
- **Simulated Portfolio:** Dynamically calculates total USD value across a simulated set of crypto holdings based on live market ticks.
- **Performance Optimized:** Uses modern CSS features like `content-visibility: auto` (with IntersectionObserver fallback) to completely pause WebSocket data crunching and WebGL rendering when the dashboard is off-screen.
- **Glassmorphism UI:** A sleek, dark-mode-first aesthetic with frosted glass panels, neon accents, and responsive CSS grid layout.

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4 (Vanilla CSS variables for modern theming)
- **3D Graphics:** React Three Fiber (`@react-three/fiber`, `@react-three/drei`, `three`)
- **Charting:** Recharts
- **Icons:** Lucide React

## Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Crypto-analytics.git
   cd Crypto-analytics
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Architecture Notes

- **`useBinanceWebSocket.js`**: The core data hook. It manages a multiplexed WebSocket connection to Binance to minimize network overhead. It handles smart reconnection logic and throttles the historical array updates to keep the React render cycle smooth while preserving instantaneous price updates on the UI.
- **Throttling & Layout Thrashing**: The app avoids layout thrashing by fixing container heights and avoiding constant DOM node repaints for the Order Book. The 3D canvas uses a single `PointMaterial` mapped to a typed array (`Float32Array`) of vertices for extreme performance, capable of rendering thousands of particles on mobile devices.

---
*Built as a portfolio showcase project for advanced React and WebGL capabilities.*
