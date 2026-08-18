import React from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  PlusCircle, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useSubscription } from '../../context/SubscriptionContext';
import { SkeletonDashboard } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { MetallicCard3D } from '../3d/MetallicCard3D';

export const DashboardView: React.FC = () => {
  const { metrics, loading, error, subscriptions, openAddModal, openEditModal, openDeleteModal } = useSubscription();

  if (loading && !metrics) {
    return <SkeletonDashboard />;
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
    category_distribution = [],
    spending_trend = [],
    due_soon_subscriptions = [],
  } = metrics || {};

  // Color palette for Donut slice highlights (Red primary, dark grey secondaries)
  const DONUT_COLORS = ['#E50914', '#444458', '#2A2A38', '#1A1A24', '#121216'];

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Spend Hero Card */}
        <div className="bg-[#121216] border border-[#E50914]/40 rounded-2xl p-6 relative overflow-hidden shadow-red-glow flex flex-col justify-between">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#E50914] via-[#FF3B30] to-transparent" />
          <div>
            <div className="flex items-center justify-between text-[#8888A0] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Monthly Spend</span>
              <span className="p-1 rounded bg-[#E50914]/15 text-[#FF3B30]">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-3xl font-bold font-mono text-white tracking-tight">
              ${monthly_spend.toFixed(2)}
            </h3>
            <p className="text-xs text-[#8888A0] mt-1 flex items-center gap-1">
              <span className="text-[#FF3B30] font-semibold flex items-center">
                +4.2% <ArrowUpRight className="w-3 h-3" />
              </span>
              vs last month
            </p>
          </div>

          {/* Integrated Subtle 3D Metallic Card */}
          <div className="mt-4 pt-2 border-t border-white/5">
            <MetallicCard3D className="h-28" />
          </div>
        </div>

        {/* Annual Projection */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8888A0] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Annual Projection</span>
              <span className="p-1 rounded bg-white/5 text-[#E0E0E0]">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-3xl font-bold font-mono text-white tracking-tight">
              ${annual_projection.toFixed(2)}
            </h3>
            <p className="text-xs text-[#8888A0] mt-1">Calculated 12-month run-rate</p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#666680]">
            <span>Average / month</span>
            <span className="font-mono text-white">${(annual_projection / 12).toFixed(2)}</span>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8888A0] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Active Subscriptions</span>
              <span className="p-1 rounded bg-white/5 text-[#E0E0E0]">
                <CreditCard className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-3xl font-bold font-mono text-white tracking-tight">
              {active_count}
            </h3>
            <p className="text-xs text-[#8888A0] mt-1">Managed services in system</p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#666680]">
            <span>Total Tracked</span>
            <span className="font-mono text-white">{subscriptions.length}</span>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[#8888A0] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Upcoming (7 Days)</span>
              <span className="p-1 rounded bg-white/5 text-[#E50914]">
                <Calendar className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-3xl font-bold font-mono text-white tracking-tight">
              {upcoming_count}
            </h3>
            <p className="text-xs text-[#8888A0] mt-1">Renewals due this week</p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#666680]">
            <span>Next Due</span>
            <span className="font-mono text-[#FF3B30]">
              {due_soon_subscriptions[0]?.name ? due_soon_subscriptions[0].name.split(' ')[0] : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend Line Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-[#121216] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Spending Trend</h3>
              <p className="text-xs text-[#8888A0]">Monthly recurring spend over time</p>
            </div>
            <span className="text-xs font-mono text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/30 px-2.5 py-1 rounded-full">
              6 Month Trajectory
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spending_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendrRedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#666680" tick={{ fontSize: 11, fill: '#8888A0' }} axisLine={false} />
                <YAxis stroke="#666680" tick={{ fontSize: 11, fill: '#8888A0' }} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#0A0A0C', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Spend']}
                />
                <Area type="monotone" dataKey="amount" stroke="#E50914" strokeWidth={2.5} fillOpacity={1} fill="url(#spendrRedGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut Chart (1 Col) */}
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-1">Category Breakdown</h3>
            <p className="text-xs text-[#8888A0] mb-4">Share of total monthly spend</p>
          </div>

          {category_distribution.length > 0 ? (
            <div className="relative h-52 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={category_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {category_distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0A0A0C', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-[#8888A0]">Total</span>
                <span className="text-lg font-bold font-mono text-white">${monthly_spend.toFixed(0)}</span>
              </div>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-xs text-[#666680]">No category data</div>
          )}

          <div className="space-y-1.5 pt-4 border-t border-white/5">
            {category_distribution.slice(0, 3).map((item, idx) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }} />
                  <span className="text-[#E0E0E0]">{item.category}</span>
                </div>
                <span className="font-mono text-[#8888A0]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Due Soon Subscriptions Table */}
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Upcoming Renewals (Due Soon)</h3>
            <p className="text-xs text-[#8888A0]">Subscriptions renewing in the next 14 days</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A22] hover:bg-white/10 text-white text-xs font-medium rounded-lg border border-white/10 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#E50914]" />
            Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-[#666680] bg-[#0A0A0C]">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {due_soon_subscriptions.length > 0 ? (
                due_soon_subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#1A1A22] transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#1A1A22] border border-white/10 flex items-center justify-center text-white font-bold text-xs uppercase">
                          {sub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{sub.name}</p>
                          <p className="text-xs text-[#8888A0]">{sub.notes || 'No notes'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#E0E0E0]">{sub.category}</td>
                    <td className="py-3.5 px-4 text-xs font-mono text-[#FF3B30] flex items-center gap-1">
                      <Clock className="w-3 h-3 inline" />
                      {sub.next_billing_date}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#8888A0]">{sub.billing_cycle}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">${Number(sub.amount).toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-xs text-white rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(sub)}
                          className="px-2.5 py-1 bg-[#E50914]/15 hover:bg-[#E50914]/30 text-xs text-[#FF3B30] rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#8888A0]">
                    No subscriptions due in the next 14 days.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
