import api from './api';
import type { Notification } from '@/types';

interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
  };
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get<NotificationsResponse>('/notifications');
    return data.data?.notifications || [];
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },
};
export default notificationService;
