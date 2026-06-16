import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Vibrate, Thermometer, Waves, Play, Pause, Square,
  Bluetooth, BluetoothOff, Battery, AlertTriangle,
  Flame, Wind, Zap, Timer, Power,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { therapyService } from '@/services/therapyService';

type HeatLevel = 'low' | 'medium' | 'high' | null;
type VibrationMode = 'gentle' | 'moderate' | 'strong' | null;

const DURATIONS = [5, 10, 15, 20, 30, 45, 60];

const WearableControl: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [battery, setBattery] = useState(78);
  const [heatLevel, setHeatLevel] = useState<HeatLevel>(null);
  const [vibrationMode, setVibrationMode] = useState<VibrationMode>(null);
  const [duration, setDuration] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [autoShutoff, setAutoShutoff] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = duration * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setIsConnected(!isConnected);
      setConnecting(false);
      if (isConnected) {
        handleStop();
      }
    }, 1500);
  };

  const handleStart = useCallback(() => {
    if (!heatLevel && !vibrationMode) return;
    setTimeRemaining(duration * 60);
    setIsRunning(true);
  }, [heatLevel, vibrationMode, duration]);

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleEmergencyStop = () => {
    handleStop();
    setHeatLevel(null);
    setVibrationMode(null);
  };

  const saveSession = useCallback(async () => {
    if (!heatLevel || !vibrationMode) return;
    try {
      await therapyService.createSession({
        heatLevel,
        vibrationMode,
        duration,
      });
    } catch {
      // silent
    }
  }, [heatLevel, vibrationMode, duration]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            saveSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeRemaining, saveSession]);

  // SVG circle params
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Wearable Control</h1>
        <p className="text-gray-500 text-sm">Manage your WellBelt Pro therapy device</p>
      </div>

      {/* Device Status */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-lavender-100/40 to-transparent rounded-bl-full" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isConnected
                  ? 'bg-sage-50 shadow-lg shadow-sage-100'
                  : 'bg-gray-100'
              }`}
            >
              {isConnected ? (
                <Bluetooth className="w-7 h-7 text-sage-500" />
              ) : (
                <BluetoothOff className="w-7 h-7 text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-gray-800">WellBelt Pro</h3>
                <Badge variant={isConnected ? 'sage' : 'gray'}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              {isConnected && (
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Battery className="w-4 h-4 text-sage-500" />
                    <span className="text-sm text-gray-500">{battery}%</span>
                  </div>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs text-gray-400">Firmware v2.4.1</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant={isConnected ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleConnect}
            isLoading={connecting}
          >
            <Power className="w-4 h-4" />
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </Card>

      {!isConnected ? (
        <div className="glass-card p-12 text-center">
          <BluetoothOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-gray-600 mb-2">Device Not Connected</h3>
          <p className="text-gray-400 text-sm mb-6">Connect your WellBelt Pro to access therapy controls.</p>
          <Button variant="primary" onClick={handleConnect} isLoading={connecting}>
            <Bluetooth className="w-4 h-4" />
            Connect Device
          </Button>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Heat Therapy */}
            <Card title="Heat Therapy" icon={Thermometer} iconColor="text-coral-500">
              <div className="grid grid-cols-3 gap-3">
                {([
                  { level: 'low' as const, label: 'Low', temp: '38°C', icon: Flame, color: 'amber' },
                  { level: 'medium' as const, label: 'Medium', temp: '42°C', icon: Flame, color: 'orange' },
                  { level: 'high' as const, label: 'High', temp: '46°C', icon: Flame, color: 'red' },
                ]).map((h) => (
                  <button
                    key={h.level}
                    onClick={() => setHeatLevel(heatLevel === h.level ? null : h.level)}
                    disabled={isRunning}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                      heatLevel === h.level
                        ? `border-${h.color}-300 bg-${h.color}-50 shadow-md scale-[1.02]`
                        : 'border-gray-100 bg-white/40 hover:border-gray-200 hover:bg-white/60'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <h.icon
                      className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                        heatLevel === h.level ? `text-${h.color}-500` : 'text-gray-400'
                      }`}
                    />
                    <p className="text-sm font-semibold text-gray-800">{h.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{h.temp}</p>
                  </button>
                ))}
              </div>
              {/* Temperature visualization */}
              {heatLevel && (
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-red-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Temperature</span>
                    <span className="text-sm font-bold text-coral-500">
                      {heatLevel === 'low' ? '38°C' : heatLevel === 'medium' ? '42°C' : '46°C'}
                    </span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        heatLevel === 'low' ? 'w-1/3 bg-amber-400' :
                        heatLevel === 'medium' ? 'w-2/3 bg-orange-400' :
                        'w-full bg-red-400'
                      }`}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Vibration Therapy */}
            <Card title="Vibration Therapy" icon={Waves} iconColor="text-lavender-500">
              <div className="grid grid-cols-3 gap-3">
                {([
                  { mode: 'gentle' as const, label: 'Gentle', desc: 'Soothing', icon: Wind },
                  { mode: 'moderate' as const, label: 'Moderate', desc: 'Balanced', icon: Waves },
                  { mode: 'strong' as const, label: 'Strong', desc: 'Intense', icon: Zap },
                ]).map((v) => (
                  <button
                    key={v.mode}
                    onClick={() => setVibrationMode(vibrationMode === v.mode ? null : v.mode)}
                    disabled={isRunning}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                      vibrationMode === v.mode
                        ? 'border-lavender-300 bg-lavender-50 shadow-md scale-[1.02]'
                        : 'border-gray-100 bg-white/40 hover:border-gray-200 hover:bg-white/60'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <v.icon
                      className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                        vibrationMode === v.mode ? 'text-lavender-500' : 'text-gray-400'
                      }`}
                    />
                    <p className="text-sm font-semibold text-gray-800">{v.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.desc}</p>
                  </button>
                ))}
              </div>
              {/* Wave visualization */}
              {vibrationMode && (
                <div className="mt-4 p-3 rounded-xl bg-lavender-50/60">
                  <div className="flex items-center justify-center gap-1 h-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full bg-lavender-400 transition-all ${
                          isRunning ? 'animate-pulse' : ''
                        }`}
                        style={{
                          height: `${
                            vibrationMode === 'gentle' ? 8 + Math.sin(i * 0.8) * 6 :
                            vibrationMode === 'moderate' ? 10 + Math.sin(i * 1.2) * 12 :
                            14 + Math.sin(i * 1.5) * 18
                          }px`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center text-lavender-500 font-medium mt-2">
                    {vibrationMode === 'gentle' ? 'Low frequency' : vibrationMode === 'moderate' ? 'Medium frequency' : 'High frequency'}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Session Timer */}
          <Card title="Session Timer" icon={Timer} iconColor="text-sage-500">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* SVG Circular Timer */}
              <div className="relative w-52 h-52 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {/* Background circle */}
                  <circle
                    cx="100" cy="100" r={radius}
                    fill="none" stroke="#f3e8ff" strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100" cy="100" r={radius}
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fb7185" />
                      <stop offset="50%" stopColor="#B794F6" />
                      <stop offset="100%" stopColor="#68D391" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-gray-800">
                    {timeRemaining > 0 ? formatTime(timeRemaining) : formatTime(duration * 60)}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    {isRunning ? 'In Progress' : timeRemaining > 0 ? 'Paused' : 'Ready'}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-5 w-full">
                {/* Duration selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
                  <div className="flex flex-wrap gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        onClick={() => !isRunning && setDuration(d)}
                        disabled={isRunning}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          duration === d
                            ? 'gradient-primary text-white shadow-md'
                            : 'bg-white/50 text-gray-600 border border-gray-100 hover:border-rose-200'
                        } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {d}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {!isRunning && timeRemaining === 0 && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleStart}
                      disabled={!heatLevel && !vibrationMode}
                      className="flex-1"
                    >
                      <Play className="w-5 h-5" />
                      Start Session
                    </Button>
                  )}
                  {isRunning && (
                    <Button variant="secondary" size="lg" onClick={handlePause} className="flex-1">
                      <Pause className="w-5 h-5" />
                      Pause
                    </Button>
                  )}
                  {!isRunning && timeRemaining > 0 && (
                    <Button variant="primary" size="lg" onClick={handleResume} className="flex-1">
                      <Play className="w-5 h-5" />
                      Resume
                    </Button>
                  )}
                  {timeRemaining > 0 && (
                    <Button variant="ghost" size="lg" onClick={handleStop}>
                      <Square className="w-5 h-5" />
                      Stop
                    </Button>
                  )}
                </div>

                {/* Auto shutoff */}
                <div className="flex items-center justify-between bg-white/40 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-600">Auto Shutoff</span>
                  <button
                    onClick={() => setAutoShutoff(!autoShutoff)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      autoShutoff ? 'bg-sage-400' : 'bg-gray-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                        autoShutoff ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Emergency Stop + Session Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Emergency Stop</h3>
                <button
                  onClick={handleEmergencyStop}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-200/50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center mx-auto"
                >
                  <AlertTriangle className="w-10 h-10" />
                </button>
                <p className="text-xs text-gray-400 mt-3">Resets all settings immediately</p>
              </div>
            </Card>

            <Card title="Current Session" icon={Vibrate} iconColor="text-lavender-500">
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/40 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-gray-500">Heat</span>
                  <Badge variant={heatLevel ? 'coral' : 'gray'}>
                    {heatLevel ? heatLevel.charAt(0).toUpperCase() + heatLevel.slice(1) : 'Off'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-white/40 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-gray-500">Vibration</span>
                  <Badge variant={vibrationMode ? 'lavender' : 'gray'}>
                    {vibrationMode ? vibrationMode.charAt(0).toUpperCase() + vibrationMode.slice(1) : 'Off'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center bg-white/40 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-gray-500">Duration</span>
                  <span className="text-sm font-semibold text-gray-700">{duration} min</span>
                </div>
                <div className="flex justify-between items-center bg-white/40 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-gray-500">Status</span>
                  <Badge variant={isRunning ? 'sage' : timeRemaining > 0 ? 'coral' : 'gray'}>
                    {isRunning ? 'Active' : timeRemaining > 0 ? 'Paused' : 'Idle'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default WearableControl;
