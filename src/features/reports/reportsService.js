import axios from 'axios';
import userService from '../auth/userService';

/*
 * Fetch life events (birthdays/anniversaries)
 * Query Params:
 * - month (required): 1-12
 * - day (optional): 1-31
 * - type (optional): 'birthday', 'anniversary', or 'both'
 */
const getLifeEvents = async (params) => {
  const user = userService.getUser();

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { tenant, token } = user;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params,
  };

  const response = await axios.get(`/${tenant}/report/life-events`, config);
  return response.data;
};

const reportsService = {
  getLifeEvents,
};

export default reportsService;
