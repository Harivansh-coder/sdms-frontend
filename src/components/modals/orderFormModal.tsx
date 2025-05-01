import type React from "react";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderStore } from "@/store/useOrderStore";
import { toast } from "sonner";
import type { Order } from "@/utils/types";

interface OrderFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
  mode: "add" | "edit" | "view";
}

const defaultOrder = {
  orderNumber: "",
  customerName: "",
  customerAddr: "",
  customerPhone: "",
  area: "",
  // items: [""],
  status: "PENDING",
  scheduledFor: new Date().toISOString().slice(0, 16),
  totalAmount: 0,
};

export function OrderFormModal({
  open,
  onOpenChange,
  order,
  mode,
}: OrderFormModalProps) {
  const { addOrder, updateOrder, isLoading } = useOrderStore();

  const [formData, setFormData] = useState(defaultOrder);

  useEffect(() => {
    if (order && (mode === "edit" || mode === "view")) {
      // Format the date for the datetime-local input
      const formattedOrder = {
        ...order,
        scheduledFor: new Date(order.scheduledFor).toISOString().slice(0, 16),
      };
      setFormData(formattedOrder);
    } else {
      setFormData(defaultOrder);
    }
  }, [order, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert the form data to the correct format
      const orderData = {
        ...formData,
        scheduledFor: new Date(formData.scheduledFor).toISOString(),
      };

      if (mode === "add") {
        await addOrder(orderData);
        toast("Order added", {
          description: "New order has been added successfully.",
        });
      } else if (mode === "edit" && order) {
        await updateOrder(order.id, orderData);
        toast("Order updated", {
          description: "Order has been updated successfully.",
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast(mode === "add" ? "Failed to add order" : "Failed to update order", {
        description: (error as Error).message,
      });
    }
  };

  const isViewOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add New Order"
              : mode === "edit"
              ? "Edit Order"
              : "Order Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new order to the system."
              : mode === "edit"
              ? "Edit the order information."
              : "View order details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderNumber" className="text-right">
                Order #
              </Label>
              <Input
                id="orderNumber"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly || mode === "edit"}
                placeholder="ORD-001"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right">
                Customer Name
              </Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerAddr" className="text-right">
                Address
              </Label>
              <Input
                id="customerAddr"
                name="customerAddr"
                value={formData.customerAddr}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerPhone" className="text-right">
                Phone
              </Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Area
              </Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
                disabled={isViewOnly}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduledFor" className="text-right">
                Scheduled Time
              </Label>
              <Input
                id="scheduledFor"
                name="scheduledFor"
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalAmount" className="text-right">
                Total Amount
              </Label>
              <Input
                id="totalAmount"
                name="totalAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="items" className="text-right">
                Items
              </Label>
              <Input
                id="items"
                name="items"
                type="text"
                placeholder="Item1, Item2, Item3"
                value={formData.items.join(", ")}
                onChange={(e) => {
                  const items = e.target.value
                    .split(",")
                    .map((item) => item.trim());
                  setFormData((prev) => ({ ...prev, items }));
                }}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div> */}
          </div>

          <DialogFooter>
            {!isViewOnly && (
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : mode === "add"
                  ? "Add Order"
                  : "Save Changes"}
              </Button>
            )}
            {isViewOnly && (
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
