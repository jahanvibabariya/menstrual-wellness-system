import api from './api';
import type { PainLog, PainStats } from '@/types';

interface PainLogsResponse {
  success: boolean;
  data: PainLog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface PainLogResponse {
  success: boolean;
  data: PainLog;
}

interface PainStatsResponse {
  success: boolean;
  data: PainStats;
}

export const painLogService = {
  async getPainLogs(params?: Record<string, string | number>): Promise<PainLogsResponse> {
    const { data } = await api.get<PainLogsResponse>('/pain-logs', { params });
    return data;
  },

  async createPainLog(logData: Partial<PainLog>): Promise<PainLog> {
    const { data } = await api.post<PainLogResponse>('/pain-logs', logData);
    return data.data;
  },

  async getPainStats(): Promise<PainStats> {
    const { data } = await api.get<PainStatsResponse>('/pain-logs/stats');
    return data.data;
  },

  async deletePainLog(id: string): Promise<void> {
    await api.delete(`/pain-logs/${id}`);
  },
};
