// Centralized API re-exports linking directly to real backend services
export * from '../services/api';
import { getDashboard, getFinances, getHyperlocal, getSchemes, postAdvisorMessage } from '../services/api';

export const getDashboardData = (businessId = 'biz-001') => getDashboard(businessId);
export const getFinancesData = (businessId = 'biz-001') => getFinances(businessId);
export const getHyperlocalData = (businessId = 'biz-001') => getHyperlocal(businessId);
export const getSchemesData = () => getSchemes();
export const chatWithAdvisor = (message: string, businessId = 'biz-001', lang = 'en') => 
  postAdvisorMessage(message, businessId, lang);
