import { PublicNav } from '@/components/layout/PublicNav';
import { Hero } from '@/components/home/Hero';
import { Terminal } from '@/components/home/Terminal';
import { HexagonNetwork } from '@/components/home/HexagonNetwork';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { GitHubSection } from '@/components/github/GitHubSection';
import { ResearchSection } from '@/components/home/ResearchSection';
import { Resume } from '@/components/home/Resume';
import { Contact } from '@/components/home/Contact';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Muhammad Ali Qaiser | AI Engineer',
  description:
    'AI Engineer specializing in Computer Vision, LLM Engineering, and Information Retrieval. Building intelligent systems at the intersection of research and production.',
  keywords: ['AI Engineer', 'Computer Vision', 'LLM', 'Machine Learning', 'Portfolio'],
  openGraph: {
    title: 'Muhammad Ali Qaiser | AI Engineer',
    description: 'Building intelligent systems that matter.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-white/20 text-white">
      <PublicNav />
      <Hero />
      <Terminal />
      <HexagonNetwork />
      <FeaturedProjects />
      <GitHubSection />
      <ResearchSection />
      <Resume />
      <Contact />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="font-black text-2xl tracking-tight text-white mb-2">ALI QAISER</div>
            <p className="text-zinc-500 text-sm">AI Engineer · Building the Future</p>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
            <Link href="#projects" className="hover:text-white transition-colors">Projects</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-zinc-900 text-center text-xs text-zinc-700">
          © {new Date().getFullYear()} Muhammad Ali Qaiser. Built with Next.js 15, Framer Motion & Firebase.
        </div>
      </footer>
    </main>
  );
}
