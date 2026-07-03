'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Users, GitCommit, Code2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface GitHubData {
  pinnedRepos: any[];
  contributionCalendar: { weeks: { contributionDays: ContributionDay[] }[] };
  totalContributions: number;
  totalCommits: number;
  followers: number;
  languages: { name: string; count: number }[];
  latestCommits: { repo: string; message: string; date: string; url: string }[];
}

function ContributionGraph({ calendar }: { calendar: GitHubData['contributionCalendar'] }) {
  if (!calendar?.weeks) return null;
  const allDays = calendar.weeks.flatMap((w) => w.contributionDays);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px] min-w-max">
        {calendar.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.contributionDays.map((day, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (wi * 7 + di) * 0.001 }}
                title={`${day.date}: ${day.contributionCount} contributions`}
                className="w-[10px] h-[10px] rounded-[2px] transition-all hover:scale-150 cursor-default"
                style={{
                  backgroundColor: day.contributionCount === 0
                    ? 'rgba(255,255,255,0.05)'
                    : day.contributionCount < 3
                    ? 'rgba(34,197,94,0.3)'
                    : day.contributionCount < 8
                    ? 'rgba(34,197,94,0.6)'
                    : 'rgba(34,197,94,1)',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubSection() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const { track } = useAnalytics();

  useEffect(() => {
    fetch('/api/github')
      .then((res) => res.json())
      .then((json) => { setData(json); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="github" className="py-32 px-6 bg-zinc-950 border-t border-zinc-900 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Open Source</h2>
          <p className="text-zinc-400 text-lg">My contributions to the developer ecosystem.</p>
        </div>

        {loading ? (
          <div className="text-zinc-600 animate-pulse">Connecting to GitHub API...</div>
        ) : !data ? (
          <div className="text-zinc-600">Add GITHUB_TOKEN to your .env.local to enable this section.</div>
        ) : (
          <div className="space-y-16">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Contributions', value: data.totalContributions.toLocaleString(), icon: GitCommit },
                { label: 'Commits', value: data.totalCommits.toLocaleString(), icon: Code2 },
                { label: 'Followers', value: data.followers.toLocaleString(), icon: Users },
                { label: 'Pinned Repos', value: data.pinnedRepos.length, icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center hover:border-zinc-700 transition-colors">
                  <Icon size={20} className="text-zinc-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{value}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>

            {/* Contribution Graph */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Contribution Activity</h3>
              <ContributionGraph calendar={data.contributionCalendar} />
              <p className="text-sm text-zinc-600 mt-4">{data.totalContributions} contributions in the last year</p>
            </div>

            {/* Language Distribution */}
            {data.languages.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Most Used Languages</h3>
                <div className="space-y-3">
                  {data.languages.map((lang) => {
                    const pct = Math.round((lang.count / data.languages.reduce((a, b) => a + b.count, 0)) * 100);
                    return (
                      <div key={lang.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-zinc-300">{lang.name}</span>
                          <span className="text-zinc-500 font-mono">{pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-zinc-500 to-white rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pinned Repos */}
            {data.pinnedRepos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Pinned Repositories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.pinnedRepos.map((repo: any) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track('github_click', { slug: repo.name, type: 'github' })}
                      className="block bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 hover:bg-zinc-900/80 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white group-hover:text-zinc-200">{repo.name}</h4>
                        {repo.primaryLanguage && (
                          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
                            {repo.primaryLanguage.name}
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{repo.description}</p>
                      <div className="flex gap-4 text-xs text-zinc-600">
                        <span className="flex items-center gap-1"><Star size={12} />{repo.stargazerCount}</span>
                        <span className="flex items-center gap-1"><GitFork size={12} />{repo.forkCount}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Commits */}
            {data.latestCommits.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Latest Commits</h3>
                <div className="space-y-4 font-mono text-sm">
                  {data.latestCommits.map((commit, i) => (
                    <a key={i} href={commit.url} target="_blank" rel="noreferrer" className="flex items-start gap-4 text-zinc-400 hover:text-white transition-colors group">
                      <GitCommit size={16} className="mt-0.5 shrink-0 text-zinc-600" />
                      <div className="min-w-0">
                        <span className="text-zinc-600 mr-2">{commit.repo}</span>
                        <span className="text-zinc-300 group-hover:text-white line-clamp-1">{commit.message}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
