// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// const initialState = { messages: [], activeConversation: null, loading: false };

// export const fetchChatHistory = createAsyncThunk(
//   'chat/fetchHistory',
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/chat/${conversationId}`);
//       return response.data.data;
//     } catch (error) { return rejectWithValue(error.response?.data?.message); }
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     setActiveConversation: (state, action) => {
//       state.activeConversation = action.payload;
//       state.messages = []; // Clear old messages on room switch
//     },
//     addSocketMessage: (state, action) => {
//       state.messages.push(action.payload); // Push real-time message from Socket.io
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChatHistory.pending, (state) => { state.loading = true; })
//       .addCase(fetchChatHistory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.messages = action.payload;
//       });
//   },
// });

// export const { setActiveConversation, addSocketMessage } = chatSlice.actions;
// export default chatSlice.reducer;

// 












// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// // export const fetchConversations = createAsyncThunk(
// //   'chat/fetchConversations',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axiosInstance.get('/jobs/my-jobs?limit=20');
// //       return response.data.data.jobs || []; // FIX: Ensure it's always an array
// //     } catch (error) {
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
// //     }
// //   }
// // );
// export const fetchConversations = createAsyncThunk(
//   'chat/fetchConversations',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get('/chat/conversations');
//       return response.data.data; 
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
//     }
//   }
// );

// export const fetchChatHistory = createAsyncThunk(
//   'chat/fetchHistory',
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/chat/${conversationId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
//     }
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     conversations: [],
//     activeConversationId: null,
//     messages: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setActiveConversation: (state, action) => {
//       state.activeConversationId = action.payload.conversationId;
//       state.messages = []; 
//     },
//     clearActiveConversation: (state) => {
//       state.activeConversationId = null;
//       state.messages = [];
//     },
//     messageReceived: (state, action) => {
//       state.messages.push(action.payload);
//     },
//     messagesRead: (state, action) => {
//       state.messages = state.messages.map(msg => 
//         action.payload.readBy && !msg.readBy.includes(action.payload.readBy) 
//         ? { ...msg, readBy: [...msg.readBy, action.payload.readBy] } 
//         : msg
//       );
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchConversations.pending, (state) => { state.loading = true; })
//       .addCase(fetchConversations.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.conversations = action.payload; 
//       })
//       .addCase(fetchConversations.rejected, (state) => { 
//         state.loading = false; 
//         state.conversations = []; // FIX: Reset to empty array on failure
//       })
//       .addCase(fetchChatHistory.pending, (state) => { state.loading = true; })
//       .addCase(fetchChatHistory.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.messages = action.payload?.reverse() || []; 
//       })
//       .addCase(fetchChatHistory.rejected, (state) => { state.loading = false; state.messages = []; });
//   },
// });

// export const { setActiveConversation, clearActiveConversation, messageReceived, messagesRead } = chatSlice.actions;
// export default chatSlice.reducer;







// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axiosInstance from '@/api/axiosInstance';

// export const fetchConversations = createAsyncThunk(
//   'chat/fetchConversations',
//   async (_, { rejectWithValue }) => {
//     try {
//       // Using my-jobs to generate conversation rooms
//       const response = await axiosInstance.get('/jobs/my-jobs?limit=20');
//       return response.data.data.jobs; 
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
//     }
//   }
// );

// export const fetchChatHistory = createAsyncThunk(
//   'chat/fetchHistory',
//   async (conversationId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`/chat/${conversationId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
//     }
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState: {
//     conversations: [],
//     activeConversationId: null,
//     messages: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     setActiveConversation: (state, action) => {
//       state.activeConversationId = action.payload.conversationId;
//       state.messages = [];
//     },
//     clearActiveConversation: (state) => {
//       state.activeConversationId = null;
//       state.messages = [];
//     },
//     messageReceived: (state, action) => {
//       state.messages.push(action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchConversations.pending, (state) => { state.loading = true; })
//       .addCase(fetchConversations.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.conversations = action.payload || []; 
//       })
//       .addCase(fetchConversations.rejected, (state) => { state.loading = false; })
//       .addCase(fetchChatHistory.pending, (state) => { state.loading = true; })
//       .addCase(fetchChatHistory.fulfilled, (state, action) => { 
//         state.loading = false; 
//         state.messages = action.payload?.reverse() || []; 
//       })
//       .addCase(fetchChatHistory.rejected, (state) => { state.loading = false; });
//   },
// });

// export const { setActiveConversation, clearActiveConversation, messageReceived } = chatSlice.actions;
// export default chatSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';

const initialState = { 
  conversations: [], // Ensure this exists
  messages: [], 
  loading: false, 
  error: null 
};

export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/chat/conversations');
      return response.data.data;
    } catch (error) { 
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations'); 
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/${conversationId}`);
      return response.data.data; 
    } catch (error) { 
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history'); 
    }
  }
);

export const uploadChatImage = createAsyncThunk(
  'chat/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file); 
      const response = await axiosInstance.post('/chat/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data.url; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Image upload failed');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addSocketMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.loading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload || []; // Ensure it's always an array
      })
      .addCase(fetchConversations.rejected, (state) => { state.loading = false; state.conversations = []; })
      .addCase(fetchChatHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addSocketMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;