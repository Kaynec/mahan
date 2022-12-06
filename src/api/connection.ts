import SocketIO from 'socket.io-client';

export const useConnection = () => {
  return SocketIO(baseUrlDomain!, {
    query: {
      token: useStudentStore().getters.getStudentToken
        ? useStudentStore().getters.getStudentToken
        : useMentorStore().getters.getMentorToken
    },
    transports: ['websocket']
  });
};
