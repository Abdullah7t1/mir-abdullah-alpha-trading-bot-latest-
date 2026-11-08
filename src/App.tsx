/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, TerminalMode, Timeframe, CurrencyPair } from './types';
import { INITIAL_PAIRS } from './data/forexData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TickerStrip } from './components/TickerStrip';
import { DashboardView } from './components/DashboardView';
import { ProEngineView } from './components/ProEngineView';
import { NewsEngineView } from './components/NewsEngineView';
import { BangladeshSignalCenterView } from './components/BangladeshSignalCenterView';
import { MultiAssetScannerView } from './components/MultiAssetScannerView';
import { BacktesterLabView } from './components/BacktesterLabView';
import { SystemTelemetryView } from './components/SystemTelemetryView';
import { EasyTradeMirView } from './components/EasyTradeMirView';
import { FTTBinaryView } from './components/FTTBinaryView';
import { FTTProView } from './components/FTTProView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard-terminal');
  const [currentMode, setCurrentMode] = useState<TerminalMode>('pro');
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('15m');
  const [pairs, setPairs] = useState<CurrencyPair[]>(INITIAL_PAIRS);
  const [activePair, setActivePair] = useState<CurrencyPair>(INITIAL_PAIRS[0]);
  const [executedSignalsCount, setExecutedSignalsCount] = useState<number>(38);

  // Live realistic micro-tick simulation
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setPairs((prevPairs) =>
        prevPairs.map((p) => {
          // Small micro fluctuation ±0.00004 for 5-digit, ±0.03 for 2-3 digit
          const deltaFactor = p.digits === 5 ? 0.00003 : p.digits === 2 ? 0.25 : 0.02;
          const randomDelta = (Math.random() * 2 - 1) * deltaFactor;
          const newBid = Math.max(0.001, Number((p.bid + randomDelta).toFixed(p.digits)));
          const spreadDiff = (p.spread * (p.digits === 5 ? 0.0001 : p.digits === 2 ? 0.1 : 0.01));
          const newAsk = Number((newBid + spreadDiff).toFixed(p.digits));

          return {
            ...p,
            bid: newBid,
            ask: newAsk,
          };
        })
      );
    }, 1800);

    return () => clearInterval(tickInterval);
  }, []);

  // Keep activePair in sync with live pairs update
  useEffect(() => {
    const current = pairs.find((p) => p.symbol === activePair.symbol);
    if (current) {
      setActivePair(current);
    }
  }, [pairs, activePair.symbol]);

  const handleModeChange = (mode: TerminalMode) => {
    setCurrentMode(mode);
    if (mode === 'news') {
      setActiveTab('news-candle-ai-calendar');
    } else if (mode === 'mir') {
      setActiveTab('easy-trade-mir');
    } else if (mode === 'ftt') {
      setActiveTab('ftt-binary');
    } else if (mode === 'ftt-pro') {
      setActiveTab('ftt-pro-mode');
    } else {
      setActiveTab('dashboard-terminal');
    }
  };

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (tab === 'news-candle-ai-calendar') {
      setCurrentMode('news');
    } else if (tab === 'easy-trade-mir') {
      setCurrentMode('mir');
    } else if (tab === 'ftt-binary') {
      setCurrentMode('ftt');
    } else if (tab === 'ftt-pro-mode') {
      setCurrentMode('ftt-pro');
    } else if (tab === 'pro-technical-engine' || tab === 'dashboard-terminal') {
      setCurrentMode('pro');
    }
  };

  const handleExecuteTrade = (pair: string, direction: 'BUY' | 'SELL', price: number, sl: number, tp: number) => {
    setExecutedSignalsCount((prev) => prev + 1);
  };

  const handleSelectPairAndNavigate = (pair: CurrencyPair) => {
    setActivePair(pair);
    setActiveTab('dashboard-terminal');
  };

  return (
    <div className="min-h-screen bg-[#0a0e16] text-[#dfe2ee] font-sans antialiased flex">
      {/* Fixed Left Institutional Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Terminal Workspace (Offset for 64 width sidebar) */}
      <div className="pl-64 flex flex-col min-h-screen w-full">
        {/* Fixed Institutional Top Header */}
        <Header
          currentMode={currentMode}
          onModeChange={handleModeChange}
          executedSignalsCount={executedSignalsCount}
        />

        {/* Scrollable Main Canvas */}
        <main className="relative pt-16 pb-12 w-full px-space-md sm:px-space-xl bg-[#0a0e16] flex-1 flex flex-col gap-space-sm">
          {/* Global Ticker Strip (Always available across trading views) */}
          <TickerStrip
            activePair={activePair}
            pairs={pairs}
            onSelectPair={setActivePair}
            activeTimeframe={activeTimeframe}
            onTimeframeChange={setActiveTimeframe}
            onQuickExecute={(dir) => handleExecuteTrade(activePair.symbol, dir, activePair.ask, 0, 0)}
          />

          {/* Active View Router */}
          <div className="w-full flex-1 pt-1">
            {activeTab === 'dashboard-terminal' && (
              <DashboardView
                pairs={pairs}
                activePair={activePair}
                onSelectPair={setActivePair}
                activeTimeframe={activeTimeframe}
                onExecuteTrade={handleExecuteTrade}
              />
            )}

            {activeTab === 'easy-trade-mir' && (
              <EasyTradeMirView
                pairs={pairs}
                activePair={activePair}
                onSelectPair={setActivePair}
                onExecuteTrade={handleExecuteTrade}
              />
            )}

            {activeTab === 'ftt-binary' && (
              <FTTBinaryView />
            )}

            {activeTab === 'ftt-pro-mode' && (
              <FTTProView />
            )}

            {activeTab === 'pro-technical-engine' && (
              <ProEngineView
                activePair={activePair}
                onExecuteTrade={handleExecuteTrade}
              />
            )}

            {activeTab === 'news-candle-ai-calendar' && (
              <NewsEngineView />
            )}

            {activeTab === 'multi-asset-scanner' && (
              <MultiAssetScannerView
                pairs={pairs}
                onSelectPairAndNavigate={handleSelectPairAndNavigate}
              />
            )}

            {activeTab === 'strategy-backtester-lab' && (
              <BacktesterLabView />
            )}

            {(activeTab === 'bangladesh-signal-center' || activeTab === 'risk-position-calculator') && (
              <BangladeshSignalCenterView />
            )}

            {activeTab === 'system-telemetry' && (
              <SystemTelemetryView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
