import { Token, UserDocuments, UserProfileName } from '@/@types';

export type State = {
  user: UserDocuments | null;
  messages: any[];
  showModal: boolean;
};

export const state: State = {
  user: null,
  messages: [],
  showModal: false
};
