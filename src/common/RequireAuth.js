/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import userService from '../features/auth/userService';

const RequireAuth = ({ allowedRoles }) => {
  // If the logged in user hasn't been loaded into the state upon page
  // refresh (because useEffect runs after the component is loaded),
  // userService fetches the user directly from localstorage and hands
  // it to the RequireAuth component
  const loginState = useSelector((state) => state.auth) || userService.getUser();
  const location = useLocation();

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
