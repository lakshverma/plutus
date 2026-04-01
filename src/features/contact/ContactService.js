import axios from 'axios';
import userService from '../auth/userService';

const getDropDownOptions = async (options = 'all') => {
  const user = userService.getUser();

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const baseUrl = `/${user.tenant}/contacts`;
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  if (options === 'all') {
    const requestUrl = `${baseUrl}/options/all`;
    const response = await axios.get(requestUrl, config);
    return response;
  }

  const requestUrl = `${baseUrl}/options/city`;
  const response = await axios.get(requestUrl, config);
  return response;
};

const getFilteredOptions = async (optionsType, searchTerm) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }
  const { token } = userService.getUser();
  const { tenant } = user;
  const baseUrl = `/${tenant}/contacts`;

  const endpoints = {
    contactNames: { path: 'contact-names', param: 'contactName' },
    groupHeads: { path: 'groupheads', param: 'contactName' },
    cities: { path: 'cities', param: 'city' },
    contactTypes: { path: 'contact-types', param: 'contactType' },
    contactOwners: { path: 'contact-owners', param: 'contactOwner' },
    contactStatuses: { path: 'contact-statuses', param: null },
  };

  const endpointConfig = endpoints[optionsType];

  if (!endpointConfig) {
    return [];
  }

  const requestUrl = `${baseUrl}/options/${endpointConfig.path}`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: {},
  };

  if (endpointConfig.param && searchTerm) {
    config.params[endpointConfig.param] = searchTerm;
  }

  try {
    const response = await axios.get(requestUrl, config);
    return response.data;
  } catch (error) {
    return [];
  }
};

const createContact = async (newContact) => {
  const user = userService.getUser();

  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const baseUrl = `/${user.tenant}/contacts`;

  const { token } = userService.getUser();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const request = await axios.post(baseUrl, newContact, config);
  return request.data;
};

const getContacts = async ({ page, sortParams = {} }) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { tenant, token } = user;
  const baseUrl = `/${tenant}/contacts`;
  const apiUrl = `${baseUrl}`;

  const queryParams = new URLSearchParams();
  queryParams.append('page', page);

  sortParams.forEach((sort, index) => {
    queryParams.append(`sort[${index}]`, `${sort.column}:${sort.order}`);
  });

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: queryParams,
  };

  try {
    const response = await axios.get(apiUrl, config);
    if (response.data && response.data.data && response.data.pagination) {
      return response.data;
    }
    throw new Error('Invalid API response structure');
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getContactById = async (contactId) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { tenant, token } = user;
  const url = `/${tenant}/contacts/${contactId}`;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateContact = async (contactId, updatedData) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { tenant, token } = user;
  const url = `/${tenant}/contacts/${contactId}`;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.put(url, updatedData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteContact = async (contactId) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { tenant, token } = user;
  const url = `/${tenant}/contacts/${contactId}`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  await axios.delete(url, config);
};

const batchDeleteContacts = async (contactIds) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }

  const { tenant, token } = user;
  const url = `/${tenant}/contacts/batch`;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const body = { contactIds };

  const response = await axios.delete(url, { ...config, data: body });
  if (response.status === 204) {
    return { status: 'all_successful' };
  }
  if (response.status === 207) {
    return { status: 'partial_success', details: response.data };
  }
  return { status: 'unknown_success', details: response.data };
};

const getContactHistory = async (tenantId, contactId) => {
  const user = userService.getUser();
  if (!user) {
    throw new Error('User is not authenticated.');
  }
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(
    `/${tenantId}/audit/contact/${contactId}`,
    config,
  );
  return response.data;
};

// --- Activity Timeline & Notes/Calls ---

const getActivities = async (tenantId, contactId, params) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params,
  };
  const response = await axios.get(`/${tenantId}/contacts/${contactId}/activities`, config);
  return response.data;
};

const createNote = async (tenantId, contactId, data) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`/${tenantId}/contacts/${contactId}/notes`, data, config);
  return response.data;
};

const updateNote = async (tenantId, contactId, noteId, data) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`/${tenantId}/contacts/${contactId}/notes/${noteId}`, data, config);
  return response.data;
};

const deleteNote = async (tenantId, contactId, noteId) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`/${tenantId}/contacts/${contactId}/notes/${noteId}`, config);
  return response.data;
};

const createCall = async (tenantId, contactId, data) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(`/${tenantId}/contacts/${contactId}/calls`, data, config);
  return response.data;
};

const updateCall = async (tenantId, contactId, callId, data) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`/${tenantId}/contacts/${contactId}/calls/${callId}`, data, config);
  return response.data;
};

const deleteCall = async (tenantId, contactId, callId) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`/${tenantId}/contacts/${contactId}/calls/${callId}`, config);
  return response.data;
};

const getActivityOptions = async (tenantId) => {
  const user = userService.getUser();
  if (!user) throw new Error('User is not authenticated.');
  const { token } = user;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(`/${tenantId}/activities/options`, config);
  return response.data;
};

const contactService = {
  getDropDownOptions,
  getFilteredOptions,
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  batchDeleteContacts,
  getContactHistory,
  getActivities,
  createNote,
  updateNote,
  deleteNote,
  createCall,
  updateCall,
  deleteCall,
  getActivityOptions,
};

export default contactService;
