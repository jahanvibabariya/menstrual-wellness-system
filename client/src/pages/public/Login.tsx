import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Flower2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden items-center justify-center p-12">
        {/* Floating circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full animate-float delay-300" />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/10 rounded-full animate-float delay-500" />
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-white/5 rounded-full animate-pulse-soft" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <Flower2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Continue your wellness journey. Your body, your data, your insights — all in one place.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">🌸</p>
              <p className="text-xs text-white/70 mt-1">Track</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">💆</p>
              <p className="text-xs text-white/70 mt-1">Heal</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">✨</p>
              <p className="text-xs text-white/70 mt-1">Thrive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-cream">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">Bloom</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">Sign In</h1>
          <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-rose-500 focus:ring-rose-400"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-rose-500 hover:text-rose-600 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
