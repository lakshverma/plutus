import axios from 'axios';
import userService from '../auth/userService';

const handleApiError = (error) => {
  if (error.response && error.response.status === 401) {
    userService.clearUser();
  }
  throw error;
};

const getUsers = async () => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }
  const { tenant, token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(`/${tenant}/auth/users`, config);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const createUser = async (userData) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }
  const { tenant, token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.post(`/${tenant}/auth/signup`, userData, config);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const updateUserRole = async ({ userId, role }) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }
  const { tenant, token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.patch(
      `/${tenant}/auth/users/${userId}/role`,
      { role },
      config,
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

const settingsService = {
  getUsers,
  createUser,
  updateUserRole,
};

export default settingsService;
