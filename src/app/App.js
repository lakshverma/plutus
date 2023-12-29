import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
// components
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequireAuth from '../common/RequireAuth';
import TestForm from '../common/form/TestForm';
import Recover from '../features/auth/Recover';
import ResetPassword from '../features/auth/ResetPassword';
import RecoveryMailSent from '../features/auth/RecoveryMailSent';
import SignIn from '../features/auth/SignIn';
import Unauthorized from '../common/Unauthorized';
import Missing from '../common/Missing';
// services
import userService from '../features/auth/userService';
// reducers and action creators
import { login } from '../features/auth/authSlice';
import EmptyContact from '../features/contact/EmptyContact';
import NewContact from '../features/contact/NewContact';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userFromStorage = userService.getUser();
    if (userFromStorage) {
      dispatch(login(userFromStorage));
    }
  });

  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route path="/recover" element={<Recover />} />
        <Route path="/recoversent" element={<RecoveryMailSent />} />
        <Route path="/resetpass/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[2]} />}>
          <Route path="/contacts/new" element={<NewContact />} />
          <Route path="/contacts" element={<EmptyContact />} />
          <Route path="/home" element={<TestForm />} />
        </Route>

        <Route path="/" element={<SignIn />} />

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar transition={Slide} theme="colored" />
    </div>
  );
}

export default App;
