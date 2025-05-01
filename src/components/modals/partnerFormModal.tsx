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
import { usePartnerStore } from "@/store/usePartnerStore";
import { toast } from "sonner";
import type { DeliveryPartner } from "@/utils/types";

interface PartnerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner?: DeliveryPartner | null;
  mode: "add" | "edit" | "view";
}

const defaultPartner = {
  name: "",
  email: "",
  phone: "",
  status: "ACTIVE",
  areas: [""],
  shiftStart: "00:00",
  shiftEnd: "00:00",
  rating: 5.0,
  totalDeliveries: 0,
  successRate: 100,
};

export function PartnerFormModal({
  open,
  onOpenChange,
  partner,
  mode,
}: PartnerFormModalProps) {
  const { addPartner, updatePartner, isLoading } = usePartnerStore();

  const [formData, setFormData] = useState(defaultPartner);

  useEffect(() => {
    if (partner && (mode === "edit" || mode === "view")) {
      const shiftStartTime = new Date(partner.shiftStart)
        .toISOString()
        .substring(11, 16); // HH:MM
      const shiftEndTime = new Date(partner.shiftEnd)
        .toISOString()
        .substring(11, 16);

      setFormData({
        ...partner,
        shiftStart: shiftStartTime,
        shiftEnd: shiftEndTime,
      });
    } else {
      setFormData(defaultPartner);
    }
  }, [partner, mode, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create ISO string using a fixed reference date
      const shiftStartISO = new Date(
        `1970-01-01T${formData.shiftStart}:00Z`
      ).toISOString();
      const shiftEndISO = new Date(
        `1970-01-01T${formData.shiftEnd}:00Z`
      ).toISOString();

      const newFormData = {
        ...formData,
        shiftStart: shiftStartISO,
        shiftEnd: shiftEndISO,
      };

      if (mode === "add") {
        await addPartner(newFormData);
        toast("Partner added", {
          description: "New delivery partner has been added successfully.",
        });
      } else if (mode === "edit" && partner) {
        await updatePartner(partner.id, newFormData);
        toast("Partner updated", {
          description: "Delivery partner has been updated successfully.",
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error:", error);
      toast(
        mode === "add" ? "Failed to add partner" : "Failed to update partner",
        {
          description: (error as Error).message,
        }
      );
    }
  };

  const isViewOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "Add New Partner"
              : mode === "edit"
              ? "Edit Partner"
              : "Partner Details"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new delivery partner to the system."
              : mode === "edit"
              ? "Edit the delivery partner information."
              : "View delivery partner details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                required
                value={formData.phone}
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
                required
                onValueChange={(value) => handleSelectChange("status", value)}
                disabled={isViewOnly}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Service Area
              </Label>
              <Input
                id="areas"
                name="areas"
                value={formData.areas}
                onChange={(e) => {
                  const value = e.target.value
                    .split(",")
                    .map((area) => area.trim());
                  setFormData((prev) => ({ ...prev, areas: value }));
                }}
                placeholder="e.g. Area 1, Area 2, Area 3"
                className="col-span-3"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftStart" className="text-right">
                Shift Start
              </Label>
              <input
                type="time"
                id="shiftStart"
                name="shiftStart"
                required
                value={formData.shiftStart}
                onChange={(e) => handleTimeChange("shiftStart", e.target.value)}
                className="col-span-3 border border-gray-300 rounded-md p-2"
                disabled={isViewOnly}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shiftEnd" className="text-right">
                Shift End
              </Label>
              <input
                type="time"
                id="shiftEnd"
                name="shiftEnd"
                required
                value={formData.shiftEnd}
                onChange={(e) => handleTimeChange("shiftEnd", e.target.value)}
                className="col-span-3 border border-gray-300 rounded-md p-2"
                disabled={isViewOnly}
              />
            </div>

            {(mode === "edit" || mode === "view") && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    required
                    placeholder="1-5"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className="col-span-3"
                    disabled={isViewOnly}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalDeliveries" className="text-right">
                    Total Deliveries
                  </Label>
                  <Input
                    id="totalDeliveries"
                    name="totalDeliveries"
                    type="number"
                    value={formData.totalDeliveries}
                    onChange={handleChange}
                    className="col-span-3"
                    disabled={isViewOnly}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="successRate" className="text-right">
                    Success Rate (%)
                  </Label>
                  <Input
                    id="successRate"
                    name="successRate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.successRate}
                    onChange={handleChange}
                    className="col-span-3"
                    disabled={isViewOnly}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {!isViewOnly && (
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : mode === "add"
                  ? "Add Partner"
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
