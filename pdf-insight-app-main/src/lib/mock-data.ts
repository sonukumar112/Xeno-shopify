// Mock Shopify data for the dashboard
export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: number;
}

export interface Tenant {
  id: string;
  name: string;
  shopifyStore: string;
}

// Mock data for demonstration
export const mockTenants: Tenant[] = [
  { id: "1", name: "Fashion Store Pro", shopifyStore: "fashion-store-pro.myshopify.com" },
  { id: "2", name: "Tech Gadgets Inc", shopifyStore: "tech-gadgets-inc.myshopify.com" },
  { id: "3", name: "Home & Garden Co", shopifyStore: "home-garden-co.myshopify.com" },
];

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    totalSpent: 2850.00,
    ordersCount: 12,
    createdAt: "2024-01-15",
  },
  {
    id: "2", 
    name: "Michael Chen",
    email: "m.chen@email.com",
    totalSpent: 1950.00,
    ordersCount: 8,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com", 
    totalSpent: 1675.00,
    ordersCount: 15,
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@email.com",
    totalSpent: 1420.00,
    ordersCount: 6,
    createdAt: "2024-03-12",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    totalSpent: 1180.00,
    ordersCount: 9,
    createdAt: "2024-02-05",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: "1",
    customerName: "Sarah Johnson",
    total: 245.99,
    status: "delivered",
    createdAt: "2024-09-10",
    items: 3,
  },
  {
    id: "ORD-002", 
    customerId: "2",
    customerName: "Michael Chen",
    total: 189.50,
    status: "shipped",
    createdAt: "2024-09-11",
    items: 2,
  },
  {
    id: "ORD-003",
    customerId: "3", 
    customerName: "Emily Rodriguez",
    total: 312.75,
    status: "processing",
    createdAt: "2024-09-12",
    items: 4,
  },
  {
    id: "ORD-004",
    customerId: "1",
    customerName: "Sarah Johnson", 
    total: 156.25,
    status: "delivered",
    createdAt: "2024-09-08",
    items: 1,
  },
  {
    id: "ORD-005",
    customerId: "4",
    customerName: "David Kim",
    total: 428.90,
    status: "pending",
    createdAt: "2024-09-13",
    items: 5,
  },
];

// Generate chart data for the last 30 days
export const generateChartData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseOrders = Math.floor(Math.random() * 15) + 5;
    const baseRevenue = baseOrders * (Math.random() * 150 + 50);
    const customers = Math.floor(Math.random() * 8) + 2;
    
    data.push({
      date: date.toISOString().split('T')[0],
      orders: baseOrders,
      revenue: Math.round(baseRevenue),
      customers,
    });
  }
  
  return data;
};

export const chartData = generateChartData();

// Calculate metrics
export const getMetrics = () => {
  const totalCustomers = mockCustomers.length;
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  
  return {
    totalCustomers,
    totalOrders,
    totalRevenue: totalRevenue.toFixed(2),
    avgOrderValue: avgOrderValue.toFixed(2),
  };
};