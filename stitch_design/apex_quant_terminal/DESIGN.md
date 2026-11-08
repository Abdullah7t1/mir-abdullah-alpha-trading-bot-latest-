---
name: Apex Quant Terminal
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#a078ff'
  on-tertiary-container: '#340080'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-data-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-data-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  label-data-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-ticker-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.5rem
  gutter-compact: 0.25rem
  margin: 0.75rem
  margin-mobile: 0.5rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.5rem
  space-lg: 0.75rem
  space-xl: 1rem
  space-2xl: 1.5rem
---

## Brand & Style

The design system establishes an institutional-grade, hyper-performant interface for quantitative researchers, algorithmic execution desks, and high-frequency market participants. The brand identity balances the ruthless precision of Bloomberg Terminal engineering with the fluid, modern analytical ergonomics of TradingView. 

### Visual Archetype: High-Contrast Technical Brutalism & Precision Glass
The aesthetic rejects ornamental distraction in favor of extreme legibility, rapid data scanning, and microsecond situational awareness. Key visual traits include:
- **Zero-Latency Ergonomics:** High data density, flat 1px grid boundaries, and absolute structural clarity.
- **Strict Semantic Luminescence:** Saturated chromatic signals are exclusively reserved for market directionality, execution alerts, and AI copilot insights; non-functional surfaces remain deep, non-reflective obsidian tones.
- **Tactile Instrument Quality:** Flat surfaces accented by razor-sharp border delimiters (`#1F2937`), crisp tabular matrices, and zero visual clutter.

## Colors

The palette uses absolute darkness and tactical chromatic illumination. Surfaces are calibrated to reduce eye strain over multi-monitor, 14-hour market shifts while delivering maximum contrast for numeric readability.

### Foundational Canvas & Structural Layers
- **Terminal Void (Canvas):** `#0B0F17` (Deep Obsidian / Pitch Slate)
- **Panel Surface (Base Cards):** `#111827` (Card & Widget Container)
- **Elevated Sub-Surface (Inputs/Flyouts):** `#1A2234`
- **Surface Hover / Row Highlight:** `#1F2937`
- **Grid Divider / Structural Border:** `#1F2937`
- **Focus / Active Border:** `#374151`

### Semantic Action & Market Colors
- **Bullish (Primary / Accent):** Neon Emerald `#10B981` | Deep Solid `#059669` | Bullish Wash `rgba(16, 185, 129, 0.12)`
- **Bearish (Crimson Alert):** Vivid Crimson `#EF4444` | Dark Crimson `#DC2626` | Bearish Wash `rgba(239, 68, 68, 0.12)`
- **Institutional Primary / Telemetry:** Vibrant Blue `#3B82F6` | Deep Blue `#2563EB`
- **Order Routing & Execution Cyan:** `#06B6D4` | Deep Cyan `#0891B2`
- **Warning / System Halt:** Amber Gold `#F59E0B` | Deep Amber `#D97706`
- **AI Engine & Quant Copilot:** Hyper Purple `#8B5CF6` | Deep Violet `#7C3AED` | Copilot Wash `rgba(139, 92, 246, 0.12)`

### Neutral Data Typography Gradients
- **Primary Text / Active Prices:** `#F9FAFB` (98% contrast against surfaces)
- **Secondary Text / Axis Metadata:** `#9CA3AF`
- **Muted Text / Inactive Identifiers:** `#6B7280`
- **Disabled / Stale Quotes:** `#4B5563`

## Typography

Typography prioritizes fixed-width alignment and scanning speed. A strict dual-family hierarchy governs the terminal:

1. **Structural & Prose Font (`Geist`):** Delivers clean neo-grotesque authority for widget headings, navigation, dialogs, operational controls, and analytical news streams.
2. **Tabular & Quantitative Font (`JetBrains Mono`):** Non-negotiable for all execution pricing, market depths, order book volume bars, PnL calculations, UTC/BST timestamps, and delta indicators. 

