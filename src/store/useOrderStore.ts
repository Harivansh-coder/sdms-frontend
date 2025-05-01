import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Order } from "@/utils/types";
import { BASE_URL } from "@/utils/api";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  selectedOrder: Order | null;

  // Actions
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrder: (id: string) => Promise<void>;
  setSelectedOrder: (order: Order | null) => void;
  assignPartner: (orderId: string, partnerId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  devtools(
    persist(
      (set) => ({
        orders: [],
        isLoading: false,
        error: null,
        selectedOrder: null,

        fetchOrders: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/orders`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();
            set({ orders: data, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching orders:", error);
          }
        },

        addOrder: async (order) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(order),
            });
            if (!response.ok) throw new Error("Failed to add order");
            const newOrder = await response.json();
            set((state) => ({
              orders: [...state.orders, newOrder],
              isLoading: false,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error adding order:", error);
          }
        },

        updateOrder: async (id, order) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/orders/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(order),
            });
            if (!response.ok) throw new Error("Failed to update order");
            const updatedOrder = await response.json();
            set((state) => ({
              orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
              isLoading: false,
              selectedOrder: updatedOrder,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error updating order:", error);
          }
        },

        deleteOrder: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/orders/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to delete order");
            set((state) => ({
              orders: state.orders.filter((o) => o.id !== id),
              isLoading: false,
              selectedOrder: null,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error deleting order:", error);
          }
        },

        getOrder: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/orders/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch order");
            const order = await response.json();
            set({ selectedOrder: order, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching order:", error);
          }
        },

        setSelectedOrder: (order) => {
          set({ selectedOrder: order });
        },

        assignPartner: async (orderId, partnerId) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/assignments/run`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                orderId,
                partnerId,
              }),
            });
            if (!response.ok)
              throw new Error("Failed to assign partner to order");
            const updatedOrder = await response.json();
            set((state) => ({
              orders: state.orders.map((o) =>
                o.id === orderId ? updatedOrder : o
              ),
              isLoading: false,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error assigning partner:", error);
          }
        },
      }),
      {
        name: "order-storage",
        partialize: (state) => ({ orders: state.orders }),
      }
    )
  )
);
