import React from 'react';
import { X, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';

interface RecallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  servedOrders: Order[];
  onRecallOrder: (orderId: string) => void;
}

export const RecallDrawer: React.FC<RecallDrawerProps> = ({
  isOpen,
  onClose,
  servedOrders,
  onRecallOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-[#1E293B] border-l border-[#334155] h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 bg-[#0F172A] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-white uppercase">RECALLED / SERVED LOG</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300">
              {servedOrders.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {servedOrders.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <CheckCircle className="w-12 h-12 text-slate-600 mb-3" />
              <p className="font-bold text-slate-300">No Served Orders Yet</p>
              <p className="text-xs text-slate-500 mt-1">Orders cleared via "SERVE ORDER" will appear here for quick recall.</p>
            </div>
          ) : (
            servedOrders.map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-xl bg-[#0F172A] border border-[#334155] flex flex-col justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black font-mono text-white">{order.table}</h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Served {order.servedAt ? new Date(order.servedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    <Clock className="w-3 h-3" />
                    <span>DONE</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="text-xs text-slate-300 space-y-1 bg-slate-900/50 p-2 rounded border border-slate-800">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span className="font-bold">{it.quantity}x {it.name}</span>
                    </div>
                  ))}
                </div>

                {/* Restore Button */}
                <button
                  onClick={() => onRecallOrder(order.id)}
                  className="w-full py-2 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESTORE TO READY SCREEN</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-[#0F172A] border-t border-[#334155] text-center">
          <p className="text-[11px] font-mono text-slate-500">AXIONIK POS AUDIT RECALL BUFFER</p>
        </div>

      </div>
    </div>
  );
};
