import React from 'react';
import { CheckCircle2, Layers, Utensils, ShoppingBag, Hash } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onAdvanceStatus: (orderId: string, currentStatus: OrderStatus) => void;
  onToggleItemComplete: (orderId: string, itemId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAdvanceStatus,
  onToggleItemComplete,
}) => {
  // Visual status styling matching exact color requirements
  const getStatusStyles = () => {
    switch (order.status) {
      case 'NEW ORDER':
        return {
          headerBg: 'bg-blue-950/80 border-blue-500/40',
          badgeBg: 'bg-blue-600 text-white font-black',
          badgeText: 'NEW ORDER',
          accentBorder: 'border-l-4 border-l-blue-500 border-t border-r border-b border-[#334155]',
          buttonBg: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border-blue-500/50',
          buttonText: 'START COOKING',
        };
      case 'COOKING':
        return {
          headerBg: 'bg-amber-950/80 border-amber-500/40',
          badgeBg: 'bg-amber-600 text-white font-black',
          badgeText: 'COOKING',
          accentBorder: 'border-l-4 border-l-amber-500 border-t border-r border-b border-[#334155]',
          buttonBg: 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white border-amber-500/50',
          buttonText: 'MARK AS READY',
        };
      case 'READY':
      default:
        return {
          headerBg: 'bg-emerald-950/80 border-emerald-500/40',
          badgeBg: 'bg-emerald-600 text-white font-black',
          badgeText: 'READY FOR SERVING',
          accentBorder: 'border-l-4 border-l-emerald-500 border-t border-r border-b border-[#334155]',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-emerald-500/50',
          buttonText: 'SERVE ORDER',
        };
    }
  };

  const styles = getStatusStyles();
  const isTakeAway = order.orderType === 'TAKE AWAY';

  return (
    <div
      className={`bg-[#1E293B] rounded-xl shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-200 ${styles.accentBorder}`}
    >
      {/* CARD TOP HEADER BAR */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${styles.headerBg}`}>
        {/* Status Badge & Kitchen Section */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded text-xs tracking-wider uppercase shadow-sm ${styles.badgeBg}`}>
            {styles.badgeText}
          </span>
          {order.kitchenSection && (
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/60">
              <Layers className="w-3 h-3 text-slate-400" />
              {order.kitchenSection}
            </span>
          )}
        </div>

        {/* ORDER ID NUMBER BADGE */}
        <div className="flex items-center gap-1.5 bg-[#0F172A]/90 px-3 py-1 rounded-md border border-slate-700/80 shadow-inner">
          <Hash className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ORDER ID:</span>
          <span className="text-base font-black text-white font-mono tracking-tight">
            {order.orderNumber || `#${order.id.slice(-4)}`}
          </span>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        
        {/* Table Details & Order Type Meta */}
        <div>
          {/* Header Row: Table Name + Order Type Tag */}
          <div className="border-b border-slate-700/80 pb-3 mb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-slate-400 block mb-0.5">
                  LOCATION / TABLE
                </span>
                <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white font-mono">
                  {order.table}
                </h2>
              </div>

              {/* Order Type Tag (Dine In / Take Away) */}
              <div className="text-right">
                <span className="text-[11px] uppercase font-bold tracking-widest text-slate-400 block mb-0.5">
                  ORDER TYPE
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border shadow-sm ${
                    isTakeAway
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
                  }`}
                >
                  {isTakeAway ? (
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Utensils className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span>{order.orderType || 'DINE IN'}</span>
                </span>
              </div>
            </div>

            {/* Sub-row: Table Details / Zone Info */}
            {order.tableDetails && (
              <div className="mt-2 text-xs font-medium text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold">• {order.tableDetails}</span>
                {order.estimatedPrepMinutes && (
                  <span className="text-slate-400 text-[11px] font-mono font-bold">
                    EST. PREP: {order.estimatedPrepMinutes} MIN
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Status Detail Note if present */}
          {order.statusDetail && (
            <div className="mb-3 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-700/60 text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span className="font-semibold text-slate-300">CURRENT STATUS:</span>
              <span className="text-white font-bold">{order.statusDetail}</span>
            </div>
          )}

          {/* Order Items & Customizations */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase font-bold tracking-widest text-slate-400 block">
              ITEMS TO PREPARE ({order.items.length})
            </span>

            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleItemComplete(order.id, item.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    item.isCompleted
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-[#0F172A]/70 border-slate-700/80 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      {/* Quantity Badge */}
                      <span className="px-2 py-0.5 rounded bg-blue-600/30 border border-blue-500/40 text-blue-300 text-sm font-black font-mono shrink-0">
                        {item.quantity}x
                      </span>

                      {/* Item Name */}
                      <span
                        className={`text-base font-bold leading-tight ${
                          item.isCompleted ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Completion Check Icon */}
                    <div className="shrink-0 mt-0.5">
                      <CheckCircle2
                        className={`w-5 h-5 transition-colors ${
                          item.isCompleted ? 'text-emerald-400 fill-emerald-950' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Customizations Highlight List */}
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="mt-2 pl-8 space-y-1">
                      {item.customizations.map((cust, idx) => (
                        <div
                          key={idx}
                          className="text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded inline-block mr-1.5 mb-1"
                        >
                          • {cust}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => onAdvanceStatus(order.id, order.status)}
            className={`w-full min-h-[48px] h-12 rounded-lg font-black tracking-wider uppercase text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] touch-manipulation cursor-pointer ${styles.buttonBg}`}
          >
            <span>{styles.buttonText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
