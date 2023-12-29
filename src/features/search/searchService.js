import axios from 'axios';
import userService from '../auth/userService';

const search = async (query) => {
  const user = userService.getUser();

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const baseUrl = `/${user.tenant}/search`;

  const { token } = userService.getUser();
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };

  const requestUrl = `${baseUrl}?q=${encodeURIComponent(query)}`;
  const response = await axios.get(requestUrl, config);
  return response;
};

const searchService = { search };
export default searchService;
