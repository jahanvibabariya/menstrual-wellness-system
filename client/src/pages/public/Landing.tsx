import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarHeart,
  HeartPulse,
  Vibrate,
  BarChart3,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Flower2,
  Star,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: CalendarHeart,
    title: 'Cycle Tracking',
    description: 'Accurately track your menstrual cycle with smart predictions and fertile window estimates powered by your data.',
    color: 'from-rose-400 to-pink-400',
    bg: 'bg-rose-50',
  },
  {
    icon: HeartPulse,
    title: 'Pain Monitoring',
    description: 'Log pain levels, symptoms, and moods to identify patterns and triggers throughout your cycle.',
    color: 'from-coral-400 to-red-400',
    bg: 'bg-coral-50',
  },
  {
    icon: Vibrate,
    title: 'Smart Wearable',
    description: 'Control heat and vibration therapy through your WellBelt Pro for targeted menstrual pain relief.',
    color: 'from-lavender-400 to-purple-400',
    bg: 'bg-lavender-50',
  },
  {
    icon: BarChart3,
    title: 'Wellness Analytics',
    description: 'Visualize trends in pain, symptoms, and therapy usage with beautiful, insightful charts.',
    color: 'from-sage-400 to-emerald-400',
    bg: 'bg-sage-50',
  },
  {
    icon: Sparkles,
    title: 'Guided Relaxation',
    description: 'Access breathing exercises, meditation guides, and wellness tips tailored to your cycle phase.',
    color: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Health Data',
    description: 'Your health data is encrypted and private. You control who sees your information, always.',
    color: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-50',
  },
];

const steps = [
  {
    num: '01',
    title: 'Create Your Profile',
    description: 'Sign up in seconds and set your cycle preferences for personalized tracking.',
  },
  {
    num: '02',
    title: 'Track & Monitor',
    description: 'Log your cycles, pain levels, and symptoms. Our system learns your unique patterns.',
  },
  {
    num: '03',
    title: 'Heal & Thrive',
    description: 'Use smart wearable therapy, view insights, and follow guided relaxation for complete wellness.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Working Professional',
    text: 'Bloom has completely changed how I manage my period pain. The wearable therapy combined with cycle predictions means I can plan my life around my cycle, not the other way around.',
    rating: 5,
  },
  {
    name: 'Anika Patel',
    role: 'Graduate Student',
    text: 'The pain logging and analytics helped me identify that my worst days correlate with stress. The breathing exercises have become my go-to during tough days.',
    rating: 5,
  },
  {
    name: 'Dr. Meera Joshi',
    role: 'Gynecologist',
    text: 'I recommend Bloom to my patients. The data they bring from the app helps me understand their symptoms better and provide more targeted care.',
    rating: 5,
  },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-gradient">Bloom</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm text-gray-600 hover:text-rose-500 transition-colors font-medium">
            Testimonials
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:inline-flex text-sm font-semibold text-gray-600 hover:text-rose-500 transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary text-sm !px-5 !py-2.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-10 lg:px-20 pt-12 sm:pt-20 pb-20 sm:pb-32">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-lavender-200/30 rounded-full blur-3xl animate-pulse-soft delay-300" />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-sage-200/20 rounded-full blur-3xl animate-float" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-rose-100/50 shadow-sm mb-8 animate-slide-down">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Intelligent Menstrual Health Tracking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up">
            Smart Wearable{' '}
            <span className="text-gradient">Menstrual Wellness</span>{' '}
            System
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 animate-slide-up delay-200 leading-relaxed">
            Track your cycle, manage pain with intelligent wearable therapy, and gain deep insights into your wellness — all in one beautiful app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
            <Link to="/signup" className="btn-primary text-base !px-8 !py-4 shadow-lg shadow-rose-200/50">
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="btn-secondary text-base !px-8 !py-4">
              Learn More
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in delay-500">
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-gradient">10K+</p>
              <p className="text-xs text-gray-400 mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-gradient-lavender">98%</p>
              <p className="text-xs text-gray-400 mt-1">Pain Relief</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-gradient-sage">4.9★</p>
              <p className="text-xs text-gray-400 mt-1">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-rose mb-4 inline-block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-800 mb-4">
              Everything You Need for{' '}
              <span className="text-gradient">Complete Wellness</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A comprehensive suite of tools designed to empower you through every phase of your cycle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} bg-clip-text`} style={{ color: feature.color.includes('rose') ? '#fb7185' : feature.color.includes('coral') ? '#FF6B6B' : feature.color.includes('lavender') ? '#B794F6' : feature.color.includes('sage') ? '#68D391' : feature.color.includes('amber') ? '#fbbf24' : '#60a5fa' }} />
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-lavender mb-4 inline-block">Process</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-800 mb-4">
              How It <span className="text-gradient-lavender">Works</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Getting started is simple. Three easy steps to transform your menstrual wellness journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.num} className="relative text-center group" style={{ animationDelay: `${index * 150}ms` }}>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-rose-200 to-transparent" />
                )}
                <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg shadow-rose-200/50 group-hover:scale-110 transition-transform mb-6">
                  {step.num}
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 sm:px-10 lg:px-20 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-sage mb-4 inline-block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-800 mb-4">
              Loved by <span className="text-gradient-sage">Thousands</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Hear from women who have transformed their menstrual wellness with Bloom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-10 lg:px-20 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-primary rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                Join thousands of women who trust Bloom for their menstrual wellness. Start your free journey today.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-rose-600 font-bold rounded-xl px-8 py-4 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 lg:px-20 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-gradient">Bloom</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-rose-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-rose-500 transition-colors">How It Works</a>
              <Link to="/login" className="text-sm text-gray-400 hover:text-rose-500 transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-gray-400">© 2026 Bloom Wellness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
