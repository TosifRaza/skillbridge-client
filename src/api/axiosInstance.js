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

let refreshInFlight = null;

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

    // Share token refresh across simultaneous expired requests.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const activeAuth = getActiveAuth();
        if (!refreshInFlight) {
          refreshInFlight = axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: activeAuth.refreshToken,
          }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
            .finally(() => { refreshInFlight = null; });
        }
        const response = await refreshInFlight;
        const { accessToken: newAccessToken, refreshToken: rotatedRefreshToken } = response.data.data;

        const { user, refreshToken } = getActiveAuth();
        if (user) {
          saveAuthForRole(user, newAccessToken, rotatedRefreshToken || refreshToken);
        } else {
          localStorage.setItem('accessToken', newAccessToken);
          if (rotatedRefreshToken) localStorage.setItem('refreshToken', rotatedRefreshToken);
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('skillbridge:access-token', { detail: { accessToken: newAccessToken } }));
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Only invalid/revoked credentials require sign-in. Offline and server
        // errors preserve the saved session so the user can recover later.
        if ([401, 403].includes(refreshError.response?.status)) {
          const role = getRoleFromPath(typeof window !== 'undefined' ? window.location.pathname : '');
          if (role) {
            clearAuthForRole(role);
          } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('skillbridge_user');
          }
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
