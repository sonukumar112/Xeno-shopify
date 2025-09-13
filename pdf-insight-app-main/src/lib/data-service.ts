import { apiClient } from "./api-client";

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  total_spent: number;
  order_count: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  customer_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  item_count: number;
  created_at: string;
  updated_at: string;
  customer_name?: string;
}

// Tenant operations
export const getTenants = async (): Promise<Tenant[]> => {
  return await apiClient.get<Tenant[]>('/tenants');
};

export const getTenantByDomain = async (domain: string): Promise<Tenant | null> => {
  try {
    return await apiClient.get<Tenant>(`/tenants/domain/${domain}`);
  } catch (error) {
    return null;
  }
};

// Customer operations
export const getCustomersByTenant = async (tenantId: string): Promise<Customer[]> => {
  return await apiClient.get<Customer[]>(`/customers/tenant/${tenantId}`);
};

export const getTopCustomers = async (tenantId: string, limit: number = 5): Promise<Customer[]> => {
  return await apiClient.get<Customer[]>(`/customers/tenant/${tenantId}/top?limit=${limit}`);
};

// Order operations
export const getOrdersByTenant = async (tenantId: string): Promise<Order[]> => {
  return await apiClient.get<Order[]>(`/orders/tenant/${tenantId}`);
};

export const getRecentOrders = async (tenantId: string, limit: number = 5): Promise<Order[]> => {
  return await apiClient.get<Order[]>(`/orders/tenant/${tenantId}/recent?limit=${limit}`);
};

// Metrics calculations
export const getMetrics = async (tenantId: string) => {
  return await apiClient.get(`/tenants/${tenantId}/metrics`);
};

// Generate chart data for last 30 days
export const generateChartData = async (tenantId: string) => {
  return await apiClient.get(`/orders/tenant/${tenantId}/chart`);
};
