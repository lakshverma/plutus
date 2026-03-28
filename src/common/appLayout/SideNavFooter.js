import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../../features/auth/authSlice';
import userService from '../../features/auth/userService';

function SideNavFooter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    userService.clearUser();
    dispatch(logout());
    toast.success('Successfully logged out', {
      autoClose: 3000,
    });
    navigate('/', { replace: true });
  };

  const getUserInitials = () => {
    // Try to get from username first, then email
    const nameSource = user?.username || user?.email;

    if (nameSource) {
      // If it's an email, take first letter before @
      if (nameSource.includes('@')) {
        return nameSource[0].toUpperCase();
      }
      // If it's a username, try to extract initials
      const nameParts = nameSource.trim().split(/[\s._-]+/);
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0].substring(0, 2).toUpperCase();
    }

    return 'U';
  };

  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.email) return user.email;
    return 'User';
  };

  const getRoleDisplay = () => {
    if (typeof user?.role === 'number') {
      // Map numeric roles to string labels
      const roleMap = {
        0: 'admin',
        1: 'standard',
        2: 'limited',
      };
      return roleMap[user.role] || 'user';
    }
    return user?.role || null;
  };

  return (
    <div className="relative mt-auto border-t-2 border-outline-grey-plutus">
      <button
        type="button"
        onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
        className="flex items-center justify-center w-full py-4 transition-colors hover:bg-skyblue-plutus"
        title="Account"
      >
        <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full bg-primary-blue-plutus">
          {getUserInitials()}
        </div>
      </button>

      {showLogoutConfirm && (
        <>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(false)}
            className="fixed inset-0 z-40"
            aria-label="Close logout menu"
          />
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 mx-2 bg-white border rounded-lg shadow-lg border-outline-grey-plutus min-w-[180px]">
            <div className="p-3 border-b border-outline-grey-plutus">
              <p className="text-xs font-semibold truncate text-primary-dark-plutus">
                {getDisplayName()}
              </p>
              {getRoleDisplay() && (
                <p className="text-xs capitalize text-primary-grey-plutus">
                  {getRoleDisplay()}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-semibold transition-colors text-secondary-pink-plutus hover:bg-skyblue-plutus whitespace-nowrap"
            >
              <i className="mr-2 text-lg las la-sign-out-alt" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SideNavFooter;
