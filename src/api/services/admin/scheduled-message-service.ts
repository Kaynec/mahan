import { instance } from '../../apiclient';

class ScheduledMessageService {
  async get(id: string) {
    return instance.get(`scheduled-message/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`scheduled-message`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(scheduledMessage: any) {
    return instance.post(`scheduled-message`, scheduledMessage, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: number, scheduledMessage: any) {
    return instance.put(`scheduled-message/${id}`, scheduledMessage, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`scheduled-message/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const ScheduledMessageServiceApi = new ScheduledMessageService();
