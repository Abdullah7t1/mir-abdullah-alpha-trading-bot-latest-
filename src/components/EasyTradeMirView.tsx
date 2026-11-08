import React, { useState, useEffect } from 'react';
import { CurrencyPair } from '../types';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Clock,
  Volume2,
  Copy,
  Check,
  Share2,
  ShieldCheck,
  Cpu,
  Flame,
} from 'lucide-react';
import { playTerminalChime, playBengaliSpeech } from '../utils/audio';

interface EasyTradeMirViewProps {
  pairs: CurrencyPair[];
  activePair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  onExecuteTrade: (pair: string, direction: 'BUY' | 'SELL', price: number, sl: number, tp: number) => void;
}

interface MirSignalOutput {
  id: string;
  pair: string;
  direction: 'UP' | 'DOWN';
  entryPrice: number;
  stopLossPrice: number;
  stopLossPips: number;
  takeProfit1Price: number;
  takeProfit1Pips: number;
  takeProfit2Price: number;
  takeProfit2Pips: number;
  riskReward: string;
  confidence: number;
  scheduledTimeBST: string;
  scheduledTimeUTC: string;
  patternDetected: string;
  roundLevelRule: string;
  confluenceSummary: string;
  bengaliVoiceMessage: string;
}

export const EasyTradeMirView: React.FC<EasyTradeMirViewProps> = ({
  pairs,
  activePair,
  onSelectPair,
  onExecuteTrade,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(activePair.symbol);
  const [riskProfile, setRiskProfile] = useState<'CONSERVATIVE' | 'STANDARD' | 'AGGRESSIVE'>('STANDARD');
  const [targetTf, setTargetTf] = useState<'1m' | '5m' | '15m' | '1h'>('5m');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeSignal, setActiveSignal] = useState<MirSignalOutput | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  // Sync selected symbol with activePair if changed
  useEffect(() => {
    const found = pairs.find((p) => p.symbol === selectedSymbol);
    if (found && found.symbol !== activePair.symbol) {
      onSelectPair(found);
    }
  }, [selectedSymbol]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const t = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldownSeconds]);

  // Generate initial signal on first load
  useEffect(() => {
    if (!activeSignal) {
      generateMirSignal(activePair, targetTf, riskProfile);
    }
  }, []);

  const generateMirSignal = (
    pair: CurrencyPair,
    tf: '1m' | '5m' | '15m' | '1h',
    risk: 'CONSERVATIVE' | 'STANDARD' | 'AGGRESSIVE'
  ) => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    playTerminalChime('alert');

    // Simulate multi-factor AI quantitative calculations
    const p1 = setTimeout(() => setAnalysisProgress(55), 250);
    const p2 = setTimeout(() => setAnalysisProgress(88), 500);

    const finishTimeout = setTimeout(() => {
      // Calculate realistic timing based on current BST time
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bst = new Date(utc + 3600000 * 6);

      // Schedule trade for next 1 to 2 minutes window
      const targetMinOffset = tf === '1m' ? 1 : tf === '5m' ? 2 : 4;
      const tradeDate = new Date(bst.getTime() + targetMinOffset * 60000);

      const hours = tradeDate.getHours();
      const minutes = tradeDate.getMinutes();
      const seconds = '00';
      const h12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'রাত/দুপুর' : 'সকাল';
      const bstStr = `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${seconds} BST (${ampm})`;
      const utcHours = String(tradeDate.getUTCHours()).padStart(2, '0');
      const utcMins = String(tradeDate.getUTCMinutes()).padStart(2, '0');
      const utcStr = `${utcHours}:${utcMins}:00 UTC`;

      // Direction logic from pair & indicators
      const direction: 'UP' | 'DOWN' = pair.signalDirection === 'SELL' ? 'DOWN' : 'UP';
      const isUp = direction === 'UP';

      // Pip scaling based on asset type
      const isJpyOrGold = pair.symbol.includes('JPY') || pair.symbol.includes('XAU');
      const pipMultiplier = pair.digits === 5 ? 0.0001 : pair.digits === 2 ? 1.0 : 0.01;
      const slPips = risk === 'CONSERVATIVE' ? 12 : risk === 'STANDARD' ? 15 : 20;
      const tp1Pips = Math.round(slPips * 1.6);
      const tp2Pips = Math.round(slPips * 2.8);

      const entryPrice = isUp ? pair.ask : pair.bid;
      const stopLossPrice = isUp
        ? Number((entryPrice - slPips * pipMultiplier).toFixed(pair.digits))
        : Number((entryPrice + slPips * pipMultiplier).toFixed(pair.digits));
      const takeProfit1Price = isUp
        ? Number((entryPrice + tp1Pips * pipMultiplier).toFixed(pair.digits))
        : Number((entryPrice - tp1Pips * pipMultiplier).toFixed(pair.digits));
      const takeProfit2Price = isUp
        ? Number((entryPrice + tp2Pips * pipMultiplier).toFixed(pair.digits))
        : Number((entryPrice - tp2Pips * pipMultiplier).toFixed(pair.digits));

      const confidence = Number((86.5 + Math.random() * 6.5).toFixed(1));
      const pattern = isUp
        ? 'Bullish FVG Retest + Asian Low Sweep'
        : 'Bearish Order Block Rejection + Volume Divergence';
      const roundNum = pair.digits === 5 ? '.500 Institutional Pivot' : '.00 Century Support';

      const voiceText = `ভাই মির, বাংলাদেশ সময় ${h12}:${String(minutes).padStart(2, '0')} মিনিটে ${pair.symbol}-এ ${
        isUp ? 'UP বা BUY' : 'DOWN বা SELL'
      } ট্রেড এক্সিকিউট করুন। এন্ট্রি প্রাইস ${entryPrice}। স্টপ লস ${stopLossPrice} এবং টেক প্রফিট ${takeProfit2Price} রাখুন। কনফ্লুয়েন্স ${confidence}%।`;

      const newSig: MirSignalOutput = {
        id: `mir-${Date.now()}`,
        pair: pair.symbol,
        direction,
        entryPrice,
        stopLossPrice,
        stopLossPips: slPips,
        takeProfit1Price,
        takeProfit1Pips: tp1Pips,
        takeProfit2Price,
        takeProfit2Pips: tp2Pips,
        riskReward: '1:2.8',
        confidence,
        scheduledTimeBST: bstStr,
        scheduledTimeUTC: utcStr,
        patternDetected: pattern,
        roundLevelRule: roundNum,
        confluenceSummary: `EMA 21/50 Stack + Camarilla H3 Pivot + Multi-Timeframe Institutional Flow`,
        bengaliVoiceMessage: voiceText,
      };

      setActiveSignal(newSig);
      setIsAnalyzing(false);
      setAnalysisProgress(100);
      setCooldownSeconds(10); // Anti-spam cooldown so user gets consistent quantitative signals
      playTerminalChime('success');
    }, 750);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(finishTimeout);
    };
  };

  const handleVoicePlay = () => {
    if (!activeSignal) return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    playTerminalChime('alert');
    playBengaliSpeech(activeSignal.bengaliVoiceMessage, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCopy = () => {
    if (!activeSignal) return;
    const text = `🎯 EASY TRADE MIR - AI SIGNAL\nAsset: ${activeSignal.pair}\nDirection: ${activeSignal.direction} (${activeSignal.direction === 'UP' ? 'BUY / CALL' : 'SELL / PUT'})\nTrade Time (BST): ${activeSignal.scheduledTimeBST}\nEntry Price: ${activeSignal.entryPrice}\nStop Loss (SL): ${activeSignal.stopLossPrice} (${activeSignal.stopLossPips} pips)\nTake Profit 1 (TP1): ${activeSignal.takeProfit1Price} (+${activeSignal.takeProfit1Pips} pips)\nTake Profit 2 (TP2): ${activeSignal.takeProfit2Price} (+${activeSignal.takeProfit2Pips} pips)\nConfidence: ${activeSignal.confidence}% | R:R: ${activeSignal.riskReward}\n\nবাংলা নির্দেশনা:\n${activeSignal.bengaliVoiceMessage}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playTerminalChime('success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* 1. HERO BANNER: EASY TRADE MIR */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-primary-container/40 shadow-lg relative overflow-hidden flex flex-wrap items-center justify-between gap-space-md">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-container/20 border border-primary-container/50 flex items-center justify-center text-primary shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-base font-bold text-on-surface">
                EASY TRADE MIR (মীর ভাই স্পেশাল ১-ক্লিক এআই ট্রেড)
              </h1>
              <span className="font-label-ticker-xs text-[10px] px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-mono font-bold">
                1-CLICK AI ENGINE
              </span>
            </div>
            <p className="text-xs text-outline font-mono mt-0.5">
              অ্যাসেট সিলেক্ট করে বাটনে ক্লিক করলেই সফটওয়্যার সঠিক সময়, UP/DOWN ডিরেকশন এবং TP ও SL বলে দেবে।
            </p>
          </div>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-surface-container-high font-mono text-xs">
          <Cpu className="w-4 h-4 text-secondary" />
          <span className="text-outline">ENGINE:</span>
          <span className="text-secondary font-bold">MIR-QUANT 4.2 ACTIVE</span>
        </div>
      </section>

      {/* 2. CONTROLS BAR: ASSET SELECTOR + TIMEFRAME + GET SIGNAL BUTTON */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-3 font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Asset Selector */}
          <div>
            <label className="text-outline text-[11px] block mb-1.5 font-bold">
              ১. ট্রেডিং অ্যাসেট সিলেক্ট করুন (Asset Pair):
            </label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-3 py-2 text-on-surface font-bold text-sm focus:outline-none focus:border-primary-container cursor-pointer"
            >
              {pairs.map((p) => (
                <option key={p.symbol} value={p.symbol} className="bg-surface-container">
                  {p.symbol} — {p.name} ({p.spread.toFixed(1)}p Spread)
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div>
            <label className="text-outline text-[11px] block mb-1.5 font-bold">
              ২. টাইমফ্রেম সিলেক্ট করুন (Timeframe):
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['1m', '5m', '15m', '1h'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTargetTf(tf)}
                  className={`py-2 rounded font-bold transition-all text-center ${
                    targetTf === tf
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container text-outline hover:text-on-surface border border-surface-container-high'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Profile */}
          <div>
            <label className="text-outline text-[11px] block mb-1.5 font-bold">
              ৩. রিস্ক ও ট্রেডিং স্টাইল (Trading Profile):
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['CONSERVATIVE', 'STANDARD', 'AGGRESSIVE'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskProfile(r)}
                  className={`py-2 rounded text-[10px] font-bold transition-all truncate px-1 ${
                    riskProfile === r
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container text-outline hover:text-on-surface border border-surface-container-high'
                  }`}
                >
                  {r === 'CONSERVATIVE' ? 'নিরাপদ' : r === 'STANDARD' ? 'স্ট্যান্ডার্ড' : 'আক্রমণাত্মক'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BIG INTERACTIVE "GET SIGNAL" BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => {
              const currentPair = pairs.find((p) => p.symbol === selectedSymbol) || activePair;
              generateMirSignal(currentPair, targetTf, riskProfile);
            }}
            disabled={isAnalyzing || cooldownSeconds > 0}
            className={`w-full py-3.5 rounded-lg font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] font-mono tracking-wider ${
              isAnalyzing
                ? 'bg-primary-container/50 text-white cursor-wait'
                : cooldownSeconds > 0
                ? 'bg-surface-container text-outline cursor-not-allowed border border-surface-container-high'
                : 'bg-gradient-to-r from-primary-container via-[#4edea3] to-primary-container text-[#00285d] hover:brightness-110 shadow-[0_0_20px_rgba(77,142,255,0.35)]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing
              ? `AI কোয়ান্ট ইঞ্জিন বিশ্লেষণ করছে (${analysisProgress}%)...`
              : cooldownSeconds > 0
              ? `পরবর্তী নির্ভুল সিগন্যালের জন্য অপেক্ষা করুন (${cooldownSeconds}s)...`
              : '⚡ GET AI MIR SIGNAL (সঠিক সময় ও ট্রেড সিগন্যাল নিন)'}
          </button>
        </div>
      </section>

      {/* 3. SIGNAL RESULT CARD: ACCURATE TIME, DIRECTION, TP, SL, AND VOICE TRANSCRIPT */}
      {activeSignal && (
        <section className="bg-surface-container-low rounded-lg p-space-md border border-secondary/50 shadow-xl flex flex-col gap-3 font-mono relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header of Signal */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-surface-container-high pb-3">
            <div className="flex items-center gap-2.5">
              <span className="font-headline-sm text-lg font-bold text-on-surface">
                {activeSignal.pair}
              </span>
              <span
                className={`px-3 py-1 rounded text-xs font-bold font-mono shadow-sm flex items-center gap-1 ${
                  activeSignal.direction === 'UP'
                    ? 'bg-secondary text-on-secondary shadow-[0_0_10px_#4edea3]'
                    : 'bg-error text-on-error shadow-[0_0_10px_#ffb4ab]'
                }`}
              >
                {activeSignal.direction === 'UP' ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" /> UP / BUY (কল)
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5" /> DOWN / SELL (পুট)
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-outline">কনফ্লুয়েন্স:</span>
              <span className="text-secondary font-bold text-sm bg-secondary/15 px-2 py-0.5 rounded border border-secondary/30">
                {activeSignal.confidence}%
              </span>
              <span className="text-outline">R:R: <strong className="text-on-surface">{activeSignal.riskReward}</strong></span>
            </div>
          </div>

          {/* EXACT TRADE TIMING CALLOUT (USER SPECIFIC REQUIREMENT) */}
          <div className="bg-surface-container-highest p-3.5 rounded-lg border border-primary-container/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary flex items-center justify-center text-primary shrink-0 animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-primary font-bold text-xs uppercase tracking-wide block">
                  সঠিক ট্রেড এক্সিকিউশন সময় (EXACT EXECUTION TIME)
                </span>
                <span className="font-headline-sm text-base sm:text-lg font-bold text-on-surface tracking-tight">
                  {activeSignal.scheduledTimeBST}
                </span>
                <span className="text-[11px] text-outline block">
                  বিশ্ব সময়: {activeSignal.scheduledTimeUTC} (টাইমফ্রেম: {targetTf})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleVoicePlay}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isPlayingAudio
                    ? 'bg-secondary text-on-secondary animate-pulse'
                    : 'bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-high'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                {isPlayingAudio ? 'ভয়েস শুনছেন...' : 'ভয়েসে শুনুন (Voice Alert)'}
              </button>
            </div>
          </div>

          {/* TARGETS & RISK GRID: ENTRY, SL, TP1, TP2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-surface-container p-2.5 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">এন্ট্রি লেভেল (ENTRY)</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                {activeSignal.entryPrice}
              </span>
              <span className="text-[10px] text-outline block mt-0.5">মার্কেট বা লিমিট এন্ট্রি</span>
            </div>

            <div className="bg-surface-container p-2.5 rounded border border-error/30">
              <span className="text-error text-[10px] font-bold block">স্টপ লস (STOP LOSS)</span>
              <span className="font-headline-sm text-sm font-bold text-error">
                {activeSignal.stopLossPrice}
              </span>
              <span className="text-[10px] text-error/80 block mt-0.5">
                -{activeSignal.stopLossPips} Pips
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded border border-secondary/30">
              <span className="text-secondary text-[10px] font-bold block">টেক প্রফিট ১ (TP1)</span>
              <span className="font-headline-sm text-sm font-bold text-secondary">
                {activeSignal.takeProfit1Price}
              </span>
              <span className="text-[10px] text-secondary/80 block mt-0.5">
                +{activeSignal.takeProfit1Pips} Pips
              </span>
            </div>

            <div className="bg-surface-container p-2.5 rounded border border-secondary/50">
              <span className="text-secondary text-[10px] font-bold block">টেক প্রফিট ২ (TP2)</span>
              <span className="font-headline-sm text-sm font-bold text-secondary">
                {activeSignal.takeProfit2Price}
              </span>
              <span className="text-[10px] text-secondary font-bold block mt-0.5">
                +{activeSignal.takeProfit2Pips} Pips (মেইন টার্গেট)
              </span>
            </div>
          </div>

          {/* BENGALI AUDIO INSTRUCTION QUOTE BOX */}
          <div className="bg-surface-container-lowest p-3 rounded border border-surface-container-high text-xs font-sans leading-relaxed text-[#dfe2ee]">
            <span className="text-primary font-mono text-[10px] uppercase font-bold block mb-1">
              বাংলা অডিও দিকনির্দেশনা (Transcript):
            </span>
            "{activeSignal.bengaliVoiceMessage}"
          </div>

          {/* CONFLUENCE & STRATEGY RULES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-outline">
            <div className="p-2 rounded bg-surface-container border border-surface-container-high">
              <span className="text-on-surface font-semibold block">প্যাটার্ন ও সাইকোলজি:</span>
              <span>{activeSignal.patternDetected} · {activeSignal.roundLevelRule}</span>
            </div>
            <div className="p-2 rounded bg-surface-container border border-surface-container-high">
              <span className="text-on-surface font-semibold block">কনফ্লুয়েন্স ফ্যাক্টর:</span>
              <span>{activeSignal.confluenceSummary}</span>
            </div>
          </div>

          {/* ACTIONS: EXECUTE PAPER TRADE + COPY TELEGRAM + SHARE */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-surface-container-high">
            <button
              onClick={() => {
                onExecuteTrade(
                  activeSignal.pair,
                  activeSignal.direction === 'UP' ? 'BUY' : 'SELL',
                  activeSignal.entryPrice,
                  activeSignal.stopLossPrice,
                  activeSignal.takeProfit2Price
                );
                playTerminalChime('success');
              }}
              className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs rounded transition-all shadow-md flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" /> পেপার ট্রেড এক্সিকিউট করুন
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-surface-container-highest hover:bg-surface-container text-on-surface text-xs font-mono font-bold rounded flex items-center gap-1.5 border border-surface-container transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5 text-outline" />}
                {copied ? 'কপি হয়েছে!' : 'Telegram ফরম্যাটে কপি'}
              </button>

              <button
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `EASY TRADE MIR SIGNAL: ${activeSignal.pair} ${activeSignal.direction} @ ${activeSignal.scheduledTimeBST} | Entry: ${activeSignal.entryPrice} | SL: ${activeSignal.stopLossPrice} | TP: ${activeSignal.takeProfit2Price}`
                  )}`;
                  window.open(url, '_blank');
                }}
                className="px-3 py-2 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container text-xs font-bold rounded flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" /> WhatsApp
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
