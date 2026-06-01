import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

const initialState = { messages: [], activeConversation: null, loading: false };

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/${conversationId}`);
      return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message); }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      state.messages = []; // Clear old messages on room switch
    },
    addSocketMessage: (state, action) => {
      state.messages.push(action.payload); // Push real-time message from Socket.io
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      });
  },
});

export const { setActiveConversation, addSocketMessage } = chatSlice.actions;
export default chatSlice.reducer;