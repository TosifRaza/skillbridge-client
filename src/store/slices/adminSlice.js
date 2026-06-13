import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

// Thunks
export const fetchDashboardStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try { const res = await axiosInstance.get('/admin/dashboard'); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (params, { rejectWithValue }) => {
  try { const res = await axiosInstance.get('/admin/users', { params }); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const blockUser = createAsyncThunk('admin/blockUser', async (id, { rejectWithValue }) => {
  try { const res = await axiosInstance.patch(`/admin/users/${id}/block`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const unblockUser = createAsyncThunk('admin/unblockUser', async (id, { rejectWithValue }) => {
  try { const res = await axiosInstance.patch(`/admin/users/${id}/unblock`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const verifyWorker = createAsyncThunk('admin/verifyWorker', async (id, { rejectWithValue }) => {
  try { const res = await axiosInstance.patch(`/admin/workers/${id}/verify`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const rejectWorkerVerification = createAsyncThunk('admin/rejectWorker', async (id, { rejectWithValue }) => {
  try { const res = await axiosInstance.patch(`/admin/workers/${id}/reject`); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAdminJobs = createAsyncThunk('admin/fetchJobs', async (params, { rejectWithValue }) => {
  try { const res = await axiosInstance.get('/admin/jobs', { params }); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteJob = createAsyncThunk('admin/deleteJob', async (id, { rejectWithValue }) => {
  try { await axiosInstance.delete(`/admin/jobs/${id}`); return id; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchReports = createAsyncThunk('admin/fetchReports', async (params, { rejectWithValue }) => {
  try { const res = await axiosInstance.get('/admin/reports', { params }); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const resolveReport = createAsyncThunk('admin/resolveReport', async ({ id, resolution }, { rejectWithValue }) => {
  try { const res = await axiosInstance.patch(`/admin/reports/${id}/resolve`, { resolution }); return res.data.data; } 
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null, users: [], jobs: [], reports: [],
    totalUsers: 0, totalJobs: 0, totalReports: 0,
    loading: false, error: null
  },
  reducers: { clearAdminError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.stats = action.payload; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.users = action.payload.users; state.totalUsers = action.payload.total; })
      .addCase(blockUser.fulfilled, (state, action) => { state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u); })
      .addCase(unblockUser.fulfilled, (state, action) => { state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u); })
      .addCase(verifyWorker.fulfilled, (state, action) => { state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u); })
      .addCase(rejectWorkerVerification.fulfilled, (state, action) => { state.users = state.users.map(u => u._id === action.payload._id ? action.payload : u); })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => { state.jobs = action.payload.jobs; state.totalJobs = action.payload.total; })
      .addCase(deleteJob.fulfilled, (state, action) => { state.jobs = state.jobs.filter(j => j._id !== action.payload); })
      .addCase(fetchReports.fulfilled, (state, action) => { state.reports = action.payload.reports; state.totalReports = action.payload.total; })
      .addCase(resolveReport.fulfilled, (state, action) => { state.reports = state.reports.map(r => r._id === action.payload._id ? action.payload : r); });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;