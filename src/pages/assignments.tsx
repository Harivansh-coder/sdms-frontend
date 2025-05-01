import { useState, useEffect } from "react";
import { Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { CardSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockAssignments,
  mockAssignmentMetrics,
  mockPartnerAvailability,
} from "@/utils/mock_data";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

export default function AssignmentsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const ChartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <CardSkeleton count={3} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] bg-muted/30" />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Failure Reasons</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] bg-muted/30" />
          </Card>
        </div>
        <Card>
          <CardContent className="p-6">
            <TableSkeleton rows={5} columns={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format data for charts
  const failureData = mockAssignmentMetrics.failureReasons.map((item) => ({
    name: item.reason,
    value: item.count,
  }));

  // Line chart data for assignment trends (mock data)
  const assignmentTrends = [
    { name: "Mon", assignments: 24 },
    { name: "Tue", assignments: 32 },
    { name: "Wed", assignments: 28 },
    { name: "Thu", assignments: 36 },
    { name: "Fri", assignments: 42 },
    { name: "Sat", assignments: 38 },
    { name: "Sun", assignments: 30 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Available Partners"
          value={mockPartnerAvailability.available}
          icon={<Users className="h-4 w-4" />}
          description="Partners ready for assignment"
          className="border-l-4 border-l-green-500"
        />
        <MetricCard
          title="Busy Partners"
          value={mockPartnerAvailability.busy}
          icon={<Clock className="h-4 w-4" />}
          description="Partners currently on delivery"
          className="border-l-4 border-l-orange-500"
        />
        <MetricCard
          title="Offline Partners"
          value={mockPartnerAvailability.offline}
          icon={<Users className="h-4 w-4" />}
          description="Partners not available"
          className="border-l-4 border-l-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold">
                  {mockAssignmentMetrics.totalAssigned}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Total Assigned
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold text-green-500">
                  {mockAssignmentMetrics.successRate}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold">
                  {mockAssignmentMetrics.averageDeliveryTime}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Avg. Delivery Time
                </div>
              </div>
            </div>

            <div className="h-[200px] ">
              <ChartContainer
                className="h-full"
                config={ChartConfig}
                title="Assignment Trends"
              >
                <LineChart
                  accessibilityLayer
                  data={assignmentTrends}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="assignments"
                    type="linear"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Failure Reasons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ChartContainer
                className="h-full"
                config={ChartConfig}
                title="Failure Reasons"
              >
                <BarChart accessibilityLayer data={failureData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 10)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar dataKey="value" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Time</TableHead>
                <TableHead>Est. Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.orderNumber}
                  </TableCell>
                  <TableCell>{assignment.partnerName}</TableCell>
                  <TableCell>
                    <StatusBadge status={assignment.status} />
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.assignedTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      assignment.estimatedDeliveryTime
                    ).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
