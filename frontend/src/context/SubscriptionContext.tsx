import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Subscription, 
  SubscriptionInput, 
  SubscriptionMetrics, 
  UserPreferences, 
  ViewType 
} from '../types/subscription';
import { subscriptionApi } from '../api/subscriptionApi';

interface SubscriptionContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  subscriptions: Subscription[];
  metrics: SubscriptionMetrics | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  
  // Modal states
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  editingSubscription: Subscription | null;
  openEditModal: (sub: Subscription) => void;
  closeEditModal: () => void;
  deletingSubscription: Subscription | null;
  openDeleteModal: (sub: Subscription) => void;
  closeDeleteModal: () => void;
  
  // API Actions
  refreshData: () => Promise<void>;
  addSubscription: (data: SubscriptionInput) => Promise<boolean>;
  updateSubscription: (id: number, data: Partial<SubscriptionInput>) => Promise<boolean>;
  deleteSubscription: (id: number) => Promise<boolean>;
  updatePreferences: (data: Partial<UserPreferences>) => Promise<boolean>;
  retry: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal visibility states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [subsData, metricsData, prefsData] = await Promise.all([
        subscriptionApi.getSubscriptions({
          search: searchQuery,
          category: categoryFilter,
          status: statusFilter,
        }),
        subscriptionApi.getMetrics(),
        subscriptionApi.getPreferences(),
      ]);
      setSubscriptions(subsData);
      setMetrics(metricsData);
      setPreferences(prefsData);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to SPENDR API.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = async () => {
    await fetchData();
  };

  const addSubscription = async (data: SubscriptionInput): Promise<boolean> => {
    try {
      await subscriptionApi.createSubscription(data);
      await refreshData();
      setIsAddModalOpen(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription.');
      return false;
    }
  };

  const updateSubscription = async (id: number, data: Partial<SubscriptionInput>): Promise<boolean> => {
    try {
      await subscriptionApi.updateSubscription(id, data);
      await refreshData();
      setEditingSubscription(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update subscription.');
      return false;
    }
  };

  const deleteSubscription = async (id: number): Promise<boolean> => {
    try {
      await subscriptionApi.deleteSubscription(id);
      await refreshData();
      setDeletingSubscription(null);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete subscription.');
      return false;
    }
  };

  const updatePreferences = async (data: Partial<UserPreferences>): Promise<boolean> => {
    try {
      const updated = await subscriptionApi.updatePreferences(data);
      setPreferences(updated);
      await refreshData();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update preferences.');
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        activeView,
        setActiveView,
        subscriptions,
        metrics,
        preferences,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        isAddModalOpen,
        openAddModal: () => setIsAddModalOpen(true),
        closeAddModal: () => setIsAddModalOpen(false),
        editingSubscription,
        openEditModal: (sub) => setEditingSubscription(sub),
        closeEditModal: () => setEditingSubscription(null),
        deletingSubscription,
        openDeleteModal: (sub) => setDeletingSubscription(sub),
        closeDeleteModal: () => setDeletingSubscription(null),
        refreshData,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        updatePreferences,
        retry: fetchData,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
