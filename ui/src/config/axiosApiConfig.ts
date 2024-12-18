import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1.0.0',
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
    if (error.response && error.response.status === 401) {
      const navigate = useNavigate();
      navigate('/unauthorized');
    }
    return Promise.reject(error);
  }
);

export default axiosApi;
