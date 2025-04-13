import axios from 'axios';
import { tryCatch } from '../util/tryCatch'

const api = axios.create({
  withCredentials: true
});

export const apiCall = (endpoint, method, data = null, params = {}) => {
  return tryCatch(async () => {
    const config = {
      method,
      url: endpoint,
      withCredentials: true
    };

    if (data) {
      config.data = data;
    }

    if (Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await api(config);
    return response.data;

  }, `${method} ${endpoint}`);
};

