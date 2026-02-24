import { apiClient } from '../client';

// Типізуємо те, що відправляєш на NestJS
export interface LoginDto {
  email: string;
  password: string;
}

// Типізуємо те, що NestJS повертає
export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const authService = {
  // Функція логіну
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Збереження токена (можна винести і в окремий utility-файл)
  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  },

  // Вихід
  logout() {
    localStorage.removeItem('access_token');
    window.location.hash = '#/login';
  }
};
