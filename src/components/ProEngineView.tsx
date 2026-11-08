import React, { useState } from 'react';
import { CurrencyPair, IndicatorItem, StrategyItem } from '../types';
import {
  INDICATOR_CATEGORIES,
  SAMPLE_INDICATORS,
  SAMPLE_STRATEGIES,
} from '../data/forexData';
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Sliders,
  Sparkles,
  Search,
} from 'lucide-react';
import { playTerminalChime } from '../utils/audio';

interface ProEngineViewProps {
  activePair: CurrencyPair;
  onExecuteTrade: (pair: string, direction: 'BUY' | 'SELL', price: number, sl: number, tp: number) => void;
}

export const ProEngineView: React.FC<ProEngineViewProps> = ({ activePair, onExecuteTrade }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [indicatorSearch, setIndicatorSearch] = useState('');
  const [indicators, setIndicators] = useState<IndicatorItem[]>(SAMPLE_INDICATORS);
  const [strategies, setStrategies] = useState<StrategyItem[]>(SAMPLE_STRATEGIES);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const toggleIndicator = (id: string) => {
    setIndicators((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, active: !ind.active } : ind))
    );
    playTerminalChime('alert');
  };

  const toggleStrategy = (id: string) => {
    setStrategies((prev) =>
      prev.map((st) => (st.id === id ? { ...st, active: !st.active } : st))
    );
    playTerminalChime('alert');
  };

  const filteredIndicators = indicators.filter((ind) => {
    const matchesCat = selectedCategory === 'all' || ind.category === selectedCategory;
    const matchesSearch = ind.name.toLowerCase().includes(indicatorSearch.toLowerCase()) || ind.value.toLowerCase().includes(indicatorSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeIndicatorsCount = indicators.filter((i) => i.active).length;
  const activeStrategiesCount = strategies.filter((s) => s.active).length;

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* 1. HEADER: PRO MODE ACTIVE TICKER & CONFLUENCE MATRIX */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-wrap items-center justify-between gap-space-lg">
        {/* Left: Asset & Real-Time Price */}
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-surface-container">
            <Zap className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-lg font-bold text-on-surface">
                {activePair.symbol}
              </span>
              <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-mono font-bold">
                PRO QUANT ENGINE
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-outline font-mono">
              <span>BID: <strong className="text-on-surface">{activePair.bid.toFixed(activePair.digits)}</strong></span>
              <span>·</span>
              <span>ASK: <strong className="text-secondary">{activePair.ask.toFixed(activePair.digits)}</strong></span>
              <span>·</span>
              <span>SPREAD: {activePair.spread.toFixed(1)} PIPS</span>
            </div>
          </div>
        </div>

        {/* Center: Timeframe Confluence Matrix */}
        <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-lg border border-surface-container-high">
          <span className="font-label-ticker-xs text-[10px] text-outline uppercase font-mono mr-1">
            Confluence Matrix:
          </span>
          {[
            { tf: '1M', state: 'BUY', conf: 92 },
            { tf: '5M', state: 'BUY', conf: 88 },
            { tf: '15M', state: 'BUY', conf: 85 },
            { tf: '1H', state: 'BUY', conf: 81 },
            { tf: '4H', state: 'NEUTRAL', conf: 64 },
            { tf: '1D', state: 'BUY', conf: 76 },
          ].map((item) => (
            <div
              key={item.tf}
              className={`flex flex-col items-center px-2 py-1 rounded font-mono text-[10px] border ${
                item.state === 'BUY'
                  ? 'bg-secondary/15 border-secondary/40 text-secondary'
                  : 'bg-surface-container-highest border-surface-container text-outline'
              }`}
            >
              <span className="font-bold">{item.tf}</span>
              <span className="text-[9px]">{item.state}</span>
            </div>
          ))}
        </div>

        {/* Right: Quantitative Index Score */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-label-ticker-xs text-[10px] text-outline font-mono uppercase block">
              Quantitative Index
            </span>
            <span className="font-headline-sm text-lg font-bold text-secondary font-mono">
              88.4 / 100
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-secondary/30 border-t-secondary flex items-center justify-center font-mono font-bold text-xs text-secondary shadow-[0_0_12px_rgba(78,222,163,0.3)]">
            88%
          </div>
        </div>
      </section>

      {/* 2. MAIN QUANT WORKSPACE: 3-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md w-full">
        {/* LEFT & CENTER: 255+ INDICATOR MATRIX + 260+ STRATEGY ENGINE (8 COLS) */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          {/* 255+ Indicator Matrix Explorer */}
          <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-title-md text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span>255+ Multi-Factor Indicator Matrix</span>
                  <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono font-normal">
                    {activeIndicatorsCount} Active
                  </span>
                </h2>
                <p className="text-[11px] text-outline mt-0.5">
                  Institutional indicator library normalized for zero-lag mathematical confluence.
                </p>
              </div>

              {/* Anti-Collinearity Badge */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary-container/20 border border-secondary-container text-secondary text-[10px] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Anti-Collinearity Filter: Active</span>
              </div>
            </div>

            {/* Search & Categories Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1">
                {INDICATOR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary-container text-on-primary-container font-bold'
                        : 'bg-surface-container text-outline hover:text-on-surface'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Search indicator..."
                  value={indicatorSearch}
                  onChange={(e) => setIndicatorSearch(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded pl-8 pr-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary-container font-mono"
                />
              </div>
            </div>

            {/* Live Indicators Status Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
              {filteredIndicators.map((ind) => (
                <div
                  key={ind.id}
                  className={`p-2.5 rounded border transition-all flex flex-col justify-between gap-2 ${
                    ind.active
                      ? 'bg-surface-container border-surface-container-high shadow-sm'
                      : 'bg-surface-container/40 border-surface-container opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-headline-sm text-xs font-bold text-on-surface block">
                        {ind.name}
                      </span>
                      <span className="text-[10px] text-outline block mt-0.5">{ind.description}</span>
                    </div>

                    <button
                      onClick={() => toggleIndicator(ind.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                        ind.active
                          ? 'bg-secondary/20 text-secondary border border-secondary/30'
                          : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      {ind.active ? 'ACTIVE' : 'MUTED'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-surface-container-high text-[11px] font-mono">
                    <span className="text-secondary font-semibold">{ind.value}</span>
                    <span className="text-outline text-[10px]">Weight: {ind.weight}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 260+ Algorithmic Strategy Engine & Lab */}
          <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-title-md text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span>260+ Algorithmic Strategy Engine & Lab</span>
                  <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono font-normal">
                    {activeStrategiesCount} Deployed
                  </span>
                </h2>
                <p className="text-[11px] text-outline mt-0.5">
                  Smart Money Concepts, London/NY Breakouts, and Market Microstructure models.
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-outline">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Auto-Weighted</span>
              </div>
            </div>

            {/* Strategy List Cards */}
            <div className="flex flex-col gap-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
              {strategies.map((strat) => (
                <div
                  key={strat.id}
                  className={`p-3 rounded border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    strat.active
                      ? 'bg-surface-container border-surface-container-high'
                      : 'bg-surface-container/40 border-surface-container opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.2 rounded bg-primary-container text-on-primary-container font-mono font-bold">
                        {strat.code}
                      </span>
                      <span className="font-headline-sm text-xs font-bold text-on-surface">
                        {strat.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-outline mt-1 max-w-xl">{strat.description}</p>
                  </div>

                  <div className="flex items-center gap-3 sm:border-l sm:border-surface-container-high sm:pl-3">
                    <div className="text-right font-mono text-[11px]">
                      <div>WIN RATE: <strong className="text-secondary">{strat.winRate}%</strong></div>
                      <div className="text-outline text-[10px]">PF: {strat.profitFactor} · {strat.tradesCount} Trades</div>
                    </div>

                    <button
                      onClick={() => toggleStrategy(strat.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                        strat.active
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      {strat.active ? 'DEPLOYED' : 'STANDBY'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT PANE: LIVE SIGNAL GENERATOR + PATTERNS + ROUND NUMBER DOM (4 COLS) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Status Toast */}
          {statusMessage && (
            <div className="bg-secondary/20 border border-secondary text-secondary p-2 rounded text-xs font-mono font-bold animate-fadeIn">
              {statusMessage}
            </div>
          )}

          {/* 6. Live Technical Signal Generator */}
          <div className="bg-surface-container-low rounded-lg p-space-md border border-secondary/40 shadow-lg flex flex-col gap-space-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-xs font-bold text-on-surface uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-secondary" /> QUANT EXECUTION SIGNAL
              </h2>
              <span className="font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono font-bold">
                HIGH CONFLUENCE
              </span>
            </div>

            {/* Big Directional Action Card */}
            <div className="bg-surface-container-highest p-3 rounded border border-surface-container flex items-center justify-between">
              <div>
                <span className="text-[10px] text-outline font-mono block">SIGNAL DIRECTIVE</span>
                <span className="font-headline-sm text-base font-bold text-secondary">
                  BUY // {activePair.symbol}
                </span>
                <span className="text-[10px] text-outline font-mono block mt-0.5">
                  Expected Value: +28.4 pips
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-outline block">PROBABILITY</span>
                <span className="font-headline-sm text-lg font-bold text-secondary">
                  87.4%
                </span>
              </div>
            </div>

            {/* Target & Risk Parameters */}
            <div className="font-mono text-[11px] bg-surface-container p-2.5 rounded border border-surface-container-high flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-outline">TRIGGER ENTRY:</span>
                <span className="text-on-surface font-semibold">{activePair.ask.toFixed(activePair.digits)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-error">STOP LOSS (14 p):</span>
                <span className="text-error font-semibold">
                  {(activePair.ask - (activePair.digits === 2 ? 10.0 : 0.0014)).toFixed(activePair.digits)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">TARGET 1 (+20 p):</span>
                <span className="text-secondary font-semibold">
                  {(activePair.ask + (activePair.digits === 2 ? 20.0 : 0.0020)).toFixed(activePair.digits)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">TARGET 2 (+40 p):</span>
                <span className="text-secondary font-bold">
                  {(activePair.ask + (activePair.digits === 2 ? 40.0 : 0.0040)).toFixed(activePair.digits)}
                </span>
              </div>
            </div>

            {/* Immediate Execution Button Ladder */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  playTerminalChime('success');
                  const entry = activePair.ask;
                  const sl = entry - (activePair.digits === 2 ? 10.0 : 0.0014);
                  const tp = entry + (activePair.digits === 2 ? 40.0 : 0.0040);
                  onExecuteTrade(activePair.symbol, 'BUY', entry, sl, tp);
                  setStatusMessage(`Institutional Buy order logged for ${activePair.symbol}`);
                  setTimeout(() => setStatusMessage(null), 3000);
                }}
                className="w-full py-2 bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs rounded transition-all font-mono shadow-md flex items-center justify-center gap-1"
              >
                <TrendingUp className="w-3.5 h-3.5" /> EXECUTE BUY
              </button>
              <button
                onClick={() => {
                  playTerminalChime('alert');
                  const entry = activePair.bid;
                  const sl = entry + (activePair.digits === 2 ? 10.0 : 0.0014);
                  const tp = entry - (activePair.digits === 2 ? 40.0 : 0.0040);
                  onExecuteTrade(activePair.symbol, 'SELL', entry, sl, tp);
                  setStatusMessage(`Institutional Sell order logged for ${activePair.symbol}`);
                  setTimeout(() => setStatusMessage(null), 3000);
                }}
                className="w-full py-2 bg-error hover:bg-error/90 text-on-error font-bold text-xs rounded transition-all font-mono shadow-md flex items-center justify-center gap-1"
              >
                <TrendingUp className="w-3.5 h-3.5 rotate-180" /> EXECUTE SELL
              </button>
            </div>
          </div>

          {/* 4. Candlestick Recognition & Pattern Engine */}
          <div className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-xs font-bold text-on-surface uppercase">
                Candlestick Pattern AI
              </h2>
              <span className="font-label-ticker-xs text-[9px] text-secondary font-mono">
                81.2% WIN PROB
              </span>
            </div>

            <div className="flex items-center gap-3 bg-surface-container p-2.5 rounded border border-surface-container-high">
              {/* SVG Candle Diagram */}
              <svg className="w-16 h-16 shrink-0" viewBox="0 0 60 60">
                <line x1="20" x2="20" y1="12" y2="48" stroke="#ffb4ab" strokeWidth="1.5" />
                <rect x="15" y="20" width="10" height="20" rx="1" fill="#ffb4ab" />
                <line x1="38" x2="38" y1="8" y2="52" stroke="#4edea3" strokeWidth="2" />
                <rect x="32" y="14" width="12" height="32" rx="1" fill="#4edea3" />
              </svg>

              <div>
                <span className="font-headline-sm text-xs font-bold text-secondary block">
                  Bullish Engulfing + Sweep
                </span>
                <p className="text-[10px] text-outline mt-0.5 font-mono">
                  Current candle engulfed previous Asian candle body with 1.4x volume surge.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Round Number & Institutional Price Zone Monitor */}
          <div className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-xs font-bold text-on-surface uppercase">
                Institutional Round Levels
              </h2>
              <span className="font-label-ticker-xs text-[9px] text-outline font-mono">PSYCHOLOGICAL</span>
            </div>

            <div className="font-mono text-[10px] flex flex-col gap-1.5">
              {[
                { level: '1.09000 (Century Barrier)', type: 'MAJOR RESISTANCE', vol: '124M Bids', status: 'TARGET' },
                { level: '1.08500 (Half-Century Pivot)', type: 'ACTIVE BATTLEFIELD', vol: '88M Volume', status: 'CONTESTED' },
                { level: '1.08200 (Quarter Support)', type: 'INSTITUTIONAL DISCOUNT', vol: '142M Absorption', status: 'DEFENDED' },
                { level: '1.08000 (Century Base)', type: 'MAJOR LIQUIDITY POOL', vol: '210M Orders', status: 'SECURED' },
              ].map((lvl, idx) => (
                <div key={idx} className="p-1.5 rounded bg-surface-container border border-surface-container-high flex items-center justify-between">
                  <div>
                    <span className="text-on-surface font-semibold block">{lvl.level}</span>
                    <span className="text-outline text-[9px]">{lvl.type} · {lvl.vol}</span>
                  </div>
                  <span
                    className={`font-label-ticker-xs text-[9px] px-1 py-0.2 rounded font-bold ${
                      lvl.status === 'CONTESTED'
                        ? 'bg-primary-container text-on-primary-container'
                        : lvl.status === 'DEFENDED' || lvl.status === 'SECURED'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-surface-highest text-outline'
                    }`}
                  >
                    {lvl.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
