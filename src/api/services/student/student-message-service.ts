import { studentInstance as instance } from './student-api-client';
class Message {
  async getForTime(time) {
    return instance.get(`scheduled-message/getForTime/${time}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async addCountDown(countDownObject) {
    return instance.post(`count-down/student/`, countDownObject, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getCountDown() {
    return instance.get(`count-down/getForStudent`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentMessageApi = new Message();
