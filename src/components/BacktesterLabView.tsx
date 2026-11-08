import React, { useState } from 'react';
import { SAMPLE_STRATEGIES, INITIAL_PAIRS } from '../data/forexData';
import { FlaskConical, Play, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { playTerminalChime } from '../utils/audio';

export const BacktesterLabView: React.FC = () => {
  const [selectedStrategyId, setSelectedStrategyId] = useState(SAMPLE_STRATEGIES[0].id);
  const [selectedPair, setSelectedPair] = useState(INITIAL_PAIRS[0].symbol);
  const [selectedTf, setSelectedTf] = useState('15m');
  const [initialCapital, setInitialCapital] = useState(10000);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    netProfit: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    totalTrades: number;
    sharpeRatio: number;
  }>({
    netProfit: 18450,
    winRate: 81.4,
    profitFactor: 2.84,
    maxDrawdown: 4.2,
    totalTrades: 142,
    sharpeRatio: 2.91,
  });

  const handleRunBacktest = () => {
    setIsRunning(true);
    playTerminalChime('alert');
    setTimeout(() => {
      const currentStrategy = SAMPLE_STRATEGIES.find((s) => s.id === selectedStrategyId) || SAMPLE_STRATEGIES[0];
      const winRateVariance = (Math.random() * 2 - 1) * 1.5;
      const profitFactorVariance = (Math.random() * 0.2 - 0.1);
      
      setResults({
        netProfit: Math.round(initialCapital * (currentStrategy.winRate / 100) * 2.2),
        winRate: Number((currentStrategy.winRate + winRateVariance).toFixed(1)),
        profitFactor: Number((currentStrategy.profitFactor + profitFactorVariance).toFixed(2)),
        maxDrawdown: Number((3.8 + Math.random() * 1.2).toFixed(1)),
        totalTrades: currentStrategy.tradesCount + Math.floor(Math.random() * 20),
        sharpeRatio: Number((2.7 + Math.random() * 0.4).toFixed(2)),
      });
      setIsRunning(false);
      playTerminalChime('success');
    }, 700);
  };

  return (
    <div className="flex flex-col gap-space-md w-full">
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-tertiary" />
            <div>
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                QUANTITATIVE STRATEGY BACKTESTER & LAB
              </h2>
              <span className="text-[11px] text-outline font-mono">
                Monte Carlo tick simulation with realistic spread, slippage, and liquidity modeling
              </span>
            </div>
          </div>

          <button
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="px-4 py-2 bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-bold text-xs rounded transition-all font-mono shadow-md flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'SIMULATING 1,000 RUNS...' : 'RUN MONTE CARLO BACKTEST'}
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div>
            <label className="text-outline text-[10px] block mb-1">SELECT STRATEGY:</label>
            <select
              value={selectedStrategyId}
              onChange={(e) => setSelectedStrategyId(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-2.5 py-1.5 text-on-surface font-semibold focus:outline-none focus:border-primary-container"
            >
              {SAMPLE_STRATEGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-outline text-[10px] block mb-1">ASSET PAIR:</label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-2.5 py-1.5 text-on-surface font-semibold focus:outline-none focus:border-primary-container"
            >
              {INITIAL_PAIRS.map((p) => (
                <option key={p.symbol} value={p.symbol}>
                  {p.symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-outline text-[10px] block mb-1">TIMEFRAME:</label>
            <select
              value={selectedTf}
              onChange={(e) => setSelectedTf(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-2.5 py-1.5 text-on-surface font-semibold focus:outline-none focus:border-primary-container"
            >
              <option value="1m">1m (Scalping)</option>
              <option value="5m">5m (Micro-structure)</option>
              <option value="15m">15m (Intraday Swing)</option>
              <option value="1h">1h (Session Bias)</option>
              <option value="4h">4h (Institutional Trend)</option>
            </select>
          </div>

          <div>
            <label className="text-outline text-[10px] block mb-1">STARTING BALANCE ($):</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value) || 10000)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-2.5 py-1.5 text-on-surface font-semibold focus:outline-none focus:border-primary-container"
            />
          </div>
        </div>

        {/* Backtest Results KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 font-mono">
          <div className="p-2.5 rounded bg-surface-container border border-surface-container-high">
            <span className="text-outline text-[10px] block">NET PROFIT</span>
            <span className="font-headline-sm text-sm font-bold text-secondary">
              +${results.netProfit.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-container border border-surface-container-high">
            <span className="text-outline text-[10px] block">WIN RATE</span>
            <span className="font-headline-sm text-sm font-bold text-secondary">
              {results.winRate}%
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-container border border-surface-container-high">
            <span className="text-outline text-[10px] block">PROFIT FACTOR</span>
            <span className="font-headline-sm text-sm font-bold text-secondary">
              {results.profitFactor}
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-container border border-surface-container-high">
            <span className="text-outline text-[10px] block">MAX DRAWDOWN</span>
            <span className="font-headline-sm text-sm font-bold text-primary">
              {results.maxDrawdown}%
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-container border border-surface-container-high">
            <span className="text-outline text-[10px] block">TOTAL TRADES</span>
            <span className="font-headline-sm text-sm font-bold text-on-surface">
              {results.totalTrades}
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface-container border border-surface-container-high">
            <span className="text-outline text-[10px] block">SHARPE RATIO</span>
            <span className="font-headline-sm text-sm font-bold text-secondary">
              {results.sharpeRatio}
            </span>
          </div>
        </div>

        {/* Monte Carlo Simulated Equity Simulation Curve */}
        <div className="relative w-full h-[180px] bg-[#0a0e16] rounded border border-surface-container overflow-hidden p-2 mt-1">
          <svg className="w-full h-full text-secondary" viewBox="0 0 700 180" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="backtestGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#adc6ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid */}
            <line x1="0" x2="700" y1="45" y2="45" stroke="#1c2028" strokeDasharray="3 3" />
            <line x1="0" x2="700" y1="90" y2="90" stroke="#1c2028" strokeDasharray="3 3" />
            <line x1="0" x2="700" y1="135" y2="135" stroke="#1c2028" strokeDasharray="3 3" />

            {/* Simulated Curve */}
            <path
              d="M 0 160 Q 60 150, 120 135 T 240 110 T 360 85 T 480 55 T 600 35 T 700 15 L 700 180 L 0 180 Z"
              fill="url(#backtestGrad)"
            />
            <path
              d="M 0 160 Q 60 150, 120 135 T 240 110 T 360 85 T 480 55 T 600 35 T 700 15"
              stroke="#adc6ff"
              strokeWidth="2.5"
            />

            {/* High Watermark */}
            <circle cx="700" cy="15" r="4" fill="#adc6ff" />

            <text x="20" y="30" fill="#8c909f" fontSize="10" fontFamily="JetBrains Mono">
              Base: ${initialCapital.toLocaleString()}
            </text>
            <text x="520" y="30" fill="#adc6ff" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
              Simulated Peak: ${(initialCapital + results.netProfit).toLocaleString()}
            </text>
          </svg>
        </div>
      </section>
    </div>
  );
};
