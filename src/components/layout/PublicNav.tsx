'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Command, Download, Moon, Sun, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';


export function PublicNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

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
        <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
          <Download size={14} className="mr-2" />
          Resume
        </Button>
      </div>
    </motion.nav>
  );
}
