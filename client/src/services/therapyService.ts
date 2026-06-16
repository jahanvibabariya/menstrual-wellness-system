import api from './api';
import type { TherapySession, TherapyStats } from '@/types';

interface SessionsResponse {
  success: boolean;
  data: TherapySession[];
}

interface SessionResponse {
  success: boolean;
  data: TherapySession;
}

interface StatsResponse {
  success: boolean;
  data: TherapyStats;
}

export const therapyService = {
  async getSessions(): Promise<TherapySession[]> {
    const { data } = await api.get<SessionsResponse>('/therapy');
    return data.data;
  },

  async createSession(sessionData: Partial<TherapySession>): Promise<TherapySession> {
    const { data } = await api.post<SessionResponse>('/therapy', sessionData);
    return data.data;
  },

  async getStats(): Promise<TherapyStats> {
    const { data } = await api.get<StatsResponse>('/therapy/stats');
    return data.data;
  },
};
