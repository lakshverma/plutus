import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import searchReducer from '../features/search/searchSlice';
import contactReducer from '../features/contact/contactSlice';
import settingsReducer from '../features/settings/settingsSlice';
import reportsReducer from '../features/reports/reportsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  contact: contactReducer,
  reports: reportsReducer,
  settings: settingsReducer,
});

export default rootReducer;
