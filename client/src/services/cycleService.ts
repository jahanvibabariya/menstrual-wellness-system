import api from './api';
import type { Cycle, CyclePrediction } from '@/types';

interface CyclesResponse {
  success: boolean;
  data: Cycle[];
}

interface CycleResponse {
  success: boolean;
  data: Cycle;
}

interface PredictionResponse {
  success: boolean;
  data: CyclePrediction;
}

export const cycleService = {
  async getCycles(): Promise<Cycle[]> {
    const { data } = await api.get<CyclesResponse>('/cycles');
    return data.data;
  },

  async createCycle(cycleData: Partial<Cycle>): Promise<Cycle> {
    const { data } = await api.post<CycleResponse>('/cycles', cycleData);
    return data.data;
  },

  async updateCycle(id: string, cycleData: Partial<Cycle>): Promise<Cycle> {
    const { data } = await api.put<CycleResponse>(`/cycles/${id}`, cycleData);
    return data.data;
  },

  async deleteCycle(id: string): Promise<void> {
    await api.delete(`/cycles/${id}`);
  },

  async getPrediction(): Promise<CyclePrediction> {
    const { data } = await api.get<PredictionResponse>('/cycles/prediction');
    return data.data;
  },
};
