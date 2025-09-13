import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package } from "lucide-react";
import { getRecentOrders, type Order } from "@/lib/data-service";

interface RecentOrdersTableProps {
  tenantId: string;
}

export const RecentOrdersTable = ({ tenantId }: RecentOrdersTableProps) => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔄 Loading recent orders for tenant:', tenantId);
        const orders = await getRecentOrders(tenantId, 5);
        console.log('📦 Recent orders data:', orders);
        setRecentOrders(orders);
      } catch (error) {
        console.error('❌ Error loading recent orders:', error);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [tenantId]);

  if (loading) {
    return (
      <Card className="glass-card hover-glow">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-chart-orders" />
            <CardTitle className="gradient-text">Recent Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-chart-revenue/10 text-chart-revenue border-chart-revenue/20";
      case "shipped":
        return "bg-chart-orders/10 text-chart-orders border-chart-orders/20";
      case "processing":
        return "bg-warning/10 text-warning border-warning/20";
      case "pending":
        return "bg-muted text-muted-foreground border-border";
      case "cancelled":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="glass-card hover-glow">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-chart-orders" />
          <CardTitle className="gradient-text">Recent Orders</CardTitle>
        </div>
        <CardDescription>
          Latest orders from your customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card-elevated hover:bg-card-hover transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <p className="font-semibold text-foreground">{order.order_number}</p>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(order.status)}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{order.customer_name || 'Unknown Customer'}</span>
                  <span>•</span>
                  <span>{order.item_count} items</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-chart-revenue">
                  {formatCurrency(Number(order.total_amount))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-chart-orders/5 border border-chart-orders/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Recent orders total:</span>
            <span className="font-bold text-chart-orders">
              {formatCurrency(
                recentOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
