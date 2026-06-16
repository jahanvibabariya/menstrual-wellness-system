import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await notificationService.getNotifications();
        const unread = notifications.filter((n: Notification) => !n.read).length;
        setUnreadCount(unread);
      } catch {
        // Silently fail — header is non-critical
      }
    };
    fetchNotifications();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-cream/70 backdrop-blur-xl border-b border-white/30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left: Menu + Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-rose-50 text-gray-500 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-gray-800">
              {getGreeting()}, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
            </h2>
            <p className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: Search + Notifications + Avatar */}
        <div className="flex items-center gap-3">
          {/* Search (functional) */}
          <div className="hidden md:flex items-center bg-white/50 backdrop-blur rounded-xl px-3 py-2 border border-white/30 gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search wellness tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  const dest = user?.role === 'admin' ? '/admin/content' : '/dashboard/relaxation';
                  navigate(`${dest}?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-40"
            />
          </div>

          {/* Notification bell */}
          <button
            onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard/notifications')}
            className="relative p-2.5 rounded-xl bg-white/50 backdrop-blur border border-white/30 hover:bg-rose-50 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User avatar */}
          <button
            onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard/profile')}
            className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
