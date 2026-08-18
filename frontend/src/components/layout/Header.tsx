import React from 'react';
import { Search, Bell, DollarSign } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { DEFAULT_CURRENCY, formatCurrency } from '../../constants/currencies';

export const Header: React.FC = () => {
  const { activeView, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, metrics, preferences } = useSubscription();
  const activeCurrency = preferences?.currency || DEFAULT_CURRENCY;

  const titleMap: Record<string, string> = {
    dashboard: 'Overview Workspace',
    subscriptions: 'All Subscriptions',
    analytics: 'Analytics & Insights',
    calendar: 'Billing Calendar',
    settings: 'System Settings',
  };

  return (
    <header className="h-16 px-8 bg-[#0A0A0C]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{titleMap[activeView]}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-[#666680] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full h-9 pl-9 pr-4 bg-[#121216] border border-white/10 rounded-lg text-xs text-white placeholder-[#666680] focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 px-3 bg-[#121216] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Software">Software</option>
            <option value="Streaming">Streaming</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Cloud">Cloud</option>
            <option value="Utilities">Utilities</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        {/* Currency & Monthly Spend Pill */}
        {metrics && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A22] border border-white/10 rounded-lg text-xs font-mono font-semibold text-white">
            <DollarSign className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{formatCurrency(metrics.monthly_spend, activeCurrency)}/mo</span>
          </div>
        )}

        {/* Notifications Trigger */}
        <button className="w-9 h-9 rounded-lg bg-[#121216] border border-white/10 flex items-center justify-center text-[#8888A0] hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E50914] ring-2 ring-[#0A0A0C]" />
        </button>
      </div>
    </header>
  );
};
