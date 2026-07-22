export type OrderStatus = 'NEW ORDER' | 'COOKING' | 'READY';
export type OrderType = 'DINE IN' | 'TAKE AWAY';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  customizations?: string[];
  isCompleted?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#101", "#102", "#103"
  orderType: OrderType; // "DINE IN" | "TAKE AWAY"
  table: string; // e.g. "TABLE 15", "TABLE 08", "TAKEAWAY COUNTER"
  tableDetails?: string; // e.g. "Main Dining • Zone A • 4 Seats", "Patio Section • Seat 2", "Express Pickup Station"
  status: OrderStatus;
  items: OrderItem[];
  createdAt: number; // Timestamp
  estimatedPrepMinutes: number; // Estimated preparation time in minutes
  kitchenSection: string; // e.g. "Assembly Counter", "Grill & Fryer", "Beverages & Dessert"
  statusDetail?: string; // e.g. "Cooking in Progress", "Waiting For Pickup"
  servedAt?: number;
}

export type StationFilter = 'ALL' | 'ASSEMBLY' | 'GRILL' | 'DESERT_BEV';
