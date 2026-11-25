import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import {
  getActiveAuth,
  saveAuthForRole,
  clearAuthForRole,
  getAuthForRole,
  getRoleFromPath,
} from '@/utils/authStorage';

// Load initial auth state based on the current URL path or active role
const loadAuthState = () => {
  try {
    const { token, user } = getActiveAuth();
    if (token && user) {
      return {
        user,
        accessToken: token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (e) {
    console.error('Failed to initialize auth state:', e);
  }
  return { user: null, accessToken: null, isAuthenticated: false, loading: false, error: null };
};

const initialState = loadAuthState();

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(
          'Unable to reach the server. Check your internet connection and app server configuration, then try again.'
        );
      }
      return rejectWithValue(error.response.data?.message || 'Sign in failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (e) {
    console.warn('Logout API call failed, continuing client cleanup:', e);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    // Synchronize Redux active session to match the current portal role
    syncAuthRole: (state, action) => {
      const role = action.payload || getRoleFromPath(window.location.pathname);
      if (!role) return;
      const roleAuth = getAuthForRole(role);
      if (roleAuth) {
        state.user = roleAuth.user;
        state.accessToken = roleAuth.token;
        state.isAuthenticated = true;
      }
    },
    updateLocalUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      saveAuthForRole(state.user, state.accessToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        saveAuthForRole(action.payload.user, action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;

        saveAuthForRole(action.payload.user, action.payload.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        const currentRole = state.user?.role || getRoleFromPath(window.location.pathname);
        if (currentRole) {
          clearAuthForRole(currentRole);
        } else {
          clearAuthForRole('customer');
          clearAuthForRole('provider');
          clearAuthForRole('admin');
        }

        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError, updateLocalUser, syncAuthRole } = authSlice.actions;
export default authSlice.reducer;
