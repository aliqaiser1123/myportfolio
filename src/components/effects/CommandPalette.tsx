'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, FolderGit2, Hexagon, FileText, 
  Microscope, FileBadge2, Mail, UserCircle, Search, 
  ArrowRight, MonitorPlay 
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useScreenshotMode } from './ScreenshotContext';

const commands = [
  { id: 'home', label: 'Go to Home', section: 'Navigate', icon: LayoutDashboard, action: '/' },
  { id: 'about', label: 'About / Terminal', section: 'Navigate', icon: UserCircle, action: '/#about' },
  { id: 'projects', label: 'View Projects', section: 'Navigate', icon: FolderGit2, action: '/#projects' },
  { id: 'skills', label: 'Skills Network', section: 'Navigate', icon: Hexagon, action: '/#skills' },
  { id: 'blog', label: 'Read Blog', section: 'Navigate', icon: FileText, action: '/blog' },
  { id: 'research', label: 'Research', section: 'Navigate', icon: Microscope, action: '/#research' },
  { id: 'resume', label: 'View Resume', section: 'Navigate', icon: FileBadge2, action: '/#resume' },
  { id: 'contact', label: 'Contact Me', section: 'Navigate', icon: Mail, action: '/#contact' },
  { id: 'github', label: 'GitHub Profile', section: 'Social', icon: FaGithub, action: 'https://github.com', external: true },
  { id: 'linkedin', label: 'LinkedIn Profile', section: 'Social', icon: FaLinkedin, action: 'https://linkedin.com', external: true },
  { id: 'screenshot', label: 'Toggle Screenshot Mode', section: 'Utilities', icon: MonitorPlay, action: 'SCREENSHOT_TOGGLE' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { toggleScreenshotMode } = useScreenshotMode();

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Group by section
  const grouped = filtered.reduce<Record<string, typeof commands>>((acc, cmd) => {
    acc[cmd.section] = [...(acc[cmd.section] || []), cmd];
    return acc;
  }, {});

  const handleSelect = useCallback((cmd: (typeof commands)[0]) => {
    setOpen(false);
    setQuery('');
    if (cmd.action === 'SCREENSHOT_TOGGLE') {
      toggleScreenshotMode();
    } else if (cmd.external) {
      window.open(cmd.action, '_blank');
    } else {
      router.push(cmd.action);
    }
  }, [router, toggleScreenshotMode]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <Search size={18} className="text-zinc-500 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-zinc-600 focus:outline-none text-sm"
              />
              <kbd className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">Esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {Object.keys(grouped).length === 0 ? (
                <p className="text-center text-zinc-600 text-sm py-8">No commands found.</p>
              ) : (
                Object.entries(grouped).map(([section, items]) => (
                  <div key={section}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-4 py-2">{section}</p>
                    {items.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors group"
                      >
                        <cmd.icon size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="flex-1 text-left">{cmd.label}</span>
                        <ArrowRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-zinc-800 px-4 py-2 flex items-center gap-4 text-xs text-zinc-700">
              <span><kbd className="bg-zinc-800 px-1 rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="bg-zinc-800 px-1 rounded">↵</kbd> Select</span>
              <span><kbd className="bg-zinc-800 px-1 rounded">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
