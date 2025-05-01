import { useEffect, useMemo } from "react";
import { Users, Package, CheckCircle, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useMetricsStore } from "@/store/useMetricStore";
import { useOrderStore } from "@/store/useOrderStore";

export default function Dashboard() {
  const { fetchMetrics, dashboardMetrics, partnerAvailability, isLoading } =
    useMetricsStore();

  const { orders, fetchOrders } = useOrderStore();

  // Recent activity - get the most recent orders
  const recentActivity = useMemo(() => {
    return orders
      .filter((order) => order.status === "IN_PROGRESS")
      .sort(
        (a, b) =>
          new Date(b.scheduledFor).getTime() -
          new Date(a.scheduledFor).getTime()
      )
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        partnerName: "Assigned Partner", // placeholder
        assignedTime: order.scheduledFor,
      }));
  }, [orders]);

  useEffect(() => {
    fetchMetrics();
    fetchOrders();
  }, [fetchMetrics, fetchOrders]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <CardSkeleton count={4} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Orders Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] bg-muted/30 flex items-center justify-center">
              <p className="text-muted-foreground">Map Loading...</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Partner Availability</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] bg-muted/30" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Partners"
          value={dashboardMetrics?.totalPartners || 0}
          icon={<Users className="h-4 w-4" />}
          description="Active delivery partners"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Orders Today"
          value={dashboardMetrics.totalOrders}
          icon={<Package className="h-4 w-4" />}
          description="Total orders received today"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Success Rate"
          value={`${dashboardMetrics.successRate}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Order completion rate"
          trend={{ value: 3, isPositive: true }}
        />
        <MetricCard
          title="Pending Orders"
          value={dashboardMetrics.pendingOrders}
          icon={<Clock className="h-4 w-4" />}
          description="Orders awaiting assignment"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Orders Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] bg-muted/30 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Map visualization would appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Partner Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {partnerAvailability.available}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Active</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {partnerAvailability.busy}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Inactive
                </div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-gray-500">
                  {partnerAvailability.offline}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Suspended
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-sm font-medium">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge status={activity.status} />
                      <div>
                        <div className="text-sm font-medium">
                          Order #{activity.orderNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Assigned to {activity.partnerName}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.assignedTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
