import axios from 'axios';
import userService from '../auth/userService';

const getDashboardStats = async () => {
  const user = userService.getUser();

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { token, tenant } = user;
  const baseUrl = `/${tenant}/contacts/stats/dashboard`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.get(baseUrl, config);
  return response.data;
};

const getRecentActivities = async () => {
  const user = userService.getUser();

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { token, tenant } = user;
  const baseUrl = `/${tenant}/activities/recent`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const response = await axios.get(baseUrl, config);

  return response.data;
};

const homeService = { getDashboardStats, getRecentActivities };
export default homeService;
