import React from 'react';
import { CurrencyPair, Timeframe } from '../types';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface TickerStripProps {
  activePair: CurrencyPair;
  pairs: CurrencyPair[];
  onSelectPair: (pair: CurrencyPair) => void;
  activeTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  onQuickExecute: (direction: 'BUY' | 'SELL') => void;
}

export const TickerStrip: React.FC<TickerStripProps> = ({
  activePair,
  pairs,
  onSelectPair,
  activeTimeframe,
  onTimeframeChange,
  onQuickExecute,
}) => {
  const timeframes: Timeframe[] = ['1s', '1m', '5m', '15m', '1h', '4h', '1D'];

  return (
    <header className="w-full bg-surface-container-low rounded-lg p-space-sm shadow-md border border-surface-container-high flex flex-wrap items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-lg flex-wrap">
        {/* Pair & Ticker Meta Dropdown */}
        <div className="flex items-center gap-space-sm bg-surface-container-highest px-space-md py-1.5 rounded border border-surface-container">
          <select
            value={activePair.symbol}
            onChange={(e) => {
              const found = pairs.find((p) => p.symbol === e.target.value);
              if (found) onSelectPair(found);
            }}
            aria-label="Select Active Currency Pair"
            className="bg-transparent text-on-surface font-headline-sm text-sm font-bold tracking-wide cursor-pointer focus:outline-none border-none py-0.5"
          >
            {pairs.map((p) => (
              <option key={p.symbol} value={p.symbol} className="bg-surface-container text-on-surface">
                {p.symbol} ({p.name})
              </option>
            ))}
          </select>
          <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-surface-container font-semibold text-primary uppercase">
            SPOT FX
          </span>
        </div>

        {/* Live Spread, Bid, Ask */}
        <div className="flex items-center gap-space-md">
          {/* BID (SELL) */}
          <button
            onClick={() => onQuickExecute('SELL')}
            className="flex flex-col text-left group hover:opacity-80 transition-opacity"
            title="Click to execute Paper SELL at Bid"
          >
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">BID (SELL)</span>
            <span className="font-label-data-lg text-sm text-error font-bold font-mono tracking-tight flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3 text-error inline" />
              {activePair.bid.toFixed(activePair.digits)}
            </span>
          </button>

          {/* SPREAD */}
          <div className="flex flex-col items-center justify-center px-space-xs">
            <span className="font-label-ticker-xs text-[9px] text-outline uppercase font-mono">SPREAD</span>
            <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-surface-bright text-on-surface font-bold font-mono">
              {activePair.spread.toFixed(1)} PIPS
            </span>
          </div>

          {/* ASK (BUY) */}
          <button
            onClick={() => onQuickExecute('BUY')}
            className="flex flex-col text-left group hover:opacity-80 transition-opacity"
            title="Click to execute Paper BUY at Ask"
          >
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">ASK (BUY)</span>
            <span className="font-label-data-lg text-sm text-secondary font-bold font-mono tracking-tight flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3 text-secondary inline" />
              {activePair.ask.toFixed(activePair.digits)}
            </span>
          </button>
        </div>

        {/* 24h Metrics */}
        <div className="hidden md:flex items-center gap-space-md bg-surface-container px-space-md py-1 rounded border border-surface-container-high">
          <div>
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">24H CHG</span>
            <p
              className={`font-label-data-sm text-[11px] font-bold font-mono ${
                activePair.change24h >= 0 ? 'text-secondary' : 'text-error'
              }`}
            >
              {activePair.change24h >= 0 ? '+' : ''}
              {activePair.change24h}% ({activePair.changePips > 0 ? '+' : ''}
              {activePair.changePips} p)
            </p>
          </div>
          <div className="w-px h-6 bg-surface-bright"></div>
          <div>
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">24H HIGH / LOW</span>
            <p className="font-label-data-sm text-[11px] text-on-surface font-mono">
              {activePair.high24h.toFixed(activePair.digits)} / {activePair.low24h.toFixed(activePair.digits)}
            </p>
          </div>
          <div className="w-px h-6 bg-surface-bright"></div>
          <div>
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">SESSION STATE</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-ticker-xs text-[10px] font-semibold text-secondary">
                LONDON / NY OVERLAP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeframes */}
      <div className="flex items-center gap-space-md flex-wrap">
        <div className="flex items-center bg-surface-container p-0.5 rounded gap-0.5 border border-surface-container-high">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-0.5 font-label-ticker-xs text-[10px] rounded transition-all font-mono ${
                activeTimeframe === tf
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Quick Refresh */}
        <button
          onClick={() => {}}
          title="Force Tick Synchronization"
          className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
