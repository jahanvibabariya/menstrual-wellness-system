import api from './api';
import type { User, AuthTokens } from '@/types';

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

interface MeResponse {
  success: boolean;
  data: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<MeResponse>('/auth/me');
    return data.data;
  },

  async resetPassword(email: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { email, newPassword });
  },
};
