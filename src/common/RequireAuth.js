/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import userService from '../features/auth/userService';
import { logout } from '../features/auth/authSlice';

const RequireAuth = ({ allowedRoles }) => {
  // If the logged in user hasn't been loaded into the state upon page
  // refresh (because useEffect runs after the component is loaded),
  // userService fetches the user directly from localstorage and hands
  // it to the RequireAuth component
  const loginState = useSelector((state) => state.auth) || userService.getUser();

  const location = useLocation();
  const dispatch = useDispatch(); // To clear auth state if the token is expired.

  // Helper to check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() >= exp * 1000; // exp is in seconds; convert to milliseconds.
    } catch (error) {
      return true; // If token is invalid or can't be decoded, treat it as expired.
    }
  };

  const tokenExpired = loginState?.token && isTokenExpired(loginState.token);

  React.useEffect(() => {
    if (tokenExpired) {
      userService.clearUser();
      dispatch(logout());
      toast.error('Your session has expired. Please log in again.');
    }
  }, [dispatch, tokenExpired]);

  // Handle expired token
  if (tokenExpired) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    allowedRoles.includes(loginState?.role) ? (
      <Outlet />
    ) : loginState?.token ? (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/" state={{ from: location }} replace />
    )
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default RequireAuth;
