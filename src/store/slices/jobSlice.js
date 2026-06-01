import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

const initialState = { jobs: [], currentJob: null, totalPages: 1, currentPage: 1, loading: false, error: null };

export const fetchAvailableJobs = createAsyncThunk(
  'job/fetchAvailable',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/jobs/available', { params });
      return response.data.data; // { jobs, total, page, pages }
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'job/fetchMyJobs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/jobs/my-jobs', { params });
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

export const fetchJobById = createAsyncThunk(
  'job/fetchById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: { clearCurrentJob: (state) => { state.currentJob = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchAvailableJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalPages = action.payload.pages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchAvailableJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.totalPages = action.payload.pages;
      })
      .addCase(fetchJobById.pending, (state) => { state.loading = true; })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      });
  },
});

export default jobSlice.reducer;