import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Order service functions
export const orderService = {
  getOrders: async () => {
    const response = await api.get('/api/orders');
    return response.data;
  },
  
  getOrderById: async (id: string) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },
  
  updateOrderStatus: async (orderId: number, status: string, customerEmail?: string) => {
    const response = await api.post('/api/update-order', { 
      orderId, 
      status,
      customerEmail 
    });
    return response.data;
  },
  
  sendLocation: async (latitude: number, longitude: number) => {
    const response = await api.post('/api/send-location', { 
      latitude, 
      longitude 
    });
    return response.data;
  },
  
  notifyCustomer: async (orderId: number, event: string, customerEmail?: string) => {
    const response = await api.post('/api/trigger-webhook', { 
      orderId, 
      event,
      customerEmail 
    });
    return response.data;
  }
};
