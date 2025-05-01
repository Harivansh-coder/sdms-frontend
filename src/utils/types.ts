export type DeliveryPartner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  rating: number;
  areas: string;
  shiftStart: string;
  shiftEnd: string;
  totalDeliveries: number;
  successRate: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  area: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "CANCELLED" | "COMPLETED";
  scheduledTime: string;
  totalAmount: number;
  items: number;
  partnerId?: string;
};

export type Assignment = {
  id: string;
  orderId: string;
  orderNumber: string;
  partnerId: string;
  partnerName: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  assignedTime: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
};

export type AssignmentMetrics = {
  totalAssigned: number;
  successRate: number;
  averageDeliveryTime: string;
  failureReasons: {
    reason: string;
    count: number;
  }[];
};

export type PartnersPageProps = {
  partners: DeliveryPartner[];
  metrics: {
    totalActive: number;
    avgRating: number;
    topAreas: string[];
  };
};

export type OrdersPageProps = {
  orders: Order[];
  filters: {
    status: string[];
    areas: string[];
    date: string;
  };
};

export type AssignmentPageProps = {
  activeAssignments: Assignment[];
  metrics: AssignmentMetrics;
  partners: {
    available: number;
    busy: number;
    offline: number;
  };
};

export type AuthResponse = {
  status: string;
  message: string;
  data: {
    access_token: string;
  };
};

export type Partner = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  areas: string[];
  shiftStart: string;
  shiftEnd: string;
};

export type AssignmentRequest = {
  id?: string;
  orderId: string;
  partnerId: string;
};

export type OrderRequest = {
  id?: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  area: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "CANCELLED" | "COMPLETED";
  scheduledFor: string;
  totalAmount: number;
};
