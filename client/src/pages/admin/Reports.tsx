import React, { useState } from 'react';
import { ClipboardList, Download, Calendar, Filter, Users, Heart, Shield } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [reportType, setReportType] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReportData({
        totalSignups: 145,
        avgPainReported: 5.4,
        totalTherapySessions: 412,
        avgSessionDuration: 24.3,
        commonSymptom: 'cramps (64%)',
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-rose-500" /> Platform Reports & Audit
        </h1>
        <p className="text-gray-500">
          Generate, download, and review system-wide usage metrics and health logs.
        </p>
      </div>

      <Card title="Report Generation Controls" icon={Filter} iconColor="text-rose-500">
        <form onSubmit={handleGenerate} className="grid sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Report Category</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300/40 text-sm font-semibold text-gray-700"
            >
              <option value="all">Full System Summary</option>
              <option value="users">User Signups & Cohorts</option>
              <option value="health">Pain Metrics & Symptoms</option>
              <option value="therapy">Therapy Belt Usage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300/40 text-sm font-semibold text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300/40 text-sm font-semibold text-gray-700"
            />
          </div>

          <Button type="submit" isLoading={generating} className="w-full">
            Generate Report
          </Button>
        </form>
      </Card>

      {reportData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-gray-800">Generated Report Results</h2>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 flex items-start gap-4">
              <div className="p-3 bg-rose-100 rounded-xl text-rose-500">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">New Cohorts</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">+{reportData.totalSignups}</h3>
              </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4">
              <div className="p-3 bg-coral-100 rounded-xl text-coral-500">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Avg Pain Score</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{reportData.avgPainReported} / 10</h3>
              </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4">
              <div className="p-3 bg-lavender-100 rounded-xl text-lavender-500">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Belt Activations</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{reportData.totalTherapySessions}</h3>
              </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4">
              <div className="p-3 bg-sage-100 rounded-xl text-sage-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Primary Symptom</p>
                <h3 className="text-lg font-bold text-gray-800 mt-2 truncate">{reportData.commonSymptom}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Reports;
