import axios from 'axios';

const axiosApi = axios.create({
  // Local development
  baseURL: 'http://localhost:8080/api/v1.0.0',
  // For emulator
  // baseURL: 'http://10.0.2.2:8080/api/v1.0.0',
  // For physical device
  // baseURL: 'http://192.168.0.2:8080/api/v1.0.0',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApi;