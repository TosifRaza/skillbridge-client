import axios from 'axios';
import {
  getActiveAuth,
  saveAuthForRole,
  clearAuthForRole,
  getRoleFromPath,
} from '@/utils/authStorage';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = getActiveAuth();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axiosInstance.post('/auth/refresh');
        const newAccessToken = response.data.data.accessToken;

        const { user } = getActiveAuth();
        if (user) {
          saveAuthForRole(user, newAccessToken);
        } else {
          localStorage.setItem('accessToken', newAccessToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const role = getRoleFromPath(typeof window !== 'undefined' ? window.location.pathname : '');
        if (role) {
          clearAuthForRole(role);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('skillbridge_user');
        }
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
