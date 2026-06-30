'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { login, register, mockAuth } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Logo } from '@/components/ui/Logo';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const destinationFor = (role: string) =>
    role === 'agent' || role === 'admin' ? '/dashboard' : '/';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res =
        mode === 'login'
          ? await login(form.email, form.password)
          : await register(form.name, form.email, form.password);
      setAuth(res.user, res.token);
      router.push(destinationFor(res.user.role));
    } catch (err) {
      const response = axios.isAxiosError(err) ? err.response : undefined;
      if (response) {
        const data = response.data as { error?: { message?: string } } | undefined;
        setError(
          data?.error?.message ??
            (mode === 'login'
              ? 'Invalid email or password.'
              : 'Could not create your account. Try a different email.')
        );
      } else {
        const demo = mockAuth(form.name, form.email);
        setAuth(demo.user, demo.token);
        router.push(destinationFor(demo.user.role));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4 py-28">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === 'login'
              ? 'Sign in to sync your wishlist and tours.'
              : 'Join Grovyn to save homes and tour them in 3D.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-surface/50 p-6">
          {mode === 'register' && (
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                className="input"
                placeholder="Aria Sharma"
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
              className="input"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={6}
              className="input"
              placeholder="••••••••"
            />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d8b25e] disabled:opacity-50 ring-focus"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <p className="text-center text-xs text-muted">
            Demo: <span className="text-text">demo@grovyn.in</span> / password123 ·
            works offline
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {mode === 'login' ? (
            <>
              New here?{' '}
              <Link href="/register" className="text-accent hover:underline">
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already a member?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: var(--bg);
          padding: 0.65rem 0.85rem;
          font-size: 0.875rem;
          color: var(--text);
          outline: none;
        }
        .input:focus {
          border-color: rgba(200, 162, 75, 0.5);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
