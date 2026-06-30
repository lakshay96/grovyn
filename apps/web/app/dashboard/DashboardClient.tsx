'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import type { AnalyticsSummary, Property } from '@/types';
import { priceLabel } from '@/lib/format';
import { getAnalytics, getProperties } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { Spinner } from '@/components/ui/Spinner';

const PIE_COLORS = ['#6d6aff', '#c8a24b', '#36d399', '#4ea8de', '#f87272'];

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-pad flex min-h-[60svh] flex-col items-center justify-center pt-28 text-center">
      {children}
    </div>
  );
}

export function DashboardClient() {
  const router = useRouter();
  const user = useAuth((s) => s.user);
  const [mounted, setMounted] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const authorized = !!user && (user.role === 'agent' || user.role === 'admin');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!authorized) return;
    let active = true;
    (async () => {
      setLoading(true);
      const [a, p] = await Promise.all([
        getAnalytics(),
        getProperties({ limit: 8, sort: 'popular' }),
      ]);
      if (!active) return;
      setAnalytics(a);
      setProperties(p.items);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [mounted, user, authorized, router]);

  if (!mounted || !user) {
    return (
      <DashboardShell>
        <Spinner label="Loading dashboard…" />
      </DashboardShell>
    );
  }

  if (!authorized) {
    return (
      <DashboardShell>
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-muted">This area is for Grovyn agents and admins.</p>
        <Link href="/login" className="mt-4 text-sm text-accent hover:underline">
          Sign in →
        </Link>
      </DashboardShell>
    );
  }

  if (loading || !analytics) {
    return (
      <DashboardShell>
        <Spinner label="Loading dashboard…" />
      </DashboardShell>
    );
  }

  const { totals, viewsByDay, topProperties, byType, funnel } = analytics;

  const funnelSteps = [
    { label: 'Views', value: funnel.view, color: '#6d6aff' },
    { label: 'Tours', value: funnel.tour, color: '#4ea8de' },
    { label: 'AR launches', value: funnel.ar, color: '#c8a24b' },
    { label: 'Inquiries', value: funnel.inquiry, color: '#36d399' },
  ];
  const maxFunnel = Math.max(1, ...funnelSteps.map((s) => s.value));

  return (
    <div className="section-pad pb-24 pt-28">
      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">
          {user ? `Welcome, ${user.name.split(' ')[0]}` : 'Agent dashboard'}
        </h1>
        <p className="mt-2 text-muted">Platform performance and your managed listings.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'Properties', value: totals.properties },
          { label: 'Users', value: totals.users.toLocaleString('en-IN') },
          { label: 'Inquiries', value: totals.inquiries },
          { label: 'Total views', value: totals.views.toLocaleString('en-IN') },
          { label: 'AR launches', value: totals.arLaunches },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/10 bg-surface/50 p-5">
            <p className="text-xs text-muted">{k.label}</p>
            <p className="mt-1 text-2xl font-bold">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-surface/50 p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Views — last 14 days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsByDay}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c8a24b" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#c8a24b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#9a9ab0" fontSize={11} tickLine={false} />
                <YAxis stroke="#9a9ab0" fontSize={11} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{
                    background: '#14141c',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#f5f5f7',
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#c8a24b" strokeWidth={2} fill="url(#vg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface/50 p-5">
          <h3 className="mb-4 text-sm font-semibold">Inventory by type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  isAnimationActive={false}
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#14141c',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#f5f5f7',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {byType.map((t, i) => (
              <span key={t.type} className="flex items-center gap-1.5 text-xs capitalize text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {t.type}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-surface/50 p-5">
          <h3 className="mb-4 text-sm font-semibold">Conversion funnel</h3>
          <div className="space-y-3">
            {funnelSteps.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted">{s.label}</span>
                  <span className="font-medium text-text">{s.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(s.value / maxFunnel) * 100}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface/50 p-5">
          <h3 className="mb-4 text-sm font-semibold">Top properties by views</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProperties} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" stroke="#9a9ab0" fontSize={11} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="title"
                  stroke="#9a9ab0"
                  fontSize={10}
                  width={110}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    background: '#14141c',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#f5f5f7',
                  }}
                />
                <Bar dataKey="views" fill="#6d6aff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Manage listings</h2>
          <Link href="/properties" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-muted">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="56px" />
                      </div>
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-accent">{priceLabel(p)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs capitalize text-muted">
                      {p.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.views.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/properties/${p.slug}`} className="text-xs text-accent hover:underline">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
