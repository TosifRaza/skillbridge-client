import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

const initialState = { applications: [], loading: false, error: null };

export const fetchJobApplications = createAsyncThunk(
  'app/fetchByJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/applications/job/${jobId}`);
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

// NEW: Accept Application
export const acceptApplication = createAsyncThunk(
  'app/accept',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/applications/${applicationId}/accept`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

// NEW: Reject Application
export const rejectApplication = createAsyncThunk(
  'app/reject',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/applications/${applicationId}/reject`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    clearApplications: (state) => { state.applications = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      // Handle Accept/Reject UI updates optimistically or on success
      .addCase(acceptApplication.fulfilled, (state, action) => {
        const acceptedApp = action.payload;
        state.applications = state.applications.map(app => 
          app._id === acceptedApp._id ? { ...app, status: 'Accepted' } : 
          app.status === 'Pending' ? { ...app, status: 'Rejected' } : app
        );
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        const rejectedApp = action.payload;
        state.applications = state.applications.map(app => 
          app._id === rejectedApp._id ? { ...app, status: 'Rejected' } : app
        );
      });
  },
});

export const { clearApplications } = applicationSlice.actions;
export default applicationSlice.reducer;