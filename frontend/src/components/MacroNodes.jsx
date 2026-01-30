import React, { useEffect, useRef, memo } from 'react';

const MacroNodes = memo(() => {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    currentContainer.innerHTML = "";

    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": false,
      "locale": "en",
      "width": "100%",
      "height": "100%",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "tabs": [
        {
          "title": "Neural Macro",
          "symbols": [
            { "s": "FX_IDC:USDINR", "d": "USD / INR" },
            { "s": "TVC:DXY", "d": "US Dollar Index" },
            { "s": "NSE:INDIAVIX", "d": "India VIX (Fear)" },
            { "s": "TVC:GOLD", "d": "Gold" }
          ]
        }
      ]
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
    <div className="w-full h-[300px] bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden p-2">
      <div ref={containerRef} className="tradingview-widget-container h-full">
        <div className="tradingview-widget-container__widget h-full"></div>
      </div>
    </div>
  );
});

export default MacroNodes;