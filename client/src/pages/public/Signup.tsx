import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Flower2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pass: string): { label: string; color: string; width: string } => {
    if (pass.length === 0) return { label: '', color: 'bg-gray-200', width: 'w-0' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-red-400', width: 'w-1/3' };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass))
      return { label: 'Medium', color: 'bg-amber-400', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-sage-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lavender-400 via-purple-400 to-rose-400 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-16 right-20 w-36 h-36 bg-white/10 rounded-full animate-float" />
        <div className="absolute bottom-24 left-16 w-28 h-28 bg-white/10 rounded-full animate-float delay-300" />
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-white/10 rounded-full animate-pulse-soft" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <Flower2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">Begin Your Journey</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Join thousands of women taking control of their menstrual health with smart, personalized wellness tools.
          </p>
          <div className="mt-12 space-y-4 text-left">
            {[
              'Personalized cycle predictions',
              'AI-powered pain pattern analysis',
              'Smart wearable therapy control',
              'Guided relaxation & breathing',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-cream">
        <div className="w-full max-w-md animate-slide-up">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">Bloom</span>
          </div>

          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Start your wellness journey today.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="Create a password"
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
              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} ${strength.width} rounded-full transition-all duration-300`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${strength.label === 'Strong' ? 'text-sage-600' : strength.label === 'Medium' ? 'text-amber-600' : 'text-red-500'}`}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
            />

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-rose-500 focus:ring-rose-400"
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <span className="text-rose-500 font-medium cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-rose-500 font-medium cursor-pointer hover:underline">Privacy Policy</span>
              </span>
            </label>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-500 hover:text-rose-600 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
