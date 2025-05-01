// src/stores/metricsStore.ts
import { BASE_URL } from "@/utils/api";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AssignmentTrend {
  name: string;
  assignments: number;
}

interface AssignmentMetrics {
  totalAssigned: number;
  successRate: number;
  averageDeliveryTime: string;
  failureReasons: string[];
}

interface DashboardMetrics {
  totalPartners: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  successRate: number;
}

interface PartnerMetrics {
  totalActive: number;
  avgRating: number;
  topAreas: string[];
}

interface PartnerAvailability {
  available: number;
  busy: number;
  offline: number;
}

interface MetricsState {
  assignmentTrends: AssignmentTrend[];
  assignmentMetrics:
    | AssignmentMetrics
    | {
        totalAssigned: 0;
        successRate: 0;
        averageDeliveryTime: "0";
        failureReasons: [""];
      };
  dashboardMetrics:
    | DashboardMetrics
    | {
        totalPartners: 0;
        totalOrders: 0;
        successRate: 0;
        pendingOrders: 0;
        completedOrders: 0;
      };
  partnerMetrics:
    | PartnerMetrics
    | {
        totalActive: 0;
        avgRating: 0;
        topAreas: [""];
      };
  partnerAvailability:
    | PartnerAvailability
    | {
        available: number;
        busy: number;
        offline: number;
      };
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;

  fetchMetrics: () => Promise<void>;
  invalidateMetrics: () => void;
}

// 30 min cache duration
const CACHE_DURATION = 30 * 60 * 1000;

export const useMetricsStore = create<MetricsState>()(
  devtools((set, get) => ({
    assignmentTrends: [],
    assignmentMetrics: {
      totalAssigned: 0,
      successRate: 0,
      averageDeliveryTime: "0",
      failureReasons: [""],
    },
    dashboardMetrics: {
      totalPartners: 0,
      totalOrders: 0,
      successRate: 0,
      pendingOrders: 0,
      completedOrders: 0,
    },
    partnerMetrics: {
      totalActive: 0,
      avgRating: 0,
      topAreas: [""],
    },
    partnerAvailability: {
      available: 0,
      busy: 0,
      offline: 0,
    },
    lastUpdated: null,
    isLoading: false,
    error: null,

    fetchMetrics: async () => {
      const now = new Date();
      const { lastUpdated } = get();

      if (
        lastUpdated &&
        now.getTime() - lastUpdated.getTime() < CACHE_DURATION
      ) {
        return; // Return cached
      }

      set({ isLoading: true, error: null });

      try {
        const response = await fetch(`${BASE_URL}/assignments/metrics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch metrics");

        const result = await response.json();
        const data = result.data;

        set({
          assignmentTrends: data.assignmentTrends,
          assignmentMetrics: data.assignmentMetrics,
          partnerMetrics: data.partnersMetrics,
          dashboardMetrics: data.dashboardMetrics,
          partnerAvailability: data.partnerAvailability,
          lastUpdated: new Date(),
          isLoading: false,
        });
      } catch (err) {
        set({ error: (err as Error).message, isLoading: false });
      }
    },

    invalidateMetrics: () => {
      set({ lastUpdated: null });
    },
  }))
);
