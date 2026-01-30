import React, { useEffect, useRef, memo } from 'react';

const TickerTape = memo(() => {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    currentContainer.innerHTML = "";

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FOREXCOM:SPX500", "title": "S&P 500" },
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "NASDAQ:AAPL", "title": "Apple" },
        { "proName": "NASDAQ:TSLA", "title": "Tesla" },
        { "proName": "NASDAQ:NVDA", "title": "Nvidia" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });

    const timeoutId = setTimeout(() => {
      if (currentContainer) {
        currentContainer.appendChild(script);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (currentContainer) currentContainer.innerHTML = "";
    };
  }, []);

  return (
  <div className="relative group w-full h-[44px]">
    {/* 🟢 Glow Overlays - Only show on Desktop to save space on mobile */}
    <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-20 pointer-events-none" />
    
    <div 
      ref={containerRef} 
      className="tradingview-widget-container border-y border-white/5 bg-white/[0.01] backdrop-blur-md h-full w-full"
    >
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>

    {/* Subtle bottom accent - always visible */}
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-50 z-30" />
  </div>
);
});

export default TickerTape;