// Shared Types for SaleManager Frontend

// Customer
export interface Customer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCreate {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
}

// Lead
export interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source: 'website' | 'referral' | 'event' | 'cold_call' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export interface LeadCreate {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
}

// Opportunity
export interface Opportunity {
  id: string;
  customerId?: string;
  leadId?: string;
  title: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string; company?: string };
  lead?: { id: string; name: string; company?: string };
}

export interface OpportunityCreate {
  title: string;
  customerId?: string | null;
  leadId?: string | null;
  stage?: string;
  value?: number;
  probability?: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  notes?: string;
}

// Activity
export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'other';
  customerId?: string;
  leadId?: string;
  opportunityId?: string;
  title: string;
  description?: string;
  activityDate: string;
  duration?: number;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string };
  lead?: { id: string; name: string };
  opportunity?: { id: string; title: string };
}

export interface ActivityCreate {
  type: string;
  title: string;
  customerId?: string | null;
  leadId?: string | null;
  opportunityId?: string | null;
  description?: string;
  activityDate: string;
  duration?: number | null;
  outcome?: string;
}

// Dashboard
export interface DashboardStats {
  customers: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  };
  opportunities: {
    total: number;
    byStage: Record<string, number>;
    totalValue: number;
    weightedValue: number;
  };
  activities: {
    total: number;
    thisWeek: number;
    byType: Record<string, number>;
  };
}

// API Response
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}
