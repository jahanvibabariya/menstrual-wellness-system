import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Flower2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { authService } from '@/services/authService';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-lavender-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Back link */}
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">Bloom</span>
          </div>

          {success ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-sage-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-gray-800 mb-2">Password Reset!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link to="/login">
                <Button variant="primary" fullWidth>
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-display font-bold text-gray-800 mb-2">Reset Password</h1>
              <p className="text-gray-500 text-sm mb-6">
                Enter your email and new password below.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-slide-down">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  icon={Mail}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="New Password"
                  type="password"
                  icon={Lock}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  icon={Lock}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
                />
                <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg">
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
