import axios from 'axios';

// 1. Створюємо інстанс з базовим URL твого NestJS сервера
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Заміни на порт свого бекенду
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor для ЗАПИТІВ: автоматично додаємо токен
apiClient.interceptors.request.use(
  (config) => {
    // В Electron можемо зберігати токен у localStorage (для початку)
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor для ВІДПОВІДЕЙ: глобальна обробка помилок
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Якщо NestJS повернув 401 Unauthorized (токен прострочився або невірний)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      // Примусово перекидаємо на логін (оскільки у нас HashRouter)
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);
