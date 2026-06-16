import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarHeart,
  HeartPulse,
  Vibrate,
  Sparkles,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { cycleService } from '@/services/cycleService';
import { painLogService } from '@/services/painLogService';
import { therapyService } from '@/services/therapyService';
import type { CyclePrediction, PainLog, TherapyStats } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [recentLogs, setRecentLogs] = useState<PainLog[]>([]);
  const [therapyStats, setTherapyStats] = useState<TherapyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [predData, logsData, statsData] = await Promise.allSettled([
          cycleService.getPrediction(),
          painLogService.getPainLogs({ limit: 5 }),
          therapyService.getStats(),
        ]);
        if (predData.status === 'fulfilled') setPrediction(predData.value);
        if (logsData.status === 'fulfilled') setRecentLogs(logsData.value.data || []);
        if (statsData.status === 'fulfilled') setTherapyStats(statsData.value);
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const wellnessScore = prediction
    ? Math.max(0, Math.min(100, 100 - (recentLogs[0]?.painScore || 3) * 10))
    : 75;

  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      happy: '😊', sad: '😢', anxious: '😰', irritated: '😤',
      calm: '😌', tired: '😴', energetic: '⚡', neutral: '😐',
    };
    return moods[mood] || '😐';
  };

  const getPainColor = (score: number) => {
    if (score <= 3) return 'sage';
    if (score <= 6) return 'coral';
    return 'red';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 🌸
          </h1>
          <p className="text-white/80 max-w-lg">
            {prediction
              ? `You're on day ${prediction.currentCycleDay} of your cycle. ${prediction.daysUntilNextPeriod <= 5 ? 'Your period is coming soon — be prepared!' : 'Keep tracking your wellness journey.'}`
              : 'Start tracking your cycle to get personalized predictions and insights.'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarHeart}
          value={prediction ? `${prediction.daysUntilNextPeriod}` : '—'}
          label="Days Until Next Period"
          color="rose"
        />
        <StatCard
          icon={Activity}
          value={prediction ? `Day ${prediction.currentCycleDay}` : '—'}
          label="Current Cycle Day"
          color="lavender"
        />
        <StatCard
          icon={TrendingUp}
          value={`${wellnessScore}%`}
          label="Wellness Score"
          color="sage"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          icon={HeartPulse}
          value={recentLogs[0]?.painScore?.toString() || '—'}
          label="Last Pain Score"
          color="coral"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cycle Overview */}
        <Card title="Cycle Overview" icon={CalendarHeart} iconColor="text-rose-500" className="lg:col-span-2">
          {prediction ? (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="relative">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Day 1</span>
                  <span>Day {prediction.currentCycleDay}</span>
                  <span>Day 28</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary rounded-full transition-all duration-500"
                    style={{ width: `${(prediction.currentCycleDay / 28) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-rose-50/60 rounded-xl p-4">
                  <p className="text-xs text-rose-400 font-medium mb-1">Next Period</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(prediction.nextPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="bg-lavender-50/60 rounded-xl p-4">
                  <p className="text-xs text-lavender-400 font-medium mb-1">Ovulation</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(prediction.estimatedOvulation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="bg-sage-50/60 rounded-xl p-4">
                  <p className="text-xs text-sage-500 font-medium mb-1">Fertile Window</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(prediction.fertileWindowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} —{' '}
                    {new Date(prediction.fertileWindowEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="bg-coral-50/60 rounded-xl p-4">
                  <p className="text-xs text-coral-400 font-medium mb-1">Cycle Day</p>
                  <p className="text-sm font-semibold text-gray-800">Day {prediction.currentCycleDay} of 28</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm mb-4">No cycle data yet. Start tracking to see predictions.</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/dashboard/cycles')}>
                Track Your Cycle
              </Button>
            </div>
          )}
        </Card>

        {/* Therapy Summary */}
        <Card title="Therapy Summary" icon={Vibrate} iconColor="text-lavender-500">
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-display font-bold text-white">
                  {therapyStats?.totalSessions || 0}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total Sessions</p>
            </div>
            <div className="flex justify-between items-center bg-lavender-50/40 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Total Minutes</span>
              <span className="text-sm font-semibold text-lavender-600">
                {therapyStats?.totalMinutes || 0} min
              </span>
            </div>
            <div className="flex justify-between items-center bg-lavender-50/40 rounded-xl px-4 py-3">
              <span className="text-xs text-gray-500">Avg Duration</span>
              <span className="text-sm font-semibold text-lavender-600">
                {therapyStats?.averageDuration?.toFixed(0) || 0} min
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Pain Logs + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Logs */}
        <Card title="Recent Pain Logs" icon={HeartPulse} iconColor="text-coral-400" className="lg:col-span-2">
          {recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.slice(0, 4).map((log) => (
                <div key={log._id} className="flex items-center justify-between bg-white/40 rounded-xl px-4 py-3 hover:bg-white/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getMoodEmoji(log.mood)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPainColor(log.painScore) as 'sage' | 'coral' | 'red'}>
                          Pain: {log.painScore}/10
                        </Badge>
                        {log.symptoms.slice(0, 2).map((s) => (
                          <Badge key={s} variant="gray">{s}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/dashboard/pain-logger')}
                className="w-full text-center text-sm text-rose-500 hover:text-rose-600 font-medium py-2 transition-colors"
              >
                View All Logs →
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm mb-3">No pain logs yet</p>
              <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/pain-logger')}>
                Log Your First Entry
              </Button>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" icon={Zap} iconColor="text-amber-500">
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/pain-logger')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-coral-50/50 hover:bg-coral-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5 text-coral-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-gray-800">Log Pain</p>
                <p className="text-xs text-gray-400">Record how you're feeling</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-coral-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/dashboard/wearable')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-lavender-50/50 hover:bg-lavender-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Vibrate className="w-5 h-5 text-lavender-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-gray-800">Start Therapy</p>
                <p className="text-xs text-gray-400">Control your WellBelt</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-lavender-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/dashboard/cycles')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-rose-50/50 hover:bg-rose-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarHeart className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-gray-800">Track Cycle</p>
                <p className="text-xs text-gray-400">Update your cycle data</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-rose-400 transition-colors" />
            </button>

            <button
              onClick={() => navigate('/dashboard/relaxation')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-sage-50/50 hover:bg-sage-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-sage-500" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-gray-800">Relaxation</p>
                <p className="text-xs text-gray-400">Breathing & wellness</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-sage-400 transition-colors" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
