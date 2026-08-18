import type { Subscription, SubscriptionInput, SubscriptionMetrics, UserPreferences } from '../types/subscription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMsg = `API Error: ${response.status} ${response.statusText}`;
    try {
      const errData = await response.json();
      if (typeof errData === 'object' && errData !== null) {
        errorMsg = Object.entries(errData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
      }
    } catch {
      // Use default error string
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json();
}

export const subscriptionApi = {
  async getSubscriptions(params?: { search?: string; category?: string; status?: string; ordering?: string }): Promise<Subscription[]> {
    const url = new URL(`${API_BASE_URL}/subscriptions/`);
    if (params) {
      if (params.search) url.searchParams.append('search', params.search);
      if (params.category && params.category.toLowerCase() !== 'all') url.searchParams.append('category', params.category);
      if (params.status && params.status.toLowerCase() !== 'all') url.searchParams.append('status', params.status);
      if (params.ordering) url.searchParams.append('ordering', params.ordering);
    }
    const res = await fetch(url.toString());
    return handleResponse<Subscription[]>(res);
  },

  async getMetrics(): Promise<SubscriptionMetrics> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/metrics/`);
    return handleResponse<SubscriptionMetrics>(res);
  },

  async createSubscription(data: SubscriptionInput): Promise<Subscription> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Subscription>(res);
  },

  async updateSubscription(id: number, data: Partial<SubscriptionInput>): Promise<Subscription> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Subscription>(res);
  },

  async deleteSubscription(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/subscriptions/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },

  async getPreferences(): Promise<UserPreferences> {
    const res = await fetch(`${API_BASE_URL}/preferences/`);
    return handleResponse<UserPreferences>(res);
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
    const res = await fetch(`${API_BASE_URL}/preferences/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<UserPreferences>(res);
  }
};
