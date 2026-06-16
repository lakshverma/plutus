import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
// components
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequireAuth from '../common/RequireAuth';
import UnsupportedScreen from '../common/UnsupportedScreen';
import Recover from '../features/auth/Recover';
import ResetPassword from '../features/auth/ResetPassword';
import RecoveryMailSent from '../features/auth/RecoveryMailSent';
import SignIn from '../features/auth/SignIn';
import Settings from '../features/settings/Settings';
import Unauthorized from '../common/Unauthorized';
import Missing from '../common/Missing';
// services
import userService from '../features/auth/userService';
// reducers and action creators
import { login } from '../features/auth/authSlice';
import EmptyContact from '../features/contact/EmptyContact';
import NewContact from '../features/contact/NewContact';
import ContactList from '../features/contact/ContactList';
import ContactProfile from '../features/contact/ContactProfile';
import Reports from '../features/reports/Reports';
import HomePage from '../features/home/HomePage';

function App() {
  const dispatch = useDispatch();
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  );

  useEffect(() => {
    const userFromStorage = userService.getUser();
    if (userFromStorage) {
      dispatch(login(userFromStorage));
    }
  }, [dispatch]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e) => setIsSmallScreen(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (isSmallScreen) {
    return <UnsupportedScreen />;
  }

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
          <Route path="/contactstest" element={<EmptyContact />} />
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/contacts/:id" element={<ContactProfile />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
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
