import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportsService from './reportsService';

const initialState = {
  lifeEvents: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get Life Events Reports
export const getLifeEvents = createAsyncThunk(
  'reports/getLifeEvents',
  async (params, thunkAPI) => {
    try {
      // Service now handles auth and tenantId internally
      return await reportsService.getLifeEvents(params);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message)
        || error.message
        || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    reset: (state) => {
      state.lifeEvents = [];
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLifeEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLifeEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lifeEvents = action.payload;
      })
      .addCase(getLifeEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.lifeEvents = [];
      });
  },
});

export const { reset } = reportsSlice.actions;
export default reportsSlice.reducer;
