import React, { useState } from 'react';
import { 
  PlusCircle, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { DEFAULT_CURRENCY, formatCurrency } from '../../constants/currencies';
import { SkeletonTableRow } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';

export const SubscriptionsView: React.FC = () => {
  const { 
    subscriptions, 
    preferences,
    loading, 
    error, 
    openAddModal, 
    openEditModal, 
    openDeleteModal,
    searchQuery,
    categoryFilter,
    setCategoryFilter,
  } = useSubscription();
  const activeCurrency = preferences?.currency || DEFAULT_CURRENCY;

  const [sortField, setSortField] = useState<'name' | 'amount' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  if (loading && subscriptions.length === 0) {
    return (
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="h-8 w-48 bg-[#1A1A22] rounded animate-pulse" />
        <table className="w-full">
          <tbody>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </tbody>
        </table>
      </div>
    );
  }

  if (error && subscriptions.length === 0) {
    return <ErrorState message={error} />;
  }

  // Filter & Sort
  const filtered = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || sub.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'amount') {
      comparison = Number(a.amount) - Number(b.amount);
    } else if (sortField === 'date') {
      comparison = new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: 'name' | 'amount' | 'date') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
            <CheckCircle2 className="w-3 h-3 text-[#E50914]" /> Active
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E50914]/15 text-[#FF3B30] border border-[#E50914]/30">
            <Clock className="w-3 h-3" /> Upcoming
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 text-[#666680] border border-white/5">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-[#8888A0]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121216] border border-white/10 rounded-2xl p-6">
        <div>
          <h2 className="text-lg font-bold text-white">All Subscriptions ({sorted.length})</h2>
          <p className="text-xs text-[#8888A0]">Manage, edit, and organize all recurring payment accounts</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#FF3B30] text-white text-sm font-medium rounded-xl shadow-red-glow transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Software', 'Streaming', 'Cloud', 'Infrastructure', 'Utilities', 'Fitness'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === cat
                ? 'bg-[#1A1A22] text-white border border-[#E50914]/40 shadow-red-glow'
                : 'bg-[#0A0A0C] text-[#8888A0] hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      {sorted.length > 0 ? (
        <div className="bg-[#121216] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-[#666680] bg-[#0A0A0C]">
                  <th className="py-3.5 px-5 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1">
                      Service Name <ArrowUpDown className="w-3 h-3 inline" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Cycle</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => toggleSort('date')}>
                    <div className="flex items-center gap-1">
                      Next Billing <ArrowUpDown className="w-3 h-3 inline" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right cursor-pointer hover:text-white" onClick={() => toggleSort('amount')}>
                    <div className="flex items-center justify-end gap-1">
                      Cost <ArrowUpDown className="w-3 h-3 inline" />
                    </div>
                  </th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {sorted.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#1A1A22] transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A1A22] border border-white/10 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                          {sub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-[#E50914] transition-colors">{sub.name}</p>
                          <p className="text-xs text-[#8888A0] max-w-xs truncate">{sub.notes || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-[#E0E0E0]">{sub.category}</td>
                    <td className="py-4 px-4 text-xs text-[#8888A0]">{sub.billing_cycle}</td>
                    <td className="py-4 px-4 text-xs font-mono text-[#E0E0E0] flex items-center gap-1.5 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-[#8888A0]" />
                      {sub.next_billing_date}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(sub.status)}</td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-base text-white">
                      {formatCurrency(Number(sub.amount), sub.currency || activeCurrency)}
                      <span className="text-[10px] text-[#8888A0] font-normal block">/{sub.billing_cycle.toLowerCase()}</span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-2 bg-white/5 hover:bg-white/15 text-[#E0E0E0] hover:text-white rounded-lg transition-colors"
                          title="Edit Subscription"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(sub)}
                          className="p-2 bg-[#E50914]/15 hover:bg-[#E50914]/30 text-[#FF3B30] rounded-lg transition-colors"
                          title="Delete Subscription"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No matching subscriptions found." description="Try adjusting your search query or filter settings." />
      )}
    </div>
  );
};
