import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types';
import { Metadata } from 'next';
import { ExternalLink, Clock, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<(Project & { id: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return data as Project & { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} | Ali Qaiser`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Back link */}
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-4">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      {/* Hero */}
      <section className="relative w-full aspect-video max-h-[60vh] bg-zinc-900 overflow-hidden">
        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 max-w-5xl mx-auto w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((t) => (
              <span key={t} className="px-3 py-1 text-xs font-mono bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-zinc-300">{t}</span>
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">{project.title}</h1>
          <div className="flex items-center gap-6 text-zinc-400 text-sm">
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min read</span>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors">
                <FaGithub size={16} /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-white">Overview</h2>
          <p className="text-zinc-300 text-lg leading-relaxed">{project.description}</p>
        </section>

        {(project as any).architecture && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-white">Architecture</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{(project as any).architecture}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
