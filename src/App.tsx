import { useState, useMemo, useCallback } from 'react';
import { Order, OrderStatus, StationFilter } from './types';
import { INITIAL_ORDERS, SAMPLE_SIMULATOR_ORDERS } from './data/initialOrders';
import { KDSHeader } from './components/KDSHeader';
import { OrderCard } from './components/OrderCard';
import { EmptyState } from './components/EmptyState';
import { RecallDrawer } from './components/RecallDrawer';
import { playKDSSound } from './utils/audio';

export default function App() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [servedOrders, setServedOrders] = useState<Order[]>([]);
  const [activeStation, setActiveStation] = useState<StationFilter>('ALL');
  const [isRecallOpen, setIsRecallOpen] = useState<boolean>(false);

  // Compute status summary counts
  const newOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'NEW ORDER').length,
    [orders]
  );
  const cookingCount = useMemo(
    () => orders.filter((o) => o.status === 'COOKING').length,
    [orders]
  );
  const readyCount = useMemo(
    () => orders.filter((o) => o.status === 'READY').length,
    [orders]
  );

  // Filter orders by active kitchen station
  const filteredOrders = useMemo(() => {
    if (activeStation === 'ALL') return orders;
    if (activeStation === 'ASSEMBLY') {
      return orders.filter((o) => o.kitchenSection.toLowerCase().includes('assembly'));
    }
    if (activeStation === 'GRILL') {
      return orders.filter((o) => o.kitchenSection.toLowerCase().includes('grill') || o.kitchenSection.toLowerCase().includes('fryer'));
    }
    if (activeStation === 'DESERT_BEV') {
      return orders.filter((o) => o.kitchenSection.toLowerCase().includes('beverage') || o.kitchenSection.toLowerCase().includes('dessert'));
    }
    return orders;
  }, [orders, activeStation]);

  // Advance Order Status Workflow
  const handleAdvanceStatus = useCallback(
    (orderId: string, currentStatus: OrderStatus) => {
      playKDSSound('bump');

      setOrders((prevOrders) => {
        const orderIndex = prevOrders.findIndex((o) => o.id === orderId);
        if (orderIndex === -1) return prevOrders;

        const updated = [...prevOrders];
        const targetOrder = { ...updated[orderIndex] };

        if (currentStatus === 'NEW ORDER') {
          targetOrder.status = 'COOKING';
          targetOrder.statusDetail = 'Cooking in Progress';
          updated[orderIndex] = targetOrder;
          return updated;
        } else if (currentStatus === 'COOKING') {
          targetOrder.status = 'READY';
          targetOrder.statusDetail = 'Waiting For Pickup';
          // Mark all items prepared
          targetOrder.items = targetOrder.items.map((i) => ({ ...i, isCompleted: true }));
          updated[orderIndex] = targetOrder;
          return updated;
        } else if (currentStatus === 'READY') {
          // Serve order -> Archive to served list
          targetOrder.servedAt = Date.now();
          setServedOrders((prevServed) => [targetOrder, ...prevServed]);
          return prevOrders.filter((o) => o.id !== orderId);
        }

        return prevOrders;
      });
    },
    []
  );

  // Toggle item prep checkbox state
  const handleToggleItemComplete = useCallback((orderId: string, itemId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map((item) =>
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
          ),
        };
      })
    );
  }, []);

  // Add simulated test ticket
  const handleAddSimulatedOrder = useCallback(() => {
    playKDSSound('new_order');

    const randomIndex = Math.floor(Math.random() * SAMPLE_SIMULATOR_ORDERS.length);
    const template = SAMPLE_SIMULATOR_ORDERS[randomIndex];
    const ticketNum = Math.floor(100 + Math.random() * 900);

    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: template.orderNumber || `#${ticketNum}`,
      orderType: template.orderType || (Math.random() > 0.5 ? 'DINE IN' : 'TAKE AWAY'),
      table: template.table || `TABLE ${Math.floor(Math.random() * 25) + 1}`,
      tableDetails: template.tableDetails || 'Dining Hall • Zone B • 2 Guests',
      status: 'NEW ORDER',
      kitchenSection: template.kitchenSection || 'Assembly Counter',
      estimatedPrepMinutes: template.estimatedPrepMinutes || 12,
      createdAt: Date.now(),
      items: (template.items || []).map((it, idx) => ({
        ...it,
        id: `sim-item-${Date.now()}-${idx}`,
        isCompleted: false,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
  }, []);

  // Restore order from recall drawer back to READY
  const handleRecallOrder = useCallback(
    (orderId: string) => {
      const orderToRecall = servedOrders.find((o) => o.id === orderId);
      if (!orderToRecall) return;

      playKDSSound('bump');

      setServedOrders((prev) => prev.filter((o) => o.id !== orderId));
      setOrders((prev) => [
        ...prev,
        {
          ...orderToRecall,
          status: 'READY',
          statusDetail: 'Restored to Serving Pass',
        },
      ]);
    },
    [servedOrders]
  );

  // Reset to prompt initial orders state
  const handleResetInitialOrders = useCallback(() => {
    playKDSSound('alert');
    setOrders(INITIAL_ORDERS);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#0F172A] text-white flex flex-col overflow-hidden select-none font-sans">
      
      {/* HEADER SECTION */}
      <KDSHeader
        totalActive={orders.length}
        newOrdersCount={newOrdersCount}
        cookingCount={cookingCount}
        readyCount={readyCount}
        activeStation={activeStation}
        onStationChange={setActiveStation}
        onAddSimulatedOrder={handleAddSimulatedOrder}
        onOpenRecall={() => setIsRecallOpen(true)}
        onResetInitialOrders={handleResetInitialOrders}
        recalledCount={servedOrders.length}
      />

      {/* MAIN TABLET CONTENT AREA (2-COLUMN AUTO-FIT GRID) */}
      <main className="flex-1 p-4 overflow-hidden relative flex flex-col">
        {filteredOrders.length === 0 ? (
          <EmptyState
            onAddSimulatedOrder={handleAddSimulatedOrder}
            onResetInitialOrders={handleResetInitialOrders}
          />
        ) : (
          <div className="w-full h-full overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAdvanceStatus={handleAdvanceStatus}
                  onToggleItemComplete={handleToggleItemComplete}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* RECALL SERVED ORDERS DRAWER */}
      <RecallDrawer
        isOpen={isRecallOpen}
        onClose={() => setIsRecallOpen(false)}
        servedOrders={servedOrders}
        onRecallOrder={handleRecallOrder}
      />

      {/* KDS SYSTEM STATUS FOOTER BAR */}
      <footer className="bg-[#1E293B] border-t border-[#334155] px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SYSTEM ONLINE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">STATION: WALL-MOUNT TABLET KDS-01</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-400">TOUCH CONTROLS ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-bold">AXIONIK v4.2 PRO</span>
        </div>
      </footer>

    </div>
  );
}
