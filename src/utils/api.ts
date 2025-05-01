import axios from "axios";
import {
  AssignmentRequest,
  AuthResponse,
  OrderRequest,
  Partner,
} from "./types";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },
  signin: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>("/auth/login", data);

    return response.data;
  },
};

export const partnerApi = {
  getAllPartners: async () => {
    const response = await api.get<Partner[]>("/partners");
    return response.data;
  },
  getPartnerById: async (id: string) => {
    const response = await api.get<Partner>(`/partners/${id}`);
    return response.data;
  },
  createPartner: async (content: Partner) => {
    const response = await api.post<Partner>("/partners", content);
    return response.data;
  },
  updatePartner: async (content: Partial<Partner>) => {
    const response = await api.put<Partner>(`/partners/${content.id}`, content);
    return response.data;
  },
  deletePartner: async (id: string) => {
    await api.delete(`/partners/${id}`);
  },
};

export const orderApi = {
  getAllOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (content: OrderRequest) => {
    const response = await api.post("/orders", content);
    return response.data;
  },
  updateOrder: async (content: Partial<OrderRequest>) => {
    const response = await api.put(`/orders/${content.id}`, content);
    return response.data;
  },
  deleteOrder: async (id: string) => {
    await api.delete(`/orders/${id}`);
  },
};

export const assignmentApi = {
  getAllAssignments: async () => {
    const response = await api.get("/assignments");
    return response.data;
  },
  getAssignmentById: async (id: string) => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },
  createAssignment: async (content: AssignmentRequest) => {
    const response = await api.post("/assignments", content);
    return response.data;
  },
  updateAssignment: async (content: Partial<AssignmentRequest>) => {
    const response = await api.put(`/assignments/${content.id}`, content);
    return response.data;
  },
  deleteAssignment: async (id: string) => {
    await api.delete(`/assignments/${id}`);
  },
};

export default api;
