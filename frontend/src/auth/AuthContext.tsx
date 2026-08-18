import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
}

interface AuthActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<AuthActionResult>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<AuthActionResult>;
  logout: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(message: string, status: number, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

async function getCsrfToken(): Promise<string> {
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

function normalizeFieldErrors(data: Record<string, unknown>): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'detail') return;
    if (Array.isArray(value)) {
      const messages = value.flatMap((item) => (typeof item === 'string' ? [item] : []));
      if (messages.length) {
        fieldErrors[key] = messages[0];
      }
      return;
    }

    if (typeof value === 'string') {
      fieldErrors[key] = value;
    }
  });

  return fieldErrors;
}

async function apiRequest<T>(input: string, options: RequestInit = {}): Promise<T> {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${API_BASE_URL}${input}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.method && options.method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    },
  });

  if (!res.ok) {
    let message = 'Request failed.';
    let fieldErrors: Record<string, string> = {};

    try {
      const data = await res.json();
      if (typeof data === 'object' && data !== null) {
        fieldErrors = normalizeFieldErrors(data as Record<string, unknown>);

        const flatErrors = Object.values(data).flatMap((value) => {
          if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
          if (typeof value === 'string') return [value];
          return [];
        });

        if (flatErrors.length) {
          message = flatErrors[0];
        } else if ('detail' in data && typeof data.detail === 'string') {
          message = data.detail;
        }
      }
    } catch {
      message = `${res.status} ${res.statusText}`;
    }

    throw new ApiError(message, res.status, fieldErrors);
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const payload = await apiRequest<{ id: number; username: string; email: string; first_name: string; last_name: string; name: string }>('/auth/me/', {
        method: 'GET',
      });
      setUser(payload);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    void refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (identifier: string, password: string): Promise<AuthActionResult> => {
    try {
      const payload = await apiRequest<{ user: User }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });
      setUser(payload.user);
      return { success: true };
    } catch (error) {
      setUser(null);
      if (error instanceof ApiError) {
        return {
          success: false,
          message: error.message || 'Invalid email or password.',
          fieldErrors: error.fieldErrors,
        };
      }
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<AuthActionResult> => {
    try {
      const payload = await apiRequest<{ user: User }>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, confirm_password: confirmPassword }),
      });
      setUser(payload.user);
      return { success: true };
    } catch (error) {
      setUser(null);
      if (error instanceof ApiError) {
        return {
          success: false,
          message: error.message || 'Unable to create your account right now. Please try again.',
          fieldErrors: error.fieldErrors,
        };
      }
      return {
        success: false,
        message: 'Unable to create your account right now. Please try again.',
      };
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await apiRequest<{ detail: string }>('/auth/logout/', {
        method: 'POST',
      });
      setUser(null);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    refreshUser,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
