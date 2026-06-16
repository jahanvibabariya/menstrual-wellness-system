import React, { useState, useEffect } from 'react';
import {
  CalendarHeart, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { cycleService } from '@/services/cycleService';
import type { Cycle, CyclePrediction } from '@/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CycleTracker: React.FC = () => {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<Cycle | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    cycleLength: 28,
    periodLength: 5,
    notes: '',
  });

  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cyclesData, predData] = await Promise.allSettled([
        cycleService.getCycles(),
        cycleService.getPrediction(),
      ]);
      if (cyclesData.status === 'fulfilled') setCycles(cyclesData.value);
      if (predData.status === 'fulfilled') setPrediction(predData.value);
    } catch {
      // defaults
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCycle) {
        await cycleService.updateCycle(editingCycle._id, formData);
      } else {
        await cycleService.createCycle(formData);
      }
      setShowModal(false);
      setEditingCycle(null);
      resetForm();
      fetchData();
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this cycle entry?')) return;
    try {
      await cycleService.deleteCycle(id);
      fetchData();
    } catch {
      // handle error
    }
  };

  const openEdit = (cycle: Cycle) => {
    setEditingCycle(cycle);
    setFormData({
      startDate: cycle.startDate.split('T')[0],
      cycleLength: cycle.cycleLength,
      periodLength: cycle.periodLength,
      notes: cycle.notes || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      startDate: new Date().toISOString().split('T')[0],
      cycleLength: 28,
      periodLength: 5,
      notes: '',
    });
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getDayType = (day: number): 'period' | 'ovulation' | 'fertile' | null => {
    if (!prediction || !cycles.length) return null;
    const dateStr = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    const latestCycle = cycles[0];
    if (!latestCycle) return null;

    const startDate = new Date(latestCycle.startDate);
    const diffDays = Math.floor((dateStr.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % latestCycle.cycleLength) + latestCycle.cycleLength) % latestCycle.cycleLength;

    if (cycleDay >= 0 && cycleDay < latestCycle.periodLength) return 'period';
    if (cycleDay >= 12 && cycleDay <= 16) return 'fertile';
    if (cycleDay === 14) return 'ovulation';
    return null;
  };

  const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1));
  const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1));

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Cycle Tracker</h1>
          <p className="text-gray-500 text-sm">Track and predict your menstrual cycle</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setEditingCycle(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Log Cycle
        </Button>
      </div>

      {/* Prediction Card */}
      {prediction && (
        <div className="gradient-primary rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <CalendarHeart className="w-5 h-5" /> Cycle Predictions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/70">Next Period</p>
              <p className="font-semibold text-sm mt-1">
                {new Date(prediction.nextPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/70">Ovulation</p>
              <p className="font-semibold text-sm mt-1">
                {new Date(prediction.estimatedOvulation).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/70">Fertile Window</p>
              <p className="font-semibold text-sm mt-1">
                {new Date(prediction.fertileWindowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                {new Date(prediction.fertileWindowEnd).toLocaleDateString('en-US', { day: 'numeric' })}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-3">
              <p className="text-xs text-white/70">Days Until Period</p>
              <p className="font-semibold text-sm mt-1">{prediction.daysUntilNextPeriod} days</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2" noPadding>
          <div className="p-6">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-gray-800">
                {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-rose-50 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-rose-50 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getFirstDayOfMonth(calendarDate) }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(calendarDate) }).map((_, i) => {
                const day = i + 1;
                const type = getDayType(day);
                const isToday = new Date().getDate() === day &&
                  new Date().getMonth() === calendarDate.getMonth() &&
                  new Date().getFullYear() === calendarDate.getFullYear();

                return (
                  <div
                    key={day}
                    className={`relative flex items-center justify-center h-10 rounded-xl text-sm font-medium transition-all
                      ${type === 'period' ? 'bg-rose-100 text-rose-700' : ''}
                      ${type === 'ovulation' ? 'bg-lavender-100 text-lavender-700' : ''}
                      ${type === 'fertile' ? 'bg-sage-100 text-sage-700' : ''}
                      ${!type ? 'hover:bg-gray-50 text-gray-600' : ''}
                      ${isToday ? 'ring-2 ring-rose-400 font-bold' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-300" />
                <span className="text-xs text-gray-500">Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-lavender-300" />
                <span className="text-xs text-gray-500">Ovulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sage-300" />
                <span className="text-xs text-gray-500">Fertile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full ring-2 ring-rose-400 bg-white" />
                <span className="text-xs text-gray-500">Today</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Cycle History */}
        <Card title="Cycle History" icon={CalendarHeart}>
          {cycles.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {cycles.map((cycle) => (
                <div key={cycle._id} className="bg-white/40 rounded-xl p-4 hover:bg-white/60 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(cycle.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="rose">{cycle.cycleLength}d cycle</Badge>
                        <Badge variant="lavender">{cycle.periodLength}d period</Badge>
                      </div>
                      {cycle.notes && <p className="text-xs text-gray-400 mt-2 line-clamp-1">{cycle.notes}</p>}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(cycle)} className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cycle._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Cycles Logged"
              message="Start tracking your cycle to see history and predictions."
              actionLabel="Log Cycle"
              onAction={() => setShowModal(true)}
            />
          )}
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingCycle(null); }} title={editingCycle ? 'Edit Cycle' : 'Log New Cycle'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cycle Length (days)"
              type="number"
              min={20}
              max={45}
              value={formData.cycleLength}
              onChange={(e) => setFormData({ ...formData, cycleLength: parseInt(e.target.value) || 28 })}
            />
            <Input
              label="Period Length (days)"
              type="number"
              min={2}
              max={10}
              value={formData.periodLength}
              onChange={(e) => setFormData({ ...formData, periodLength: parseInt(e.target.value) || 5 })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              className="input-field resize-none h-20"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingCycle(null); }} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving} className="flex-1">
              {editingCycle ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CycleTracker;
