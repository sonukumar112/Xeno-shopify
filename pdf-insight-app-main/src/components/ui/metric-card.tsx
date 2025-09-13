import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  className,
}: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-chart-revenue";
      case "down":
        return "text-error";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("metric-card", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {change && (
            <p className={cn("text-sm font-medium", getTrendColor())}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};