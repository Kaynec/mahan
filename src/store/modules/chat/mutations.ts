import { MutationTree } from 'vuex';
import { State } from './state';
import { ChatMutationTypes } from './mutation-types';

export type Mutations<S = State> = {
  [ChatMutationTypes.SOCKET_INITIAL_MESSAGE](state: S, messages: any[]): void;
  [ChatMutationTypes.SOCKET_NEW_Message](state: S, message: any | null): void;
  [ChatMutationTypes.ADD_MESSAGE](state: S, message: any | null): void;
  [ChatMutationTypes.EMPTY_MESSAGES](state: S, mentorId: string): void;
  [ChatMutationTypes.TOGGLE_MODAL](state: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [ChatMutationTypes.SOCKET_INITIAL_MESSAGE](state: State, messages: any[]) {
    if (messages && messages.length > 0) {
      state.messages = messages.map((message) => {
        if (message.sender == 'student') {
          message.receptorId = message.mentor._id;
          message.senderId = message.student._id;
        } else {
          message.receptorId = message.student._id;
          message.senderId = message.mentor._id;
        }
        return message;
      });
    } else {
      state.messages = [];
    }
  },
  [ChatMutationTypes.SOCKET_NEW_Message](state: State, message: any) {
    if (message) {
      if (message.sender == 'student') {
        message.receptorId = message.mentor;
        message.senderId = message.student;
      } else {
        message.receptorId = message.student;
        message.senderId = message.mentor;
      }
      state.messages.push(message);
    }
  },
  [ChatMutationTypes.ADD_MESSAGE](state: State, message: any) {
    if (message) {
      if (message.sender == 'student') {
        message.receptorId = message.mentor._id;
        message.senderId = message.student._id;
      } else {
        message.receptorId = message.student._id;
        message.senderId = message.mentor._id;
      }
      state.messages.push(message);
    }
  },
  [ChatMutationTypes.EMPTY_MESSAGES](state: State, mentorId: string) {
    state.messages = [];
  },
  [ChatMutationTypes.TOGGLE_MODAL](state: State) {
    state.showModal = !state.showModal;
  }
};
