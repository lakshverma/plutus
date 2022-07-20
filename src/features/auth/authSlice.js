/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
