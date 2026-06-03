// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// const initialState = { profile: null, loading: false, error: null };

// export const fetchCurrentUser = createAsyncThunk(
//   'user/fetchCurrentUser',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/auth/me'); // Assuming an /auth/me route exists
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
//     }
//   }
// );

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: { clearUserProfile: (state) => { state.profile = null; } },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; })
//       .addCase(fetchCurrentUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//       })
//       .addCase(fetchCurrentUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default userSlice.reducer;








                                    // UPDATED
import { createSlice } from '@reduxjs/toolkit';

const initialState = { profile: null, loading: false, error: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;