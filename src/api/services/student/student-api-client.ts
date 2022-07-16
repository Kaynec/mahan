import axios from 'axios';
import { useStudentStore, store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import alertify from '@/assets/alertifyjs/alertify';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import router from '@/router';

export const studentInstance = axios.create({
  baseURL: baseUrl,
  // 5 minutes
  timeout: 300000,
  headers: {}
});
studentInstance.interceptors.request.use((config) => {
  const token = useStudentStore().getters.getStudentToken;
  if (token) config.headers.token = `${token}`;
  return config;
});
studentInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response errord
    if (error.response && error.response.data && error.response.data.message)
      alertify.error(error.response.data.message);
    if (error.response && error.response.status == 401)
      store.dispatch(StudentActionTypes.LOG_OUT_STUDENT).then((res) => {
        if (res) router.push({ name: 'StudentLogin' });
      });

    return Promise.reject(error);
  }
);
