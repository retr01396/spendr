import React from 'react';
import { PlusCircle, CreditCard } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAddButton?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No subscriptions yet.",
  description = "Add your first subscription to start tracking recurring spending.",
  showAddButton = true,
}) => {
  const { openAddModal } = useSubscription();

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#0A0A0C] border border-white/10 rounded-2xl text-center my-6">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#E50914]">
        <CreditCard className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#8888A0] max-w-md mb-6">{description}</p>
      {showAddButton && (
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF3B30] text-white font-medium text-sm rounded-lg shadow-red-glow transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Add Subscription
        </button>
      )}
    </div>
  );
};
