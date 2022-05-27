import axios from 'axios';
import { useAdminStore } from '@/store';
const alertify = require('../assets/alertifyjs/alertify');

export const baseUrlDomain = process.env.VUE_APP_BASE_URL;

export const baseUrl = `${baseUrlDomain}/api/`;

// export const baseUrl = `https://api.mahanplus.com/api/`;

export const instance = axios.create({
  baseURL: baseUrl,
  // 5 minutes
  timeout: 300000,
  headers: {}
});
instance.interceptors.request.use((config) => {
  const token = useAdminStore().getters.getUserToken;
  if (token) {
    config.headers.token = `${token}`;
  }
  return config;
});
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data && error.response.data.message) {
      alertify.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);
