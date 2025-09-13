import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { TopCustomersTable } from "@/components/dashboard/TopCustomersTable";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Store,
  LogOut,
  Calendar,
  Filter
} from "lucide-react";
import { getTenantByDomain, getMetrics, generateChartData, type Tenant } from "@/lib/data-service";

interface DashboardProps {
  tenantId: string;
  userEmail: string;
  onLogout: () => void;
}

export const Dashboard = ({ tenantId, userEmail, onLogout }: DashboardProps) => {
  const [dateRange, setDateRange] = useState("30d");
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading dashboard data for tenant:', tenantId);
        
        // Get tenant info by domain mapping
        const domainMap: { [key: string]: string } = {
          'tenant-1': 'fashion-store-pro.com',
          'tenant-2': 'tech-gadgets-inc.com',
          'tenant-3': 'home-garden-co.com'
        };
        
        const domain = domainMap[tenantId] || 'fashion-store-pro.com';
        console.log('🔍 Looking up tenant by domain:', domain);
        
        const tenantData = await getTenantByDomain(domain);
        console.log('📊 Tenant data:', tenantData);
        
        if (tenantData) {
          setTenant(tenantData);
          
          // Load metrics and chart data
          console.log('📈 Loading metrics and chart data...');
          const [metricsData, chartDataArray] = await Promise.all([
            getMetrics(tenantData.id),
            generateChartData(tenantData.id)
          ]);
          
          console.log('📊 Metrics data:', metricsData);
          console.log('📈 Chart data:', chartDataArray);
          
          setMetrics(metricsData);
          setChartData(chartDataArray);
        } else {
          console.warn('⚠️ No tenant data found for domain:', domain);
        }
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        // Set default values to prevent crashes
        setMetrics({
          totalCustomers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0
        });
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (tenantId) {
      loadDashboardData();
    }
  }, [tenantId]);

  const dateRangeOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-20">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Store className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-bold gradient-text">Xeno Analytics</h1>
                  <p className="text-xs text-muted-foreground">{tenant?.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground">{tenant?.domain}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Dashboard Overview</h2>
              <p className="text-muted-foreground mt-1">
                Real-time insights from your Shopify store
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex space-x-2">
                {dateRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={dateRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateRange(option.value)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Customers"
            value={metrics?.totalCustomers || 0}
            change="+12% from last month"
            icon={Users}
            trend="up"
          />
          <MetricCard
            title="Total Orders"
            value={metrics?.totalOrders || 0}
            change="+8% from last month"
            icon={ShoppingCart}
            trend="up"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${metrics?.totalRevenue || '0'}`}
            change="+15% from last month"
            icon={DollarSign}
            trend="up"
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${metrics?.avgOrderValue || '0'}`}
            change="+3% from last month"
            icon={TrendingUp}
            trend="up"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Revenue Trend"
            description="Daily revenue over the selected period"
            type="revenue"
            data={chartData}
          />
          <ChartContainer
            title="Orders & Customers"
            description="Daily orders and new customers"
            type="orders"
            data={chartData}
          />
        </div>

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCustomersTable tenantId={tenant?.id || ""} />
          <RecentOrdersTable tenantId={tenant?.id || ""} />
        </div>
      </main>
    </div>
  );
};
