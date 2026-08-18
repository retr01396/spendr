import React, { useState, useEffect } from 'react';
import { X, Plus, Save, AlertCircle } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import type { BillingCycle, SubscriptionCategory, SubscriptionStatus } from '../../types/subscription';

export const AddSubscriptionModal: React.FC = () => {
  const { 
    isAddModalOpen, 
    closeAddModal, 
    editingSubscription, 
    closeEditModal, 
    addSubscription, 
    updateSubscription 
  } = useSubscription();

  const isOpen = isAddModalOpen || !!editingSubscription;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('Software');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [nextBillingDate, setNextBillingDate] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('Active');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setCategory(editingSubscription.category as SubscriptionCategory);
      setAmount(String(editingSubscription.amount));
      setCurrency(editingSubscription.currency);
      setBillingCycle(editingSubscription.billing_cycle);
      setNextBillingDate(editingSubscription.next_billing_date);
      setStatus(editingSubscription.status);
      setNotes(editingSubscription.notes || '');
    } else {
      // Defaults for Add mode
      setName('');
      setCategory('Software');
      setAmount('');
      setCurrency('USD');
      setBillingCycle('Monthly');
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setNextBillingDate(nextWeek.toISOString().split('T')[0]);
      setStatus('Active');
      setNotes('');
    }
    setErrors({});
  }, [editingSubscription, isAddModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (editingSubscription) closeEditModal();
    if (isAddModalOpen) closeAddModal();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Service name is required.';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Amount must be a number greater than 0.';
    }
    if (!nextBillingDate) {
      errs.nextBillingDate = 'Next billing date is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      name: name.trim(),
      category,
      amount: parseFloat(amount),
      currency,
      billing_cycle: billingCycle,
      next_billing_date: nextBillingDate,
      status,
      notes: notes.trim(),
    };

    let success = false;
    if (editingSubscription) {
      success = await updateSubscription(editingSubscription.id, payload);
    } else {
      success = await addSubscription(payload);
    }

    setIsSubmitting(false);
    if (success) {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg liquid-glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#8888A0] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
          </h3>
          <p className="text-xs text-[#8888A0]">
            {editingSubscription ? 'Modify service details and renewal dates' : 'Enter billing details to add a new recurring expense'}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">
              Service Name <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix, AWS, Figma"
              className="w-full h-10 px-3.5 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914]"
            />
            {errors.name && <p className="text-xs text-[#FF3B30] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
          </div>

          {/* Amount & Currency Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">
                Cost Amount ($) <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="29.99"
                className="w-full h-10 px-3.5 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#E50914]"
              />
              {errors.amount && <p className="text-xs text-[#FF3B30] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          {/* Category & Cycle Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SubscriptionCategory)}
                className="w-full h-10 px-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="Software">Software</option>
                <option value="Streaming">Streaming</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Cloud">Cloud Services</option>
                <option value="Utilities">Utilities</option>
                <option value="Fitness">Fitness</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full h-10 px-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
          </div>

          {/* Next Billing Date & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">
                Next Billing Date <span className="text-[#FF3B30]">*</span>
              </label>
              <input
                type="date"
                value={nextBillingDate}
                onChange={(e) => setNextBillingDate(e.target.value)}
                className="w-full h-10 px-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#E50914]"
              />
              {errors.nextBillingDate && <p className="text-xs text-[#FF3B30] mt-1">{errors.nextBillingDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
                className="w-full h-10 px-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#8888A0] uppercase mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Shared plan, auto-renew enabled..."
              rows={2}
              className="w-full p-3 bg-[#0A0A0C] border border-white/10 rounded-xl text-xs text-white placeholder-[#666680] focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#8888A0] hover:text-white bg-[#1A1A22] border border-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF3B30] text-white text-xs font-semibold rounded-xl shadow-red-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {editingSubscription ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isSubmitting ? 'Saving...' : editingSubscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
