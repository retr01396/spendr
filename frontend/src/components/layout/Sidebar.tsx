import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Calendar, 
  Settings, 
  Flame, 
  PlusCircle, 
  User 
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import type { ViewType } from '../../types/subscription';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'calendar', label: 'Billing Calendar', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, openAddModal } = useSubscription();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-[#0A0A0C] border-r border-white/10 flex flex-col justify-between z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-[#E50914] flex items-center justify-center text-white shadow-red-glow">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
              SPENDR <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#E50914]/20 border border-[#E50914]/40 text-[#FF3B30]">PRO</span>
            </h1>
            <p className="text-[11px] text-[#666680]">Subscription Manager</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={openAddModal}
            className="w-full h-11 bg-[#E50914] hover:bg-[#FF3B30] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-red-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Add Subscription
          </button>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full h-11 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all relative group ${
                  isActive
                    ? 'bg-[#1A1A22] text-white font-semibold'
                    : 'text-[#8888A0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {/* Active Left Red Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#E50914] rounded-r shadow-red-glow" />
                )}
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#E50914]' : 'text-[#666680] group-hover:text-white'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/5 bg-[#050507]">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-[#121216] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#1A1A22] border border-white/10 flex items-center justify-center text-white">
            <User className="w-4 h-4 text-[#8888A0]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Nathan Drake</p>
            <p className="text-[10px] text-[#8888A0] truncate">nathan@spendr.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
