export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Cycle {
  _id: string;
  userId: string;
  startDate: string;
  cycleLength: number;
  periodLength: number;
  notes?: string;
  predictedNextStart?: string;
  estimatedOvulation?: string;
  createdAt: string;
}

export interface PainLog {
  _id: string;
  userId: string;
  painScore: number;
  symptoms: string[];
  mood: string;
  notes?: string;
  timestamp: string;
  createdAt: string;
}

export interface TherapySession {
  _id: string;
  userId: string;
  heatLevel: 'low' | 'medium' | 'high';
  vibrationMode: 'gentle' | 'moderate' | 'strong';
  duration: number;
  completedAt?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'period' | 'wellness' | 'therapy' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Content {
  _id: string;
  title: string;
  category: 'wellness_tip' | 'relaxation' | 'education';
  description: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
}

export interface PainStats {
  averagePain: number;
  totalLogs: number;
  commonSymptoms: { symptom: string; count: number }[];
  monthlyTrends: { month: string; avgPain: number; count: number }[];
}

export interface TherapyStats {
  totalSessions: number;
  totalMinutes: number;
  averageDuration: number;
  heatUsage: { level: string; count: number }[];
  vibrationUsage: { mode: string; count: number }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  averagePainScore: number;
  totalTherapySessions: number;
}

export interface CyclePrediction {
  nextPeriodStart: string;
  estimatedOvulation: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  daysUntilNextPeriod: number;
  currentCycleDay: number;
}
