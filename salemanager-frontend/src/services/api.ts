// API Services
import apiClient from '@/lib/api';
import type {
  Customer,
  CustomerCreate,
  Lead,
  LeadCreate,
  Opportunity,
  OpportunityCreate,
  Activity,
  ActivityCreate,
  DashboardStats,
  PaginationResponse,
} from '@/types';

// Customer Service
export const customerService = {
  getAll: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginationResponse<Customer>>('/customers', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Customer }>(`/customers/${id}`);
    return response.data.data;
  },
  create: async (data: CustomerCreate) => {
    const response = await apiClient.post<{ data: Customer }>('/customers', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<CustomerCreate>) => {
    const response = await apiClient.put<{ data: Customer }>(`/customers/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/customers/${id}`);
  },
};

// Lead Service
export const leadService = {
  getAll: async (params?: { search?: string; status?: string; source?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginationResponse<Lead>>('/leads', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Lead }>(`/leads/${id}`);
    return response.data.data;
  },
  create: async (data: LeadCreate) => {
    const response = await apiClient.post<{ data: Lead }>('/leads', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<LeadCreate>) => {
    const response = await apiClient.put<{ data: Lead }>(`/leads/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/leads/${id}`);
  },
  convertToCustomer: async (id: string) => {
    const response = await apiClient.put<{ customerId: string; message: string }>(`/leads/${id}/convert`);
    return response.data;
  },
};

// Opportunity Service
export const opportunityService = {
  getAll: async (params?: { stage?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get<PaginationResponse<Opportunity>>('/opportunities', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Opportunity }>(`/opportunities/${id}`);
    return response.data.data;
  },
  create: async (data: OpportunityCreate) => {
    const response = await apiClient.post<{ data: Opportunity }>('/opportunities', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<OpportunityCreate>) => {
    const response = await apiClient.put<{ data: Opportunity }>(`/opportunities/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/opportunities/${id}`);
  },
};

// Activity Service
export const activityService = {
  getAll: async (params?: {
    type?: string;
    customerId?: string;
    leadId?: string;
    opportunityId?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<PaginationResponse<Activity>>('/activities', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Activity }>(`/activities/${id}`);
    return response.data.data;
  },
  create: async (data: ActivityCreate) => {
    const response = await apiClient.post<{ data: Activity }>('/activities', data);
    return response.data.data;
  },
  update: async (id: string, data: Partial<ActivityCreate>) => {
    const response = await apiClient.put<{ data: Activity }>(`/activities/${id}`, data);
    return response.data.data;
  },
  delete: async (id: string) => {
    await apiClient.delete(`/activities/${id}`);
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
