import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { DeliveryPartner } from "@/utils/types";
import { BASE_URL } from "@/utils/api";

interface PartnerState {
  partners: DeliveryPartner[];
  isLoading: boolean;
  error: string | null;
  selectedPartner: DeliveryPartner | null;

  // Actions
  fetchPartners: () => Promise<void>;
  addPartner: (partner: Omit<DeliveryPartner, "id">) => Promise<void>;
  updatePartner: (
    id: string,
    partner: Partial<DeliveryPartner>
  ) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  getPartner: (id: string) => Promise<void>;
  setSelectedPartner: (partner: DeliveryPartner | null) => void;
}

export const usePartnerStore = create<PartnerState>()(
  devtools(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (set) => ({
        partners: [],
        isLoading: false,
        error: null,
        selectedPartner: null,

        fetchPartners: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/partners`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch partners");
            const data = await response.json();
            set({ partners: data, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching partners:", error);
          }
        },

        addPartner: async (partner) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/partners`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(partner),
            });
            if (!response.ok) throw new Error("Failed to add partner");
            const newPartner = await response.json();
            set((state) => ({
              partners: [...state.partners, newPartner],
              isLoading: false,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error adding partner:", error);
          }
        },

        updatePartner: async (id, partner) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/partners/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(partner),
            });
            if (!response.ok) throw new Error("Failed to update partner");
            const updatedPartner = await response.json();
            set((state) => ({
              partners: state.partners.map((p) =>
                p.id === id ? updatedPartner : p
              ),
              isLoading: false,
              selectedPartner: updatedPartner,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error updating partner:", error);
          }
        },

        deletePartner: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/partners/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to delete partner");
            set((state) => ({
              partners: state.partners.filter((p) => p.id !== id),
              isLoading: false,
              selectedPartner: null,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error deleting partner:", error);
          }
        },

        getPartner: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/partners/${id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch partner");
            const partner = await response.json();
            set({ selectedPartner: partner, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching partner:", error);
          }
        },

        setSelectedPartner: (partner) => {
          set({ selectedPartner: partner });
        },
      }),
      {
        name: "partner-storage",
        partialize: (state) => ({ partners: state.partners }),
      }
    )
  )
);
