// TODO: Remove no-shadow eslint disable after fixed: https://github.com/typescript-eslint/typescript-eslint/issues/2484
// eslint-disable-next-line no-shadow
export enum ChatMutationTypes {
  SOCKET_NEW_Message = 'SOCKET_new-message',
  SOCKET_INITIAL_MESSAGE = 'SOCKET_initial-messages',
  ADD_MESSAGE = 'ADD_MESSAGE',
  EMPTY_MESSAGES = 'EMPTY_MESSAGES',
  TOGGLE_MODAL = 'TOGGLE_MODAL'
}
