import { BASE_URL } from "@/utils/api";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/auth/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              }
            );

            if (!response.ok) throw new Error("Login failed");

            const data = await response.json();
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: (error as Error).message,
              isLoading: false,
              isAuthenticated: false,
              user: null,
            });
            console.error("Login error:", error);
          }
        },

        logout: () => {
          set({ user: null, isAuthenticated: false });
        },

        fetchUserProfile: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/users/profile`
            );
            if (!response.ok) throw new Error("Failed to fetch user profile");
            const data = await response.json();
            set({ user: data, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error fetching user profile:", error);
          }
        },

        updateUserProfile: async (userData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`${BASE_URL}/auth/me`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error("Failed to update user profile");
            const updatedUser = await response.json();
            set((state) => ({
              user: { ...state.user, ...updatedUser } as User,
              isLoading: false,
            }));
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            console.error("Error updating user profile:", error);
          }
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
