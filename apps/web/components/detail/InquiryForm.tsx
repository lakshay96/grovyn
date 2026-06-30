'use client';

import { useState } from 'react';
import { postInquiry, logEvent } from '@/lib/api';
import type { Property } from '@/types';

export function InquiryForm({ property }: { property: Property }) {
  const [status, setStatus] = useState<'idle' | 'sent' | 'offline'>('idle');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${property.title}. Please get in touch.`,
    type: 'info' as 'visit' | 'callback' | 'info',
    preferredDate: '',
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await postInquiry({ property: property._id, ...form });
    setBusy(false);
    if (res.ok) {
      logEvent('inquiry', property._id);
      setStatus('sent');
    } else {
      setStatus('offline');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/20 text-success">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l5 5 9-9" />
          </svg>
        </div>
        <p className="font-semibold">Inquiry sent</p>
        <p className="mt-1 text-sm text-muted">
          {property.agent.name} will reach out shortly.
        </p>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-center">
        <p className="font-semibold">Saved — we&apos;ll follow up shortly</p>
        <p className="mt-1 text-sm text-muted">
          We couldn&apos;t reach our servers just now. Please try again in a moment.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 rounded-full border border-white/15 px-4 py-2 text-sm text-text hover:bg-white/5 ring-focus"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {(['visit', 'callback', 'info'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => update('type', t)}
            className={`col-span-2 rounded-lg border px-3 py-2 text-xs font-medium capitalize sm:col-span-1 ${
              form.type === t ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-muted hover:text-text'
            } ${t === 'info' ? 'col-span-2' : ''}`}
          >
            {t === 'visit' ? 'Book a visit' : t === 'callback' ? 'Request callback' : 'More info'}
          </button>
        ))}
      </div>
      <Input placeholder="Your name" value={form.name} onChange={(v) => update('name', v)} required />
      <Input type="email" placeholder="Email" value={form.email} onChange={(v) => update('email', v)} required />
      <Input placeholder="Phone" value={form.phone} onChange={(v) => update('phone', v)} required />
      {form.type === 'visit' && (
        <Input type="date" placeholder="Preferred date" value={form.preferredDate} onChange={(v) => update('preferredDate', v)} />
      )}
      <textarea
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent/50"
      />
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-[#0a0a0f] hover:bg-[#d8b25e] disabled:opacity-50 ring-focus"
      >
        {busy ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}

function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm text-text outline-none placeholder:text-muted focus:border-accent/50"
    />
  );
}
