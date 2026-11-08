import React, { useState } from 'react';
import { CurrencyPair, Timeframe } from '../types';
import {
  TrendingUp,
  Search,
  Eye,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { playTerminalChime } from '../utils/audio';

interface DashboardViewProps {
  pairs: CurrencyPair[];
  activePair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  activeTimeframe: Timeframe;
  onExecuteTrade: (pair: string, direction: 'BUY' | 'SELL', price: number, sl: number, tp: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  pairs,
  activePair,
  onSelectPair,
  activeTimeframe,
  onExecuteTrade,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'majors' | 'minors' | 'metals' | 'crypto'>('all');
  const [showOB, setShowOB] = useState(true);
  const [showFVG, setShowFVG] = useState(true);
  const [showEMAs, setShowEMAs] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<{ x: number; y: number; price: string; time: string } | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  // Filter pairs
  const filteredPairs = pairs.filter((p) => {
    const matchesSearch = p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExecuteLong = () => {
    playTerminalChime('success');
    const entry = activePair.ask;
    const sl = entry - (activePair.digits === 2 ? 10.0 : 0.0014);
    const tp = entry + (activePair.digits === 2 ? 35.0 : 0.0040);
    onExecuteTrade(activePair.symbol, 'BUY', entry, sl, tp);
    setExecutionMessage(`Paper LONG executed: ${activePair.symbol} @ ${entry.toFixed(activePair.digits)} (SL: ${sl.toFixed(activePair.digits)})`);
    setTimeout(() => setExecutionMessage(null), 4000);
  };

  const handleExecuteShort = () => {
    playTerminalChime('alert');
    const entry = activePair.bid;
    const sl = entry + (activePair.digits === 2 ? 10.0 : 0.0014);
    const tp = entry - (activePair.digits === 2 ? 35.0 : 0.0040);
    onExecuteTrade(activePair.symbol, 'SELL', entry, sl, tp);
    setExecutionMessage(`Paper SHORT executed: ${activePair.symbol} @ ${entry.toFixed(activePair.digits)} (SL: ${sl.toFixed(activePair.digits)})`);
    setTimeout(() => setExecutionMessage(null), 4000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-sm w-full">
      {/* LEFT PANEL: ASSET SCANNER & WATCHLIST (Col Span 3) */}
      <section className="xl:col-span-3 bg-surface-container-low rounded-lg p-space-sm border border-surface-container-high flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-headline-sm text-xs font-bold text-on-surface uppercase tracking-wide">
              Market Scanner
            </span>
            <span className="font-label-ticker-xs text-[9px] px-1 py-0.2 rounded bg-surface-container text-primary font-mono">
              LIVE
            </span>
          </div>
          <span className="font-label-data-sm text-[10px] text-outline font-mono">
            {filteredPairs.length} PAIRS
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search pair or asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-surface-container-high rounded pl-8 pr-3 py-1 text-xs text-on-surface focus:outline-none focus:border-primary-container font-mono"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
          {(['all', 'majors', 'minors', 'metals', 'crypto'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'bg-surface-container text-outline hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Asset Table */}
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[580px] pr-1">
          {filteredPairs.map((pair) => {
            const isSelected = pair.symbol === activePair.symbol;
            return (
              <button
                key={pair.symbol}
                onClick={() => {
                  onSelectPair(pair);
                  playTerminalChime('alert');
                }}
                className={`w-full text-left p-2 rounded border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-surface-container-high border-primary-container shadow-sm'
                    : 'bg-surface-container/60 hover:bg-surface-container border-surface-container-high'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-xs font-bold text-on-surface group-hover:text-primary">
                      {pair.symbol}
                    </span>
                    <span
                      className={`font-label-ticker-xs text-[8px] px-1 py-0.2 rounded font-mono font-bold ${
                        pair.signalDirection === 'BUY'
                          ? 'bg-secondary/20 text-secondary'
                          : pair.signalDirection === 'SELL'
                          ? 'bg-error/20 text-error'
                          : 'bg-surface-bright text-outline'
                      }`}
                    >
                      {pair.signalDirection}
                    </span>
                  </div>
                  <span className="text-[10px] text-outline truncate block max-w-[120px]">
                    {pair.smcSetup}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-label-data-sm text-[11px] font-mono text-on-surface block font-semibold">
                    {pair.bid.toFixed(pair.digits)}
                  </span>
                  <div className="flex items-center gap-1 justify-end">
                    <span
                      className={`text-[10px] font-mono ${
                        pair.change24h >= 0 ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {pair.change24h >= 0 ? '+' : ''}
                      {pair.change24h}%
                    </span>
                    <span className="text-[9px] text-outline font-mono">
                      {pair.confluence.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CENTER PANEL: TRADINGVIEW-GRADE INTERACTIVE CHART (Col Span 6) */}
      <section className="xl:col-span-6 bg-surface-container-low rounded-lg p-space-sm border border-surface-container-high flex flex-col gap-space-sm">
        {/* Chart Header & Overlays Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-surface-container-high pb-2">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-sm font-bold text-on-surface">
              {activePair.symbol} · {activeTimeframe}
            </span>
            <span className="text-xs text-outline font-mono">Institutional Price Delivery</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
            <button
              onClick={() => setShowEMAs(!showEMAs)}
              className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                showEMAs
                  ? 'bg-primary-container/20 border-primary-container text-primary font-bold'
                  : 'bg-surface-container border-surface-container-high text-outline'
              }`}
            >
              <Eye className="w-3 h-3" /> EMAs (21/50)
            </button>
            <button
              onClick={() => setShowOB(!showOB)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showOB
                  ? 'bg-tertiary-container/30 border-tertiary text-tertiary font-bold'
                  : 'bg-surface-container border-surface-container-high text-outline'
              }`}
            >
              OB Zone
            </button>
            <button
              onClick={() => setShowFVG(!showFVG)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showFVG
                  ? 'bg-secondary/20 border-secondary text-secondary font-bold'
                  : 'bg-surface-container border-surface-container-high text-outline'
              }`}
            >
              FVG Imbalance
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                showVolume
                  ? 'bg-surface-container-highest border-outline text-on-surface'
                  : 'bg-surface-container border-surface-container-high text-outline'
              }`}
            >
              Volume Profile
            </button>
          </div>
        </div>

        {/* Interactive SVG Candlestick Chart */}
        <div
          className="relative w-full h-[400px] bg-[#0a0e16] rounded border border-surface-container overflow-hidden select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const price = (
              activePair.bid +
              (1 - y / 400) * (activePair.digits === 2 ? 20 : 0.003) -
              (activePair.digits === 2 ? 10 : 0.0015)
            ).toFixed(activePair.digits);
            setHoveredCandle({ x, y, price, time: '15:42:00' });
          }}
          onMouseLeave={() => setHoveredCandle(null)}
        >
          {/* Watermark Symbol */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <span className="text-8xl font-black font-mono tracking-tighter text-white">
              {activePair.symbol}
            </span>
          </div>

          {/* SVG Canvas */}
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fvgGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.04" />
              </linearGradient>
              <linearGradient id="obGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#a078ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a078ff" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid & Price Ticks */}
            {[60, 130, 200, 270, 340].map((y) => (
              <line
                key={y}
                x1="0"
                x2="800"
                y1={y}
                y2={y}
                stroke="#181c24"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {/* Vertical Time Grid */}
            {[160, 320, 480, 640].map((x) => (
              <line
                key={x}
                x1={x}
                x2={x}
                y1="0"
                y2="400"
                stroke="#181c24"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {/* Order Block (OB Zone) */}
            {showOB && (
              <g>
                <rect x="220" y="260" width="230" height="38" rx="2" fill="url(#obGrad)" />
                <line x1="220" x2="450" y1="260" y2="260" stroke="#a078ff" strokeWidth="1" strokeDasharray="2,2" />
                <text x="228" y="278" fill="#d0bcff" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                  4H BULLISH ORDER BLOCK (OB) [UNMITIGATED]
                </text>
              </g>
            )}

            {/* Fair Value Gap (FVG Zone) */}
            {showFVG && (
              <g>
                <rect x="440" y="210" width="290" height="42" rx="2" fill="url(#fvgGrad)" />
                <line x1="440" x2="730" y1="210" y2="210" stroke="#4edea3" strokeWidth="1" strokeDasharray="2,2" />
                <text x="448" y="228" fill="#4edea3" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                  15M FAIR VALUE GAP (FVG) · DISCOUNT TEST
                </text>
              </g>
            )}

            {/* Liquidity Sweep Annotation Line */}
            <g>
              <line x1="140" x2="520" y1="315" y2="315" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="4,4" />
              <text x="145" y="310" fill="#ffb4ab" fontSize="9" fontFamily="JetBrains Mono">
                ASIAN EQUAL LOWS LIQUIDITY SWEPT (BSL/SSL RAID)
              </text>
            </g>

            {/* Smooth Moving Average Curves */}
            {showEMAs && (
              <g>
                {/* EMA 50 (Purple) */}
                <path
                  d="M 20 280 Q 180 270, 340 240 T 560 190 T 780 145"
                  fill="none"
                  stroke="#a078ff"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                />
                {/* EMA 21 (Cyan/Primary) */}
                <path
                  d="M 20 260 Q 180 250, 340 215 T 560 160 T 780 115"
                  fill="none"
                  stroke="#4d8eff"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* High-Resolution Candlesticks Simulation */}
            <g>
              {/* Bar 1 */}
              <line x1="40" x2="40" y1="250" y2="305" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="34" y="265" width="12" height="32" rx="1" fill="#ffb4ab" />

              {/* Bar 2 */}
              <line x1="75" x2="75" y1="260" y2="315" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="69" y="275" width="12" height="35" rx="1" fill="#ffb4ab" />

              {/* Bar 3 (Liquidity grab wick) */}
              <line x1="110" x2="110" y1="280" y2="340" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="104" y="285" width="12" height="25" rx="1" fill="#ffb4ab" />

              {/* Bar 4 (Hammer reversal) */}
              <line x1="145" x2="145" y1="270" y2="335" stroke="#4edea3" strokeWidth="1" />
              <rect x="139" y="275" width="12" height="20" rx="1" fill="#4edea3" />

              {/* Bar 5 (Bullish expansion) */}
              <line x1="180" x2="180" y1="240" y2="295" stroke="#4edea3" strokeWidth="1" />
              <rect x="174" y="248" width="12" height="38" rx="1" fill="#4edea3" />

              {/* Bar 6 */}
              <line x1="215" x2="215" y1="230" y2="275" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="209" y="235" width="12" height="22" rx="1" fill="#ffb4ab" />

              {/* Bar 7 */}
              <line x1="250" x2="250" y1="220" y2="265" stroke="#4edea3" strokeWidth="1" />
              <rect x="244" y="228" width="12" height="30" rx="1" fill="#4edea3" />

              {/* Bar 8 (Order block test) */}
              <line x1="285" x2="285" y1="235" y2="285" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="279" y="242" width="12" height="28" rx="1" fill="#ffb4ab" />

              {/* Bar 9 (Strong impulse) */}
              <line x1="320" x2="320" y1="190" y2="260" stroke="#4edea3" strokeWidth="1" />
              <rect x="314" y="200" width="12" height="48" rx="1" fill="#4edea3" />

              {/* Bar 10 */}
              <line x1="355" x2="355" y1="175" y2="225" stroke="#4edea3" strokeWidth="1" />
              <rect x="349" y="182" width="12" height="32" rx="1" fill="#4edea3" />

              {/* Bar 11 */}
              <line x1="390" x2="390" y1="180" y2="230" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="384" y="188" width="12" height="24" rx="1" fill="#ffb4ab" />

              {/* Bar 12 */}
              <line x1="425" x2="425" y1="185" y2="245" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="419" y="195" width="12" height="30" rx="1" fill="#ffb4ab" />

              {/* Bar 13 (FVG test reaction) */}
              <line x1="460" x2="460" y1="190" y2="240" stroke="#4edea3" strokeWidth="1" />
              <rect x="454" y="198" width="12" height="28" rx="1" fill="#4edea3" />

              {/* Bar 14 (Displacement green) */}
              <line x1="495" x2="495" y1="150" y2="215" stroke="#4edea3" strokeWidth="1" />
              <rect x="489" y="160" width="12" height="42" rx="1" fill="#4edea3" />

              {/* Bar 15 */}
              <line x1="530" x2="530" y1="140" y2="190" stroke="#4edea3" strokeWidth="1" />
              <rect x="524" y="148" width="12" height="34" rx="1" fill="#4edea3" />

              {/* Bar 16 */}
              <line x1="565" x2="565" y1="145" y2="195" stroke="#ffb4ab" strokeWidth="1" />
              <rect x="559" y="152" width="12" height="22" rx="1" fill="#ffb4ab" />

              {/* Bar 17 */}
              <line x1="600" x2="600" y1="130" y2="178" stroke="#4edea3" strokeWidth="1" />
              <rect x="594" y="136" width="12" height="30" rx="1" fill="#4edea3" />

              {/* Bar 18 */}
              <line x1="635" x2="635" y1="120" y2="165" stroke="#4edea3" strokeWidth="1" />
              <rect x="629" y="125" width="12" height="28" rx="1" fill="#4edea3" />

              {/* Bar 19 */}
              <line x1="670" x2="670" y1="110" y2="155" stroke="#4edea3" strokeWidth="1" />
              <rect x="664" y="115" width="12" height="32" rx="1" fill="#4edea3" />

              {/* Bar 20 (Live Candle) */}
              <line x1="705" x2="705" y1="95" y2="140" stroke="#4edea3" strokeWidth="1.5" />
              <rect x="699" y="100" width="12" height="30" rx="1" fill="#4edea3" className="animate-pulse" />
            </g>

            {/* Volume Profile Bars (Bottom) */}
            {showVolume && (
              <g opacity="0.35">
                {[15, 25, 45, 60, 50, 30, 40, 55, 75, 65, 35, 45, 55, 80, 70, 40, 60, 75, 85, 95].map(
                  (v, idx) => (
                    <rect
                      key={idx}
                      x={34 + idx * 35}
                      y={400 - v * 0.7}
                      width="12"
                      height={v * 0.7}
                      rx="1"
                      fill={idx % 2 === 0 ? '#4edea3' : '#ffb4ab'}
                    />
                  )
                )}
              </g>
            )}

            {/* Crosshair Cursor if hovered */}
            {hoveredCandle && (
              <g>
                <line x1={hoveredCandle.x} x2={hoveredCandle.x} y1="0" y2="400" stroke="#8c909f" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" x2="800" y1={hoveredCandle.y} y2={hoveredCandle.y} stroke="#8c909f" strokeWidth="1" strokeDasharray="3,3" />
              </g>
            )}
          </svg>

          {/* Interactive Tooltip Overlay */}
          {hoveredCandle && (
            <div
              className="absolute z-30 pointer-events-none bg-surface-container-highest/95 border border-primary-container px-2 py-1 rounded text-[10px] font-mono shadow-lg text-on-surface"
              style={{
                left: Math.min(hoveredCandle.x + 12, 650),
                top: Math.max(hoveredCandle.y - 30, 10),
              }}
            >
              <div>PRICE: <span className="text-secondary font-bold">{hoveredCandle.price}</span></div>
              <div className="text-outline">TIME: {hoveredCandle.time} BST</div>
            </div>
          )}

          {/* Price Axis Overlay on Right */}
          <div className="absolute top-0 right-0 bottom-0 w-16 bg-surface-container-lowest/80 border-l border-surface-container flex flex-col justify-between py-2 px-1 text-[10px] font-mono text-outline pointer-events-none">
            <span>{(activePair.bid + 0.002).toFixed(activePair.digits)}</span>
            <span>{(activePair.bid + 0.001).toFixed(activePair.digits)}</span>
            <span className="text-secondary font-bold bg-secondary/10 px-1 rounded">
              {activePair.bid.toFixed(activePair.digits)}
            </span>
            <span>{(activePair.bid - 0.001).toFixed(activePair.digits)}</span>
            <span>{(activePair.bid - 0.002).toFixed(activePair.digits)}</span>
          </div>
        </div>

        {/* Chart Legend / Active Status */}
        <div className="flex items-center justify-between text-[11px] text-outline font-mono pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span> EMA 21: {(activePair.bid - 0.0004).toFixed(activePair.digits)}
            </span>
            <span className="flex items-center gap-1 text-tertiary">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span> EMA 50: {(activePair.bid - 0.0009).toFixed(activePair.digits)}
            </span>
          </div>
          <span className="text-secondary">ATR(14): 18.4 pips · Volatility: Moderate</span>
        </div>
      </section>

      {/* RIGHT PANEL: AI SIGNAL ENGINE & INSTITUTIONAL DOM TAPE (Col Span 3) */}
      <section className="xl:col-span-3 flex flex-col gap-space-sm">
        {/* Signal Execution Alert Banner */}
        {executionMessage && (
          <div className="bg-secondary/20 border border-secondary text-secondary p-2 rounded text-xs font-mono font-bold flex items-center justify-between animate-fadeIn">
            <span>{executionMessage}</span>
          </div>
        )}

        {/* Quant Signal Card */}
        <div className="bg-surface-container-low rounded-lg p-space-sm border border-secondary/40 shadow-lg relative overflow-hidden flex flex-col gap-2.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-secondary animate-pulse" />
              <span className="font-headline-sm text-xs font-bold text-on-surface">
                QUANT SIGNAL ENGINE
              </span>
            </div>
            <span className="font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono font-bold">
              CONFLUENCE {activePair.confluence.toFixed(1)}%
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="font-headline-sm text-sm font-bold text-secondary">
                {activePair.symbol} {activePair.signalDirection === 'BUY' ? 'BULLISH CONTINUATION' : 'BEARISH DISPLACEMENT'}
              </span>
              <span className="font-label-ticker-xs text-xs font-mono text-outline">R:R 1:3.4</span>
            </div>
            <p className="text-[11px] text-outline mt-0.5">
              Multi-Timeframe 4H Flow & 15M FVG mitigation confirmed by Order Flow delta.
            </p>
          </div>

          {/* Target & Risk Parameters Ladder */}
          <div className="bg-surface-container-highest p-2 rounded border border-surface-container font-mono text-[11px] flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-outline">ENTRY (ASK)</span>
              <span className="text-on-surface font-semibold">{activePair.ask.toFixed(activePair.digits)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-error">STOP LOSS</span>
              <span className="text-error font-semibold">
                {(activePair.ask - (activePair.digits === 2 ? 10.0 : 0.0014)).toFixed(activePair.digits)} (-14.0 p)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">TAKE PROFIT 1</span>
              <span className="text-secondary font-semibold">
                {(activePair.ask + (activePair.digits === 2 ? 20.0 : 0.0020)).toFixed(activePair.digits)} (+20.0 p)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary">TAKE PROFIT 2 (PRIMARY)</span>
              <span className="text-secondary font-bold">
                {(activePair.ask + (activePair.digits === 2 ? 40.0 : 0.0040)).toFixed(activePair.digits)} (+40.0 p)
              </span>
            </div>
          </div>

          {/* ML Ensemble Breakdown */}
          <div className="text-[10px] font-mono flex flex-col gap-1">
            <div className="flex items-center justify-between text-outline">
              <span>ML ENSEMBLE WEIGHTS</span>
              <span className="text-secondary font-semibold">HIGH CONVICTION</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-1.5 bg-primary rounded-full flex-1" title="XGBoost 42%"></div>
              <div className="h-1.5 bg-secondary rounded-full flex-1" title="MLP 31%"></div>
              <div className="h-1.5 bg-tertiary rounded-full flex-1" title="LSTM 27%"></div>
            </div>
            <div className="flex justify-between text-[9px] text-outline">
              <span>XGB: 42%</span>
              <span>MLP: 31%</span>
              <span>LSTM: 27%</span>
            </div>
          </div>

          {/* Execution Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleExecuteLong}
              className="w-full py-2 bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs rounded transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 font-mono"
            >
              <TrendingUp className="w-3.5 h-3.5" /> EXECUTE LONG
            </button>
            <button
              onClick={handleExecuteShort}
              className="w-full py-2 bg-error hover:bg-error/90 text-on-error font-bold text-xs rounded transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 font-mono"
            >
              <TrendingUp className="w-3.5 h-3.5 rotate-180" /> EXECUTE SHORT
            </button>
          </div>
        </div>

        {/* Real-Time Order Book / DOM Tape */}
        <div className="bg-surface-container-low rounded-lg p-space-sm border border-surface-container-high flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-xs font-bold text-on-surface uppercase">
              Depth of Market (DOM)
            </span>
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">TIER-1 AGGREGATED</span>
          </div>

          <div className="font-mono text-[10px] flex flex-col gap-1">
            {/* Asks (Sell Orders) */}
            <div className="flex flex-col gap-0.5">
              {[
                { price: (activePair.ask + 0.0006).toFixed(activePair.digits), lots: 14.2, pct: 40 },
                { price: (activePair.ask + 0.0004).toFixed(activePair.digits), lots: 22.8, pct: 65 },
                { price: (activePair.ask + 0.0002).toFixed(activePair.digits), lots: 35.4, pct: 90 },
              ].map((row, idx) => (
                <div key={idx} className="relative flex items-center justify-between px-1 py-0.5 rounded">
                  <div className="absolute right-0 top-0 bottom-0 bg-error/10 rounded" style={{ width: `${row.pct}%` }}></div>
                  <span className="text-error z-10">{row.price}</span>
                  <span className="text-outline z-10">{row.lots} Lots</span>
                </div>
              ))}
            </div>

            {/* Spread Divider */}
            <div className="py-0.5 border-y border-surface-container-highest text-center text-secondary font-bold text-[9px]">
              SPREAD: {activePair.spread.toFixed(1)} PIPS
            </div>

            {/* Bids (Buy Orders) */}
            <div className="flex flex-col gap-0.5">
              {[
                { price: (activePair.bid - 0.0001).toFixed(activePair.digits), lots: 38.6, pct: 95 },
                { price: (activePair.bid - 0.0003).toFixed(activePair.digits), lots: 25.1, pct: 70 },
                { price: (activePair.bid - 0.0005).toFixed(activePair.digits), lots: 16.4, pct: 45 },
              ].map((row, idx) => (
                <div key={idx} className="relative flex items-center justify-between px-1 py-0.5 rounded">
                  <div className="absolute left-0 top-0 bottom-0 bg-secondary/10 rounded" style={{ width: `${row.pct}%` }}></div>
                  <span className="text-secondary z-10">{row.price}</span>
                  <span className="text-outline z-10">{row.lots} Lots</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
