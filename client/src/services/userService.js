const API_URL = 'https://merncraft.onrender.com/api/admin/users';

const getUsers = async (page = 1, limit = 10, search = '', role = '') => {
  let url = `${API_URL}?page=${page}&limit=${limit}`;
  if (search) url += `&search=${search}`;
  if (role) url += `&role=${role}`;

  const response = await fetch(url, { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
  return data;
};

const toggleStatus = async (id, active) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ active }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update user status');
  return data;
};

const userService = { getUsers, toggleStatus };
export default userService;
