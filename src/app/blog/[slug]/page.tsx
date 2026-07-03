import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Blog } from '@/types';
import { Metadata } from 'next';
import { ArrowLeft, Clock, Eye, Share2, Link as LinkIcon } from 'lucide-react';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import { ArticleRenderer } from '@/components/blog/ArticleRenderer';
import { ReadingProgress } from '@/components/blog/ReadingProgress';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<(Blog & { id: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error || !data) return null;
  return data as Blog & { id: string };
}

async function getRelatedPosts(currentId: string, tags: string[] = []): Promise<(Blog & { id: string })[]> {
  const supabase = await createClient();
  // Simplified related posts logic: fetch recent published ones not equal to current
  const { data, error } = await supabase
    .from('blog')
    .select('*')
    .neq('id', currentId)
    .eq('published', true)
    .limit(3);
  if (error || !data) return [];
  return data as (Blog & { id: string })[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | AI Research Lab`,
    description: post.description,
    keywords: post.tags?.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  // Increment views (In a real app, this should be done via an API route to avoid blocking SSR)
  const supabase = await createClient();
  try {
    await supabase.rpc('increment_view', { row_id: post.id });
  } catch (e) {}

  const relatedPosts = await getRelatedPosts(post.id, post.tags);

  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt as unknown as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Draft';

  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <ReadingProgress />

      <article className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Lab
          </Link>
        </div>

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6 font-medium">
            <time dateTime={String(post.publishedAt)} className="text-zinc-300">
              {formattedDate}
            </time>
            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
            <span className="flex items-center gap-1"><Clock size={14} /> {post.readingTime || 5} min read</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
            <span className="flex items-center gap-1"><Eye size={14} /> {post.views + 1} views</span>
            {post.categories && post.categories.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                <span className="text-blue-400">{post.categories[0]}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-8">
            {post.title}
          </h1>
          
          {post.description && (
            <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed mb-10 border-l-2 border-zinc-800 pl-6">
              {post.description}
            </p>
          )}

          {post.coverImage && (
            <div className="w-full aspect-video md:aspect-[21/9] bg-zinc-900 rounded-3xl overflow-hidden mb-12 shadow-2xl border border-zinc-800">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Content rendered from Notion JSON */}
            <div className="prose prose-invert prose-zinc max-w-none">
              <ArticleRenderer content={post.content} />
            </div>

            {/* Tags and Share */}
            <div className="mt-20 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-zinc-900 text-zinc-300 text-sm rounded-full font-medium border border-zinc-800">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-400 mr-2">Share</span>
                <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                  <FaTwitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                  <FaLinkedin size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar Area (Table of Contents placeholder, in a real app would be parsed from content) */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <div className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-6">On this page</div>
              <ul className="space-y-3 text-sm text-zinc-400 border-l border-zinc-800">
                <li className="pl-4 border-l border-white text-white font-medium cursor-pointer">Introduction</li>
                <li className="pl-4 hover:text-white cursor-pointer transition-colors">Methodology</li>
                <li className="pl-4 hover:text-white cursor-pointer transition-colors">Results & Analysis</li>
                <li className="pl-4 hover:text-white cursor-pointer transition-colors">Conclusion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-32 pt-16 border-t border-zinc-800">
            <h3 className="text-2xl font-bold tracking-tight mb-8">More from the Lab</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 hover:bg-zinc-900/80 transition-all">
                  <h4 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">{rp.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <span className="flex items-center gap-1"><Clock size={14}/> {rp.readingTime || 5} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