### Alignment & Tabular Figures Rules
- All numeric tables must enforce OpenType tabular figures (`font-variant-numeric: tabular-nums lining-nums;`).
- Numerical values in order books, tickers, and risk monitors must right-align with equalized column widths to prevent vertical ocular jitter during active websocket streaming.
- Ticker symbols (e.g., `BTC-PERP`, `USD/BDT`, `NVDA.NQ`) leverage uppercase styling with heightened tracking (`+0.04em`).

## Layout & Spacing

The terminal uses a zero-waste, dense CSS Grid system. Every pixel must serve market awareness.

### Grid Architecture
- **Desktop/Multi-Monitor Setup:** Multi-pane tiled workspace utilizing CSS Grid areas (`grid-template-columns: repeat(24, 1fr)`) with explicit row locking. Default layout allocates column split ratios (e.g., 4 cols for Watchlist/Market Depth, 14 cols for Candle Charts/Quant Workbenches, 6 cols for Order Book/DOM/Execution).
- **Gutter Density:** Hardcoded `0.5rem` (8px) gutter for standard panels, dropping to `0.25rem` (4px) in compact pro mode to maximize charting viewports.
- **Breakpoints:**
  - `Desktop Pro (>= 1600px)`: 24-column configurable tile canvas. Full DOM, order books, and real-time news desk active simultaneously.
  - `Standard Desktop (1024px - 1599px)`: 16-column layout with tabbed bottom drawers for open orders and trade execution logs.
  - `Tablet / Mobile (< 1024px)`: Single-column vertical reflow. Watchlists compress into horizontal scrolling carousels; bottom navigation dock switches views across Chart, Book, Trades, and News.

### Status Bar & Chronometry Rhythm
The top application bar is pinned to `36px` height. It anchors institutional operational parameters: Engine latency (ms), WebSocket ping, and dual market timekeepers:
- Primary Local Market Clock: **BST (Bangladesh Standard Time, UTC+6)** formatted as `HH:mm:ss.SSS BST`.
- Secondary Global Settlement Clock: **UTC** formatted as `HH:mm:ss UTC`.

## Elevation & Depth

This design system avoids decorative blurred drop shadows. Depth is achieved via **tonal step-ups, crisp hairline borders, and selective translucent fills**.

### Depth Layers
- **Level 0 (Terminal Backdrop):** `#0B0F17` — The infinite canvas behind all docked panes.
- **Level 1 (Docked Tiles & Workbenches):** `#111827` bordered by a 1px solid `#1F2937` boundary.
- **Level 2 (Internal Panel Containers & Header Toolbars):** `#161F30` with bottom border separator `1px solid #1F2937`.
- **Level 3 (Interactive Control Surface):** `#1F2937` hover surfaces and `#243044` active selection states.
- **Level 4 (Floating Context Modals / Algo Execution Popovers):** `#111827` framed by a glowing 1px active boundary (`#3B82F6` or `#8B5CF6`) with an ultra-tight ambient rim: `0 0 0 1px #1F2937, 0 8px 24px rgba(0, 0, 0, 0.6)`.

### Market State Illumination
Critical events cast razor-thin perimeter luminescence:
- **Active Limit Buy Fill:** Panel border flashes `rgba(16, 185, 129, 0.4)` decaying over 300ms.
- **Stop-Loss Triggered / Margin Call:** Flash border `rgba(239, 68, 68, 0.5)`.
- **AI Anomaly Detection:** Constant subtle ambient purple rim on target widget: `0 0 12px rgba(139, 92, 246, 0.2)`.

## Shapes

The design system uses a strict **Soft (0.25rem / 4px)** geometry. 

- **Containers & Tiles:** Strict `4px` corner radii. This preserves usable chart and grid real estate right to the edge while avoiding harsh corners.
- **Input Fields & Multi-Timeframe Pills:** `2px` to `4px` maximum corner radius.
- **Tags, Execution Badges & Order Status Flags:** `2px` corner radius (`rounded-sm`), delivering a stamp-like physical trading ticket feel.
- **Pill-shaped elements are strictly banned** across the platform, with the sole exception of toggle state indicators which may utilize micro-capsule radii to differentiate switch toggles from static data blocks.

