import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Load initial auth state from localStorage safely
const loadAuthState = () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('skillbridge_user');
    if (accessToken && user) {
      return {
        user: JSON.parse(user),
        accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (e) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('skillbridge_user');
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
      return rejectWithValue(error.response?.data?.message || 'Login failed');
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
  await axiosInstance.post('/auth/logout');
});
// export const { clearAuthError, updateLocalUser } = authSlice.actions;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => { state.error = null; },
    // Add this reducer to update the user in real-time after profile edits
  // updateLocalUser: (state, action) => {
  //   state.user = action.payload;
  //   localStorage.setItem('skillbridge_user', JSON.stringify(action.payload));
  // },
   // Add this reducer to update the user in real-time after profile edits
  updateLocalUser: (state, action) => {
    // Merge the updated fields into the existing user state
    state.user = { ...state.user, ...action.payload };
    // Update localStorage so it persists on refresh
    localStorage.setItem('skillbridge_user', JSON.stringify(state.user));
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('skillbridge_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('skillbridge_user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('skillbridge_user');
      });
  },
});

// export const { clearAuthError } = authSlice.actions;
export const { clearAuthError, updateLocalUser } = authSlice.actions;
export default authSlice.reducer;