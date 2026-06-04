// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// // Async Thunks
// export const fetchWorkerProfile = createAsyncThunk(
//   'customer/fetchWorkerProfile',
//   async (workerId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/users/${workerId}/profile`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch worker profile');
//     }
//   }
// );

// export const updateCustomerProfile = createAsyncThunk(
//   'customer/updateProfile',
//   async (profileData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.patch('/users/me', profileData);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
//     }
//   }
// );

// export const uploadProfilePhoto = createAsyncThunk(
//   'customer/uploadPhoto',
//   async (file, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       const response = await axiosInstance.patch('/users/me/photo', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to upload photo');
//     }
//   }
// );

// const customerSlice = createSlice({
//   name: 'customer',
//   initialState: {
//     viewedWorker: null,
//     profileUpdateLoading: false,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearViewedWorker: (state) => {
//       state.viewedWorker = null;
//     },
//     clearCustomerError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWorkerProfile.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(fetchWorkerProfile.fulfilled, (state, action) => { state.loading = false; state.viewedWorker = action.payload; })
//       .addCase(fetchWorkerProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
//       .addCase(updateCustomerProfile.pending, (state) => { state.profileUpdateLoading = true; })
//       .addCase(updateCustomerProfile.fulfilled, (state) => { state.profileUpdateLoading = false; })
//       .addCase(updateCustomerProfile.rejected, (state, action) => { state.profileUpdateLoading = false; state.error = action.payload; })
//       .addCase(uploadProfilePhoto.pending, (state) => { state.profileUpdateLoading = true; })
//       .addCase(uploadProfilePhoto.fulfilled, (state) => { state.profileUpdateLoading = false; })
//       .addCase(uploadProfilePhoto.rejected, (state, action) => { state.profileUpdateLoading = false; state.error = action.payload; });
//   },
// });

// export const { clearViewedWorker, clearCustomerError } = customerSlice.actions;
// export default customerSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

export const fetchWorkerProfile = createAsyncThunk(
  'customer/fetchWorkerProfile',
  async (workerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${workerId}/profile`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch worker profile');
    }
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'customer/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('/users/me', profileData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'customer/uploadPhoto',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // FIX: Changed 'files' to 'avatar' to match backend upload.single('avatar')
      formData.append('avatar', file); 
      const response = await axiosInstance.patch('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload photo');
    }
  }
);

export const fetchRatingDistribution = createAsyncThunk(
  'customer/fetchRatingDistribution',
  async (workerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/reviews/distribution/${workerId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rating distribution');
    }
  }
);

export const fetchWorkerReviews = createAsyncThunk(
  'customer/fetchWorkerReviews',
  async (workerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/reviews/worker/${workerId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch worker reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'customer/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reviews', reviewData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    viewedWorker: null,
    ratingDistribution: null,
    workerReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearViewedWorker: (state) => {
      state.viewedWorker = null;
      state.ratingDistribution = null;
      state.workerReviews = [];
    },
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkerProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWorkerProfile.fulfilled, (state, action) => { state.loading = false; state.viewedWorker = action.payload; })
      .addCase(fetchWorkerProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateCustomerProfile.pending, (state) => { state.loading = true; })
      .addCase(updateCustomerProfile.fulfilled, (state) => { state.loading = false; })
      .addCase(updateCustomerProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(uploadProfilePhoto.pending, (state) => { state.loading = true; })
      .addCase(uploadProfilePhoto.fulfilled, (state) => { state.loading = false; })
      .addCase(uploadProfilePhoto.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchRatingDistribution.fulfilled, (state, action) => { state.ratingDistribution = action.payload; })
      .addCase(fetchWorkerReviews.fulfilled, (state, action) => { state.workerReviews = action.payload?.reviews || action.payload || []; })
      .addCase(createReview.fulfilled, (state) => { /* Could add optimistic update here */ })
      // Generic pending/rejected for loading states (simplified for brevity)
      .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; state.error = null; })
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.loading = false; state.error = action.payload; })
      .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.loading = false; });

  },
});

export const { clearViewedWorker, clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;



// NEW



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// // ... (Keep existing fetchWorkerProfile, updateCustomerProfile, uploadProfilePhoto thunks)






// const customerSlice = createSlice({
//   name: 'customer',
//   initialState: {
//     viewedWorker: null,
//     ratingDistribution: null,
//     workerReviews: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearViewedWorker: (state) => {
//       state.viewedWorker = null;
//       state.ratingDistribution = null;
//       state.workerReviews = [];
//     },
//     clearCustomerError: (state) => { state.error = null; },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ... (Keep existing fetchWorkerProfile, updateCustomerProfile, uploadProfilePhoto cases)
//       .addCase(fetchRatingDistribution.fulfilled, (state, action) => { state.ratingDistribution = action.payload; })
//       .addCase(fetchWorkerReviews.fulfilled, (state, action) => { state.workerReviews = action.payload?.reviews || action.payload || []; })
//       .addCase(createReview.fulfilled, (state) => { /* Could add optimistic update here */ })
//       // Generic pending/rejected for loading states (simplified for brevity)
//       .addMatcher((action) => action.type.endsWith('/pending'), (state) => { state.loading = true; state.error = null; })
//       .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => { state.loading = false; state.error = action.payload; })
//       .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => { state.loading = false; });
//   },
// });

// export const { clearViewedWorker, clearCustomerError } = customerSlice.actions;
// export default customerSlice.reducer;