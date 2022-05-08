import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';
import { StudentActionTypes } from './action-types';
import { StudentMutationTypes } from './mutation-types';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { connection } from '@/main';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [StudentActionTypes.AUTH_REQUEST_STUDENT](
    { commit }: AugmentedActionContext,
    payload: any // Obsolete in here but left as an example
  ): Promise<boolean>;
  [StudentActionTypes.LOG_OUT_STUDENT]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
  [StudentActionTypes.CURRENT_STUDENT]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [StudentActionTypes.AUTH_REQUEST_STUDENT](
    { commit, getters },
    payload: any
  ) {
    try {
      const result = await StudentAuthServiceApi.login(payload);

      if (result.data && result.data.token) {
        commit(StudentMutationTypes.SET_TOKEN, result.data.token);
        connection.connect().on('connect', () => {
          connection.emit('register', {
            _id: getters.getCurrentStudent?._id,
            userType: 'student'
          });
        });
      }

      return true;
    } catch (e) {
      commit(StudentMutationTypes.SET_TOKEN, null);
      return false;
    }
  },
  async [StudentActionTypes.LOG_OUT_STUDENT]({ commit }) {
    // const result = await AuthServiceApi.logout();
    commit(StudentMutationTypes.SET_TOKEN, null);
    commit(StudentMutationTypes.SET_USER, null);
    return true;
  },
  async [StudentActionTypes.CURRENT_STUDENT]({ commit }) {
    try {
      const result = await StudentAuthServiceApi.currentUser();
      if (result.data) {
        const temp = result.data;
        commit(StudentMutationTypes.SET_USER, temp);
      }
      return true;
    } catch (e) {
      return false;
    }
  }
};
