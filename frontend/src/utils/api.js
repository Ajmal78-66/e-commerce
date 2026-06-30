import axios from 'axios';

const API = axios.create({
  baseURL: 'https://e-commerce-ujp8.onrender.com/api',
});

// Request interceptor to add JWT token to Authorization headers
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
