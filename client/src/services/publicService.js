const API_URL = `${import.meta.env.VITE_API_URL}/public`;

export const getPublicServices = async () => {
  const response = await fetch(`${API_URL}/services`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch services');
  return data;
};

export const getPublicProjects = async () => {
  const response = await fetch(`${API_URL}/projects`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch projects');
  return data;
};

export const getPublicPricing = async () => {
  const response = await fetch(`${API_URL}/pricing`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch pricing');
  return data;
};

export const getPublicTestimonials = async () => {
  const response = await fetch(`${API_URL}/testimonials`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch testimonials');
  return data;
};

const publicService = {
  getPublicServices,
  getPublicProjects,
  getPublicPricing,
  getPublicTestimonials,
};

export default publicService;
