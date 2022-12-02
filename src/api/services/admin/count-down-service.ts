import { instance } from '../../apiclient';

class CountDownService {
  async get(id: string) {
    return instance.get(`count-down/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`count-down`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(countDown: any) {
    return instance.post(`count-down`, countDown, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: number, countDown: any) {
    return instance.put(`count-down/${id}`, countDown, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`count-down/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const CountDownServiceApi = new CountDownService();
