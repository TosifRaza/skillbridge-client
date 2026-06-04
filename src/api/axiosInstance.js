// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // Required for HttpOnly refresh token cookies
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to attach Access Token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for global error handling & token refresh
// // axiosInstance.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     // If 401 and haven't retried yet, attempt token refresh
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         const response = await axiosInstance.post('/auth/refresh');
// //         const { accessToken } = response.data.data;
        
// //         localStorage.setItem('accessToken', accessToken);
// //         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
// //         return axiosInstance(originalRequest); // Retry original request
// //       } catch (refreshError) {
// //         // Refresh failed, force logout
// //         localStorage.removeItem('accessToken');
// //         window.location.href = '/auth/login';
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );


//               // UPDATED
// //  // Response Interceptor
// // instance.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     // 403 — User is blocked
// //     if (error.response?.status === 403) {
// //       localStorage.removeItem('accessToken');
// //       localStorage.removeItem('skillbridge_user');
// //       window.location.href = '/auth/login?blocked=true';
// //       return Promise.reject(error);
// //     }

// //     // 401 — Token expired, try refresh
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       try {
// //         const response = await instance.post('/auth/refresh-token');
// //         const newAccessToken = response.data.data.accessToken;

// //         localStorage.setItem('accessToken', newAccessToken);
// //         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

// //         return instance(originalRequest);
// //       } catch (refreshError) {
// //         // Refresh failed — logout
// //         localStorage.removeItem('accessToken');
// //         localStorage.removeItem('skillbridge_user');
// //         window.location.href = '/auth/login';
// //         return Promise.reject(refreshError);
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );



// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // User blocked
//     if (error.response?.status === 403) {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('skillbridge_user');

//       window.location.href = '/auth/login?blocked=true';

//       return Promise.reject(error);
//     }

//     // Access token expired
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const response = await axiosInstance.post('/auth/refresh-token');

//         const newAccessToken = response.data.data.accessToken;

//         localStorage.setItem('accessToken', newAccessToken);

//         originalRequest.headers.Authorization =
//           `Bearer ${newAccessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('skillbridge_user');

//         window.location.href = '/auth/login';

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
// export default axiosInstance;

import axios from 'axios';

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
    const token = localStorage.getItem('accessToken');

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

// Response interceptor for global error handling & token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // FIX: Ensure this is /auth/refresh (NOT /auth/refresh-token)
        const response = await axiosInstance.post('/auth/refresh');
        const newAccessToken = response.data.data.accessToken;
        
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        // Refresh failed — logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('skillbridge_user');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // ❌ USER BLOCKED
//     if (error.response?.status === 403) {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('skillbridge_user');

//       window.location.href = '/auth/login?blocked=true';
//       return Promise.reject(error);
//     }

//     // ❌ TOKEN EXPIRED → REFRESH
//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         // 🔥 IMPORTANT: match your backend route
//         const response = await axiosInstance.post('/auth/refresh');

//         const newAccessToken =
//           response.data.data?.accessToken ||
//           response.data.accessToken;

//         if (!newAccessToken) {
//           throw new Error('No access token returned');
//         }

//         localStorage.setItem('accessToken', newAccessToken);

//         originalRequest.headers.Authorization =
//           `Bearer ${newAccessToken}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // ❌ refresh failed → logout clean
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('skillbridge_user');

//         window.location.href = '/auth/login';

//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;