## Components

### 1. Mode Switcher (PRO MODE vs. NEWS MODE)
- **Container:** Dual segmented control locked inside a `28px` high frame. Background `#0B0F17`, border `1px solid #1F2937`, padding `2px`.
- **Active Pro Mode State:** Surface shifts to `#1F2937`, text `#F9FAFB`, accented by a left `2px` cyan border indicator (`#06B6D4`). Displays multi-depth order books, execution ladders, and DOM panels.
- **Active News Mode State:** Surface shifts to `#1F2937`, text `#F9FAFB`, accented by an amber indicator (`#F59E0B`). Reflows the viewport to split charting with live terminal news feeds, regulatory wires, and sentiment metrics.

### 2. Multi-Timeframe Selector Pills
- **Visual Spec:** Segmented horizontal array (`1s`, `1m`, `5m`, `15m`, `1h`, `4h`, `1D`, `1W`).
- **Typography:** `label-ticker-xs` (`JetBrains Mono`, 10px, bold).
- **Idle State:** Background transparent, text `#6B7280`, border `1px solid transparent`, height `22px`, padding `0 6px`.
- **Hover State:** Background `#1F2937`, text `#9CA3AF`.
- **Active Selected State:** Background `#1E293B`, text `#3B82F6`, border `1px solid #3B82F6`.

### 3. Institutional Action Buttons
- **Buy / Long Button:** Background `#10B981`, hover `#059669`, text `#0B0F17` (heavy black weight). Font: `Geist` Medium, height `32px` or `24px` for quick-order ladders.
- **Sell / Short Button:** Background `#EF4444`, hover `#DC2626`, text `#FFFFFF`.
- **Algorithmic Trigger (Copilot/AI):** Background `rgba(139, 92, 246, 0.15)`, text `#8B5CF6`, border `1px solid #8B5CF6`, hover background `rgba(139, 92, 246, 0.25)`.

### 4. Tabular Data Rows & Order Book (DOM)
- **Cell Structure:** Density level ultra-compact. Line-height `18px`, vertical padding `2px`, horizontal padding `6px`.
- **Bid/Ask Depth Fill Indicator:** Horizontal micro-bars behind row text using opacity washes:
  - Bid Depth: `background: linear-gradient(to left, rgba(16, 185, 129, 0.15) var(--depth), transparent var(--depth))`
  - Ask Depth: `background: linear-gradient(to left, rgba(239, 68, 68, 0.15) var(--depth), transparent var(--depth))`
- **Flash Transitions:** On quote updates, only price text briefly illuminates via CSS transition (green flash `#34D399` for tick up, red flash `#F87171` for tick down, 150ms ease-out).

### 5. Input Fields & Order Entry
- **Layout:** Integrated inline field containing asset amount and quick percentage chips (`25%`, `50%`, `75%`, `100%`).
- **Base Style:** Background `#0B0F17`, border `1px solid #1F2937`, height `30px`, font `JetBrains Mono` 12px, text `#F9FAFB`.
- **Focus State:** Border `1px solid #3B82F6`, zero outline box-shadow.

### 6. Interactive Quantitative Analysis Widgets
- **Container Structure:** Standard card `#111827`, header height `28px` with embedded drag-handle icon, title (`Geist` 12px SemiBold), and quantitative parameter settings gear.
- **Copilot Insight Card:** Left border `2px solid #8B5CF6`, interior background `rgba(139, 92, 246, 0.04)`. Displays Monte Carlo confidence metrics, VaR thresholds, and automated rebalance alerts with mono-spaced delta chips.
- **System Telemetry Bar (Footer):** Fixed bottom ribbon `20px` tall. Color `#6B7280`, monospace 10px. Displays: `WS: CONNECTED (12ms) | FEED: DIRECT L3 | MEM: 412MB | TIME: BST (UTC+6)`.