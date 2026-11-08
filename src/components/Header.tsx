import React, { useState, useEffect } from 'react';
import { TerminalMode } from '../types';
import { Volume2, ShieldCheck, Zap } from 'lucide-react';
import { playTerminalChime } from '../utils/audio';

interface HeaderProps {
  currentMode: TerminalMode;
  onModeChange: (mode: TerminalMode) => void;
  executedSignalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentMode, onModeChange, executedSignalsCount }) => {
  const [bstTime, setBstTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate BST (UTC+6)
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const bstDate = new Date(utc + (3600000 * 6));
      
      const hours = String(bstDate.getHours()).padStart(2, '0');
      const minutes = String(bstDate.getMinutes()).padStart(2, '0');
      const seconds = String(bstDate.getSeconds()).padStart(2, '0');
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      
      setBstTime(`${hours}:${minutes}:${seconds}.${ms} BST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 47);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-surface-container-lowest/95 backdrop-blur-xl z-40 flex items-center justify-between px-space-xl border-b border-surface-container-high shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
      {/* Title & Mode Switcher */}
      <div className="flex items-center gap-space-lg">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
              ALPHAFOREX AI
            </span>
            <span className="text-[11px] text-outline font-mono hidden sm:inline">// QUANT INTELLIGENCE</span>
          </div>
          <span className="font-label-ticker-xs text-label-ticker-xs text-outline tracking-wider">
            INSTITUTIONAL HIGH-FREQUENCY DESK
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="hidden lg:flex items-center bg-surface-container p-0.5 rounded-lg border border-surface-container-high overflow-x-auto text-[11px]">
          <button
            onClick={() => {
              onModeChange('pro');
              playTerminalChime('alert');
            }}
            className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${
              currentMode === 'pro'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            PRO MODE
          </button>
          <button
            onClick={() => {
              onModeChange('mir');
              playTerminalChime('alert');
            }}
            className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${
              currentMode === 'mir'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            EASY TRADE MIR
          </button>
          <button
            onClick={() => {
              onModeChange('ftt');
              playTerminalChime('alert');
            }}
            className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${
              currentMode === 'ftt'
                ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            FTT BINARY
          </button>
          <button
            onClick={() => {
              onModeChange('ftt-pro');
              playTerminalChime('alert');
            }}
            className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${
              currentMode === 'ftt-pro'
                ? 'bg-gradient-to-r from-primary-container to-[#a078ff] text-white font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            FTT PRO
          </button>
          <button
            onClick={() => {
              onModeChange('news');
              playTerminalChime('alert');
            }}
            className={`px-2.5 py-1 rounded transition-all whitespace-nowrap ${
              currentMode === 'news'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            NEWS MODE
          </button>
        </div>
      </div>

      {/* Right Metrics & BST Clock */}
      <div className="flex items-center gap-space-lg">
        {/* Real-time BST Clock */}
        <div className="flex flex-col items-end">
          <span className="font-label-ticker-xs text-label-ticker-xs text-outline">
            CLOCK BST (UTC+6)
          </span>
          <span className="font-label-data-md text-label-data-md font-semibold text-secondary font-mono tracking-tight">
            {bstTime || '15:42:08.412 BST'}
          </span>
        </div>

        {/* Latency & Connectivity */}
        <div className="hidden lg:flex flex-col items-end border-l border-surface-container-high pl-4">
          <span className="font-label-ticker-xs text-label-ticker-xs text-outline">
            NETWORK & LATENCY
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-data-sm text-label-data-sm text-on-surface">
              14ms | WS-CONNECTED: TIER-1 LP
            </span>
          </div>
        </div>

        {/* 24H Signals & Risk Gate */}
        <div className="hidden 2xl:flex items-center gap-space-md bg-surface-container px-space-md py-1 rounded border border-surface-container-high">
          <div className="flex flex-col">
            <span className="font-label-ticker-xs text-label-ticker-xs text-outline">24H SIGNALS</span>
            <span className="font-label-data-sm text-label-data-sm text-on-surface font-semibold">
              {executedSignalsCount} EXECUTED
            </span>
          </div>
          <div className="w-px h-6 bg-surface-bright"></div>
          <div className="flex flex-col">
            <span className="font-label-ticker-xs text-label-ticker-xs text-outline">WIN RATE</span>
            <span className="font-label-data-sm text-label-data-sm text-secondary font-semibold">78.4%</span>
          </div>
          <div className="w-px h-6 bg-surface-bright"></div>
          <div className="flex flex-col">
            <span className="font-label-ticker-xs text-label-ticker-xs text-outline">RISK GATE</span>
            <span className="font-label-ticker-xs text-label-ticker-xs px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold inline-flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> ACTIVE
            </span>
          </div>
        </div>

        {/* Quick Chime Sound Test & Operator */}
        <button
          onClick={() => playTerminalChime('alert')}
          title="Test Institutional Terminal Alert Chime"
          className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors border border-surface-container-high flex items-center gap-1 text-xs"
        >
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="hidden md:inline font-mono text-[10px]">CHIME</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shadow-inner">
          <Zap className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
