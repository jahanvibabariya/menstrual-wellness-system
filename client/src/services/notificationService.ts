import api from './api';
import type { Notification } from '@/types';

interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<NotificationsResponse>('/notifications');
    return data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },
};
