const API_URL = `${import.meta.env.VITE_API_URL}/admin/leads`;

const getLeads = async (page = 1, limit = 10, search = '', status = '') => {
  let url = `${API_URL}?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  if (status) url += `&status=${status}`;

  const response = await fetch(url, { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch leads');
  return data;
};

const getLead = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch lead');
  return data;
};

const updateLead = async (id, updateData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update lead');
  return data;
};

const deleteLead = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete lead');
  return data;
};

const leadService = {
  getLeads,
  getLead,
  updateLead,
  deleteLead,
};

export default leadService;
