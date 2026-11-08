import React, { useState, useEffect } from 'react';
import { SAMPLE_ECONOMIC_EVENTS } from '../data/forexData';
import { EconomicNewsEvent } from '../types';
import {
  AlertOctagon,
  Clock,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Flame,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { playTerminalChime } from '../utils/audio';

export const NewsEngineView: React.FC = () => {
  const [events, setEvents] = useState<EconomicNewsEvent[]>(SAMPLE_ECONOMIC_EVENTS);
  const [filterImpact, setFilterImpact] = useState<'ALL' | 'EXTREME' | 'HIGH' | 'MEDIUM'>('ALL');
  const [countdownSeconds, setCountdownSeconds] = useState(872); // ~14m 32s

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 872));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  const filteredEvents = events.filter((ev) => {
    if (filterImpact === 'ALL') return true;
    return ev.impact === filterImpact;
  });

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* 1. TOP HERO STATUS / VOLATILITY RADAR BANNER */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-error/40 shadow-lg flex flex-wrap items-center justify-between gap-space-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-error/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Left: Engine Status */}
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-lg bg-error/20 border border-error/50 flex items-center justify-center text-error animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-base font-bold text-on-surface">
                AI NEWS CANDLE INTELLIGENCE ENGINE
              </span>
              <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-error/20 text-error font-mono font-bold">
                HIGH VOLATILITY EMBARGO
              </span>
            </div>
            <p className="text-xs text-outline font-mono mt-0.5">
              Real-time economic calendar surprise vector & post-release liquidity sweep predictor.
            </p>
          </div>
        </div>

        {/* Center: Pulsating Risk Countdown Widget */}
        <div className="bg-surface-container-highest px-4 py-2 rounded-lg border border-surface-container flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-label-ticker-xs text-[10px] text-error font-mono uppercase font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 animate-spin" /> UPCOMING EVENT COUNTDOWN
            </span>
            <span className="font-headline-sm text-lg font-bold text-error font-mono tracking-wider">
              {formatCountdown(countdownSeconds)}
            </span>
          </div>
          <div className="w-px h-8 bg-surface-bright"></div>
          <div className="text-[11px] font-mono">
            <div className="text-on-surface font-semibold">US Non-Farm Payrolls (NFP)</div>
            <div className="text-outline text-[10px]">07:30 PM BST (13:30 UTC) · Impact: EXTREME</div>
          </div>
        </div>

        {/* Right: Quick Sentiment Metrics */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[11px]">
          <div className="bg-surface-container px-3 py-1.5 rounded border border-surface-container-high">
            <span className="text-outline text-[10px] block">DXY INDEX</span>
            <span className="text-secondary font-bold">104.85 (+0.28%)</span>
          </div>
          <div className="bg-surface-container px-3 py-1.5 rounded border border-surface-container-high">
            <span className="text-outline text-[10px] block">PIP VOLATILITY RISK</span>
            <span className="text-error font-bold">EXTREME (85+ p)</span>
          </div>
        </div>
      </section>

      {/* 2. GRID ROW 1: LIVE CALENDAR & SURPRISE ENGINE (LEFT) + CENTRAL BANK SENTIMENT (RIGHT) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md w-full">
        {/* Economic Calendar & Surprise Engine (8 Cols) */}
        <section className="xl:col-span-8 bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-title-md text-sm font-semibold text-on-surface flex items-center gap-2">
                <span>Economic Calendar & Surprise Deviation Engine</span>
                <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono">
                  BST UTC+6 SYNCHRONIZED
                </span>
              </h2>
              <p className="text-[11px] text-outline mt-0.5">
                Surprise delta standard deviations calculated via institutional consensus variance.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              {(['ALL', 'EXTREME', 'HIGH', 'MEDIUM'] as const).map((impact) => (
                <button
                  key={impact}
                  onClick={() => setFilterImpact(impact)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    filterImpact === impact
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  {impact}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Table */}
          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-surface-container-high text-outline text-[10px] uppercase">
                  <th className="py-2 px-2">BST Time</th>
                  <th className="py-2 px-2">Currency</th>
                  <th className="py-2 px-2">Economic Event</th>
                  <th className="py-2 px-2 text-center">Impact</th>
                  <th className="py-2 px-2 text-right">Actual</th>
                  <th className="py-2 px-2 text-right">Forecast</th>
                  <th className="py-2 px-2 text-right">Previous</th>
                  <th className="py-2 px-2 text-right">Surprise Vector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="py-2.5 px-2 text-on-surface font-semibold whitespace-nowrap">
                      {ev.bstTime}
                    </td>
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-bold">
                        {ev.currency}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-sans font-medium text-on-surface">
                      {ev.event}
                    </td>
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      <span
                        className={`font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          ev.impact === 'EXTREME'
                            ? 'bg-error/20 text-error border border-error/30'
                            : ev.impact === 'HIGH'
                            ? 'bg-error/15 text-error'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {ev.impact}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-on-surface whitespace-nowrap">
                      {ev.actual === 'PENDING' ? (
                        <span className="text-outline">COUNTDOWN</span>
                      ) : ev.actual === 'LIVE' ? (
                        <span className="text-error animate-pulse">SPEAKING NOW</span>
                      ) : (
                        <span className="text-secondary">{ev.actual}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right text-outline whitespace-nowrap">
                      {ev.forecast}
                    </td>
                    <td className="py-2.5 px-2 text-right text-outline whitespace-nowrap">
                      {ev.previous}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold whitespace-nowrap">
                      <span
                        className={`${
                          ev.bias === 'BULLISH'
                            ? 'text-secondary'
                            : ev.bias === 'BEARISH'
                            ? 'text-error'
                            : 'text-outline'
                        }`}
                      >
                        {ev.surpriseDeviation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Central Bank Tracker & AI Sentiment (4 Cols) */}
        <section className="xl:col-span-4 bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-sm font-semibold text-on-surface uppercase">
              Central Bank Stance & Hawkish Score
            </h2>
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">LLM NLP</span>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            {[
              {
                bank: 'Federal Reserve (Fed)',
                currency: 'USD',
                rate: '5.50%',
                score: 62,
                label: 'Hawkish Hold',
                bias: 'hawkish',
                nextMeeting: '14 Days',
              },
              {
                bank: 'European Central Bank (ECB)',
                currency: 'EUR',
                rate: '3.75%',
                score: 34,
                label: 'Dovish Cut Cycle',
                bias: 'dovish',
                nextMeeting: '22 Days',
              },
              {
                bank: 'Bank of England (BOE)',
                currency: 'GBP',
                rate: '5.25%',
                score: 51,
                label: 'Balanced Stance',
                bias: 'neutral',
                nextMeeting: '9 Days',
              },
            ].map((b, idx) => (
              <div key={idx} className="p-2.5 rounded bg-surface-container border border-surface-container-high font-mono text-[11px] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-bold text-on-surface text-xs">{b.bank}</span>
                    <span className="px-1 py-0.2 rounded bg-surface-container-highest text-primary text-[9px]">
                      {b.currency}
                    </span>
                  </div>
                  <span className="text-secondary font-bold">{b.rate}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-outline">
                  <span>Policy Bias: <strong className="text-on-surface">{b.label}</strong></span>
                  <span>Next: {b.nextMeeting}</span>
                </div>

                {/* Score bar */}
                <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      b.bias === 'hawkish'
                        ? 'bg-secondary'
                        : b.bias === 'dovish'
                        ? 'bg-error'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${b.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Wire Micro-Stream */}
          <div className="pt-2 border-t border-surface-container-high flex flex-col gap-1.5">
            <span className="font-label-ticker-xs text-[10px] text-outline uppercase font-mono flex items-center gap-1">
              <Radio className="w-3 h-3 text-secondary animate-pulse" /> Breaking News Wire
            </span>
            <div className="font-mono text-[10px] flex flex-col gap-1 text-outline">
              <p className="text-on-surface">
                <strong className="text-secondary">[15:38 BST]</strong> Fed's Waller says inflation data warrants patience on additional rate cuts.
              </p>
              <p>
                <strong className="text-primary">[15:12 BST]</strong> Eurozone retail sales revised up to +0.8% YoY; ECB neutral impact.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 3. GRID ROW 2: NEWS CANDLE VOLATILITY & SPREAD MONITOR (7 COLS) + AI SIGNAL & RISK ENGINE (5 COLS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md w-full">
        {/* NEWS CANDLE ANATOMY & SPREAD MONITOR (7 COLS) */}
        <section className="xl:col-span-7 bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-title-md text-sm font-semibold text-on-surface">
                News Candle Anatomy & Liquidity Sweep Waveform
              </h2>
              <p className="text-[11px] text-outline mt-0.5">
                Visual anatomy of manipulation Judas spikes vs true post-news directional displacement.
              </p>
            </div>

            {/* Live Spread Indicator */}
            <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1 rounded border border-surface-container-high font-mono text-[10px]">
              <span className="text-outline">SPREAD EXPANSION:</span>
              <span className="text-error font-bold">NORMAL 1.1p → SPIKE 8.2p</span>
            </div>
          </div>

          {/* INLINE SVG: High-Precision News Candle Volatility Waveform & Wick Anatomy */}
          <div className="relative w-full h-[150px] bg-[#0a0e16] rounded border border-surface-container overflow-hidden p-2">
            <svg className="w-full h-full text-primary" viewBox="0 0 600 130" preserveAspectRatio="none" fill="none">
              {/* Grid Lines */}
              <line x1="0" x2="600" y1="30" y2="30" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
              <line x1="0" x2="600" y1="65" y2="65" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
              <line x1="0" x2="600" y1="100" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

              {/* Pre-News Flat Wave (0 -> 240) */}
              <path d="M 0 85 Q 30 82, 60 86 T 120 84 T 180 85 T 230 84 L 240 85" stroke="#8C909F" strokeWidth="1.5" />

              {/* Initial Judas Spike Wick Up (240 -> 270) */}
              <path d="M 240 85 L 265 15" stroke="#FFB4AB" strokeWidth="2.5" />
              <circle cx="265" cy="15" r="3" fill="#FFB4AB" />

              {/* Trap Collapse Wave (270 -> 400) */}
              <path d="M 265 15 L 280 115 L 340 105 L 400 95" stroke="#4EDEA3" strokeWidth="2.5" />

              {/* Stabilization / Cooling Zone (400 -> 600) */}
              <path d="M 400 95 Q 450 92, 500 95 T 600 94" stroke="#ADC6FF" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* Labels on SVG */}
              <text x="50" y="75" fill="#8C909F" fontSize="9" fontFamily="JetBrains Mono">
                Pre-News Consolidation
              </text>
              <text x="270" y="22" fill="#FFB4AB" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
                Judas Spike Trap (Stop Run)
              </text>
              <text x="350" y="115" fill="#4EDEA3" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
                True Displacement Wave
              </text>
            </svg>
          </div>

          {/* Trap Visualizer Steps */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
            <div className="p-2 rounded bg-surface-container border border-surface-container-high">
              <span className="text-outline uppercase block">PHASE 1 (T-5m)</span>
              <span className="text-on-surface font-semibold block mt-0.5">Spread Expansion</span>
              <p className="text-outline text-[9px] mt-0.5">LPs pull depth; spread widens 3x to 5x.</p>
            </div>
            <div className="p-2 rounded bg-surface-container border border-error/30">
              <span className="text-error uppercase block">PHASE 2 (T+0s)</span>
              <span className="text-error font-semibold block mt-0.5">Judas Wick Liquidity Raid</span>
              <p className="text-outline text-[9px] mt-0.5">Raid stop orders above Asian session highs.</p>
            </div>
            <div className="p-2 rounded bg-surface-container border border-secondary/30">
              <span className="text-secondary uppercase block">PHASE 3 (T+15m)</span>
              <span className="text-secondary font-semibold block mt-0.5">Equilibrium Retest</span>
              <p className="text-outline text-[9px] mt-0.5">Enter on 50% wick retrace with low risk.</p>
            </div>
          </div>
        </section>

        {/* AI SIGNAL & RISK ENGINE (5 COLS) */}
        <section className="xl:col-span-5 bg-surface-container-low rounded-lg p-space-md border border-secondary/40 shadow-lg flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-xs font-bold text-on-surface uppercase flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-secondary" /> POST-NEWS STRATEGY BLUEPRINT
            </h2>
            <span className="font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono font-bold">
              STRATEGY #205
            </span>
          </div>

          <div className="bg-surface-container-highest p-3 rounded border border-surface-container font-mono text-[11px] flex flex-col gap-2">
            <div>
              <span className="text-secondary font-bold block text-sm">
                EUR/USD · WICK ABSORPTION FADE
              </span>
              <span className="text-outline text-[10px]">
                Rule: If NFP beats forecast by &gt;+40k, wait for initial 15-pip spike up to exhaust, then enter SHORT at Asian High raid.
              </span>
            </div>

            <div className="p-2 rounded bg-surface-container border border-surface-container-high flex flex-col gap-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-outline">RECOMMENDED BUFFER:</span>
                <span className="text-on-surface font-semibold">18.5 Pips (Pre-News SL Lock)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">STRADDLE THRESHOLD:</span>
                <span className="text-secondary font-semibold">±25 Pips Breakout Trigger</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">EMBARGO WINDOW:</span>
                <span className="text-error font-semibold">T-15m to T+10m No Market Orders</span>
              </div>
            </div>
          </div>

          {/* False Breakout Alert */}
          <div className="p-2.5 rounded bg-error/10 border border-error/30 text-error flex items-center gap-2 text-xs font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>False Breakout Guard:</strong> 64% of NFP initial 1-minute candle directions reverse within 12 minutes. Do NOT chase market orders.
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              playTerminalChime('alert');
            }}
            className="w-full py-2 bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-bold text-xs rounded transition-all font-mono shadow-md mt-auto flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> ARM STRADDLE BREAKOUT GUARD
          </button>
        </section>
      </div>
    </div>
  );
};
