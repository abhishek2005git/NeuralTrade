import React, { useEffect, useRef, memo } from 'react';

const SectorHeatmap = memo(() => {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Clear previous widget to prevent duplicates
    currentContainer.innerHTML = "";

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "exchanges": [],
      "dataSource": "S&P500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDatasetEnabled": true,
      "isTransparent": true,
      "width": "100%",
      "height": "100%"
    });

    // Protection: Timeout ensures React DOM commitment is finished
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
    <div className="w-full h-full bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden">
      <div ref={containerRef} className="tradingview-widget-container h-full">
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>
    </div>
  );
});

export default SectorHeatmap;