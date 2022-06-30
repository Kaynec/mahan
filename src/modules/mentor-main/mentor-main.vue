<template>
  <div class="st-wrapper" :style="getMainStyle()">
    <desktopRightSide v-if="!isMobile.value && store.getters.getMentorToken" />
    <router-view></router-view>
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
import desktopRightSide from '@/modules/mentor-main/desktop-rightside.vue';
import { isMobile } from '@/mixins/detectMobile';
import { store, useChatStore, useMentorStore } from '@/store';
import { connection } from '@/main';
import { ChatMutationTypes } from '@/store/modules/chat/mutation-types';
import router from '@/router';

@Options({
  components: { desktopRightSide }
})
export default class Main extends Vue {
  public windowHeight = window.innerHeight;
  public windowWidth = window.innerWidth;
  public store = store
  public text = '';
  public isMobile = isMobile;

  async mounted() {
    if (!useMentorStore().getters.getMentorToken) return;
    connection.connect().on('connect', () => {
      connection.emit('register', {
        _id: useMentorStore().getters.getCurrentMentor?._id,
        userType: 'mentor'
      });

      if (useChatStore().getters.getShowModal === false) {
        return;
      }
      if (useChatStore().getters.getMessages?.length) {
        store.commit(ChatMutationTypes.TOGGLE_MODAL);
        console.log(
          useChatStore().getters.getMessages,
          useChatStore().getters.getShowModal
        );
        this.text = `شما ${
          useChatStore().getters.getMessages?.length
        } پیام ناخوانده دارید`;
      }
    });

    connection.on('new-message', () => {
      if (this.componentname != 'Chat') {
        this.text = `شما ${
          useChatStore().getters.getMessages?.length
        } پیام ناخوانده دارید`;
        this.toggleShowNotification();
      }
    });

    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

    window.addEventListener('resize', this.onResize);
  }

  toggleShowNotification() {
    store.commit(ChatMutationTypes.TOGGLE_MODAL);
  }

  get messages() {
    return useChatStore().getters.getMessages;
  }

  redirectToChat(): void {
    this.toggleShowNotification();
    router.push({ name: 'ContactBackup' });
  }

  get componentname() {
    return this.$route.name;
  }

  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  getMainStyle() {
    let fraction = '';

    if (this.isMobile) {
      fraction = '1fr';
    } else if (!this.isMobile && !store.getters.getMentorToken) {
      fraction = '1fr';
    } else {
      fraction = '40% 60%';
    }

    return {
      'grid-template-columns': fraction
    };
  }
}
</script>
<style lang="scss">
.st-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 3rem;
  background: #f4f4f4;
  display: grid;
  font-family: IRANSans;
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
