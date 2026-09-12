import axios from 'axios';
import type {
  Business,
  DashboardData,
  FinancialSummary,
  LoanAffordabilityRequest,
  LoanAffordabilityResult,
  CashFlowData,
  InventoryItem,
  InventoryItemInput,
  HyperlocalData,
  AdvisorResponse,
  AIInsight,
  FinancingData,
  GovernmentScheme,
  ReportData,
  ApiResponse,
} from '../types';

// Centralized Axios client connecting directly to real backend API
const api = axios.create({
  baseURL: '/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('[API Error]', message);
    return Promise.reject(new Error(message));
  }
);

// ---- Business ----
export const getBusiness = async (id: string): Promise<Business> => {
  const { data } = await api.get<ApiResponse<Business>>(`/business/${id}`);
  return data.data;
};

export const updateBusiness = async (id: string, updates: Partial<Business>): Promise<Business> => {
  const { data } = await api.put<ApiResponse<Business>>(`/business/${id}`, updates);
  return data.data;
};

// ---- Dashboard ----
export const getDashboard = async (businessId: string): Promise<DashboardData> => {
  const { data } = await api.get<ApiResponse<DashboardData>>(`/dashboard/${businessId}`);
  return data.data;
};

export const completePriority = async (priorityId: string): Promise<void> => {
  await api.patch(`/dashboard/priorities/${priorityId}/complete`);
};

// ---- Finances ----
export const getFinances = async (businessId: string): Promise<FinancialSummary> => {
  const { data } = await api.get<ApiResponse<FinancialSummary>>(`/finance/${businessId}`);
  return data.data;
};

export const calculateLoanAffordability = async (
  params: LoanAffordabilityRequest
): Promise<LoanAffordabilityResult> => {
  const { data } = await api.post<ApiResponse<LoanAffordabilityResult>>('/finance/loan-affordability', params);
  return data.data;
};

// ---- Cash Flow ----
export const getCashFlow = async (businessId: string): Promise<CashFlowData> => {
  const { data } = await api.get<ApiResponse<CashFlowData>>(`/cashflow/${businessId}`);
  return data.data;
};

// ---- Inventory ----
export const getInventory = async (businessId: string): Promise<InventoryItem[]> => {
  const { data } = await api.get<ApiResponse<InventoryItem[]>>(`/inventory/${businessId}`);
  return data.data;
};

export const addInventoryItem = async (
  businessId: string,
  item: InventoryItemInput
): Promise<InventoryItem> => {
  const { data } = await api.post<ApiResponse<InventoryItem>>(`/inventory/${businessId}`, item);
  return data.data;
};

export const updateInventoryItem = async (
  itemId: string,
  updates: Partial<InventoryItemInput>
): Promise<InventoryItem> => {
  const { data } = await api.put<ApiResponse<InventoryItem>>(`/inventory/item/${itemId}`, updates);
  return data.data;
};

export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  await api.delete(`/inventory/item/${itemId}`);
};

// ---- Hyperlocal ----
export const getHyperlocal = async (businessId: string): Promise<HyperlocalData> => {
  const { data } = await api.get<ApiResponse<HyperlocalData>>(`/hyperlocal/${businessId}`);
  return data.data;
};

// ---- AI Advisor ----
export const postAdvisorMessage = async (
  message: string,
  businessId: string,
  lang: string = 'en'
): Promise<AdvisorResponse> => {
  const { data } = await api.post<ApiResponse<AdvisorResponse>>('/ai/advisor', {
    message,
    businessId,
    lang,
  });
  return data.data;
};

export const getInsights = async (businessId: string): Promise<AIInsight[]> => {
  const { data } = await api.get<ApiResponse<AIInsight[]>>(`/ai/insights/${businessId}`);
  return data.data;
};

// ---- Financing ----
export const getFinancing = async (businessId: string): Promise<FinancingData> => {
  const { data } = await api.get<ApiResponse<FinancingData>>(`/financing/${businessId}`);
  return data.data;
};

export const submitLoanApplication = async (
  productId: string,
  applicationData: Record<string, unknown>
): Promise<{ applicationId: string; status: string }> => {
  const { data } = await api.post<ApiResponse<{ applicationId: string; status: string }>>(
    `/financing/apply/${productId}`,
    applicationData
  );
  return data.data;
};

// ---- Government Schemes ----
export const getSchemes = async (filters?: {
  category?: string;
  search?: string;
}): Promise<GovernmentScheme[]> => {
  const { data } = await api.get<ApiResponse<GovernmentScheme[]>>('/schemes', { params: filters });
  return data.data;
};

// ---- Reports ----
export const getReports = async (
  businessId: string,
  range?: string
): Promise<ReportData> => {
  const { data } = await api.get<ApiResponse<ReportData>>(`/reports/${businessId}`, {
    params: { range },
  });
  return data.data;
};

export default api;
