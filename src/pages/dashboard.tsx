import { useState, useEffect } from "react";
import { Users, Package, CheckCircle, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { CardSkeleton } from "@/components/ui/skeleton";
import {
  // mockPartners,
  // orders,
  // assignments,
  mockPartnerAvailability,
} from "@/utils/mock_data";
import { assignmentApi, orderApi, partnerApi } from "@/utils/api";
import { Assignment, Order, Partner } from "@/utils/types";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    Promise.all([
      partnerApi.getAllPartners(),
      orderApi.getAllOrders(),
      assignmentApi.getAllAssignments(),
    ])
      .then(([partnersResponse, ordersResponse, assignmentsResponse]) => {
        setPartners(partnersResponse);
        setOrders(ordersResponse);
        setAssignments(assignmentsResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setIsLoading(false);
  }, []);

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

  // Calculate metrics
  const totalPartners = partners.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;
  const successRate = Math.round((completedOrders / totalOrders) * 100);

  // Recent activity
  const recentActivity = assignments
    .sort(
      (a, b) =>
        new Date(b.assignedTime).getTime() - new Date(a.assignedTime).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Partners"
          value={totalPartners}
          icon={<Users className="h-4 w-4" />}
          description="Active delivery partners"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Orders Today"
          value={totalOrders}
          icon={<Package className="h-4 w-4" />}
          description="Total orders received today"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={<CheckCircle className="h-4 w-4" />}
          description="Order completion rate"
          trend={{ value: 3, isPositive: true }}
        />
        <MetricCard
          title="Pending Orders"
          value={pendingOrders}
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
                  {mockPartnerAvailability.available}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Available
                </div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {mockPartnerAvailability.busy}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Busy</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-gray-500">
                  {mockPartnerAvailability.offline}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Offline
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
