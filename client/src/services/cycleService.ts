import api from './api';
import type { Cycle, CyclePrediction } from '@/types';

interface CyclesResponse {
  success: boolean;
  data: {
    cycles: Cycle[];
  };
}

interface CycleResponse {
  success: boolean;
  data: {
    cycle: Cycle;
  };
}

interface PredictionResponse {
  success: boolean;
  data: {
    currentCycle: Cycle;
    prediction: {
      predictedNextStart: string;
      estimatedOvulation: string;
      fertileWindow: {
        start: string;
        end: string;
      };
      daysUntilNextPeriod: number;
      currentCycleDay: number;
    };
  };
}

export const cycleService = {
  async getCycles(): Promise<Cycle[]> {
    const { data } = await api.get<CyclesResponse>('/cycles');
    return data.data?.cycles || [];
  },

  async createCycle(cycleData: Partial<Cycle>): Promise<Cycle> {
    const { data } = await api.post<CycleResponse>('/cycles', cycleData);
    return data.data.cycle;
  },

  async updateCycle(id: string, cycleData: Partial<Cycle>): Promise<Cycle> {
    const { data } = await api.put<CycleResponse>(`/cycles/${id}`, cycleData);
    return data.data.cycle;
  },

  async deleteCycle(id: string): Promise<void> {
    await api.delete(`/cycles/${id}`);
  },

  async getPrediction(): Promise<CyclePrediction> {
    const { data } = await api.get<PredictionResponse>('/cycles/predict');
    const raw = data.data;
    if (!raw || !raw.prediction) {
      throw new Error('No prediction data found');
    }
    const p = raw.prediction;
    return {
      nextPeriodStart: p.predictedNextStart,
      estimatedOvulation: p.estimatedOvulation,
      fertileWindowStart: p.fertileWindow.start,
      fertileWindowEnd: p.fertileWindow.end,
      daysUntilNextPeriod: p.daysUntilNextPeriod,
      currentCycleDay: p.currentCycleDay,
    };
  },
};
export default cycleService;
