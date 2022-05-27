import { instance } from '../../apiclient';
class OrientationService {
  async get(id: string) {
    return instance.get(`orientation/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`orientation/`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(orientation) {
    return instance.post(`orientation`, orientation, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: number, orientation) {
    return instance.put(`orientation/${id}`, orientation, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`orientation/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const OrientationServiceApi = new OrientationService();
