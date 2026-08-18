import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Target, 
  Zap 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell 
} from 'recharts';
import { useSubscription } from '../../context/SubscriptionContext';
import { SkeletonCard } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';

export const AnalyticsView: React.FC = () => {
  const { metrics, loading, error, subscriptions } = useSubscription();

  if (loading && !metrics) {
    return <SkeletonCard className="h-96" />;
  }

  if (error && !metrics) {
    return <ErrorState message={error} />;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return <EmptyState />;
  }

  const {
    monthly_spend = 0,
    annual_projection = 0,
    active_count = 0,
    upcoming_count = 0,
    monthly_budget = 750,
    remaining_budget = 411.53,
    category_distribution = [],
    top_impact_subscriptions = [],
  } = metrics || {};

  const budgetUsedPct = Math.min(100, roundVal((monthly_spend / (monthly_budget || 1)) * 100));

  function roundVal(num: number) {
    return Math.round(num * 10) / 10;
  }

  return (
    <div className="space-y-6">
      {/* 4 Real Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs text-[#8888A0] font-semibold uppercase tracking-wider mb-2">
            <span>Monthly Spend</span>
            <DollarSign className="w-4 h-4 text-[#E50914]" />
          </div>
          <h3 className="text-3xl font-bold font-mono text-white">${monthly_spend.toFixed(2)}</h3>
          <p className="text-xs text-[#8888A0] mt-1">Total active recurring expenses</p>
        </div>

        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs text-[#8888A0] font-semibold uppercase tracking-wider mb-2">
            <span>Annual Run-Rate</span>
            <TrendingUp className="w-4 h-4 text-[#FF3B30]" />
          </div>
          <h3 className="text-3xl font-bold font-mono text-white">${annual_projection.toFixed(2)}</h3>
          <p className="text-xs text-[#8888A0] mt-1">12-month projected total</p>
        </div>

        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs text-[#8888A0] font-semibold uppercase tracking-wider mb-2">
            <span>Monthly Budget</span>
            <Target className="w-4 h-4 text-[#E0E0E0]" />
          </div>
          <h3 className="text-3xl font-bold font-mono text-white">${monthly_budget.toFixed(2)}</h3>
          <div className="mt-2 w-full bg-[#1A1A22] h-2 rounded-full overflow-hidden">
            <div className="bg-[#E50914] h-full rounded-full" style={{ width: `${budgetUsedPct}%` }} />
          </div>
          <p className="text-xs text-[#8888A0] mt-1 flex justify-between">
            <span>Used: {budgetUsedPct}%</span>
            <span className="text-[#FF3B30] font-mono">${remaining_budget.toFixed(2)} left</span>
          </p>
        </div>

        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs text-[#8888A0] font-semibold uppercase tracking-wider mb-2">
            <span>Active Accounts</span>
            <Zap className="w-4 h-4 text-[#E50914]" />
          </div>
          <h3 className="text-3xl font-bold font-mono text-white">{active_count}</h3>
          <p className="text-xs text-[#8888A0] mt-1">{upcoming_count} renewals due soon</p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Expense Breakdown Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-[#121216] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Expense Distribution by Category</h3>
              <p className="text-xs text-[#8888A0]">Monthly cost contribution per category</p>
            </div>
            <span className="text-xs font-mono text-[#8888A0] bg-[#1A1A22] px-3 py-1 rounded-lg border border-white/10">
              Institutional SaaS Analytics
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category_distribution} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <XAxis dataKey="category" stroke="#666680" tick={{ fontSize: 11, fill: '#8888A0' }} axisLine={false} />
                <YAxis stroke="#666680" tick={{ fontSize: 11, fill: '#8888A0' }} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0A0A0C', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Monthly Spend']}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {category_distribution.map((_, index) => (
                    <Cell key={`bar-${index}`} fill={index === 0 ? '#E50914' : index === 1 ? '#444458' : '#2A2A38'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Highest Impact Subscriptions List (1 Col) */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Highest Cost Impact</h3>
            <p className="text-xs text-[#8888A0] mb-4">Top 3 largest recurring expenses</p>

            <div className="space-y-3">
              {top_impact_subscriptions.map((sub, idx) => (
                <div key={sub.id} className="p-3 bg-[#0A0A0C] border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center font-bold text-xs text-[#FF3B30]">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{sub.name}</p>
                      <p className="text-[10px] text-[#8888A0]">{sub.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-white">${Number(sub.amount).toFixed(2)}</p>
                    <p className="text-[10px] text-[#8888A0]">/{sub.billing_cycle.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-xs text-[#8888A0] flex items-center justify-between">
            <span>Top 3 share:</span>
            <span className="font-mono text-white font-bold">
              ${top_impact_subscriptions.reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)}/mo
            </span>
          </div>
        </div>
      </div>

      {/* AI Subscription Optimization Insights */}
      <div className="bg-[#121216] border border-[#E50914]/30 rounded-2xl p-6 relative overflow-hidden shadow-red-glow">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#E50914] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">SPENDR Intelligence Insights</h4>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3B30]">
                Optimization Active
              </span>
            </div>
            <p className="text-xs text-[#E0E0E0] leading-relaxed">
              Your top 2 subscriptions (AWS & Figma) represent <strong className="text-white">83.8%</strong> of total recurring software expense. Consider evaluating annual billing for Figma to unlock an estimated 15% discount ($81.00/yr savings).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
