import React, { useState, useEffect } from 'react';
import { Plus, History, RotateCcw, UtensilsCrossed } from 'lucide-react';
import { StationFilter } from '../types';

interface KDSHeaderProps {
  totalActive: number;
  newOrdersCount: number;
  cookingCount: number;
  readyCount: number;
  activeStation: StationFilter;
  onStationChange: (station: StationFilter) => void;
  onAddSimulatedOrder: () => void;
  onOpenRecall: () => void;
  onResetInitialOrders: () => void;
  recalledCount: number;
}

export const KDSHeader: React.FC<KDSHeaderProps> = ({
  totalActive,
  newOrdersCount,
  cookingCount,
  readyCount,
  activeStation,
  onStationChange,
  onAddSimulatedOrder,
  onOpenRecall,
  onResetInitialOrders,
  recalledCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('Wednesday, 22 July 2026');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format time as 12-hour AM/PM with seconds
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeStr);

      // Default to exact formatted date as specified in design prompt
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-GB', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#1E293B] border-b border-[#334155] px-4 py-2.5 shadow-md select-none shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        
        {/* Brand & System Title */}
        <div className="flex items-center justify-between lg:justify-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black tracking-wider text-white">AXIONIK</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-l border-slate-700 pl-2">
                  Kitchen Display System
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <span>{currentDate || 'Wednesday, 22 July 2026'}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
                <span className="text-slate-200 font-mono font-bold">{currentTime || '02:30:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Mobile/Compact Quick Actions */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={onAddSimulatedOrder}
              className="p-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Summary Counters (NEW ORDER, COOKING, READY) */}
        <div className="flex items-center justify-between lg:justify-center gap-2 bg-[#0F172A]/80 p-1.5 rounded-lg border border-[#334155]/80 shrink-0">
          
          <div className="px-3 py-1 rounded bg-[#1E293B] border border-slate-700 flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">ACTIVE:</span>
            <span className="text-sm font-black font-mono text-white">{totalActive}</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700"></div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5">
            {/* NEW ORDERS */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-xs font-black tracking-wide">{newOrdersCount}</span>
              <span className="text-[11px] font-bold uppercase text-blue-200 hidden sm:inline">NEW ORDERS</span>
            </div>

            {/* COOKING */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-black tracking-wide">{cookingCount}</span>
              <span className="text-[11px] font-bold uppercase text-amber-200 hidden sm:inline">COOKING</span>
            </div>

            {/* READY */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-black tracking-wide">{readyCount}</span>
              <span className="text-[11px] font-bold uppercase text-emerald-200 hidden sm:inline">READY</span>
            </div>
          </div>
        </div>

        {/* Station Filter & Operational Controls */}
        <div className="hidden lg:flex items-center gap-2">
          
          {/* Kitchen Station Selector */}
          <div className="flex items-center bg-[#0F172A] p-1 rounded-md border border-slate-700 text-xs font-bold">
            <button
              onClick={() => onStationChange('ALL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeStation === 'ALL'
                  ? 'bg-slate-700 text-white font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL STATIONS
            </button>
            <button
              onClick={() => onStationChange('ASSEMBLY')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeStation === 'ASSEMBLY'
                  ? 'bg-slate-700 text-white font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ASSEMBLY
            </button>
            <button
              onClick={() => onStationChange('GRILL')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeStation === 'GRILL'
                  ? 'bg-slate-700 text-white font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GRILL
            </button>
          </div>

          <div className="h-6 w-[1px] bg-slate-700"></div>

          {/* Recall Served Orders Drawer Button */}
          <button
            onClick={onOpenRecall}
            className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors relative"
            title="Recall Served Orders"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>RECALL</span>
            {recalledCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-slate-200 rounded text-[10px] font-mono font-bold">
                {recalledCount}
              </span>
            )}
          </button>

          {/* Add Test Ticket */}
          <button
            onClick={onAddSimulatedOrder}
            className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            title="Simulate Incoming Order"
          >
            <Plus className="w-4 h-4" />
            <span>+ NEW TICKET</span>
          </button>

          {/* Reset Demo State */}
          <button
            onClick={onResetInitialOrders}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Initial Orders"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
