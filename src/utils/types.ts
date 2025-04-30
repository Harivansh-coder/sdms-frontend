export type DeliveryPartner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "available" | "busy" | "offline";
  rating: number;
  area: string;
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
  status: "pending" | "in-progress" | "completed" | "failed";
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
  status: "pending" | "in-progress" | "completed" | "failed";
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
