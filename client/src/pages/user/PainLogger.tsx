import React, { useState, useEffect } from 'react';
import { HeartPulse, Trash2, Send } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { painLogService } from '@/services/painLogService';
import type { PainLog } from '@/types';

const SYMPTOMS = [
  'Cramps', 'Headache', 'Back Pain', 'Bloating', 'Fatigue',
  'Nausea', 'Breast Tenderness', 'Mood Swings', 'Insomnia', 'Dizziness',
];

const MOODS = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Neutral', emoji: '😐' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Anxious', emoji: '😰' },
  { label: 'Irritated', emoji: '😤' },
  { label: 'Energetic', emoji: '⚡' },
];

const painEmojis = ['😊', '🙂', '😐', '😕', '😣', '😖', '😩', '😫', '🥵', '😭'];

const PainLogger: React.FC = () => {
  const [logs, setLogs] = useState<PainLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [painScore, setPainScore] = useState(3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await painLogService.getPainLogs({ limit: 20 });
      setLogs(data.data || []);
    } catch {
      // defaults
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setSaving(true);
    try {
      await painLogService.createPainLog({
        painScore,
        symptoms: selectedSymptoms,
        mood: selectedMood.toLowerCase(),
        notes,
        timestamp: new Date().toISOString(),
      });
      // Reset form
      setPainScore(3);
      setSelectedSymptoms([]);
      setSelectedMood('');
      setNotes('');
      fetchLogs();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await painLogService.deletePainLog(id);
      fetchLogs();
    } catch {
      // handle error
    }
  };

  const getPainGradient = (score: number) => {
    if (score <= 3) return 'from-sage-400 to-emerald-400';
    if (score <= 6) return 'from-amber-400 to-orange-400';
    return 'from-red-400 to-rose-500';
  };

  const getPainBadgeVariant = (score: number): 'sage' | 'coral' | 'red' => {
    if (score <= 3) return 'sage';
    if (score <= 6) return 'coral';
    return 'red';
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-800">Pain Logger</h1>
        <p className="text-gray-500 text-sm">Track your pain levels, symptoms, and moods</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Logger Form */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Pain Level Slider */}
            <Card title="Pain Level" icon={HeartPulse} iconColor="text-coral-400" className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-5xl">{painEmojis[painScore - 1]}</span>
                  <div className="text-right">
                    <span className={`text-4xl font-display font-bold bg-gradient-to-r ${getPainGradient(painScore)} bg-clip-text text-transparent`}>
                      {painScore}
                    </span>
                    <span className="text-gray-400 text-lg">/10</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={painScore}
                  onChange={(e) => setPainScore(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-rose-500"
                  style={{
                    background: `linear-gradient(to right, #68D391 0%, #fbbf24 50%, #ef4444 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>No pain</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </Card>

            {/* Symptoms */}
            <Card title="Symptoms" className="mb-6">
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedSymptoms.includes(symptom)
                        ? 'gradient-primary text-white shadow-md scale-[1.02]'
                        : 'bg-white/50 text-gray-600 border border-gray-100 hover:border-rose-200 hover:bg-rose-50/50'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </Card>

            {/* Mood Selector */}
            <Card title="How are you feeling?" className="mb-6">
              <div className="grid grid-cols-4 gap-3">
                {MOODS.map((mood) => (
                  <button
                    key={mood.label}
                    type="button"
                    onClick={() => setSelectedMood(mood.label)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 ${
                      selectedMood === mood.label
                        ? 'bg-rose-50 border-2 border-rose-300 shadow-sm scale-[1.03]'
                        : 'bg-white/40 border-2 border-transparent hover:bg-rose-50/30'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs font-medium text-gray-600">{mood.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card title="Notes" className="mb-6">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about how you're feeling..."
                className="input-field resize-none h-24"
              />
            </Card>

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={saving}>
              <Send className="w-4 h-4" />
              Log Entry
            </Button>
          </form>
        </div>

        {/* Recent Logs */}
        <div className="lg:col-span-2">
          <Card title="Recent Logs" className="sticky top-6">
            {logs.length > 0 ? (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                {logs.map((log) => (
                  <div key={log._id} className="bg-white/40 rounded-xl p-4 hover:bg-white/60 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPainBadgeVariant(log.painScore)}>
                          Pain: {log.painScore}/10
                        </Badge>
                        <span className="text-lg">
                          {MOODS.find((m) => m.label.toLowerCase() === log.mood)?.emoji || '😐'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {log.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {log.symptoms.map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {log.notes && <p className="text-xs text-gray-400 line-clamp-2">{log.notes}</p>}
                    <p className="text-xs text-gray-300 mt-2">
                      {new Date(log.timestamp).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No Logs Yet" message="Start logging to see your entries here." />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PainLogger;
