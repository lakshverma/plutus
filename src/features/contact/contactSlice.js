import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  options: [],
  cityOptions: {},
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setOptions: (state, action) => {
      state.options = action.payload;
    },
    setCityOptions: (state, action) => {
      state.cityOptions = action.payload;
    },
  },
});

export const {
  setOptions,
  setCityOptions,
} = contactSlice.actions;

export default contactSlice.reducer;
