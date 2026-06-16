import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, HeartPulse, Clock } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { Loader } from '@/components/common/Loader';
import { painLogService } from '@/services/painLogService';
import { therapyService } from '@/services/therapyService';
import type { PainStats, TherapyStats } from '@/types';

const PERIODS = ['30 days', '3 months', '6 months', '1 year'];

const Analytics: React.FC = () => {
  const [painStats, setPainStats] = useState<PainStats | null>(null);
  const [therapyStats, setTherapyStats] = useState<TherapyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('3 months');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [painData, therapyData] = await Promise.allSettled([
          painLogService.getPainStats(),
          therapyService.getStats(),
        ]);
        if (painData.status === 'fulfilled') setPainStats(painData.value);
        if (therapyData.status === 'fulfilled') setTherapyStats(therapyData.value);
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  // Fallback data for charts
  const painTrends = painStats?.monthlyTrends?.length
    ? painStats.monthlyTrends
    : [
        { month: 'Jan', avgPain: 4.2, count: 8 },
        { month: 'Feb', avgPain: 3.8, count: 12 },
        { month: 'Mar', avgPain: 5.1, count: 10 },
        { month: 'Apr', avgPain: 3.5, count: 14 },
        { month: 'May', avgPain: 4.0, count: 11 },
        { month: 'Jun', avgPain: 3.2, count: 9 },
      ];

  const symptomData = painStats?.commonSymptoms?.length
    ? painStats.commonSymptoms
    : [
        { symptom: 'Cramps', count: 24 },
        { symptom: 'Headache', count: 18 },
        { symptom: 'Fatigue', count: 16 },
        { symptom: 'Bloating', count: 14 },
        { symptom: 'Back Pain', count: 12 },
        { symptom: 'Mood Swings', count: 10 },
      ];

  const therapyTrends = [
    { month: 'Jan', sessions: 5, minutes: 75 },
    { month: 'Feb', sessions: 8, minutes: 120 },
    { month: 'Mar', sessions: 6, minutes: 90 },
    { month: 'Apr', sessions: 10, minutes: 150 },
    { month: 'May', sessions: 7, minutes: 105 },
    { month: 'Jun', sessions: 9, minutes: 135 },
  ];

  const topSymptom = symptomData[0]?.symptom || 'N/A';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 text-sm">Insights into your wellness journey</p>
        </div>
        <div className="flex bg-white/60 backdrop-blur rounded-xl p-1 border border-white/30">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === p
                  ? 'bg-white shadow-sm text-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HeartPulse}
          value={painStats?.averagePain?.toFixed(1) || '3.8'}
          label="Avg Pain Score"
          color="coral"
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          icon={BarChart3}
          value={painStats?.totalLogs?.toString() || '47'}
          label="Total Logs"
          color="lavender"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon={Activity}
          value={topSymptom}
          label="Most Common"
          color="rose"
        />
        <StatCard
          icon={Clock}
          value={`${therapyStats?.totalMinutes || 675}`}
          label="Therapy Minutes"
          color="sage"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Pain Trend Chart */}
      <Card title="Pain Trends" icon={HeartPulse} iconColor="text-coral-400">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={painTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff20" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgPain"
                name="Avg Pain"
                stroke="#fb7185"
                strokeWidth={3}
                dot={{ fill: '#fb7185', r: 5 }}
                activeDot={{ r: 7, fill: '#f43f5e' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Log Count"
                stroke="#B794F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#B794F6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Symptom Frequency */}
        <Card title="Symptom Frequency" icon={BarChart3} iconColor="text-lavender-500">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis dataKey="symptom" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="count" name="Occurrences" fill="#B794F6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Therapy Usage */}
        <Card title="Therapy Usage" icon={Clock} iconColor="text-sage-500">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={therapyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  name="Minutes"
                  stroke="#68D391"
                  fill="#68D39130"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  name="Sessions"
                  stroke="#fb7185"
                  fill="#fb718520"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
