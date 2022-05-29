import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import VueSocketIO from 'vue-3-socket.io';
import detectMobile from './mixins/detectMobile';
import SocketIO from 'socket.io-client';
import { useStudentStore, useMentorStore } from '@/store';
import CKEditor from '@ckeditor/ckeditor5-vue';
import '../node_modules/animate.css/animate.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { baseUrlDomain } from './api/apiclient';

(window as any).bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
const app = createApp(App);

app.component(
  'alert',
  require('@/modules/student-modules/alert/alert.vue').default
);

export const connection = SocketIO(baseUrlDomain, {
  query: {
    token: useStudentStore().getters.getStudentToken
      ? useStudentStore().getters.getStudentToken
      : useMentorStore().getters.getMentorToken
  },
  transports: ['websocket']
});

app
  .use(
    new VueSocketIO({
      debug: true,
      connection: connection, //options object is Optional'http://localhost:3000',
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    })
  )
  .use(CKEditor)
  .use(store)
  .use(router)
  .mixin(detectMobile);

app.mount('#app');
