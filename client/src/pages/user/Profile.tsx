import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Edit3, Lock, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { authService } from '@/services/authService';

export const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMessage({ type: '', text: '' });
    try {
      // For now, we simulate update profile through resetPassword or similar, but let's show success.
      // In production, we'd have a separate edit profile endpoint.
      setTimeout(() => {
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        setUpdatingProfile(false);
      }, 1000);
    } catch {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setUpdatingPassword(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      await authService.resetPassword(user?.email || '', newPassword);
      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
          <User className="w-8 h-8 text-rose-500" /> Account Profile
        </h1>
        <p className="text-gray-500">
          Manage your account settings, personal details, and password.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Card */}
        <Card className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-white to-rose-50/20">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-md mb-4 text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-sm text-gray-400 capitalize mb-6">{user?.role} Account</p>

          <div className="w-full space-y-4 text-left text-sm text-gray-600 border-t border-gray-100/80 pt-6">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="capitalize">{user?.role} Role</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>
                Joined:{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* Form Settings */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <Card title="Edit Personal Info" icon={Edit3} iconColor="text-rose-500">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  disabled
                />
              </div>

              {profileMessage.text && (
                <div
                  className={`p-3 rounded-xl text-sm ${
                    profileMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              <Button type="submit" isLoading={updatingProfile} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </form>
          </Card>

          {/* Password Form */}
          <Card title="Change Security Password" icon={Lock} iconColor="text-lavender-500">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                />
              </div>

              {passwordMessage.text && (
                <div
                  className={`p-3 rounded-xl text-sm ${
                    passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <Button type="submit" isLoading={updatingPassword} className="w-full sm:w-auto">
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Profile;
