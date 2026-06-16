import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Vibrate, Thermometer, Calendar } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { Loader } from '@/components/common/Loader';
import { adminService } from '@/services/adminService';
import type { AdminAnalytics as AdminAnalyticsType } from '@/types';

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader />;

  // Detailed platform-wide mock data for charts
  const painDistribution = [
    { score: '1-2', count: 15 },
    { score: '3-4', count: 28 },
    { score: '5-6', count: 42 },
    { score: '7-8', count: 25 },
    { score: '9-10', count: 10 },
  ];

  const monthlyTherapyUsage = [
    { month: 'Jan', Heat: 140, Vibration: 110 },
    { month: 'Feb', Heat: 180, Vibration: 150 },
    { month: 'Mar', Heat: 220, Vibration: 190 },
    { month: 'Apr', Heat: 260, Vibration: 210 },
    { month: 'May', Heat: 310, Vibration: 280 },
    { month: 'Jun', Heat: 450, Vibration: 380 },
  ];

  const heatVsVibrationPie = [
    { name: 'Heat Therapy', value: 65, color: '#FF6B6B' },
    { name: 'Vibration Therapy', value: 35, color: '#B794F6' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-rose-500" /> Platform-Wide Analytics
        </h1>
        <p className="text-gray-500">
          In-depth insights into platform usage, health pain logs, and therapy belt utilization.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          value={analytics?.totalUsers?.toString() || '0'}
          label="Total Registered"
          color="rose"
        />
        <StatCard
          icon={TrendingUp}
          value={`${analytics?.activeUsers || 0}`}
          label="Active This Week"
          color="sage"
        />
        <StatCard
          icon={Thermometer}
          value={analytics?.averagePainScore?.toFixed(1) || '0.0'}
          label="Platform Avg Pain"
          color="coral"
        />
        <StatCard
          icon={Vibrate}
          value={analytics?.totalTherapySessions?.toString() || '0'}
          label="Completed Therapies"
          color="lavender"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pain Distribution */}
        <Card title="Reported Pain Level Distribution" icon={TrendingUp} iconColor="text-coral-500">
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={painDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="score" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Therapy Volume */}
        <Card title="Monthly Therapy Sessions" icon={Vibrate} iconColor="text-lavender-500">
          <div className="h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTherapyUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="Heat" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Vibration" stroke="#B794F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart of Therapy Preferences */}
        <Card title="Therapy Preference Breakdown" icon={Thermometer} iconColor="text-rose-500" className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 mt-4">
            <div className="h-60 w-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={heatVsVibrationPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {heatVsVibrationPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {heatVsVibrationPie.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    <span className="text-gray-400 text-sm ml-2">({item.value}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default AdminAnalytics;
