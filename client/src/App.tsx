import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { AdminRoute } from '@/components/guards/AdminRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Public Pages
import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import ResetPassword from '@/pages/public/ResetPassword';

// User Pages
import Dashboard from '@/pages/user/Dashboard';
import CycleTracker from '@/pages/user/CycleTracker';
import PainLogger from '@/pages/user/PainLogger';
import Analytics from '@/pages/user/Analytics';
import WearableControl from '@/pages/user/WearableControl';
import Relaxation from '@/pages/user/Relaxation';
import NotificationsPage from '@/pages/user/NotificationsPage';
import Profile from '@/pages/user/Profile';
import Settings from '@/pages/user/Settings';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import ContentManagement from '@/pages/admin/ContentManagement';
import Reports from '@/pages/admin/Reports';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/cycles" element={<CycleTracker />} />
              <Route path="/dashboard/pain-logger" element={<PainLogger />} />
              <Route path="/dashboard/analytics" element={<Analytics />} />
              <Route path="/dashboard/wearable" element={<WearableControl />} />
              <Route path="/dashboard/relaxation" element={<Relaxation />} />
              <Route path="/dashboard/notifications" element={<NotificationsPage />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/content" element={<ContentManagement />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
