<template>
  <div
    :class="`${mobile ? 'st-wrapper' : 'st-wrapper pc'}`"
    :style="getMainStyle()"
  >
    <desktopRightSide
      v-show="
        !mobile &&
        store.getters.getStudentToken &&
        componentname != 'StudentGroupPage' &&
        componentname != 'CustomGroupPage'
      "
    />

    <router-view> </router-view>
    <alert
      messages
      label="پیام ناخوانده"
      :text="text"
      @convertBoolean="toggleShowNotification"
      v-if="store.getters.getShowModal"
    >
      <div class="btns">
        <button @click="redirectToChat">انتقال به صفحه چت</button>
      </div>
    </alert>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import desktopRightSide from '@/modules/desktop-rightside.vue';
import { store, useChatStore, useStudentStore } from '@/store';
import router from '@/router';
import { ChatMutationTypes } from '@/store/modules/chat/mutation-types';
import { useConnection } from '@/api/connection';

@Options({
  components: { desktopRightSide }
})
export default class Main extends Vue {
  public windowHeight = window.innerHeight;
  public store = store;
  public text = '';

  async mounted() {
    if (!store.getters.getStudentToken) return;
    useConnection()
      .connect()
      .on('connect', () => {
        useConnection().emit('register', {
          _id: useStudentStore().getters.getCurrentStudent?._id,
          userType: 'student'
        });

        if (useChatStore().getters.getShowModal === false) {
          return;
        } else if (useChatStore().getters.getMessages?.length) {
          store.commit(ChatMutationTypes.TOGGLE_MODAL);
          this.text = `شما ${
            useChatStore().getters.getMessages?.length
          } پیام ناخوانده دارید`;
        }
      });

    useConnection().on('new-message', () => {
      if (
        this.componentname != 'ContactBackupChat' &&
        this.componentname != 'ContactBackupInfo' &&
        this.componentname != 'ContactBackup'
      ) {
        this.text = `شما ${
          useChatStore().getters.getMessages?.length
        } پیام ناخوانده دارید`;
        this.toggleShowNotification();
      }
    });
  }

  toggleShowNotification() {
    store.commit(ChatMutationTypes.TOGGLE_MODAL);
  }

  get messages() {
    return useChatStore().getters.getMessages;
  }

  get componentname() {
    return this.$route.name;
  }

  // get showNotification() {
  //   return useChatStore().getters.getShowModal
  // }

  redirectToChat(): void {
    this.toggleShowNotification();
    router.push({ name: 'ContactBackup' });
  }

  getMainStyle() {
    let fraction = '';

    // We Want One Part page on the roadmap pages
    if (
      !mobile.value &&
      store.getters.getStudentToken &&
      this.$route.name != 'StudentGroupPage' &&
      this.$route.name != 'CustomGroupPage'
    ) {
      fraction = '40% 60%';
    } else {
      fraction = '1fr';
    }

    return {
      'grid-template-columns': fraction
    };
  }
}
</script>
<style lang="scss">
.startAnimeation {
  opacity: 0;
}

.endAnimation {
  opacity: 1;
}

.st-wrapper {
  background: #f4f4f4;
  display: grid;
  overflow-x: hidden;
  transition: opacity 0.9s ease-in-out;
  width: 100%;
  height: 100%;
  scrollbar-width: thin !important;
  scrollbar-color: rgb(146, 141, 141) rgb(230, 224, 224);
  ::-webkit-scrollbar,
  ::moz-sc {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  //
}

.pc {
  width: 100vw;
  height: 100%;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-out;
}

.slide-enter-to {
  position: absolute;
  left: 0;
}

.slide-enter-from {
  position: absolute;
  left: -100%;
}

.slide-leave-to {
  position: absolute;
  right: -100%;
}

.slide-leave-from {
  position: absolute;
  right: 0;
}

.btns {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
  margin-bottom: 2.5rem;
  button {
    padding: 5% 18%;
    border-radius: 1rem;
    border: none;

    &:first-child {
      background-color: #4ac367;
      color: #fff;
      margin-left: 0.3rem;
    }

    &:last-child {
      background-color: #d3d7e0;
      color: #646464;
    }
  }
}
</style>
