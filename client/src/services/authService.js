const API_URL = 'https://merncraft.onrender.com.';

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');
  return data;
};

const register = async (name, email, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Logout failed');
  return data;
};

const checkAuth = async () => {
  const response = await fetch(`${API_URL}/me`, {
    credentials: 'include'
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Authentication failed');
  }
  return data;
};

const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/forgotpassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

const resetPassword = async (token, password) => {
  const response = await fetch(`${API_URL}/resetpassword/${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

const getMe = async () => {
  const response = await fetch(`${API_URL}/me`, {
    credentials: 'include'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to get user');
  return data;
};

const authService = {
  login,
  register,
  logout,
  getMe,
  checkAuth,
  forgotPassword,
  resetPassword,
};

export default authService;
