import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import VueSocketIO from 'vue-3-socket.io';
import { useStudentStore, useMentorStore } from '@/store';
import SocketIO from 'socket.io-client';
import CKEditor from '@ckeditor/ckeditor5-vue';
import '../node_modules/animate.css/animate.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { baseUrlDomain } from './api/apiclient';
import '@unocss/reset/tailwind.css';
import 'uno.css';
import { useConnection } from './api/connection';

(window as any).bootstrap = import('bootstrap/dist/js/bootstrap.bundle.js');
const app = createApp(App);

app.component('alert', import('@/modules/student-modules/alert/alert.vue'));

app
  .use(
    new VueSocketIO({
      debug: true,
      connection: useConnection(), //options object is Optional'http://localhost:3000',
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    })
  )
  .use(CKEditor)
  .use(store)
  .use(router);

app.mount('#app');
