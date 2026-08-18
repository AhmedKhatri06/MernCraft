export const createGenericService = (endpoint) => {
  const API_URL = `http://localhost:5000/api/admin/${endpoint}`;

  return {
    getAll: async () => {
      const response = await fetch(API_URL, { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to fetch ${endpoint}`);
      return data;
    },
    getOne: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to fetch ${endpoint}`);
      return data;
    },
    create: async (body) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to create ${endpoint}`);
      return data;
    },
    update: async (id, body) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to update ${endpoint}`);
      return data;
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to delete ${endpoint}`);
      return data;
    }
  };
};
