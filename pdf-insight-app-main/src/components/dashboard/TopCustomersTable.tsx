import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, TrendingUp } from "lucide-react";
import { getTopCustomers, type Customer } from "@/lib/data-service";

interface TopCustomersTableProps {
  tenantId: string;
}

export const TopCustomersTable = ({ tenantId }: TopCustomersTableProps) => {
  const [topCustomers, setTopCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      if (!tenantId) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔄 Loading top customers for tenant:', tenantId);
        const customers = await getTopCustomers(tenantId, 5);
        console.log('👥 Top customers data:', customers);
        setTopCustomers(customers);
      } catch (error) {
        console.error('❌ Error loading top customers:', error);
        setTopCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [tenantId]);

  if (loading) {
    return (
      <Card className="glass-card hover-glow">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-warning" />
            <CardTitle className="gradient-text">Top Customers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="glass-card hover-glow">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-warning" />
          <CardTitle className="gradient-text">Top Customers</CardTitle>
        </div>
        <CardDescription>
          Your highest value customers by total spend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, index) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-3 rounded-lg bg-card-elevated hover:bg-card-hover transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-4 h-4 text-warning" />
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-chart-revenue">
                    {formatCurrency(Number(customer.total_spent))}
                  </p>
                  {index < 3 && (
                    <TrendingUp className="w-4 h-4 text-chart-revenue" />
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {customer.order_count} orders
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total from top 5:</span>
            <span className="font-bold text-primary">
              {formatCurrency(
                topCustomers.reduce((sum, customer) => sum + Number(customer.total_spent), 0)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
