const API_URL = 'http://localhost:5000/api/admin/quotes';

const getQuotes = async () => {
  const response = await fetch(API_URL, { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch quotes');
  return data;
};

const getQuote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { credentials: 'include' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch quote');
  return data;
};

const createQuote = async (quoteData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(quoteData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create quote');
  return data;
};

const updateQuote = async (id, updateData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updateData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update quote');
  return data;
};

const deleteQuote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete quote');
  return data;
};

const quoteService = {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
};

export default quoteService;
