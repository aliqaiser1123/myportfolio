'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Blog } from '@/types';
import { Search, Clock, Eye, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BlogPage() {
  const { data: allPosts, loading } = useSupabase<Blog>('blog', 'created_at', false);
  const posts = allPosts.filter(p => p.published && (!p.publishedAt || new Date(p.publishedAt) <= new Date()));

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id);

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

  const filtered = regularPosts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? p.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-16">
          <h1 className="text-6xl font-black tracking-tight mb-4 flex items-center gap-4">
            AI Research Lab <Sparkles className="text-yellow-500 w-8 h-8" />
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl">
            Deep dives into artificial intelligence, machine learning systems, and the future of software engineering.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && !search && !selectedTag && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <Link href={`/blog/${featuredPost.slug}`} className="group relative block overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
              {featuredPost.coverImage && (
                <img src={featuredPost.coverImage} alt={featuredPost.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              )}
              <div className="relative z-20 p-8 md:p-12 flex flex-col justify-end min-h-[400px]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Featured</span>
                  <span className="text-zinc-300 text-sm flex items-center gap-1"><Clock size={14}/> {featuredPost.readingTime || 5} min read</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 group-hover:text-zinc-200 transition-colors">
                  {featuredPost.title}
                </h2>
                {featuredPost.description && (
                  <p className="text-zinc-300 text-lg md:text-xl max-w-3xl line-clamp-2">{featuredPost.description}</p>
                )}
              </div>
            </Link>
          </motion.div>
        )}

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search research..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 items-center">
              <button 
                onClick={() => setSelectedTag(null)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedTag ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-zinc-500 animate-pulse text-lg">Loading research...</div>
        ) : filtered.length === 0 ? (
          <div className="text-zinc-600 text-center py-20 text-lg">No research matches your criteria.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 hover:border-zinc-600 hover:bg-zinc-900/80 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4 text-sm text-zinc-500">
                    <span>{post.publishedAt ? new Date(post.publishedAt as unknown as string).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {post.readingTime || 5} min</span>
                    {post.views > 0 && <span className="flex items-center gap-1"><Eye size={14}/> {post.views}</span>}
                  </div>
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-zinc-400 line-clamp-3 mb-6 flex-1">{post.description}</p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs font-medium text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
