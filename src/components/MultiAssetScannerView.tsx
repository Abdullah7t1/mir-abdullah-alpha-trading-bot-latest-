import React, { useState } from 'react';
import { CurrencyPair } from '../types';
import { Radar, Search, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { playTerminalChime } from '../utils/audio';

interface MultiAssetScannerViewProps {
  pairs: CurrencyPair[];
  onSelectPairAndNavigate: (pair: CurrencyPair) => void;
}

export const MultiAssetScannerView: React.FC<MultiAssetScannerViewProps> = ({
  pairs,
  onSelectPairAndNavigate,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL' | 'HIGH_CONF'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = pairs.filter((p) => {
    const matchesSearch = p.symbol.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'BUY') return p.signalDirection === 'BUY';
    if (filterType === 'SELL') return p.signalDirection === 'SELL';
    if (filterType === 'HIGH_CONF') return p.confluence >= 80;
    return true;
  });

  return (
    <div className="flex flex-col gap-space-md w-full">
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-primary animate-spin" />
            <div>
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                MULTI-ASSET QUANTITATIVE SCANNER RADAR
              </h2>
              <span className="text-[11px] text-outline font-mono">
                Continuous tick evaluation across 28+ FX Pairs, Spot Metals, & Crypto
              </span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {(['ALL', 'BUY', 'SELL', 'HIGH_CONF'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1 rounded transition-colors ${
                  filterType === ft
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'bg-surface-container text-outline hover:text-on-surface'
                }`}
              >
                {ft === 'HIGH_CONF' ? 'CONFLUENCE ≥80%' : ft}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            placeholder="Search pair or asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest border border-surface-container-high rounded pl-8 pr-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary-container font-mono"
          />
        </div>

        {/* Scanner Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-surface-container-high text-outline text-[10px] uppercase">
                <th className="py-2 px-2">Asset Symbol</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2 text-right">Bid (Sell)</th>
                <th className="py-2 px-2 text-right">Ask (Buy)</th>
                <th className="py-2 px-2 text-center">Spread</th>
                <th className="py-2 px-2 text-right">24H Change</th>
                <th className="py-2 px-2 text-center">Signal Bias</th>
                <th className="py-2 px-2 text-right">Confluence %</th>
                <th className="py-2 px-2">SMC Institutional Setup</th>
                <th className="py-2 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {filtered.map((pair) => (
                <tr key={pair.symbol} className="hover:bg-surface-container/60 transition-colors">
                  <td className="py-3 px-2 font-bold whitespace-nowrap">
                    <span className="text-on-surface">{pair.symbol}</span>
                    <span className="text-outline text-[10px] block font-normal">{pair.name}</span>
                  </td>
                  <td className="py-3 px-2 uppercase text-[10px] text-outline whitespace-nowrap">
                    {pair.category}
                  </td>
                  <td className="py-3 px-2 text-right text-error font-semibold whitespace-nowrap">
                    {pair.bid.toFixed(pair.digits)}
                  </td>
                  <td className="py-3 px-2 text-right text-secondary font-semibold whitespace-nowrap">
                    {pair.ask.toFixed(pair.digits)}
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface text-[10px]">
                      {pair.spread.toFixed(1)} p
                    </span>
                  </td>
                  <td
                    className={`py-3 px-2 text-right font-bold whitespace-nowrap ${
                      pair.change24h >= 0 ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    <span className="flex items-center justify-end gap-0.5">
                      {pair.change24h >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {pair.change24h}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pair.signalDirection === 'BUY'
                          ? 'bg-secondary text-on-secondary'
                          : pair.signalDirection === 'SELL'
                          ? 'bg-error text-on-error'
                          : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      {pair.signalDirection}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-secondary whitespace-nowrap">
                    {pair.confluence.toFixed(1)}%
                  </td>
                  <td className="py-3 px-2 font-sans text-xs text-on-surface-variant whitespace-nowrap">
                    {pair.smcSetup}
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        playTerminalChime('alert');
                        onSelectPairAndNavigate(pair);
                      }}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary hover:text-white border border-surface-container-high transition-colors flex items-center gap-1 mx-auto"
                    >
                      <span>Chart</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
