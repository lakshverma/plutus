import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  auth: authReducer,
});

export default rootReducer;
