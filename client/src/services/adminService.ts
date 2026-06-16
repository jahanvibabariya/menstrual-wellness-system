import api from './api';
import type { User, AdminAnalytics as AdminAnalyticsType, Content } from '@/types';

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface AnalyticsResponse {
  success: boolean;
  data: {
    analytics: AdminAnalyticsType;
  };
}

interface ContentListResponse {
  success: boolean;
  data: {
    content: Content[];
  };
}

interface ContentResponse {
  success: boolean;
  data: {
    content: Content;
  };
}

export const adminService = {
  async getUsers(params?: Record<string, string | number>): Promise<{ success: boolean; data: User[]; pagination?: any }> {
    const { data } = await api.get<UsersResponse>('/admin/users', { params });
    return {
      success: data.success,
      data: data.data?.users || [],
      pagination: data.data?.pagination,
    };
  },

  async toggleUserStatus(id: string): Promise<User> {
    const { data } = await api.put<{ success: boolean; data: { user: User } }>(`/admin/users/${id}/toggle`);
    return data.data.user;
  },

  async getAnalytics(): Promise<AdminAnalyticsType> {
    const { data } = await api.get<AnalyticsResponse>('/admin/analytics');
    return data.data.analytics;
  },

  async getContent(category?: string): Promise<Content[]> {
    const params = category ? { category } : {};
    const { data } = await api.get<ContentListResponse>('/admin/content', { params });
    return data.data?.content || [];
  },

  async createContent(contentData: Partial<Content>): Promise<Content> {
    const { data } = await api.post<ContentResponse>('/admin/content', contentData);
    return data.data.content;
  },

  async updateContent(id: string, contentData: Partial<Content>): Promise<Content> {
    const { data } = await api.put<ContentResponse>(`/admin/content/${id}`, contentData);
    return data.data.content;
  },

  async deleteContent(id: string): Promise<void> {
    await api.delete(`/admin/content/${id}`);
  },

  async getReports(params?: Record<string, string>): Promise<{ success: boolean; data: Record<string, unknown> }> {
    const { data } = await api.get('/admin/reports', { params });
    return data;
  },
};
export default adminService;
