import api from './api';
import type { TherapySession, TherapyStats } from '@/types';

interface SessionsResponse {
  success: boolean;
  data: {
    sessions: TherapySession[];
  };
}

interface SessionResponse {
  success: boolean;
  data: {
    session: TherapySession;
  };
}

interface StatsResponse {
  success: boolean;
  data: {
    stats: {
      totalSessions: number;
      totalMinutes: number;
      averageDuration: number;
      usageByHeatLevel: { level: string; count: number; totalMinutes: number }[];
      usageByVibrationMode: { mode: string; count: number; totalMinutes: number }[];
    };
  };
}

export const therapyService = {
  async getSessions(): Promise<TherapySession[]> {
    const { data } = await api.get<SessionsResponse>('/therapy');
    return data.data?.sessions || [];
  },

  async createSession(sessionData: Partial<TherapySession>): Promise<TherapySession> {
    const { data } = await api.post<SessionResponse>('/therapy', sessionData);
    return data.data.session;
  },

  async getStats(): Promise<TherapyStats> {
    const { data } = await api.get<StatsResponse>('/therapy/stats');
    const raw = data.data.stats;
    return {
      totalSessions: raw.totalSessions || 0,
      totalMinutes: raw.totalMinutes || 0,
      averageDuration: raw.averageDuration || 0,
      heatUsage: (raw.usageByHeatLevel || []).map(h => ({ level: h.level, count: h.count })),
      vibrationUsage: (raw.usageByVibrationMode || []).map(v => ({ mode: v.mode, count: v.count })),
    };
  },
};
export default therapyService;
