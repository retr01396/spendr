import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus 
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { DEFAULT_CURRENCY, formatCurrency } from '../../constants/currencies';
import type { Subscription } from '../../types/subscription';
import { SkeletonCard } from '../ui/SkeletonLoader';
import { ErrorState } from '../ui/ErrorState';

export const CalendarView: React.FC = () => {
  const { subscriptions, preferences, loading, error, openAddModal, openEditModal } = useSubscription();
  const activeCurrency = preferences?.currency || DEFAULT_CURRENCY;

  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026 default
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  if (loading && subscriptions.length === 0) {
    return <SkeletonCard className="h-[600px]" />;
  }

  if (error && subscriptions.length === 0) {
    return <ErrorState message={error} />;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToday = () => setCurrentDate(new Date());

  // Map subscriptions by YYYY-MM-DD
  const subsByDate: Record<string, Subscription[]> = {};
  subscriptions.forEach((sub) => {
    const dStr = sub.next_billing_date; // YYYY-MM-DD
    if (!subsByDate[dStr]) subsByDate[dStr] = [];
    subsByDate[dStr].push(sub);
  });

  const selectedSubs = selectedDateStr ? (subsByDate[selectedDateStr] || []) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#FF3B30]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono">{monthNames[month]} {year}</h2>
            <p className="text-xs text-[#8888A0]">Track upcoming renewal dates visually across the month</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 bg-[#1A1A22] hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={resetToday}
            className="px-3 py-1.5 bg-[#1A1A22] hover:bg-white/10 text-xs font-semibold text-white rounded-lg border border-white/10 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 bg-[#1A1A22] hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar & Day Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Monthly Calendar Grid (3 Cols) */}
        <div className="lg:col-span-3 bg-[#121216] border border-white/10 rounded-2xl p-6 shadow-xl">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#666680]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-24 bg-[#0A0A0C]/50 rounded-xl border border-white/5 opacity-30" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const daySubs = subsByDate[dateStr] || [];
              const hasSubs = daySubs.length > 0;
              const isSelected = selectedDateStr === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-24 p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1A1A22] border-[#E50914] ring-1 ring-[#E50914] shadow-red-glow'
                      : hasSubs
                      ? 'bg-[#0A0A0C] border-[#E50914]/40 hover:border-[#E50914]'
                      : 'bg-[#0A0A0C] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold ${hasSubs ? 'text-[#FF3B30]' : 'text-[#8888A0]'}`}>
                      {dayNum}
                    </span>
                    {hasSubs && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shadow-red-glow" />
                    )}
                  </div>

                  {/* Badges preview */}
                  <div className="space-y-1 overflow-hidden">
                    {daySubs.slice(0, 2).map((s) => (
                      <div key={s.id} className="px-1.5 py-0.5 bg-[#E50914]/20 border border-[#E50914]/40 rounded text-[10px] font-medium text-white truncate">
                        {s.name.split(' ')[0]} {formatCurrency(Number(s.amount), s.currency || activeCurrency)}
                      </div>
                    ))}
                    {daySubs.length > 2 && (
                      <span className="text-[9px] text-[#8888A0] font-mono block text-right">+{daySubs.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Subscriptions Sidebar (1 Col) */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">
              {selectedDateStr ? `Due on ${selectedDateStr}` : 'Select a Date'}
            </h3>
            <p className="text-xs text-[#8888A0] mb-4">Click any date cell to view exact scheduled payments</p>

            {selectedDateStr ? (
              selectedSubs.length > 0 ? (
                <div className="space-y-3">
                  {selectedSubs.map((sub) => (
                    <div key={sub.id} className="p-3 bg-[#0A0A0C] border border-[#E50914]/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{sub.name}</span>
                        <span className="text-xs font-mono font-bold text-[#FF3B30]">{formatCurrency(Number(sub.amount), sub.currency || activeCurrency)}</span>
                      </div>
                      <p className="text-[11px] text-[#8888A0]">{sub.category} • {sub.billing_cycle}</p>
                      <button
                        onClick={() => openEditModal(sub)}
                        className="w-full text-center py-1 bg-white/5 hover:bg-white/15 text-xs text-white rounded transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-[#0A0A0C] border border-white/5 rounded-xl text-center text-xs text-[#8888A0]">
                  No subscriptions due on {selectedDateStr}.
                </div>
              )
            ) : (
              <div className="p-6 bg-[#0A0A0C] border border-white/5 rounded-xl text-center text-xs text-[#8888A0]">
                Select a day on the calendar to inspect due items.
              </div>
            )}
          </div>

          <button
            onClick={openAddModal}
            className="w-full mt-6 py-2.5 bg-[#E50914] hover:bg-[#FF3B30] text-white text-xs font-medium rounded-xl shadow-red-glow transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      </div>
    </div>
  );
};
