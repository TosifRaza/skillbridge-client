import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  city: localStorage.getItem('skillbridge_city') || 'Mumbai',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload;
      localStorage.setItem('skillbridge_city', action.payload);
    },
  },
});

export const { setCity } = locationSlice.actions;
export default locationSlice.reducer;