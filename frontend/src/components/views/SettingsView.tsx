import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  Bell, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { SkeletonCard } from '../ui/SkeletonLoader';
import { ErrorState } from '../ui/ErrorState';

export const SettingsView: React.FC = () => {
  const { preferences, loading, error, updatePreferences } = useSubscription();

  const [monthlyBudget, setMonthlyBudget] = useState<string>('750.00');
  const [currency, setCurrency] = useState<string>('USD');
  const [reminderDays, setReminderDays] = useState<number>(3);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (preferences) {
      setMonthlyBudget(String(preferences.monthly_budget));
      setCurrency(preferences.currency || 'USD');
      setReminderDays(preferences.renewal_reminder_days || 3);
    }
  }, [preferences]);

  if (loading && !preferences) {
    return <SkeletonCard className="h-96" />;
  }

  if (error && !preferences) {
    return <ErrorState message={error} />;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const budgetVal = parseFloat(monthlyBudget);
    if (isNaN(budgetVal) || budgetVal < 0) {
      setIsSaving(false);
      return;
    }

    const success = await updatePreferences({
      monthly_budget: budgetVal,
      currency,
      renewal_reminder_days: reminderDays,
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF3B30]">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Settings & Preferences</h2>
            <p className="text-xs text-[#8888A0]">Configure financial thresholds, currency, and notifications</p>
          </div>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3B30] text-xs font-semibold rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Financial Preferences Section */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <DollarSign className="w-4 h-4 text-[#E50914]" />
            Financial Targets & Currency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-2">
                Monthly Subscription Budget ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#E50914]"
                required
              />
              <p className="text-[11px] text-[#666680] mt-1">Used to calculate budget variance on Analytics screen.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-2">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="CAD">CAD ($ - Canadian Dollar)</option>
                <option value="JPY">JPY (¥ - Japanese Yen)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <Bell className="w-4 h-4 text-[#E50914]" />
            Renewal Notifications
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-2">
                Advance Renewal Reminder Threshold
              </label>
              <select
                value={reminderDays}
                onChange={(e) => setReminderDays(Number(e.target.value))}
                className="w-full h-10 px-3.5 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value={1}>1 Day before renewal</option>
                <option value={3}>3 Days before renewal (Recommended)</option>
                <option value={7}>7 Days before renewal</option>
                <option value={14}>14 Days before renewal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF3B30] text-white font-semibold text-sm rounded-xl shadow-red-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
