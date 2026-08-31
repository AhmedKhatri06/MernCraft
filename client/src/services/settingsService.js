const API_URL = `${import.meta.env.VITE_API_URL}/admin/settings`;

const getProfile = async () => {
  const response = await fetch(API_URL, { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data;
};

const updateProfile = async (profileData) => {
  const response = await fetch(API_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

const settingsService = { getProfile, updateProfile };
export default settingsService;
