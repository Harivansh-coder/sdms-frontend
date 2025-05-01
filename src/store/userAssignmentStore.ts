import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type { Assignment } from "../utils/types";

interface UserAssignmentState {
  assignments: Assignment[];
  isLoading: boolean;
  error: string | null;
  selectedAssignment: Assignment | null;

  // Actions
  fetchAssignments: () => Promise<void>;

  getAssignment: (id: string) => Promise<void>;
  setSelectedAssignment: (assignment: Assignment | null) => void;
}

export const useUserAssignmentStore = create<UserAssignmentState>()(
  devtools(
    persist(
      (set) => ({
        assignments: [],
        isLoading: false,
        error: null,
        selectedAssignment: null,

        fetchAssignments: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/assignments`
            );
            if (!response.ok) throw new Error("Failed to fetch assignments");
            const data = await response.json();
            set({ assignments: data, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching assignments:", error);
          }
        },
        getAssignment: async (id) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/assignments/${id}`
            );
            if (!response.ok) throw new Error("Failed to fetch assignment");
            const data = await response.json();
            set({ selectedAssignment: data, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching assignment:", error);
          }
        },
        setSelectedAssignment: (assignment) => {
          set({ selectedAssignment: assignment });
        },
      }),
      {
        name: "user-assignment-storage", // unique name
        partialize: (state) => ({
          assignments: state.assignments,
        }),
      }
    )
  )
);
export default useUserAssignmentStore;
