import type { Subscription, SubscriptionInput, SubscriptionMetrics, UserPreferences } from '../types/subscription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

function getCookie(name: string): string {
  const value = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return value ? decodeURIComponent(value.split('=')[1] ?? '') : '';
}

async function getCsrfToken(): Promise<string> {
  const existingToken = getCookie('csrftoken');
  if (existingToken) {
    return existingToken;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/csrf/`, { credentials: 'include' });
    if (!response.ok) {
      return '';
    }
    const data = await response.json();
    return data.csrfToken || '';
  } catch {
    return '';
  }
}

async function requestWithSession<T>(input: string, options: RequestInit = {}): Promise<T> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}${input}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.method && options.method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
  });

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

  return response.json() as Promise<T>;
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
    return requestWithSession<Subscription[]>(`/subscriptions/?${url.searchParams.toString()}`);
  },

  async getMetrics(): Promise<SubscriptionMetrics> {
    return requestWithSession<SubscriptionMetrics>('/subscriptions/metrics/');
  },

  async createSubscription(data: SubscriptionInput): Promise<Subscription> {
    return requestWithSession<Subscription>('/subscriptions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSubscription(id: number, data: Partial<SubscriptionInput>): Promise<Subscription> {
    return requestWithSession<Subscription>(`/subscriptions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteSubscription(id: number): Promise<void> {
    return requestWithSession<void>(`/subscriptions/${id}/`, {
      method: 'DELETE',
    });
  },

  async getPreferences(): Promise<UserPreferences> {
    return requestWithSession<UserPreferences>('/preferences/');
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
    return requestWithSession<UserPreferences>('/preferences/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
};
