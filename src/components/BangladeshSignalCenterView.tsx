import React, { useState, useEffect } from 'react';
import { BANGLADESH_SIGNALS, RECENT_TRADE_AUDITS } from '../data/forexData';
import { SignalAlert, TradeAuditLog } from '../types';
import {
  Radio,
  Volume2,
  Copy,
  Check,
  Send,
  Calculator,
  ShieldAlert,
  Share2,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { playTerminalChime, playBengaliSpeech } from '../utils/audio';

export const BangladeshSignalCenterView: React.FC = () => {
  const [signals] = useState<SignalAlert[]>(BANGLADESH_SIGNALS);
  const [trades] = useState<TradeAuditLog[]>(RECENT_TRADE_AUDITS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Risk Calculator State
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'BDT'>('USD');
  const usdToBdtRate = 122.50;
  const [balanceInput, setBalanceInput] = useState<number>(25000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLossPips, setStopLossPips] = useState<number>(14);
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');

  // BST live clock percentage for timeline
  const [bstProgressPct, setBstProgressPct] = useState<number>(86.45); // default ~20:45 BST
  const [currentBstDisplay, setCurrentBstDisplay] = useState<string>('08:45 PM BST');

  useEffect(() => {
    const updateTimeline = () => {
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const bst = new Date(utc + (3600000 * 6));
      
      const hours = bst.getHours();
      const minutes = bst.getMinutes();
      const seconds = bst.getSeconds();
      
      const totalHours = hours + minutes / 60 + seconds / 3600;
      const pct = (totalHours / 24) * 100;
      setBstProgressPct(pct);

      const h12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      setCurrentBstDisplay(`${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm} BST`);
    };

    updateTimeline();
    const interval = setInterval(updateTimeline, 1000);
    return () => clearInterval(interval);
  }, []);

  // Risk calculations
  const balanceInUsd = currencyMode === 'USD' ? balanceInput : balanceInput / usdToBdtRate;
  const balanceInBdt = currencyMode === 'BDT' ? balanceInput : balanceInput * usdToBdtRate;
  const cashAtRiskUsd = balanceInUsd * (riskPercent / 100);
  const cashAtRiskBdt = cashAtRiskUsd * usdToBdtRate;
  
  // Standard FX lot: 1 pip = $10 per 1.0 standard lot (EUR/USD)
  const pipValuePerLot = selectedPair.includes('JPY') ? 6.5 : 10.0;
  const recommendedLots = stopLossPips > 0 ? (cashAtRiskUsd / (stopLossPips * pipValuePerLot)) : 0;
  const target1Pips = stopLossPips * 1.5;
  const target2Pips = stopLossPips * 2.8;
  const potentialProfitUsd = recommendedLots * target2Pips * pipValuePerLot;

  const handleCopySignal = (signal: SignalAlert) => {
    const text = `🎯 ALPHAFOREX AI INSTITUTIONAL SIGNAL\nPair: ${signal.pair} (${signal.type})\nBST Time: ${signal.timeBST}\nEntry: ${signal.entry}\nSL: ${signal.stopLoss}\nTP1: ${signal.takeProfit1}\nTP2: ${signal.takeProfit2}\nR:R: ${signal.riskReward} | Conf: ${signal.confidence}%\n\nবাংলা নির্দেশনা:\n${signal.bengaliTranscript}`;
    navigator.clipboard.writeText(text);
    setCopiedId(signal.id);
    playTerminalChime('success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePlayVoice = (signal: SignalAlert) => {
    if (playingVoiceId === signal.id) {
      window.speechSynthesis?.cancel();
      setPlayingVoiceId(null);
      return;
    }
    setPlayingVoiceId(signal.id);
    playTerminalChime('alert');
    playBengaliSpeech(signal.bengaliTranscript, () => {
      setPlayingVoiceId(null);
    });
  };

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* 1. BANGLADESH TRADING SESSION TIMELINE & STATUS (24-Hour Ribbon) */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-secondary animate-pulse" />
            <div>
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                BANGLADESH STANDARD TIME (BST UTC+6) SESSION TIMELINE
              </h2>
              <span className="text-[11px] text-outline font-mono">
                Optimized for Dhaka, Chittagong, Sylhet & Global Bangladeshi FX Desks
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-surface-container-high font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span className="text-outline">CURRENT BST:</span>
            <span className="text-secondary font-bold">{currentBstDisplay}</span>
            <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
              LONDON / NY OVERLAP
            </span>
          </div>
        </div>

        {/* 24-Hour Visual Session Ribbon */}
        <div className="relative w-full h-12 bg-surface-container-lowest rounded-lg overflow-hidden border border-surface-container flex flex-col justify-center">
          {/* Asian / Tokyo Session: 06:00 to 15:00 BST (25% to 62.5%, width = 37.5%) */}
          <div
            className="absolute top-1 bottom-1 bg-[#adc6ff]/15 border-l border-r border-[#adc6ff]/40 rounded-sm flex items-center px-2 text-[9px] font-mono text-primary select-none"
            style={{ left: '25%', width: '37.5%' }}
            title="Tokyo / Asian Session (06:00 - 15:00 BST)"
          >
            <span className="truncate">TOKYO / ASIAN (06:00 - 15:00 BST)</span>
          </div>

          {/* London Session: 14:00 to 23:00 BST (58.33% to 95.83%, width = 37.5%) */}
          <div
            className="absolute top-1 bottom-1 bg-[#4edea3]/20 border-l border-r border-[#4edea3]/50 rounded-sm flex items-center px-2 text-[9px] font-mono text-secondary select-none"
            style={{ left: '58.33%', width: '37.5%' }}
            title="London Session (14:00 - 23:00 BST)"
          >
            <span className="truncate">LONDON (14:00 - 23:00 BST)</span>
          </div>

          {/* New York Session: 19:00 to 04:00 BST (wraps) */}
          <div
            className="absolute top-1 bottom-1 bg-[#d0bcff]/20 border-l border-r border-[#d0bcff]/50 rounded-sm flex items-center px-2 text-[9px] font-mono text-tertiary select-none"
            style={{ left: '79.16%', width: '20.84%' }}
            title="New York Session (19:00 - 04:00 BST)"
          >
            <span className="truncate">NEW YORK</span>
          </div>

          {/* London / NY Overlap Zone Highlight (19:00 to 23:00 BST -> 79.16% to 95.83%, width = 16.67%) */}
          <div
            className="absolute top-0 bottom-0 bg-secondary/30 border-2 border-secondary shadow-[0_0_12px_rgba(78,222,163,0.5)] z-10 flex items-center justify-center text-[9px] font-mono font-bold text-white select-none animate-pulse"
            style={{ left: '79.16%', width: '16.67%' }}
            title="Golden Hour: London & NY Overlap (19:00 - 23:00 BST)"
          >
            <span>GOLDEN OVERLAP (7PM-11PM)</span>
          </div>

          {/* Current BST Live Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-error z-30 shadow-[0_0_8px_#ffb4ab]"
            style={{ left: `${Math.min(Math.max(bstProgressPct, 0), 100)}%` }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-error animate-ping"></div>
          </div>
        </div>

        {/* Time Axis Labels */}
        <div className="flex justify-between text-[10px] text-outline font-mono px-1">
          <span>00:00 BST</span>
          <span>06:00 (Asian Open)</span>
          <span>12:00</span>
          <span>14:00 (London Open)</span>
          <span className="text-secondary font-bold">19:00 (NY Open / Overlap)</span>
          <span>23:00 (London Close)</span>
          <span>24:00</span>
        </div>
      </section>

      {/* 2. WORKBENCH GRID: LIVE SIGNALS & RISK ENGINE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md w-full">
        {/* LEFT 7 COLS: ACTIVE BANGLADESH SIGNALS FEED */}
        <section className="xl:col-span-7 bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                বাংলা লাইভ সিগন্যাল ও অডিও ডেসপ্যাচ (Live Signals)
              </h2>
              <span className="font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-mono font-bold">
                HIGH CONVICTION
              </span>
            </div>
            <span className="text-[11px] text-outline font-mono">Telegram & Push Ready</span>
          </div>

          {/* Signals List */}
          <div className="flex flex-col gap-3 pt-1">
            {signals.map((sig) => (
              <div
                key={sig.id}
                className="bg-surface-container rounded-lg p-3.5 border border-surface-container-high flex flex-col gap-2.5 shadow-sm hover:border-primary-container/60 transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-base font-bold text-on-surface">
                      {sig.pair}
                    </span>
                    <span
                      className={`font-label-ticker-xs text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        sig.type === 'BUY'
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-error text-on-error'
                      }`}
                    >
                      {sig.type}
                    </span>
                    <span className="text-[11px] font-mono text-outline">{sig.timeBST}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-outline">R:R: <strong className="text-on-surface">{sig.riskReward}</strong></span>
                    <span className="text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded">
                      {sig.confidence}% AI CONF
                    </span>
                  </div>
                </div>

                {/* Entry & Targets Ladder */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface-container-highest p-2 rounded text-[11px] font-mono">
                  <div>
                    <span className="text-outline text-[10px] block">ENTRY</span>
                    <span className="text-on-surface font-semibold">{sig.entry}</span>
                  </div>
                  <div>
                    <span className="text-error text-[10px] block">STOP LOSS</span>
                    <span className="text-error font-semibold">{sig.stopLoss}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[10px] block">TARGET 1</span>
                    <span className="text-secondary font-semibold">{sig.takeProfit1}</span>
                  </div>
                  <div>
                    <span className="text-secondary text-[10px] block">TARGET 2</span>
                    <span className="text-secondary font-bold">{sig.takeProfit2}</span>
                  </div>
                </div>

                {/* Bengali Notification Transcript Box with Interactive TTS */}
                <div className="p-2.5 rounded bg-surface-container-lowest border border-secondary/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-secondary font-bold uppercase flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" /> বাংলা অডিও নোটিফিকেশন ট্রান্সক্রিপ্ট
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayVoice(sig)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-all ${
                          playingVoiceId === sig.id
                            ? 'bg-secondary text-on-secondary animate-pulse'
                            : 'bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-high'
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        {playingVoiceId === sig.id ? 'শুনছেন...' : 'অডিও শুনুন'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#dfe2ee] font-sans leading-relaxed">
                    "{sig.bengaliTranscript}"
                  </p>
                </div>

                {/* Dispatch & Copy Actions */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-surface-container-high">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-outline">
                    <span>Strategies:</span>
                    {sig.strategies.map((st, idx) => (
                      <span key={idx} className="text-primary">{st} ·</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySignal(sig)}
                      className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-surface-container text-on-surface text-xs font-mono flex items-center gap-1 border border-surface-container"
                    >
                      {copiedId === sig.id ? (
                        <>
                          <Check className="w-3 h-3 text-secondary" />
                          <span className="text-secondary font-bold">কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-outline" />
                          <span>Telegram ফরম্যাট কপি</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `ALPHAFOREX AI SIGNAL: ${sig.pair} ${sig.type} @ ${sig.entry} | SL: ${sig.stopLoss} | TP: ${sig.takeProfit2} (${sig.timeBST})`
                        )}`;
                        window.open(url, '_blank');
                      }}
                      className="px-2.5 py-1 rounded bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container text-xs font-mono font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT 5 COLS: POSITION SIZING & RISK/REWARD CALCULATOR */}
        <section className="xl:col-span-5 bg-surface-container-low rounded-lg p-space-md border border-surface-container-high flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                লট সাইজ ও রিস্ক ক্যালকুলেটর (Risk Sizing)
              </h2>
            </div>

            {/* Currency Mode Toggle */}
            <div className="flex items-center bg-surface-container p-0.5 rounded border border-surface-container-high font-mono text-xs">
              <button
                onClick={() => setCurrencyMode('USD')}
                className={`px-2 py-0.5 rounded ${
                  currencyMode === 'USD'
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrencyMode('BDT')}
                className={`px-2 py-0.5 rounded ${
                  currencyMode === 'BDT'
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                BDT (৳)
              </button>
            </div>
          </div>

          <p className="text-[11px] text-outline font-mono">
            Current Rate: 1 USD = {usdToBdtRate} BDT. Never risk &gt;2% per trade.
          </p>

          {/* Inputs Form */}
          <div className="flex flex-col gap-3 pt-1 font-mono text-xs">
            {/* Account Balance Input */}
            <div>
              <label className="text-outline text-[10px] block mb-1">
                ACCOUNT BALANCE ({currencyMode}):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-bold">
                  {currencyMode === 'USD' ? '$' : '৳'}
                </span>
                <input
                  type="number"
                  value={balanceInput}
                  onChange={(e) => setBalanceInput(Number(e.target.value) || 0)}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded pl-8 pr-3 py-1.5 text-on-surface font-bold text-sm focus:outline-none focus:border-primary-container"
                />
              </div>
              <span className="text-[10px] text-outline mt-0.5 block">
                ≈ {currencyMode === 'USD' ? `৳${balanceInBdt.toLocaleString()} BDT` : `$${balanceInUsd.toFixed(2)} USD`}
              </span>
            </div>

            {/* Pair Selector & Stop Loss Pips */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-outline text-[10px] block mb-1">CURRENCY PAIR:</label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-2.5 py-1.5 text-on-surface font-bold text-xs focus:outline-none focus:border-primary-container"
                >
                  <option value="EUR/USD">EUR/USD (1.2 p)</option>
                  <option value="GBP/USD">GBP/USD (1.4 p)</option>
                  <option value="USD/JPY">USD/JPY (1.3 p)</option>
                  <option value="XAU/USD">XAU/USD Gold (3.0 p)</option>
                  <option value="GBP/JPY">GBP/JPY (2.2 p)</option>
                </select>
              </div>

              <div>
                <label className="text-outline text-[10px] block mb-1">STOP LOSS (PIPS):</label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-3 py-1.5 text-error font-bold text-xs focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            {/* Risk Percentage Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-outline text-[10px]">MAX RISK PER TRADE (%):</label>
                <span className="text-secondary font-bold font-mono">{riskPercent}%</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="5.0"
                step="0.25"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-outline">
                <span>0.25% (Conservative)</span>
                <span>1.0% (Institutional)</span>
                <span>5.0% (High Risk)</span>
              </div>
            </div>
          </div>

          {/* CALCULATED SIZING MATRIX CARD */}
          <div className="bg-surface-container-highest p-3.5 rounded-lg border border-primary-container/40 flex flex-col gap-2 font-mono text-xs mt-1">
            <span className="text-primary font-bold text-[11px] uppercase tracking-wide">
              গণনা অনুযায়ী সুপারিশকৃত ট্রেড সাইজ (Recommended Execution)
            </span>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-container">
              <div>
                <span className="text-outline text-[10px] block">RECOMMENDED LOTS:</span>
                <span className="font-headline-sm text-lg font-bold text-secondary">
                  {recommendedLots.toFixed(2)} Lots
                </span>
              </div>
              <div>
                <span className="text-outline text-[10px] block">TOTAL RISK CAPITAL:</span>
                <span className="font-headline-sm text-base font-bold text-error">
                  ${cashAtRiskUsd.toFixed(2)} / ৳{Math.round(cashAtRiskBdt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-outline text-[10px] block">PIP VALUE:</span>
                <span className="text-on-surface font-semibold">
                  ${(recommendedLots * pipValuePerLot).toFixed(2)} / pip
                </span>
              </div>
              <div>
                <span className="text-outline text-[10px] block">TARGET 2 PROFIT:</span>
                <span className="text-secondary font-bold">
                  +${potentialProfitUsd.toFixed(2)} (+৳{Math.round(potentialProfitUsd * usdToBdtRate).toLocaleString()})
                </span>
              </div>
            </div>
          </div>

          {/* Strict Risk Guardrails Section */}
          <div className="p-2.5 rounded bg-error/10 border border-error/30 text-error flex items-center gap-2 text-[11px] font-mono mt-auto">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              <strong>বাংলাদেশ ট্রেডার রিস্ক গার্ড:</strong> দৈনিক ৪% ড্রডাউনে পৌঁছালে সব পজিশন স্বয়ংক্রিয় ক্লোজ হয়ে যাবে।
            </span>
          </div>
        </section>
      </div>

      {/* 3. HISTORICAL PERFORMANCE & AUDITABLE WIN/LOSS LEDGER */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">
              HISTORICAL PERFORMANCE & AUDITABLE WIN/LOSS LEDGER
            </h2>
            <p className="text-[11px] text-outline font-mono">
              100% verified institutional execution metrics with complete transparent loss post-mortem.
            </p>
          </div>

          {/* Quick KPI Chips */}
          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <div className="bg-surface-container px-3 py-1 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">WIN RATE</span>
              <span className="text-secondary font-bold">78.4%</span>
            </div>
            <div className="bg-surface-container px-3 py-1 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">PROFIT FACTOR</span>
              <span className="text-secondary font-bold">2.68</span>
            </div>
            <div className="bg-surface-container px-3 py-1 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">MAX DRAWDOWN</span>
              <span className="text-primary font-bold">4.2%</span>
            </div>
            <div className="bg-surface-container px-3 py-1 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">30D NET PIPS</span>
              <span className="text-secondary font-bold">+1,420 pips</span>
            </div>
          </div>
        </div>

        {/* High-Resolution Inline SVG Equity Curve */}
        <div className="relative w-full h-[160px] bg-[#0a0e16] rounded border border-surface-container overflow-hidden p-2">
          <svg className="w-full h-full text-secondary" viewBox="0 0 700 160" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="equityGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4edea3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline Grid lines */}
            <line x1="0" x2="700" y1="40" y2="40" stroke="#1c2028" strokeDasharray="3 3" />
            <line x1="0" x2="700" y1="80" y2="80" stroke="#1c2028" strokeDasharray="3 3" />
            <line x1="0" x2="700" y1="120" y2="120" stroke="#1c2028" strokeDasharray="3 3" />

            {/* Shaded Area Under Curve */}
            <path
              d="M 0 140 Q 70 130, 140 115 T 280 90 T 420 60 T 560 45 T 700 20 L 700 160 L 0 160 Z"
              fill="url(#equityGrad)"
            />

            {/* Equity Line */}
            <path
              d="M 0 140 Q 70 130, 140 115 T 280 90 T 420 60 T 560 45 T 700 20"
              stroke="#4edea3"
              strokeWidth="2.5"
            />

            {/* High Water Mark Pulse */}
            <circle cx="700" cy="20" r="4" fill="#4edea3" />
            <circle cx="700" cy="20" r="8" fill="#4edea3" opacity="0.4" className="animate-ping" />

            {/* Labels */}
            <text x="20" y="30" fill="#8c909f" fontSize="10" fontFamily="JetBrains Mono">
              Starting Equity: $10,000 (Day 1)
            </text>
            <text x="540" y="30" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
              Current Peak: $28,450 (+184.5%)
            </text>
          </svg>
        </div>

        {/* Auditable Table of Recent Trades */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-surface-container-high text-outline text-[10px] uppercase">
                <th className="py-2 px-2">Trade ID</th>
                <th className="py-2 px-2">Pair & Direction</th>
                <th className="py-2 px-2">Entry → Exit</th>
                <th className="py-2 px-2 text-right">Pip Gain/Loss</th>
                <th className="py-2 px-2 text-right">Net PnL ($)</th>
                <th className="py-2 px-2">Session / Date</th>
                <th className="py-2 px-2">Audit Status / Post-Mortem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {trades.map((tr) => (
                <tr key={tr.id} className="hover:bg-surface-container/60 transition-colors">
                  <td className="py-2.5 px-2 text-outline">{tr.id}</td>
                  <td className="py-2.5 px-2 font-bold whitespace-nowrap">
                    <span className="text-on-surface">{tr.pair}</span>{' '}
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded ${
                        tr.direction === 'BUY'
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-error/20 text-error'
                      }`}
                    >
                      {tr.direction}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-outline whitespace-nowrap">
                    {tr.entryPrice} → {tr.exitPrice}
                  </td>
                  <td
                    className={`py-2.5 px-2 text-right font-bold whitespace-nowrap ${
                      tr.pips >= 0 ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    {tr.pips >= 0 ? '+' : ''}{tr.pips} p
                  </td>
                  <td
                    className={`py-2.5 px-2 text-right font-bold whitespace-nowrap ${
                      tr.pnlUsd >= 0 ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    {tr.pnlUsd >= 0 ? '+' : ''}${tr.pnlUsd.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-outline whitespace-nowrap">
                    {tr.session} ({tr.date})
                  </td>
                  <td className="py-2.5 px-2">
                    {tr.result === 'WIN' ? (
                      <span className="font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary font-bold">
                        VERIFIED WIN
                      </span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded bg-error/20 text-error font-bold w-fit">
                          CONTROLLED LOSS
                        </span>
                        {tr.postMortem && (
                          <span className="text-[10px] text-outline font-sans">
                            {tr.postMortem}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
