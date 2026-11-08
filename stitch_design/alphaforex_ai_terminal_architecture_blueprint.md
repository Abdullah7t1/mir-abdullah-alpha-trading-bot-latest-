# ALPHAFOREX AI // QUANTITATIVE SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATION

## 1. System Architecture Overview
The Next-Generation AI Forex Trading Signal Intelligence Platform is engineered as an event-driven, high-throughput quantitative intelligence system.

```
[ Tier-1 Liquidity Providers & TradingView / Webhook Feed ]
                          │ (Sub-15ms WebSocket / FIX Protocol)
                          ▼
            [ Ingestion & Normalization Layer ]
             ├── TimescaleDB (High-res tick/OHLCV data)
             └── Redis Cluster (Pub/Sub & Low-latency in-memory cache)
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
[ PRO MODE ENGINE ]              [ NEWS MODE ENGINE ]
- 255+ Indicator Matrix          - Real-Time Economic Event Ingester
- 260+ Algorithmic Strategies     - LLM-based Sentiment & Surprise Engine
- Multi-Timeframe Confluence     - News Candle Volatility & Spread Predictor
- Smart Money & SMC Parser       - Post-Release Liquidity Sweep Detector
- Order Flow & Round Numbers     - False Breakout / Trap Identifier
         └────────────────┬────────────────┘
                          ▼
           [ AI Confluence & Signal Scorer ]
           - Multi-Layer Perceptron & XGBoost Ensembles
           - Correlation & Redundancy Filter (Anti-collinearity)
           - Dynamic Realistic Confidence Calibration (Never 100%)
           - Bangladesh Standard Time (BST UTC+6) Synchronizer
                          ▼
             [ Client Interface & Dispatch ]
      ├── Desktop Web Terminal (TradingView Lightweight Charts)
      ├── Telegram Bot & Push Webhook Dispatch
      └── Risk & Execution Guardrails (Paper Trading Engine)
```

## 2. Quantitative Strategy & Indicator Taxonomy
### A. 255+ Indicator Library (Categorized)
- **Trend Following (60+):** EMA (9, 21, 50, 100, 200), SMA, WMA, Hull MA, McGinley Dynamic, Supertrend (ATR Multiplier 2, 3), Ichimoku Kinko Hyo (Tenkan, Kijun, Senkou Span A/B, Chikou), Parabolic SAR, Kaufman Adaptive MA (KAMA), TEMA, DEMA, ZigZag, Guppy Multiple MA, Vortex Indicator, Linear Regression Slope, Trend Intensity Index.
- **Momentum & Oscillators (55+):** RSI (14, 7, 21), StochRSI, MACD (12, 26, 9 & custom histogram delta), Stochastic Oscillator (%K, %D), Williams %R, CCI (Commodity Channel Index), Rate of Change (ROC), Ultimate Oscillator, Awesome Oscillator, Accelerator Oscillator, True Strength Index (TSI), Percentage Price Oscillator (PPO), Fisher Transform, Chande Momentum Oscillator (CMO).
- **Volatility & Bands (45+):** Bollinger Bands (20, 2 & squeeze breakout), Keltner Channels, Donchian Channels, Average True Range (ATR), Normalized ATR (NATR), Chaikin Volatility, Historical Volatility, Bollinger %B, Standard Deviation Bands, Historical Volatility Bands.
- **Volume & Institutional Order Flow (50+):** Volume Profile (Fixed & Session Volume), VWAP (Daily, Weekly, Monthly anchors), On-Balance Volume (OBV), Money Flow Index (MFI), Accumulation/Distribution Line, Chaikin Money Flow (CMF), Ease of Movement, Volume-Weighted MACD, CVD (Cumulative Volume Delta) where broker depth permitted, Elder's Force Index.
- **Support, Resistance & Psychological Price Levels (45+):** Fibonacci Retracement & Extensions (0.236, 0.382, 0.50, 0.618, 0.786, 1.272, 1.618), Dynamic Camarilla Pivots (L3/L4, H3/H4), Classic Floor Pivots, Woodie's Pivots, Institutional Round Numbers (.000, .500, .200, .800) Psychological Barrier Rejection Matrices, Average Daily Range (ADR) Projections.

### B. 260+ Trading Strategies (Algorithmic Logic)
- **Smart Money Concepts (SMC) & Institutional Price Delivery (45 Strategies):**
  - Fair Value Gap (FVG) Mitigation & Re-entry
  - Liquidity Sweeps (Equal Highs / Equal Lows raid)
  - Change of Character (CHoCH) & Break of Structure (BOS)
  - Order Block (OB) Validation with Imbalance Confirmation
  - Judas Swing (London Open / NY Open Traps)
- **Scalping & Micro-structure (40 Strategies):** 1m/5m EMA Ribbon compression breakouts, 3-candle momentum continuation, stochastic multi-rebound scalps, VWAP deviation reversion.
- **Day Trading & Intraday Swings (55 Strategies):** Asian Session Liquidity Expansion, London Breakout, NY Session Continuation, Camarilla Pivot H3/L3 bounce & H4/L4 breakout, Bollinger Band squeeze-expansion transitions.
- **Multi-Timeframe Confluence (60 Strategies):** HTF 4H Trend direction -> MTF 1H Market Structure -> LTF 5M / 15M Entry triggers with volume & candlestick confirmation.
- **Mean Reversion & Volatility (35 Strategies):** 2.5 Sigma Bollinger Rejection + RSI Divergence, Keltner Channel mean return with candlestick exhaustion.
- **Economic & News Candle Algorithmic Rules (25 Strategies):** Straddle break, post-news wick absorption, news spike fade against pre-news institutional bias, 15-minute post-event consolidation breakout.

## 3. Bangladesh Standard Time (BST UTC+6) Implementation
Forex traders in Bangladesh operate predominantly in BST. The platform integrates native UTC+6 synchronization:
- London Session Opens: 02:00 PM BST (Summer) / 03:00 PM BST (Winter)
- New York Session Opens: 07:00 PM BST (Summer) / 08:00 PM BST (Winter)
- Tokyo / Asian Session: 06:00 AM BST
- Instant localized Bengali audio/text notifications: e.g. *"ভাই, বাংলাদেশ সময় রাত ৮:৩৫ মিনিটে EUR/USD-এ UP/BUY সেটআপ পাওয়া গেছে।"*

## 4. API Integration & Licensing Requirements
- **Charting Engine:** TradingView Charting Library (requires Technical Analysis Charting License) or TradingView Lightweight Charts (Open Source Apache 2.0 - fully client-embeddable without proprietary licensing hurdles).
- **Market Data Feeds:** Polygon.io Forex/Crypto WebSockets, OANDA v20 REST/Streaming API, Interactive Brokers Client Portal API, or TwelveData Real-Time FX Websocket.
- **Economic Calendar & News:** ForexFactory RSS / Finnhub Economic Calendar API / Bloomberg Enterprise / Alpha Vantage Sentiment.
- **TradingView Alerts:** Custom Pine Script Webhooks routed into FastAPI `POST /api/v1/signals/webhook` endpoint with HMAC-SHA256 signature verification.

## 5. Development Roadmap & Production Execution
- **Phase 1 (Completed):** UI/UX System Architecture, Design System Tokens, PRO vs NEWS Dual Mode Wireframe.
- **Phase 2 (Current Delivery):** Interactive Full Institutional Terminal (PRO Technical Engine + NEWS Candle AI + BST Signal Engine + Strategy Backtester).
- **Phase 3:** Python FastAPI backend microservices & Dockerized TimescaleDB pipeline.
- **Phase 4:** Live broker bridge & automated paper execution sandbox.
