import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Sliders, Database, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appAlerts, setAppAlerts] = useState(true);
  const [cycleReminders, setCycleReminders] = useState(true);
  const [therapyReminders, setTherapyReminders] = useState(true);
  
  const [safetyTimer, setSafetyTimer] = useState('20');
  const [safetyStop, setSafetyStop] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-rose-500" /> System Settings
        </h1>
        <p className="text-gray-500">
          Personalize your wellness notifications, device safety parameters, and account settings.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Notifications */}
        <Card title="Notification Configurations" icon={Bell} iconColor="text-rose-500">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100/60">
              <div>
                <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                <p className="text-xs text-gray-500">Receive periodic wellness reports and cycle alerts via email.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-300 text-rose-500 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100/60">
              <div>
                <h3 className="font-semibold text-gray-800">App Push Notifications</h3>
                <p className="text-xs text-gray-500">Get reminders directly inside Bloom on active wellness goals.</p>
              </div>
              <input
                type="checkbox"
                checked={appAlerts}
                onChange={e => setAppAlerts(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-300 text-rose-500 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100/60">
              <div>
                <h3 className="font-semibold text-gray-800">Upcoming Period Reminders</h3>
                <p className="text-xs text-gray-500">Receive an alert 3 days prior to your estimated start date.</p>
              </div>
              <input
                type="checkbox"
                checked={cycleReminders}
                onChange={e => setCycleReminders(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-300 text-rose-500 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-semibold text-gray-800">Therapy Recommendations</h3>
                <p className="text-xs text-gray-500">Alert me when it is time for heat or vibration therapies.</p>
              </div>
              <input
                type="checkbox"
                checked={therapyReminders}
                onChange={e => setTherapyReminders(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-300 text-rose-500 focus:ring-rose-400"
              />
            </div>
          </div>
        </Card>

        {/* Wearable Belt Preset Settings */}
        <Card title="Wearable Device Safety Defaults" icon={Sliders} iconColor="text-lavender-500">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-100/60">
              <div>
                <h3 className="font-semibold text-gray-800">Maximum Session Duration</h3>
                <p className="text-xs text-gray-500">Auto shutoff device therapy after this session limit.</p>
              </div>
              <select
                value={safetyTimer}
                onChange={e => setSafetyTimer(e.target.value)}
                className="px-3 py-2 bg-white border border-rose-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300/40 text-sm font-semibold text-gray-700"
              >
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-semibold text-gray-800">Extreme Heat Protection</h3>
                <p className="text-xs text-gray-500">Auto shutoff heating belt if skin-contact temperatures peak.</p>
              </div>
              <input
                type="checkbox"
                checked={safetyStop}
                onChange={e => setSafetyStop(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-300 text-rose-500 focus:ring-rose-400"
              />
            </div>
          </div>
        </Card>

        {/* Action button */}
        <div className="flex items-center gap-4">
          <Button type="submit" isLoading={saving} className="w-full sm:w-auto">
            Save Preferences
          </Button>
          {saved && (
            <span className="text-green-600 flex items-center gap-1 text-sm font-semibold animate-pulse">
              <Shield className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
        </div>
      </form>

      {/* Danger Zone */}
      <Card title="Danger Settings Zone" icon={AlertTriangle} iconColor="text-red-500" className="border-red-100">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <h3 className="font-semibold text-gray-800">Delete Account Permanently</h3>
              <p className="text-xs text-gray-500">Deletes all pain records, cycle logs, and credential information permanently.</p>
            </div>
            <Button variant="danger" className="py-2 text-xs self-start sm:self-auto">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default Settings;
