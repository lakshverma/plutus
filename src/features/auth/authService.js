import axios from 'axios';

const baseUrl = '/auth';

const login = async (credentials) => {
  const requestUrl = `${baseUrl}/login`;
  const response = await axios.post(requestUrl, credentials);
  return response.data;
};

const recoverRequest = async (credentials) => {
  const requestUrl = `${baseUrl}/request-pass`;
  const response = await axios.post(requestUrl, credentials);
  return response;
};

const resetRequest = async (credentials, token) => {
  const config = {
    headers: { Authorization: `bearer ${token}` },
  };
  const requestUrl = `${baseUrl}/reset-pass`;
  const response = await axios.post(requestUrl, credentials, config);
  return response;
};

const authService = { login, recoverRequest, resetRequest };
export default authService;
