const API_BASE = '/api';

export const getDashboardData = () => fetch(`${API_BASE}/dashboard`).then(res => res.json());
export const getFinancesData = () => fetch(`${API_BASE}/finances`).then(res => res.json());
export const getHyperlocalData = () => fetch(`${API_BASE}/hyperlocal`).then(res => res.json());
export const getSchemesData = () => fetch(`${API_BASE}/schemes`).then(res => res.json());
export const chatWithAdvisor = (message: string) => fetch(`${API_BASE}/advisor`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message })
}).then(res => res.json());
