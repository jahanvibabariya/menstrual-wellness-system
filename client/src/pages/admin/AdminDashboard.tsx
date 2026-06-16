import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Heart,
  TrendingUp,
  FileText,
  ClipboardList,
  UserCheck,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { StatCard } from '@/components/common/StatCard';
import { Loader } from '@/components/common/Loader';
import { adminService } from '@/services/adminService';
import type { AdminAnalytics } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
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

  // Mock registration data for trend visualization
  const trendData = [
    { name: 'Jan', users: 12 },
    { name: 'Feb', users: 19 },
    { name: 'Mar', users: 32 },
    { name: 'Apr', users: 48 },
    { name: 'May', users: 65 },
    { name: 'Jun', users: analytics?.totalUsers || 78 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="gradient-secondary rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Bloom Admin Portal</h1>
          <p className="text-white/80 max-w-lg">
            Manage system users, review platform-wide wellness metrics, update tips, and access usage logs.
          </p>
        </div>
      </div>

      {/* Admin stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          value={analytics?.totalUsers?.toString() || '0'}
          label="Total Registered Users"
          color="rose"
        />
        <StatCard
          icon={UserCheck}
          value={analytics?.activeUsers?.toString() || '0'}
          label="Active Platform Users"
          color="sage"
        />
        <StatCard
          icon={Heart}
          value={analytics?.averagePainScore?.toFixed(1) || '0.0'}
          label="Average Pain Score"
          color="coral"
        />
        <StatCard
          icon={TrendingUp}
          value={analytics?.totalTherapySessions?.toString() || '0'}
          label="Total Therapy Sessions"
          color="lavender"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Registration Chart */}
        <Card title="User Registration Trends" icon={TrendingUp} iconColor="text-rose-500" className="lg:col-span-2">
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#F43F5E" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold text-gray-800">Quick Operations</h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="glass-card p-5 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-left flex items-center gap-4 w-full"
            >
              <div className="p-3 bg-rose-100 rounded-xl text-rose-500">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">User Control</h3>
                <p className="text-xs text-gray-400 mt-0.5">Toggle status and review profiles.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/content')}
              className="glass-card p-5 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-left flex items-center gap-4 w-full"
            >
              <div className="p-3 bg-lavender-100 rounded-xl text-lavender-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Educational Tips</h3>
                <p className="text-xs text-gray-400 mt-0.5">Publish & edit relaxation files.</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/reports')}
              className="glass-card p-5 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-left flex items-center gap-4 w-full"
            >
              <div className="p-3 bg-sage-100 rounded-xl text-sage-500">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Usage Reports</h3>
                <p className="text-xs text-gray-400 mt-0.5">Generate trend analysis docs.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
