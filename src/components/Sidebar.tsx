import React from 'react';
import { NavigationTab } from '../types';
import {
  Activity,
  LineChart,
  Newspaper,
  Radar,
  FlaskConical,
  Calculator,
  Radio,
  Cpu,
  Sparkles,
  Layers,
  Crosshair,
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: NavItemConfig[] = [
    {
      id: 'dashboard-terminal',
      label: 'Dashboard / Terminal',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'easy-trade-mir',
      label: 'Easy Trade Mir',
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      badge: 'MIR AI'
    },
    {
      id: 'ftt-binary',
      label: 'FTT Binary Trading',
      icon: <Layers className="w-4 h-4 text-secondary" />,
      badge: 'BINARY'
    },
    {
      id: 'ftt-pro-mode',
      label: 'FTT Pro Mode',
      icon: <Crosshair className="w-4 h-4 text-primary" />,
      badge: 'SNIPER'
    },
    {
      id: 'pro-technical-engine',
      label: 'PRO Technical Engine',
      icon: <LineChart className="w-4 h-4" />,
      badge: '255+'
    },
    {
      id: 'news-candle-ai-calendar',
      label: 'NEWS Candle AI',
      icon: <Newspaper className="w-4 h-4" />,
      badge: 'NFP'
    },
    {
      id: 'multi-asset-scanner',
      label: 'Multi-Asset Scanner',
      icon: <Radar className="w-4 h-4" />
    },
    {
      id: 'strategy-backtester-lab',
      label: 'Backtester & Lab',
      icon: <FlaskConical className="w-4 h-4" />,
      badge: '260+'
    },
    {
      id: 'risk-position-calculator',
      label: 'Risk & Position Calc',
      icon: <Calculator className="w-4 h-4" />
    },
    {
      id: 'bangladesh-signal-center',
      label: 'BD Signal Center',
      icon: <Radio className="w-4 h-4" />,
      badge: 'BST'
    },
    {
      id: 'system-telemetry',
      label: 'System Telemetry',
      icon: <Cpu className="w-4 h-4" />
    }
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-surface-container-lowest border-r border-surface-container-high z-50 flex flex-col justify-between select-none">
      {/* Top Branding */}
      <div>
        <div className="h-14 px-space-md flex items-center justify-between border-b border-surface-container-high bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse shadow-[0_0_8px_#4edea3]"></div>
            <span className="font-headline-sm text-sm font-bold tracking-tight text-on-surface">
              ALPHAFOREX
            </span>
          </div>
          <span className="font-label-ticker-xs text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-mono font-bold tracking-wider">
            QUANT
          </span>
        </div>

        {/* Section Header */}
        <div className="px-space-md py-space-sm">
          <span className="font-label-ticker-xs text-[10px] text-outline uppercase tracking-wider px-space-xs font-mono">
            Core Intelligence
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-0.5 px-space-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-between px-space-md py-2 rounded text-left transition-all group ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-bold shadow-sm border-l-2 border-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-primary' : 'text-outline group-hover:text-primary'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body-md text-xs truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-label-ticker-xs text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-container-highest text-outline group-hover:text-on-surface'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry Mini Widget */}
      <div className="p-space-md bg-surface-container-low border-t border-surface-container-high">
        <div className="bg-surface-container-highest p-space-sm rounded flex flex-col gap-1.5 border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">ENGINE CORES</span>
            <span className="font-label-ticker-xs text-[9px] text-secondary font-mono font-bold">
              64/64 ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-label-ticker-xs text-[9px] text-outline font-mono">QUANT STRATEGIES</span>
            <span className="font-label-data-sm text-[10px] text-on-surface font-mono">260+ LOADED</span>
          </div>
          <div className="w-full bg-surface-container-low h-1 rounded overflow-hidden mt-0.5">
            <div className="bg-secondary h-full w-[94%] rounded-full shadow-[0_0_6px_#4edea3]"></div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-outline mt-0.5">
            <span>MEM: 12.4 GB</span>
            <span className="text-secondary">LATENCY: 14ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
