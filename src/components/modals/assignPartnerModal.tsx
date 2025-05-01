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
import { useOrderStore } from "@/store/useOrderStore";
import { usePartnerStore } from "@/store/usePartnerStore";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Order, DeliveryPartner } from "@/utils/types";

interface AssignPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export function AssignPartnerModal({
  open,
  onOpenChange,
  order,
}: AssignPartnerModalProps) {
  const { assignPartner, isLoading } = useOrderStore();
  const { partners, fetchPartners } = usePartnerStore();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [availablePartners, setAvailablePartners] = useState<DeliveryPartner[]>(
    []
  );

  useEffect(() => {
    if (open) {
      fetchPartners();
    }
  }, [open, fetchPartners]);

  useEffect(() => {
    // Filter partners by availability and area match if possible
    const filtered = partners.filter(
      (partner) =>
        partner.status === "ACTIVE" &&
        (!order?.area || partner.areas.includes(order.area)) &&
        (!order?.partnerId || partner.id !== order.partnerId)
    );

    setAvailablePartners(filtered);

    // Reset selection when modal opens
    setSelectedPartnerId("");
  }, [partners, order, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!order || !selectedPartnerId) {
      toast("Error", {
        description: "Please select a delivery partner",
      });
      return;
    }

    try {
      await assignPartner(order.id, selectedPartnerId);
      toast("Partner assigned", {
        description:
          "Delivery partner has been assigned to the order successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast("Assignment failed", {
        description: (error as Error).message,
      });
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Assign Delivery Partner</DialogTitle>
          <DialogDescription>
            Assign a delivery partner to order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Order Information</h3>
              <div className="bg-muted/30 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Customer:</span>{" "}
                    {order.customerName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area:</span>{" "}
                    {order.area}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <StatusBadge status={order.status} />
                  </div>
                  <div>
                    <span className="text-muted-foreground">Items:</span>{" "}
                    {order.items}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Available Partners</h3>

              {availablePartners.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No available delivery partners found for this area.
                </div>
              ) : (
                <RadioGroup
                  value={selectedPartnerId}
                  onValueChange={setSelectedPartnerId}
                >
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {availablePartners.map((partner) => (
                      <div
                        key={partner.id}
                        className="flex items-center space-x-2 border rounded-md p-3"
                      >
                        <RadioGroupItem value={partner.id} id={partner.id} />
                        <Label
                          htmlFor={partner.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{partner.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {partner.areas}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">
                                Rating: {partner.rating}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Success: {partner.successRate}%
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading || !selectedPartnerId}>
              {isLoading ? "Assigning..." : "Assign Partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
