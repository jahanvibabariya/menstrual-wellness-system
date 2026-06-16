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

// ── Two-Way Translation Dictionaries ──────────────────────────

const symptomToBackendMap: Record<string, string> = {
  'Cramps': 'cramps',
  'Headache': 'headache',
  'Back Pain': 'backPain',
  'Bloating': 'bloating',
  'Fatigue': 'fatigue',
  'Nausea': 'nausea',
  'Breast Tenderness': 'breastTenderness',
  'Mood Swings': 'moodSwings',
  'Insomnia': 'insomnia',
  'Dizziness': 'dizziness',
};

const symptomToFrontendMap: Record<string, string> = {
  'cramps': 'Cramps',
  'headache': 'Headache',
  'backPain': 'Back Pain',
  'bloating': 'Bloating',
  'fatigue': 'Fatigue',
  'nausea': 'Nausea',
  'breastTenderness': 'Breast Tenderness',
  'moodSwings': 'Mood Swings',
  'insomnia': 'Insomnia',
  'dizziness': 'Dizziness',
};

const moodToBackendMap: Record<string, string> = {
  'happy': 'happy',
  'sad': 'sad',
  'anxious': 'anxious',
  'irritated': 'irritable',
  'calm': 'calm',
  'tired': 'tired',
  'energetic': 'energetic',
  'neutral': 'neutral',
};

const moodToFrontendMap: Record<string, string> = {
  'happy': 'happy',
  'sad': 'sad',
  'anxious': 'anxious',
  'irritable': 'irritated',
  'calm': 'calm',
  'tired': 'tired',
  'energetic': 'energetic',
  'neutral': 'neutral',
};

const translateLogToFrontend = (log: PainLog): PainLog => {
  if (!log) return log;
  return {
    ...log,
    mood: moodToFrontendMap[log.mood] || log.mood,
    symptoms: (log.symptoms || []).map(s => symptomToFrontendMap[s] || s),
  };
};

export const painLogService = {
  async getPainLogs(params?: Record<string, string | number>): Promise<{ success: boolean; data: PainLog[] }> {
    const { data } = await api.get<PainLogsResponse>('/pain-logs', { params });
    const formattedLogs = (data.data?.painLogs || []).map(translateLogToFrontend);
    return {
      success: data.success,
      data: formattedLogs,
    };
  },

  async createPainLog(logData: Partial<PainLog>): Promise<PainLog> {
    // Translate parameters to backend enums before sending
    const payload = {
      ...logData,
      mood: logData.mood ? (moodToBackendMap[logData.mood] || logData.mood) : undefined,
      symptoms: logData.symptoms ? logData.symptoms.map(s => symptomToBackendMap[s] || s) : undefined,
    };

    const { data } = await api.post<PainLogResponse>('/pain-logs', payload);
    return translateLogToFrontend(data.data.painLog);
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

    const commonSymptoms = (raw.mostCommonSymptoms || []).map(s => ({
      symptom: symptomToFrontendMap[s.symptom] || s.symptom,
      count: s.count
    }));

    return {
      averagePain: raw.averagePainScore || 0,
      totalLogs: raw.totalLogs || 0,
      commonSymptoms,
      monthlyTrends
    };
  },

  async deletePainLog(id: string): Promise<void> {
    await api.delete(`/pain-logs/${id}`);
  },
};
export default painLogService;
