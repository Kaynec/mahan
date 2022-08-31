import { instance } from '../../apiclient';
class ClassService {
  async getNewRecording() {
    return instance.post(
      `adobe-convert/get-new-recording`,
      {},
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export const ClassServiceApi = new ClassService();
