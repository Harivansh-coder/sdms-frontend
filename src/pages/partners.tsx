import { useState, useEffect } from "react";
import { Users, Star, MapPin, Search, Edit, Trash, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { MetricCard } from "@/components/metric-card";
import { CardSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { mockPartners, mockPartnersMetrics } from "@/utils/mock_data";
import type { DeliveryPartner } from "@/utils/types";

export default function PartnersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<DeliveryPartner[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setPartners(mockPartners);
      setFilteredPartners(mockPartners);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter partners based on search query and status filter
    let filtered = [...partners];

    if (searchQuery) {
      filtered = filtered.filter(
        (partner) =>
          partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          partner.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((partner) => partner.status === statusFilter);
    }

    setFilteredPartners(filtered);
  }, [partners, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <CardSkeleton count={3} />
        <div className="rounded-lg border">
          <div className="p-4">
            <TableSkeleton rows={5} columns={6} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Active Partners"
          value={mockPartnersMetrics.totalActive}
          icon={<Users className="h-4 w-4" />}
          description="Total active delivery partners"
        />
        <MetricCard
          title="Average Rating"
          value={mockPartnersMetrics.avgRating}
          icon={<Star className="h-4 w-4" />}
          description="Average partner rating"
        />
        <MetricCard
          title="Top Service Areas"
          value={mockPartnersMetrics.topAreas.length}
          icon={<MapPin className="h-4 w-4" />}
          description={mockPartnersMetrics.topAreas.join(", ")}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search partners..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </div>
          </div>

          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Shift Time</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No partners found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        <div>{partner.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {partner.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={partner.status} />
                      </TableCell>
                      <TableCell>{partner.area}</TableCell>
                      <TableCell>
                        {partner.shiftStart} - {partner.shiftEnd}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{partner.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
