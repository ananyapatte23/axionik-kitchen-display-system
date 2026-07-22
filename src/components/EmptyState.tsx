import React from 'react';
import { ChefHat, Utensils, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onAddSimulatedOrder: () => void;
  onResetInitialOrders: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddSimulatedOrder,
  onResetInitialOrders,
}) => {
  return (
    <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center p-8 bg-[#1E293B] border border-[#334155] rounded-2xl shadow-xl text-center select-none">
      
      {/* Restaurant Theme Vector Graphic / Illustration */}
      <div className="relative mb-6">
        {/* Outer glowing halo */}
        <div className="w-28 h-28 rounded-full bg-blue-900/20 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
          <ChefHat className="w-14 h-14 text-blue-400 stroke-[1.5]" />
        </div>
        
        {/* Decorative corner icon */}
        <div className="absolute -bottom-1 -right-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 shadow">
          <Utensils className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* Primary Empty Message */}
      <h2 className="text-2xl md:text-3xl font-black tracking-wide text-white uppercase mb-2">
        WAITING FOR NEW ORDERS
      </h2>

      {/* Subtitle */}
      <p className="text-slate-300 font-medium text-base max-w-md mb-8">
        All incoming orders will automatically appear here.
      </p>

      {/* Quick Action Controls for Kitchen Operators */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onAddSimulatedOrder}
          className="px-6 py-3 min-h-[48px] rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>SIMULATE NEW ORDER</span>
        </button>

        <button
          onClick={onResetInitialOrders}
          className="px-5 py-3 min-h-[48px] rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>RELOAD DEFAULT TICKETS</span>
        </button>
      </div>

      {/* System Status Operational Footer Badge */}
      <div className="mt-10 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>AXIONIK KDS ENGINE • LISTENING FOR POS TICKETS</span>
      </div>

    </div>
  );
};
