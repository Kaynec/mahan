import axios from 'axios';
import { useMentorStore, store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import alertify from '@/assets/alertifyjs/alertify';
import router from '@/router';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';

export const MentorInstance = axios.create({
  baseURL: baseUrl,
  // 5 minutes
  timeout: 300000,
  headers: {}
});
MentorInstance.interceptors.request.use((config) => {
  const token = useMentorStore().getters.getMentorToken;
  if (token) config.headers.token = `${token}`;
  return config;
});
MentorInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data && error.response.data.message)
      alertify.error(error.response.data.message);
    if (error.response && error.response.status == 401)
      store.dispatch(MentorActionTypes.LOG_OUT_MENTOR).then((res) => {
        if (res) router.push({ name: 'MentorLogin' });
      });
    return Promise.reject(error);
  }
);
