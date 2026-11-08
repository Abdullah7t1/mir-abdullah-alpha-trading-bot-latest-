export type NavigationTab =
  | 'dashboard-terminal'
  | 'pro-technical-engine'
  | 'news-candle-ai-calendar'
  | 'easy-trade-mir'
  | 'ftt-binary'
  | 'ftt-pro-mode'
  | 'multi-asset-scanner'
  | 'strategy-backtester-lab'
  | 'risk-position-calculator'
  | 'bangladesh-signal-center'
  | 'system-telemetry';

export type TerminalMode = 'pro' | 'news' | 'mir' | 'ftt' | 'ftt-pro';

export type Timeframe = '1s' | '1m' | '5m' | '15m' | '1h' | '4h' | '1D';

export type BinaryBrokerId =
  | 'quotex'
  | 'olymptrade'
  | 'bynix'
  | 'pocketoption'
  | 'deriv'
  | 'expertoption';

export interface BinaryBroker {
  id: BinaryBrokerId;
  name: string;
  logoColor: string;
  payoutPercent: number;
  apiStatus: 'CONNECTED' | 'SYNCED' | 'STANDBY';
  pingMs: number;
  otcSupported: boolean;
}

export type BinaryExpiryDuration =
  | '5s'
  | '10s'
  | '15s'
  | '30s'
  | '40s'
  | '45s'
  | '1m'
  | '2m'
  | '3m'
  | '5m';

export interface FTTSignalResult {
  id: string;
  broker: string;
  asset: string;
  direction: 'UP' | 'DOWN';
  entryPrice: number;
  executionTimeBST: string;
  executionTimeUTC: string;
  targetCandleOpenTimeBST: string;
  expiryDuration: BinaryExpiryDuration;
  timeframe: string;
  payoutPercent: number;
  confidence: number;
  strategyName: string;
  patternDetected: string;
  roundNumberLevel: string;
  roundNumberPsychology: string;
  bengaliVoiceText: string;
  englishExplanation: string;
  isIntraCandleSniper?: boolean;
  candleSecondsRemaining?: number;
}

export interface CurrencyPair {
  symbol: string;
  name: string;
  category: 'majors' | 'minors' | 'metals' | 'crypto';
  bid: number;
  ask: number;
  spread: number;
  change24h: number;
  changePips: number;
  high24h: number;
  low24h: number;
  digits: number;
  signalDirection: 'BUY' | 'SELL' | 'NEUTRAL';
  confluence: number;
  rsi: number;
  smcSetup: string;
}

export interface IndicatorItem {
  id: string;
  name: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'sr';
  value: string;
  signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  active: boolean;
  weight: number;
  description: string;
}

export interface StrategyItem {
  id: string;
  code: string;
  name: string;
  category: 'smc' | 'scalping' | 'daytrading' | 'confluence' | 'mean_reversion' | 'news';
  winRate: number;
  profitFactor: number;
  tradesCount: number;
  active: boolean;
  description: string;
  confluencePoints: number;
}

export interface EconomicNewsEvent {
  id: string;
  bstTime: string;
  utcTime: string;
  currency: string;
  event: string;
  impact: 'EXTREME' | 'HIGH' | 'MEDIUM' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
  surpriseDeviation: string;
  status: 'PENDING' | 'RELEASED' | 'COUNTDOWN';
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface SignalAlert {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  timeBST: string;
  timeUTC: string;
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskReward: string;
  confidence: number;
  status: 'ACTIVE' | 'IN_PROFIT' | 'TARGET_HIT' | 'STOPPED';
  pipsGained?: number;
  bengaliTranscript: string;
  englishTranscript: string;
  strategies: string[];
}

export interface TradeAuditLog {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  pips: number;
  pnlUsd: number;
  result: 'WIN' | 'LOSS';
  date: string;
  session: string;
  postMortem?: string;
}
