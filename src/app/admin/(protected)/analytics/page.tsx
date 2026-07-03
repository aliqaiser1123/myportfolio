'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { Eye, Download, FolderGit2, BookOpen, Globe } from 'lucide-react';

interface AnalyticsData {
  global: Record<string, number>;
  daily: { date: string; pageViews?: number }[];
  topItems: any[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch analytics');
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-zinc-500 animate-pulse">Loading analytics...</div>;
  if (error) return <div className="p-8 text-red-500 bg-red-500/10 rounded-lg m-8">Error: {error}. Check if Cloud Firestore API is enabled for the Admin SDK.</div>;
  if (!data || !data.global) return <div className="p-8 text-zinc-600">No analytics data available yet.</div>;

  const stats = [
    { label: 'Page Views', value: data.global.page_view || 0, icon: Eye, color: 'text-blue-400' },
    { label: 'Resume Downloads', value: data.global.resume_download || 0, icon: Download, color: 'text-green-400' },
    { label: 'Project Clicks', value: data.global.project_click || 0, icon: FolderGit2, color: 'text-purple-400' },
    { label: 'Blog Reads', value: data.global.blog_read || 0, icon: BookOpen, color: 'text-yellow-400' },
  ];

  const countries = Object.entries(data.global)
    .filter(([k]) => k.startsWith('countries.'))
    .map(([k, v]) => ({ country: k.replace('countries.', ''), visits: v as number }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 8);

  const chartData = [...(data.daily || [])]
    .reverse()
    .map((d) => ({ date: d.date.slice(5), views: d.pageViews || 0 }));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-zinc-400 mt-1">Real-time visitor data from your portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <Icon size={20} className={`${color} mb-3`} />
            <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
            <div className="text-sm text-zinc-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      {chartData.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Daily Traffic (30 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 12, color: '#fff' }}
                labelStyle={{ color: '#a1a1aa' }}
              />
              <Area type="monotone" dataKey="views" stroke="rgba(255,255,255,0.5)" strokeWidth={2} fill="url(#viewsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Distribution */}
        {countries.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Globe size={18} className="text-zinc-500" /> Visitors by Country
            </h2>
            <div className="space-y-3">
              {countries.map(({ country, visits }) => {
                const max = countries[0].visits;
                return (
                  <div key={country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-300">{country}</span>
                      <span className="text-zinc-500 font-mono">{visits}</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-zinc-500 to-white rounded-full transition-all"
                        style={{ width: `${(visits / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Items */}
        {data.topItems.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Top Content</h2>
            <div className="space-y-3">
              {data.topItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                  <span className="text-zinc-300 text-sm truncate max-w-[60%]">{item.title || item.id}</span>
                  <span className="text-zinc-500 text-sm font-mono">{item.page_view || 0} views</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
