/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingsService from './settingsService';

const initialState = {
  users: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const fetchUsers = createAsyncThunk(
  'settings/fetchUsers',
  async (_, thunkAPI) => {
    try {
      return await settingsService.getUsers();
    } catch (error) {
      const message = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createUser = createAsyncThunk(
  'settings/createUser',
  async (userData, thunkAPI) => {
    try {
      return await settingsService.createUser(userData);
    } catch (error) {
      // Improved error extraction: checks 'message', 'error', and valid string responses
      const message = (error.response && error.response.data && error.response.data.message)
        || (error.response && error.response.data && error.response.data.error)
        || (error.response && typeof error.response.data === 'string' ? error.response.data : null)
        || error.message
        || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUserRole = createAsyncThunk(
  'settings/updateUserRole',
  async ({ userId, role }, thunkAPI) => {
    try {
      return await settingsService.updateUserRole({ userId, role });
    } catch (error) {
      const message = (error.response
          && error.response.data
          && error.response.data.message)
        || error.message
        || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = '';
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { user_id, user_roles_user_roles_id } = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.user_id === user_id,
        );
        if (userIndex !== -1) {
          state.users[userIndex].role_id = user_roles_user_roles_id;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = settingsSlice.actions;
export default settingsSlice.reducer;
