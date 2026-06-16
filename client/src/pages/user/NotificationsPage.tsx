import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, ShieldAlert, Sparkles, Vibrate } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'period':
        return <Calendar className="w-5 h-5 text-rose-500" />;
      case 'wellness':
        return <Sparkles className="w-5 h-5 text-lavender-500" />;
      case 'therapy':
        return <Vibrate className="w-5 h-5 text-coral-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type: Notification['type'], read: boolean) => {
    if (read) return 'bg-white/60';
    switch (type) {
      case 'period':
        return 'bg-rose-50/40 border-l-4 border-l-rose-400';
      case 'wellness':
        return 'bg-lavender-50/40 border-l-4 border-l-lavender-400';
      case 'therapy':
        return 'bg-coral-50/40 border-l-4 border-l-coral-400';
      default:
        return 'bg-gray-50/60 border-l-4 border-l-gray-400';
    }
  };

  if (loading) return <Loader />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-8 h-8 text-rose-500" /> Notifications
          </h1>
          <p className="text-gray-500">
            Keep track of your cycle predictions, wearable alerts, and wellness suggestions.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="secondary" className="self-start sm:self-auto">
            <Check className="w-4 h-4" /> Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-10 h-10 text-rose-300" />}
          title="No Notifications Yet"
          message="We'll notify you here about upcoming cycle events, customized wellness suggestions, and therapy reminders."
        />
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              className={`glass-card p-5 transition-all duration-200 flex items-start gap-4 cursor-pointer hover:shadow-md
                ${getNotificationBg(notification.type, notification.read)}
              `}
            >
              <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-base font-semibold text-gray-800 ${notification.read ? 'font-medium text-gray-600' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                  {notification.message}
                </p>
              </div>
              {!notification.read && (
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NotificationsPage;
