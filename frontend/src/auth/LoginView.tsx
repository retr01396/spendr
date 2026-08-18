import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from './AuthContext';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

type FieldErrors = Partial<Record<'identifier' | 'password', string>>;

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const hasFieldErrors = useMemo(() => Object.keys(fieldErrors).length > 0, [fieldErrors]);

  const validateFields = (): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!identifier.trim()) {
      nextErrors.identifier = 'Email or username is required.';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const nextErrors = validateFields();
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    const result = await login(identifier.trim(), password);
    setLoading(false);

    if (!result.success) {
      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        setFieldErrors(result.fieldErrors);
        return;
      }

      setFieldErrors({});
      setFormError(result.message || 'Invalid email or password.');
      return;
    }

    setFieldErrors({});
    setFormError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-6 py-10 text-white">
      <div className="w-full max-w-md rounded-[24px] border border-[#FFFFFF1A] bg-[#121216]/90 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E50914]/50 bg-[#0A0A0C] text-2xl font-black text-[#E50914] shadow-[0_0_25px_rgba(229,9,20,0.3)]">
            S
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-[#8888A0]">Sign in to continue managing your subscriptions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {!hasFieldErrors && formError && (
            <div className="rounded-lg border border-[#E50914]/40 bg-[#E50914]/10 px-3 py-2 text-sm text-[#FFB2B2]">{formError}</div>
          )}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#8888A0]">Email or Username</label>
            <div className={`flex items-center gap-3 rounded-xl border bg-[#0A0A0C] px-3 py-3 transition focus-within:border-[#E50914] focus-within:shadow-[0_0_12px_rgba(229,9,20,0.25)] ${fieldErrors.identifier ? 'border-[#E50914]/70' : 'border-[#FFFFFF1A]'}`}>
              <Mail className="h-4 w-4 text-[#8888A0]" />
              <input
                value={identifier}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  if (fieldErrors.identifier) {
                    setFieldErrors((current) => ({ ...current, identifier: undefined }));
                  }
                }}
                className="w-full bg-transparent text-sm text-white placeholder:text-[#666680] focus:outline-none"
                placeholder="name@spendr.app"
                autoComplete="username"
                aria-invalid={Boolean(fieldErrors.identifier)}
              />
            </div>
            {fieldErrors.identifier && <p className="mt-2 text-xs text-[#FFB2B2]">{fieldErrors.identifier}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#8888A0]">Password</label>
            <div className={`flex items-center gap-3 rounded-xl border bg-[#0A0A0C] px-3 py-3 transition focus-within:border-[#E50914] focus-within:shadow-[0_0_12px_rgba(229,9,20,0.25)] ${fieldErrors.password ? 'border-[#E50914]/70' : 'border-[#FFFFFF1A]'}`}>
              <Lock className="h-4 w-4 text-[#8888A0]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((current) => ({ ...current, password: undefined }));
                  }
                }}
                className="w-full bg-transparent text-sm text-white placeholder:text-[#666680] focus:outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={Boolean(fieldErrors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-[#8888A0] hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && <p className="mt-2 text-xs text-[#FFB2B2]">{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#E50914] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#FF3B30] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8888A0]">
          Need an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="font-semibold text-white underline decoration-[#E50914]/60 underline-offset-4 hover:text-[#E0E0E0]">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};
