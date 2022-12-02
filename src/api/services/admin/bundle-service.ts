import { instance } from '../../apiclient';

class BundleService {
  async get(id: string) {
    return instance.get(`productBundle/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getAll() {
    return instance.get(`productBundle`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(user: any) {
    return instance.post(`productBundle`, user, {
      headers: {
        // 'Content-Type': 'multipart/form-data'
      }
    });
  }
  async getbundleByProperties(gradeId, groupId, fieldId, orientationId) {
    return instance.get(
      `/productBundle/getByProperties/${gradeId}/${groupId}/${fieldId}/${orientationId}?`,
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      }
    );
  }
  async update(id: number, user: any) {
    return instance.put(`productBundle/${id}`, user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`productBundle/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const BundleServiceApi = new BundleService();
