import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';

export type Getters = {
  getMessages(state: State): any[] | null;
  getShowModal(state: State): boolean;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getMessages: (state) => {
    return state.messages;
  },
  getShowModal: (state) => {
    return state.showModal;
  }
};
