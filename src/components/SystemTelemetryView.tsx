import React, { useState, useEffect } from 'react';
import { Cpu, Server, Wifi, Activity, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SystemTelemetryView: React.FC = () => {
  const [ticksPerSec, setTicksPerSec] = useState(124500);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicksPerSec(124000 + Math.floor(Math.random() * 1200));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-space-md w-full font-mono">
      <section className="bg-surface-container-low rounded-lg p-space-md border border-surface-container-high shadow-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-secondary animate-pulse" />
            <div>
              <h2 className="font-headline-sm text-sm font-bold text-on-surface">
                QUANTITATIVE HIGH-FREQUENCY SYSTEM TELEMETRY
              </h2>
              <span className="text-[11px] text-outline">
                Bare-Metal 64-Core Processing Cluster & Low-Latency Tier-1 FIX Bridge
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded border border-surface-container-high text-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
            <span className="text-secondary font-bold">ALL 64 CORES SYNCHRONIZED</span>
          </div>
        </div>

        {/* Cores Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-surface-container border border-surface-container-high flex flex-col gap-1 text-[10px]"
            >
              <div className="flex justify-between text-outline">
                <span>CORE #{idx}</span>
                <span className="text-secondary">94%</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1 rounded overflow-hidden">
                <div
                  className="bg-secondary h-full rounded"
                  style={{ width: `${85 + (idx % 12)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* LP Gateway Connections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          {[
            {
              hub: 'Tokyo Equinix TY3',
              role: 'Asian Session Feed',
              ping: '14.2ms',
              protocol: 'WebSocket / FIX 4.4',
              status: 'HEALTHY',
            },
            {
              hub: 'London Equinix LD4',
              role: 'European FX Primary',
              ping: '18.5ms',
              protocol: 'FIX 4.4 Ultra-DMA',
              status: 'HEALTHY',
            },
            {
              hub: 'New York Secaucus NY4',
              role: 'Wall Street Liquidity Hub',
              ping: '22.8ms',
              protocol: 'Direct Cross-Connect',
              status: 'HEALTHY',
            },
          ].map((gw, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-surface-container border border-surface-container-high flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-primary" />
                  <span className="font-bold text-on-surface text-xs">{gw.hub}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[9px] font-bold">
                  {gw.status}
                </span>
              </div>
              <div className="text-[11px] text-outline flex justify-between">
                <span>{gw.role}</span>
                <span className="text-secondary font-bold">{gw.ping}</span>
              </div>
              <div className="text-[10px] text-outline border-t border-surface-container-high pt-1 flex justify-between">
                <span>Protocol: {gw.protocol}</span>
                <span className="text-primary">Packet Loss: 0.00%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Database & Ingestion Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-3 rounded bg-surface-container border border-surface-container-high flex items-center gap-3">
            <Activity className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <span className="text-outline text-[10px] block">TICK INGESTION SPEED</span>
              <span className="text-sm font-bold text-on-surface">
                {ticksPerSec.toLocaleString()} / sec
              </span>
            </div>
          </div>
          <div className="p-3 rounded bg-surface-container border border-surface-container-high flex items-center gap-3">
            <Database className="w-6 h-6 text-primary shrink-0" />
            <div>
              <span className="text-outline text-[10px] block">REDIS CLUSTER CACHE</span>
              <span className="text-sm font-bold text-secondary">99.85% Hit Rate</span>
            </div>
          </div>
          <div className="p-3 rounded bg-surface-container border border-surface-container-high flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <span className="text-outline text-[10px] block">HMAC-SHA256 SIGNATURE</span>
              <span className="text-sm font-bold text-secondary">VERIFIED</span>
            </div>
          </div>
          <div className="p-3 rounded bg-surface-container border border-surface-container-high flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
            <div>
              <span className="text-outline text-[10px] block">FAILOVER REDUNDANCY</span>
              <span className="text-sm font-bold text-on-surface">ACTIVE (N+2)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
