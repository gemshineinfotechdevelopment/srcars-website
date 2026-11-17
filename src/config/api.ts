/**
 * API Configuration for Car Care Application
 * 
 * In Production (VPS / srcars.gemshine.tech):
 * - Uses relative '/api' or VITE_API_URL, which automatically routes through Nginx
 *   reverse proxy to Express backend listening on port 5030.
 * 
 * In Development (Localhost):
 * - Uses 'http://localhost:5000/api' or Vite proxy.
 */

export const API_BASE_URL: string = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const API_ENDPOINTS = {
  services: `${API_BASE_URL}/services`,
  settings: `${API_BASE_URL}/settings`,
  bookings: `${API_BASE_URL}/bookings`,
  customers: `${API_BASE_URL}/customers`,
  health: `${API_BASE_URL}/health`,
};
