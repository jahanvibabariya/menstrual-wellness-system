import api from './api';
import type { PainLog, PainStats } from '@/types';

interface PainLogsResponse {
  success: boolean;
  data: {
    painLogs: PainLog[];
  };
}

interface PainLogResponse {
  success: boolean;
  data: {
    painLog: PainLog;
  };
}

interface PainStatsResponse {
  success: boolean;
  data: {
    stats: {
      averagePainScore: number;
      totalLogs: number;
      mostCommonSymptoms: { symptom: string; count: number }[];
      painByMonth: { year: number; month: number; averagePain: number; logCount: number }[];
    };
  };
}

export const painLogService = {
  async getPainLogs(params?: Record<string, string | number>): Promise<{ success: boolean; data: PainLog[] }> {
    const { data } = await api.get<PainLogsResponse>('/pain-logs', { params });
    return {
      success: data.success,
      data: data.data?.painLogs || [],
    };
  },

  async createPainLog(logData: Partial<PainLog>): Promise<PainLog> {
    const { data } = await api.post<PainLogResponse>('/pain-logs', logData);
    return data.data.painLog;
  },

  async getPainStats(): Promise<PainStats> {
    const { data } = await api.get<PainStatsResponse>('/pain-logs/stats');
    const raw = data.data.stats;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = (raw.painByMonth || []).map(m => ({
      month: monthNames[m.month - 1] || `${m.month}`,
      avgPain: m.averagePain,
      count: m.logCount
    }));

    return {
      averagePain: raw.averagePainScore || 0,
      totalLogs: raw.totalLogs || 0,
      commonSymptoms: raw.mostCommonSymptoms || [],
      monthlyTrends
    };
  },

  async deletePainLog(id: string): Promise<void> {
    await api.delete(`/pain-logs/${id}`);
  },
};
export default painLogService;
