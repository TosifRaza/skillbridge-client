// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// const initialState = { jobs: [], currentJob: null, totalPages: 1, currentPage: 1, loading: false, error: null };

// export const fetchAvailableJobs = createAsyncThunk(
//   'job/fetchAvailable',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/jobs/available', { params });
//       return response.data.data; // { jobs, total, page, pages }
//     } catch (error) { return rejectWithValue(error.response?.data?.message); }
//   }
// );

// export const fetchMyJobs = createAsyncThunk(
//   'job/fetchMyJobs',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/jobs/my-jobs', { params });
//       return response.data.data;
//     } catch (error) { return rejectWithValue(error.response?.data?.message); }
//   }
// );

// export const fetchJobById = createAsyncThunk(
//   'job/fetchById',
//   async (jobId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/jobs/${jobId}`);
//       return response.data.data;
//     } catch (error) { return rejectWithValue(error.response?.data?.message); }
//   }
// );

// const jobSlice = createSlice({
//   name: 'job',
//   initialState,
//   reducers: { clearCurrentJob: (state) => { state.currentJob = null; } },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAvailableJobs.pending, (state) => { state.loading = true; })
//       .addCase(fetchAvailableJobs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs = action.payload.jobs;
//         state.totalPages = action.payload.pages;
//         state.currentPage = action.payload.page;
//       })
//       .addCase(fetchAvailableJobs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchMyJobs.pending, (state) => { state.loading = true; })
//       .addCase(fetchMyJobs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs = action.payload.jobs;
//         state.totalPages = action.payload.pages;
//       })
//       .addCase(fetchJobById.pending, (state) => { state.loading = true; })
//       .addCase(fetchJobById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentJob = action.payload;
//       });
//   },
// });

// export default jobSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// const initialState = {
//   jobs: [],
//   currentJob: null,
//   totalPages: 1,
//   currentPage: 1,
//   loading: false,
//   error: null,
// };

// export const fetchAvailableJobs = createAsyncThunk(
//   'job/fetchAvailable',

//   // ===========================
//   // UPDATED: Added getState
//   // so we can access location.city
//   // from Redux store
//   // ===========================
//   async (params, { getState, rejectWithValue }) => {
//     try {

//       // ===========================
//       // NEW: Get Redux state
//       // ===========================
//       const state = getState();

//       // ===========================
//       // NEW: Get selected city
//       // from locationSlice
//       // ===========================
//       const city = state.location?.city;

//       // ===========================
//       // NEW: Attach city to API params
//       // Existing filters + city
//       // ===========================
//       const queryParams = {
//         ...params,
//         city,
//       };

//       const response = await axiosInstance.get(
//         '/jobs/available',
//         {
//           params: queryParams,
//         }
//       );

//       return response.data.data; // { jobs, total, page, pages }

//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message
//       );
//     }
//   }
// );

// export const fetchMyJobs = createAsyncThunk(
//   'job/fetchMyJobs',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(
//         '/jobs/my-jobs',
//         { params }
//       );

//       return response.data.data;

//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message
//       );
//     }
//   }
// );

// export const fetchJobById = createAsyncThunk(
//   'job/fetchById',
//   async (jobId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(
//         `/jobs/${jobId}`
//       );

//       return response.data.data;

//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message
//       );
//     }
//   }
// );

// const jobSlice = createSlice({
//   name: 'job',

//   initialState,

//   reducers: {
//     clearCurrentJob: (state) => {
//       state.currentJob = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       // ===========================
//       // Fetch Available Jobs
//       // ===========================
//       .addCase(fetchAvailableJobs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchAvailableJobs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs = action.payload.jobs;
//         state.totalPages = action.payload.pages;
//         state.currentPage = action.payload.page;
//       })

//       .addCase(fetchAvailableJobs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===========================
//       // Fetch My Jobs
//       // ===========================
//       .addCase(fetchMyJobs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchMyJobs.fulfilled, (state, action) => {
//         state.loading = false;
//         state.jobs = action.payload.jobs;
//         state.totalPages = action.payload.pages;
//       })

//       .addCase(fetchMyJobs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ===========================
//       // Fetch Single Job
//       // ===========================
//       .addCase(fetchJobById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       .addCase(fetchJobById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentJob = action.payload;
//       })

//       .addCase(fetchJobById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearCurrentJob } = jobSlice.actions;

// export default jobSlice.reducer;







import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

const initialState = {
  jobs: [],
  currentJob: null,
  totalPages: 1,
  currentPage: 1,
  totalJobs: 0,
  loading: false,
  error: null,
};

// ==========================================
// READ THUNKS
// ==========================================
export const fetchAvailableJobs = createAsyncThunk(
  'job/fetchAvailable',
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const city = state.location?.city;
      const queryParams = { ...params, city };
      const response = await axiosInstance.get('/jobs/available', { params: queryParams });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available jobs');
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'job/fetchMyJobs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/jobs/my-jobs', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'job/fetchById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

// ==========================================
// WRITE THUNKS (NEW)
// ==========================================
export const createJob = createAsyncThunk(
  'job/create',
  async (jobData, { rejectWithValue }) => {
    try {
      // jobData must be FormData because of image uploads
      const response = await axiosInstance.post('/jobs', jobData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'job/update',
  async ({ jobId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/jobs/${jobId}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const closeJob = createAsyncThunk(
  'job/close',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/jobs/${jobId}/close`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'job/delete',
  async (jobId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      return jobId; // Return the ID so we can remove it from the state array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
    }
  }
);

// ==========================================
// SLICE
// ==========================================
const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ---------- READ ----------
      .addCase(fetchAvailableJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAvailableJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalPages = action.payload.pages;
        state.currentPage = action.payload.page;
        state.totalJobs = action.payload.total;
      })
      .addCase(fetchAvailableJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalPages = action.payload.pages;
        state.totalJobs = action.payload.total;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchJobById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // ---------- WRITE (NEW) ----------
      .addCase(createJob.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload); // Add new job to the top of the list
      })
      .addCase(createJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        // Update the job in the array if it exists
        const index = state.jobs.findIndex(j => j._id === action.payload._id);
        if (index !== -1) state.jobs[index] = action.payload;
        // Also update currentJob if it matches
        if (state.currentJob?._id === action.payload._id) state.currentJob = action.payload;
      })

      .addCase(closeJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(j => j._id === action.payload._id);
        if (index !== -1) state.jobs[index] = action.payload;
        if (state.currentJob?._id === action.payload._id) state.currentJob = action.payload;
      })

      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload is the jobId returned from the thunk
        state.jobs = state.jobs.filter(j => j._id !== action.payload);
        if (state.currentJob?._id === action.payload) state.currentJob = null;
      });
  },
});

export const { clearCurrentJob, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;