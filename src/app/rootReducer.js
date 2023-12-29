import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/search/searchSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  search: searchReducer,
});

export default rootReducer;
