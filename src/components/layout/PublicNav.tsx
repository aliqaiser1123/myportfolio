'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Command, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
// 1. Import your custom Supabase hook and types
import { useSupabase } from '@/hooks/useSupabase';
import { Resume as ResumeType } from '@/types';

export function PublicNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 2. Fetch the resume data inside the navbar component
  const { data: resumes } = useSupabase<ResumeType>('resume', 'last_updated', false);
  const resume = resumes?.[0];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  // 3. Helper function to trigger the download when clicked
  const handleDownload = () => {
    if (resume?.pdfUrl) {
      const link = document.createElement('a');
      link.href = resume.pdfUrl;
      link.download = '';
      link.target = '_blank';
      link.rel = 'noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${scrolled ? "bg-black/40 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
    >
      <div className="flex items-center gap-4 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white to-zinc-500 flex items-center justify-center">
            <span className="text-black font-bold text-sm tracking-tighter">MA</span>
          </div>
          <span className="font-semibold text-white tracking-tight hidden sm:block">ALI QAISER</span>
        </Link>
        <Link href="/admin/login" className="opacity-0 hover:opacity-10 transition-opacity">
          <Lock size={14} className="text-white" />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="#about" className="hover:text-white transition-colors">About</Link>
        <Link href="#skills" className="hover:text-white transition-colors">Skills</Link>
        <Link href="#projects" className="hover:text-white transition-colors">Projects</Link>
        <Link href="#blog" className="hover:text-white transition-colors">AI Research Lab</Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Command size={14} />
          <span className="text-xs text-zinc-400 border border-zinc-700 rounded px-1 ml-2">⌘K</span>
        </Button>

        {/* 4. Updated Button with disabled state and click handler */}
        <Button
          size="sm"
          className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50"
          onClick={handleDownload}
          disabled={!resume?.pdfUrl}
        >
          <Download size={14} className="mr-2" />
          Resume
        </Button>
      </div>
    </motion.nav>
  );
}
