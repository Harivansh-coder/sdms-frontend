import { useState, useEffect } from "react";
import { Search, UserPlus, Plus, Eye, Edit, Trash } from "lucide-react";
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
import { TableSkeleton } from "@/components/ui/skeleton";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderFormModal } from "@/components/modals/orderFormModal";
import { AssignPartnerModal } from "@/components/modals/assignPartnerModal";
import { DeleteConfirmationModal } from "@/components/modals/deleteConfirmModal";
import type { Order } from "@/utils/types";

export default function OrdersPage() {
  const {
    orders,
    fetchOrders,
    deleteOrder,
    isLoading,
    setSelectedOrder,
    selectedOrder,
  } = useOrderStore();

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<"add" | "edit" | "view">(
    "add"
  );
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Get unique areas from orders
  const areas = [...new Set(orders.map((order) => order.area))];

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    // Filter orders based on search query, status filter, and area filter
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (areaFilter !== "all") {
      filtered = filtered.filter((order) => order.area === areaFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, areaFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setFormModalMode("add");
    setFormModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormModalMode("edit");
    setFormModalOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormModalMode("view");
    setFormModalOpen(true);
  };

  const handleAssignPartner = (order: Order) => {
    setSelectedOrder(order);
    setAssignModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      await deleteOrder(orderToDelete.id);
      setDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <TableSkeleton rows={5} columns={6} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Date
              </Button> */}

              <Button onClick={handleAddOrder}>
                <Plus className="mr-2 h-4 w-4" />
                Add Order
              </Button>
            </div>
          </div>

          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>{order.customerName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {order.customerAddr}
                        </div>
                      </TableCell>
                      <TableCell>{order.area}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>{formatDate(order.scheduledFor)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(order)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={order.status !== "pending"}
                            onClick={() => handleAssignPartner(order)}
                          >
                            <UserPlus className="mr-2 h-3 w-3" />
                            Assign
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

      <OrderFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        order={selectedOrder}
        mode={formModalMode}
      />

      <AssignPartnerModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        order={selectedOrder}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Order"
        description={`Are you sure you want to delete order #${orderToDelete?.orderNumber}? This action cannot be undone.`}
        isLoading={isLoading}
      />
    </div>
  );
}
