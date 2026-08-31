import authService from './authService';

const API_URL = `${import.meta.env.VITE_API_URL}/admin/dashboard`;

const getStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch dashboard stats');
  return data;
};

const dashboardService = {
  getStats,
};

export default dashboardService;
