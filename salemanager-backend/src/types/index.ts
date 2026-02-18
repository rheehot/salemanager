// Shared Types for SaleManager Backend

// Customer Status
export const CustomerStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];

// Lead Source
export const LeadSource = {
  WEBSITE: 'website',
  REFERRAL: 'referral',
  EVENT: 'event',
  COLD_CALL: 'cold_call',
  OTHER: 'other',
} as const;

export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

// Lead Status
export const LeadStatus = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
} as const;

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

// Opportunity Stage
export const OpportunityStage = {
  PROSPECTING: 'prospecting',
  QUALIFICATION: 'qualification',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
} as const;

export type OpportunityStage = (typeof OpportunityStage)[keyof typeof OpportunityStage];

// Activity Type
export const ActivityType = {
  EMAIL: 'email',
  CALL: 'call',
  MEETING: 'meeting',
  NOTE: 'note',
  OTHER: 'other',
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    timestamp?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}
