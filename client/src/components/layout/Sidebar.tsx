import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarHeart,
  HeartPulse,
  BarChart3,
  Vibrate,
  Sparkles,
  Bell,
  User,
  LogOut,
  Users,
  FileText,
  ClipboardList,
  X,
  Flower2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const userNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/cycles', icon: CalendarHeart, label: 'Cycle Tracker' },
  { to: '/dashboard/pain-logger', icon: HeartPulse, label: 'Pain Logger' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/wearable', icon: Vibrate, label: 'Wearable Control' },
  { to: '/dashboard/relaxation', icon: Sparkles, label: 'Relaxation' },
  { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
];

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/content', icon: FileText, label: 'Content' },
  { to: '/admin/reports', icon: ClipboardList, label: 'Reports' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : userNavItems;
  const isAdminSection = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white/80 backdrop-blur-2xl border-r border-white/30 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-gradient">Bloom</h1>
                <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                  Wellness
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-rose-50 text-gray-400 lg:hidden transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin/User toggle for admin users */}
          {isAdmin && (
            <div className="px-4 mb-2">
              <div className="flex bg-gray-100/80 rounded-xl p-1">
                <button
                  onClick={() => navigate('/admin')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isAdminSection
                      ? 'bg-white shadow-sm text-rose-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    !isAdminSection
                      ? 'bg-white shadow-sm text-rose-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  User View
                </button>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-100/60 px-4 py-4 space-y-1">
            <NavLink
              to={isAdminSection ? '/admin' : '/dashboard/profile'}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </NavLink>
            <button
              onClick={handleLogout}
              className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
