import { createStore, createLogger } from 'vuex';
import VuexPersistence from 'vuex-persist';
import {
  store as users,
  DocumentsStore,
  State as UserState
} from '@/store/modules/admin';
import {
  store as students,
  StudentsStore,
  State as StudentState
} from '@/store/modules/student';
import {
  store as mentors,
  MentorsStore,
  State as MentorState
} from '@/store/modules/mentor';

import {
  store as chats,
  ChatsStore,
  State as ChatState
} from '@/store/modules/chat';

export type RootState = {
  users: UserState;
  students: StudentState;
  chats: ChatState;
  mentors: MentorState;
};

export type AdminStore = DocumentsStore<Pick<RootState, 'users'>>;
export type StudentStore = StudentsStore<Pick<RootState, 'students'>>;
export type ChatStore = ChatsStore<Pick<RootState, 'chats'>>;
export type MentorStore = MentorsStore<Pick<RootState, 'mentors'>>;

// Plug in logger when in development environment

const debug = import.meta.env.MODE !== 'production';
const plugins = debug ? [createLogger({})] : [];

const vuexLocal = new VuexPersistence<RootState>({
  storage: window.localStorage
});

export const store = createStore({
  plugins: [vuexLocal.plugin],
  modules: {
    users,
    students,
    chats,
    mentors
  }
});

export function useAdminStore(): AdminStore {
  return store as AdminStore;
}

export function useStudentStore(): StudentStore {
  console.log(store);
  return store as StudentStore;
}

export function useChatStore(): ChatStore {
  return store as ChatStore;
}

export function useMentorStore(): MentorStore {
  return store as MentorStore;
}
