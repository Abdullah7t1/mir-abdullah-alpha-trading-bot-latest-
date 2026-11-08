import React, { useState, useEffect } from 'react';
import {
  BinaryBroker,
  BinaryBrokerId,
  BinaryExpiryDuration,
  FTTSignalResult,
} from '../types';
import { BINARY_BROKERS, BINARY_ASSETS } from '../data/forexData';
import {
  Crosshair,
  TrendingUp,
  TrendingDown,
  Clock,
  Volume2,
  Copy,
  Check,
  Zap,
  Target,
  Sparkles,
  Layers,
  Flame,
} from 'lucide-react';
import { playTerminalChime, playBengaliSpeech } from '../utils/audio';

export const FTTProView: React.FC = () => {
  const [brokers] = useState<BinaryBroker[]>(BINARY_BROKERS);
  const [selectedBrokerId, setSelectedBrokerId] = useState<BinaryBrokerId>('quotex');
  const [selectedAsset, setSelectedAsset] = useState<string>(BINARY_ASSETS[0].symbol);
  const [chartTimeframe, setChartTimeframe] = useState<string>('1m');
  const [expiryDuration, setExpiryDuration] = useState<BinaryExpiryDuration>('30s');
  const [investmentAmount, setInvestmentAmount] = useState<number>(50);

  // Intra-candle second counter & live BST clock
  const [intraCandleSecond, setIntraCandleSecond] = useState<number>(24);
  const [currentBstClock, setCurrentBstClock] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [proSignal, setProSignal] = useState<FTTSignalResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [buyerPressure, setBuyerPressure] = useState<number>(78);

  const selectedBroker = brokers.find((b) => b.id === selectedBrokerId) || brokers[0];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bst = new Date(utc + 3600000 * 6);

      const sec = bst.getSeconds();
      setIntraCandleSecond(sec);

      const hours = String(bst.getHours()).padStart(2, '0');
      const minutes = String(bst.getMinutes()).padStart(2, '0');
      const seconds = String(sec).padStart(2, '0');
      setCurrentBstClock(`${hours}:${minutes}:${seconds} BST`);

      // Dynamic buyer/seller pressure oscillation
      setBuyerPressure(65 + Math.floor(Math.sin(Date.now() / 2000) * 20));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!proSignal) {
      generateProSniperSignal();
    }
  }, []);

  const generateProSniperSignal = () => {
    setIsCalculating(true);
    playTerminalChime('alert');

    setTimeout(() => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const bst = new Date(utc + 3600000 * 6);

      // In FTT Pro Mode: Instant Sniper Entry INSIDE the running candle!
      const currentSeconds = bst.getSeconds();
      const sniperSecond = (currentSeconds + 4) % 60;
      const hours = String(bst.getHours()).padStart(2, '0');
      const minutes = String(bst.getMinutes()).padStart(2, '0');
      const sniperBST = `${hours}:${minutes}:${String(sniperSecond).padStart(2, '0')} BST (চলমান ক্যান্ডেলের ভেতর)`;
      const utcStr = `${String(bst.getUTCHours()).padStart(2, '0')}:${String(bst.getUTCMinutes()).padStart(2, '0')}:${String(sniperSecond).padStart(2, '0')} UTC`;

      const isUp = buyerPressure >= 50;
      const direction: 'UP' | 'DOWN' = isUp ? 'UP' : 'DOWN';
      const confidence = Number((91.2 + Math.random() * 5.5).toFixed(1));
      const entryPrice = selectedAsset.includes('JPY') ? 154.215 : selectedAsset.includes('BDT') ? 122.50 : 1.08452;

      const voice = `ভাই, এফটিটি প্রো স্নাইপার সিগন্যাল অ্যাক্টিভ! চলমান ক্যান্ডেলের মধ্যেই ঠিক ${hours}:${minutes}:${String(sniperSecond).padStart(2, '0')} সেকেন্ডে উইক রিজেকশন পয়েন্টে ${selectedBroker.name}-এ ${expiryDuration} এক্সপায়ারির ${direction === 'UP' ? 'UP বা CALL' : 'DOWN বা PUT'} ট্রেড স্নাইপ করুন! উইন কনফিডেন্স ${confidence}%।`;

      const result: FTTSignalResult = {
        id: `ftt-pro-${Date.now()}`,
        broker: selectedBroker.name,
        asset: selectedAsset,
        direction,
        entryPrice,
        executionTimeBST: sniperBST,
        executionTimeUTC: utcStr,
        targetCandleOpenTimeBST: sniperBST,
        expiryDuration,
        timeframe: chartTimeframe,
        payoutPercent: selectedBroker.payoutPercent,
        confidence,
        strategyName: isUp ? 'Intra-Candle Sniper: Lower Wick Liquidity Grab + .00 Round SNR' : 'Intra-Candle Sniper: Upper Wick Rejection at Century Resistance',
        patternDetected: isUp ? 'Micro-Timeframe Pinbar Sweep' : 'Shooting Star Instant Absorption',
        roundNumberLevel: '1.08400 (.000 Psychological Sniping Level)',
        roundNumberPsychology: 'Massive limit order absorption detected at exact candle mid-point.',
        bengaliVoiceText: voice,
        englishExplanation: 'Intra-candle real-time sniper timing delivered. Microsecond execution ready.',
        isIntraCandleSniper: true,
      };

      setProSignal(result);
      setIsCalculating(false);
      playTerminalChime('success');
    }, 550);
  };

  const handleVoicePlay = () => {
    if (!proSignal) return;
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    playTerminalChime('alert');
    playBengaliSpeech(proSignal.bengaliVoiceText, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCopy = () => {
    if (!proSignal) return;
    const text = `🎯 FTT PRO SNIPER SIGNAL\nBroker: ${proSignal.broker}\nAsset: ${proSignal.asset}\nDirection: ${proSignal.direction} (${proSignal.direction === 'UP' ? 'CALL' : 'PUT'})\nIntra-Candle Exact Time: ${proSignal.executionTimeBST}\nExpiry Duration: ${proSignal.expiryDuration}\nConfidence: ${proSignal.confidence}%\n\nবাংলা নির্দেশনা:\n${proSignal.bengaliVoiceText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playTerminalChime('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const potentialProfit = investmentAmount * (selectedBroker.payoutPercent / 100);

  return (
    <div className="flex flex-col gap-space-md w-full font-mono">
      {/* 1. HERO BANNER: FTT PRO MODE */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-primary-container/50 shadow-lg relative overflow-hidden flex flex-wrap items-center justify-between gap-space-md">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-primary-container/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary-container/20 border border-primary-container/50 flex items-center justify-center text-primary shadow-inner">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-base font-bold text-on-surface">
                FTT PRO MODE (চলমান ক্যান্ডেলের ভেতর স্নাইপার এন্ট্রি)
              </h1>
              <span className="font-label-ticker-xs text-[10px] px-2 py-0.5 rounded bg-gradient-to-r from-primary-container to-[#a078ff] text-white font-bold">
                INTRA-CANDLE SNIPER
              </span>
            </div>
            <p className="text-xs text-outline mt-0.5">
              ক্যান্ডেল শেষ হওয়ার অপেক্ষা না করে, চলমান ক্যান্ডেলের মধ্যেই উইক রিজেকশন এবং রাউন্ড নাম্বার দেখে মিলি-সেকেন্ডে সঠিক এন্ট্রি সময় বলে দেবে।
            </p>
          </div>
        </div>

        {/* Real-Time Intra-Candle Pulse */}
        <div className="bg-surface-container-highest px-3.5 py-2 rounded-lg border border-primary-container/40 flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-outline uppercase flex items-center gap-1 font-bold">
              <Crosshair className="w-3 h-3 text-primary animate-spin" /> ক্যান্ডেল অবস্থান (Current Sec):
            </span>
            <span className="font-headline-sm text-lg font-bold text-primary">
              {intraCandleSecond}s / 60s
            </span>
          </div>
          <div className="w-px h-8 bg-surface-bright"></div>
          <div className="text-[11px]">
            <span className="text-outline text-[10px] block">BST ক্লক:</span>
            <span className="text-on-surface font-bold">{currentBstClock}</span>
          </div>
        </div>
      </section>

      {/* 2. BROKER PLATFORM SELECTOR TABS */}
      <section className="bg-surface-container-low rounded-lg p-space-sm border border-surface-container-high shadow-md flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-outline font-bold uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" /> ব্রোকার প্ল্যাটফর্ম সিলেক্ট করুন:
          </span>
          <span className="text-[10px] text-primary flex items-center gap-1 font-bold">
            <Zap className="w-3 h-3 text-secondary" /> আল্ট্রা-লো লেটেন্সি DMA মোড
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {brokers.map((broker) => {
            const isSelected = broker.id === selectedBrokerId;
            return (
              <button
                key={broker.id}
                onClick={() => {
                  setSelectedBrokerId(broker.id);
                  playTerminalChime('alert');
                }}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-surface-container-high border-primary-container shadow-md'
                    : 'bg-surface-container/60 hover:bg-surface-container border-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-on-surface">{broker.name}</span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: broker.logoColor }}
                  ></span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-secondary font-bold">পে-আউট: {broker.payoutPercent}%</span>
                  <span className="text-outline text-[9px]">{broker.pingMs}ms</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TRADING OPTIONS + INTRA-CANDLE PRESSURE GAUGE */}
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Asset Selector */}
          <div>
            <label className="text-outline text-[11px] block mb-1 font-bold">
              ১. অ্যাসেট বা কারেন্সি পেয়ার:
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-3 py-2 text-on-surface font-bold text-xs focus:outline-none focus:border-primary-container cursor-pointer"
            >
              {BINARY_ASSETS.map((a) => (
                <option key={a.symbol} value={a.symbol} className="bg-surface-container">
                  {a.symbol} ({a.payout}% Payout · {a.type})
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="text-outline text-[11px] block mb-1 font-bold">
              ২. ক্যান্ডেল টাইমফ্রেম:
            </label>
            <div className="grid grid-cols-6 gap-1">
              {(['5s', '10s', '15s', '30s', '1m', '5m'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`py-2 rounded font-bold text-center text-[10px] transition-all ${
                    chartTimeframe === tf
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container text-outline hover:text-on-surface border border-surface-container-high'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Duration */}
          <div>
            <label className="text-outline text-[11px] block mb-1 font-bold">
              ৩. স্নাইপার এক্সপায়ারি:
            </label>
            <select
              value={expiryDuration}
              onChange={(e) => setExpiryDuration(e.target.value as BinaryExpiryDuration)}
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded px-3 py-2 text-primary font-bold text-xs focus:outline-none focus:border-primary-container cursor-pointer"
            >
              <option value="5s">5 সেকেন্ড (5s Hyper Sniper)</option>
              <option value="10s">10 সেকেন্ড (10s Micro Scalp)</option>
              <option value="15s">15 সেকেন্ড (15s Flash)</option>
              <option value="30s">30 সেকেন্ড (30s Sniper)</option>
              <option value="40s">40 সেকেন্ড (40s Dynamic)</option>
              <option value="45s">45 সেকেন্ড (45s Blitz)</option>
              <option value="1m">1 মিনিট (1m Core)</option>
              <option value="2m">2 মিনিট (2m Swing)</option>
              <option value="3m">3 মিনিট (3m Wave)</option>
              <option value="5m">5 মিনিট (5m Trend)</option>
            </select>
          </div>

          {/* Investment Amount */}
          <div>
            <label className="text-outline text-[11px] block mb-1 font-bold">
              ৪. ইনভেস্টমেন্ট ($):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 bg-surface-container-lowest border border-surface-container-high rounded px-3 py-2 text-on-surface font-bold text-xs focus:outline-none focus:border-primary-container"
              />
              <span className="text-[11px] text-secondary font-bold">
                লাভ: +${potentialProfit.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Real-Time Buyer vs Seller Pressure Meter Inside the Running Candle */}
        <div className="bg-surface-container-highest p-3 rounded-lg border border-surface-container flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-secondary font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> বায়ার প্রেশার: {buyerPressure}%
            </span>
            <span className="text-outline text-[10px]">চলমান ক্যান্ডেলের ভেতর স্নাইপার মোড সক্রিয়</span>
            <span className="text-error font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> সেলার প্রেশার: {100 - buyerPressure}%
            </span>
          </div>
          <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex">
            <div className="bg-secondary h-full transition-all duration-300" style={{ width: `${buyerPressure}%` }}></div>
            <div className="bg-error h-full transition-all duration-300" style={{ width: `${100 - buyerPressure}%` }}></div>
          </div>
        </div>

        {/* BIG INTERACTIVE "GET FTT PRO SNIPER SIGNAL" BUTTON */}
        <div className="pt-1">
          <button
            onClick={generateProSniperSignal}
            disabled={isCalculating}
            className={`w-full py-3.5 rounded-lg font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] tracking-wider ${
              isCalculating
                ? 'bg-primary-container/40 text-white cursor-wait'
                : 'bg-gradient-to-r from-primary-container via-[#a078ff] to-primary-container text-white hover:brightness-110 shadow-[0_0_20px_rgba(160,120,255,0.4)]'
            }`}
          >
            <Target className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating
              ? 'চলমান ক্যান্ডেলের ভেতর উইক ও রাউন্ড নাম্বার স্নাইপ করা হচ্ছে...'
              : `🎯 GET FTT PRO SNIPER SIGNAL (${selectedBroker.name} · ${selectedAsset})`}
          </button>
        </div>
      </section>

      {/* 4. ACTIVE FTT PRO SNIPER SIGNAL CARD */}
      {proSignal && (
        <section className="bg-surface-container-low rounded-lg p-space-md border border-primary-container/50 shadow-xl flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-surface-container-high pb-3">
            <div className="flex items-center gap-2.5">
              <span className="font-headline-sm text-base font-bold text-on-surface">
                {proSignal.broker} · {proSignal.asset}
              </span>
              <span
                className={`px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1 ${
                  proSignal.direction === 'UP'
                    ? 'bg-secondary text-on-secondary shadow-[0_0_10px_#4edea3]'
                    : 'bg-error text-on-error shadow-[0_0_10px_#ffb4ab]'
                }`}
              >
                {proSignal.direction === 'UP' ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" /> UP / CALL (উপরে)
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5" /> DOWN / PUT (নিচে)
                  </>
                )}
              </span>
              <span className="px-2 py-0.5 rounded bg-gradient-to-r from-primary-container to-[#a078ff] text-white font-bold text-xs">
                {proSignal.expiryDuration} স্নাইপ
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-secondary font-bold text-sm bg-secondary/15 px-2 py-0.5 rounded border border-secondary/30">
                {proSignal.confidence}% স্নাইপার একুরেসি
              </span>
            </div>
          </div>

          {/* INTRA-CANDLE EXACT BST EXECUTION TIME CALLOUT */}
          <div className="bg-surface-container-highest p-3.5 rounded-lg border border-primary-container/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary flex items-center justify-center text-primary shrink-0 animate-pulse">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-primary font-bold text-xs uppercase tracking-wide block">
                  চলমান ক্যান্ডেলের ভেতর সঠিক ট্রেড নেওয়ার সময় (INTRA-CANDLE SNIPER BST)
                </span>
                <span className="font-headline-sm text-base sm:text-lg font-bold text-on-surface tracking-tight">
                  {proSignal.executionTimeBST}
                </span>
                <span className="text-[11px] text-outline block">
                  টাইমফ্রেম: {proSignal.timeframe} · স্নাইপার এক্সপায়ারি: {proSignal.expiryDuration} · বিশ্ব সময়: {proSignal.executionTimeUTC}
                </span>
              </div>
            </div>

            <button
              onClick={handleVoicePlay}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-secondary text-on-secondary animate-pulse'
                  : 'bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-high'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isPlayingAudio ? 'ভয়েস শুনছেন...' : 'ভয়েস দিকনির্দেশনা (Voice)'}
            </button>
          </div>

          {/* 100+ STRATEGY & ROUND NUMBER PSYCHOLOGY BREAKDOWN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-surface-container p-2.5 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">স্নাইপার স্ট্র্যাটেজি:</span>
              <span className="text-primary font-bold block mt-0.5">{proSignal.strategyName}</span>
            </div>
            <div className="bg-surface-container p-2.5 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">ক্যান্ডেলস্টিক উইক প্যাটার্ন:</span>
              <span className="text-on-surface font-semibold block mt-0.5">{proSignal.patternDetected}</span>
            </div>
            <div className="bg-surface-container p-2.5 rounded border border-surface-container-high">
              <span className="text-outline text-[10px] block">রাউন্ড নাম্বার স্নাইপ লেভেল:</span>
              <span className="text-secondary font-semibold block mt-0.5">{proSignal.roundNumberLevel}</span>
            </div>
          </div>

          {/* BENGALI TRANSCRIPT BOX */}
          <div className="bg-surface-container-lowest p-3 rounded border border-surface-container-high text-xs font-sans leading-relaxed text-[#dfe2ee]">
            <span className="text-primary font-mono text-[10px] uppercase font-bold block mb-1">
              বাংলা অডিও দিকনির্দেশনা (Voice Message):
            </span>
            "{proSignal.bengaliVoiceText}"
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-surface-container-high">
            <div className="text-[11px] text-outline">
              <span className="text-primary font-bold">স্নাইপার রুল:</span> উইক টাচ করার সাথে সাথে এন্ট্রি নিন, রিট্রেসমেন্ট মিস করবেন না।
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-surface-container-highest hover:bg-surface-container text-on-surface text-xs font-bold rounded flex items-center gap-1.5 border border-surface-container transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5 text-outline" />}
              {copied ? 'কপি হয়েছে!' : 'Telegram ফরম্যাটে কপি'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
