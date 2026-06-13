import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import locationReducer from './slices/locationSlice';
import customerReducer from './slices/customerSlice'; // <-- ADDED
import adminReducer from './slices/adminSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    job: jobReducer,
    application: applicationReducer,
    chat: chatReducer,
    notification: notificationReducer,
    location: locationReducer,
    customer: customerReducer, // <-- ADDED
    admin: adminReducer,
  },
});