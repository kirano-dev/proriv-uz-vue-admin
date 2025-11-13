import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.3:8000/api/v1/',
});

// при старте приложения — если в localStorage есть токен, подставляем его
const token = localStorage.getItem('access_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// interceptor: если 401 — можно редиректить на логин
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('access_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/sign/in';
    }
    return Promise.reject(err);
  }
);

export default api;
