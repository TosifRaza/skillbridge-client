import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

const initialState = { 
  applications: [], 
  myApplications: [], 
  totalMyApplications: 0,
  loading: false, 
  error: null 
};

// Fetch applications for a specific job (Customer view)
export const fetchJobApplications = createAsyncThunk(
  'app/fetchByJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/applications/job/${jobId}`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

// Fetch applications submitted by the logged-in Worker
export const fetchMyApplications = createAsyncThunk(
  'app/fetchMyApplied',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/applications/applied', { params });
      return response.data.data; 
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

export const applyToJob = createAsyncThunk(
  'app/apply',
  async (appData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/applications/apply', appData);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

export const acceptApplication = createAsyncThunk(
  'app/accept',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/applications/${applicationId}/accept`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

export const rejectApplication = createAsyncThunk(
  'app/reject',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/applications/${applicationId}/reject`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

// Worker withdraws their application
export const withdrawApplication = createAsyncThunk(
  'app/withdraw',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/applications/${applicationId}/withdraw`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearApplications: (state) => { state.applications = []; },
    clearMyApplications: (state) => { state.myApplications = []; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Job Applications (Customer)
      .addCase(fetchJobApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Applications (Worker)
      .addCase(fetchMyApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload.applications;
        state.totalMyApplications = action.payload.total;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Apply to Job
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.myApplications.unshift(action.payload); 
      })

      // Accept Application (Customer)
      .addCase(acceptApplication.fulfilled, (state, action) => {
        const acceptedApp = action.payload;
        state.applications = state.applications.map(app => 
          app._id === acceptedApp._id ? { ...app, status: 'Accepted' } : 
          app.status === 'Pending' ? { ...app, status: 'Rejected' } : app
        );
      })
      
      // Reject Application (Customer)
      .addCase(rejectApplication.fulfilled, (state, action) => {
        const rejectedApp = action.payload;
        state.applications = state.applications.map(app => 
          app._id === rejectedApp._id ? { ...app, status: 'Rejected' } : app
        );
      })

      // Withdraw Application (Worker)
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.loading = false;
        const withdrawnApp = action.payload;
        // Update the status in myApplications array locally to 'Withdrawn'
        // This preserves it in the History tab without needing a refetch
        state.myApplications = state.myApplications.map(app => 
          app._id === withdrawnApp._id ? { ...app, status: 'Withdrawn' } : app
        );
      });
  },
});

export const { clearApplications, clearMyApplications } = applicationSlice.actions;
export default applicationSlice.reducer;