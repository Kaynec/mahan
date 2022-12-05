import { studentInstance as instance } from './student-api-client';
class Basket {
  async get() {
    return instance.get('shopping-cart/get', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async add(product: any) {
    return instance.post('shopping-cart', product, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  async addBundle(bundle: any) {
    return instance.post('shopping-cart/add-bundle', bundle, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  async addSession(session: any) {
    return instance.post('shopping-cart/add-session', session, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  async removeSession(id: number) {
    return instance.delete(`shopping-cart/delete-session/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  async removeBundle(id: number) {
    return instance.delete(`shopping-cart/delete-bundle/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  async finalizeOrder() {
    return instance.post('order', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async HistoryOfBoughtProducts() {
    return instance.get('order/get', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentBasketApi = new Basket();
