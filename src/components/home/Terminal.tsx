'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '@/hooks/useSupabase';
import { Profile } from '@/types';

type CommandHistory = {
  command: string;
  output: React.ReactNode;
};

// Hardcoded fallback profile data
const FALLBACK_PROFILE = {
  fullName: 'Muhammad Ali Qaiser',
  headline: 'AI Engineer · Computer Vision · LLM Engineering · Information Retrieval',
  location: 'Pakistan 🇵🇰',
  bio: `Passionate AI Engineer with hands-on expertise in building intelligent systems
at the intersection of research and production. Specializing in Computer Vision,
Large Language Model (LLM) Engineering, and Information Retrieval.

I craft scalable ML pipelines, vision transformers, RAG architectures, and
neural search systems — turning cutting-edge research into real-world impact.`,
};

const COMMANDS = [
  { cmd: 'whoami',      desc: 'Display identity & role' },
  { cmd: 'cat resume.md', desc: 'Read professional summary' },
  { cmd: 'ls',          desc: 'List workspace files' },
  { cmd: 'skills',      desc: 'Show tech stack & expertise' },
  { cmd: 'contact',     desc: 'Get contact information' },
  { cmd: 'projects',    desc: 'List featured projects' },
  { cmd: 'education',   desc: 'Academic background' },
  { cmd: 'sudo rm -rf /', desc: 'Nuke everything (try it 😈)' },
  { cmd: 'clear',       desc: 'Clear terminal screen' },
];

export function Terminal() {
  const { data: profiles, loading } = useSupabase<Profile>('profile');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [cmdBuffer, setCmdBuffer] = useState('');
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prefer Supabase data, fall back to hardcoded
  const rawProfile = profiles[0];
  const profile = rawProfile ?? FALLBACK_PROFILE;

  // Initial boot sequence
  useEffect(() => {
    if (loading) return;
    const initialCmd = 'whoami';
    let currentIndex = 0;
    let typed = '';

    const typingInterval = setInterval(() => {
      if (currentIndex < initialCmd.length) {
        typed += initialCmd[currentIndex];
        setInput(typed);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          handleCommand(initialCmd, profile);
          setIsTyping(false);
          setInput('');
        }, 300);
      }
    }, 100);

    return () => clearInterval(typingInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string, profileData = profile) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        output = (
          <div className="text-zinc-400 space-y-1 mt-1">
            <div className="text-green-400 font-bold mb-2 text-xs uppercase tracking-widest">Available Commands</div>
            {COMMANDS.map(({ cmd: c, desc }) => (
              <div key={c} className="flex gap-3">
                <span className="text-blue-400 font-bold w-36 shrink-0">{c}</span>
                <span className="text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1.5 mt-1">
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Name:</span>
              <span className="text-white font-bold">{profileData.fullName}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Role:</span>
              <span className="text-zinc-200">{profileData.headline}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Location:</span>
              <span className="text-zinc-300">{profileData.location || FALLBACK_PROFILE.location}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Email:</span>
              <span className="text-green-400">aliqaiser1123@gmail.com</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Status:</span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400">Open to opportunities</span>
              </span>
            </div>
          </div>
        );
        break;

      case 'ls':
        output = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            {['projects/', 'skills/', 'research/', 'blog/', 'resume.md', 'contact.txt', 'education.md', '.secrets'].map(f => (
              <span key={f} className={f.endsWith('/') ? 'text-blue-400 font-semibold' : f.startsWith('.') ? 'text-zinc-600' : 'text-zinc-300'}>
                {f}
              </span>
            ))}
          </div>
        );
        break;

      case 'cat resume.md':
      case 'cat resume':
        output = (
          <div className="mt-1 space-y-3">
            <div className="text-xs text-zinc-600 uppercase tracking-widest font-mono">─── resume.md ───</div>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-zinc-700 text-sm">
              {profileData.bio || FALLBACK_PROFILE.bio}
            </p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="mt-1 space-y-3">
            {[
              { cat: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'Transformers (HuggingFace)', 'Scikit-learn', 'OpenCV'] },
              { cat: 'LLM & RAG', items: ['LangChain', 'LlamaIndex', 'OpenAI API', 'vLLM', 'Ollama', 'FAISS', 'Qdrant'] },
              { cat: 'Computer Vision', items: ['YOLO', 'ViT', 'Detectron2', 'Stable Diffusion', 'CLIP'] },
              { cat: 'Engineering', items: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'Docker', 'Supabase'] },
            ].map(({ cat, items }) => (
              <div key={cat}>
                <div className="text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">{cat}</div>
                <div className="flex flex-wrap gap-1.5 pl-2">
                  {items.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="mt-1 space-y-1.5">
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-16 shrink-0">Email:</span>
              <span className="text-green-400">aliqaiser1123@gmail.com</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-16 shrink-0">Discord:</span>
              <span className="text-zinc-300">@aliqaiser_discord</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-16 shrink-0">LinkedIn:</span>
              <span className="text-zinc-300">linkedin.com/in/aliqaiser</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-16 shrink-0">GitHub:</span>
              <span className="text-zinc-300">github.com/aliqaiser</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-16 shrink-0">Location:</span>
              <span className="text-zinc-300">Pakistan 🇵🇰</span>
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="mt-1 space-y-3">
            {[
              { name: 'AI Vision Pipeline', desc: 'Real-time object detection & tracking system using YOLO + DeepSort', stack: 'PyTorch · OpenCV · FastAPI' },
              { name: 'RAG Knowledge Engine', desc: 'LLM-powered document QA with hybrid semantic search', stack: 'LangChain · FAISS · OpenAI' },
              { name: 'Neural Search System', desc: 'Dense retrieval for large-scale information retrieval', stack: 'Sentence-BERT · Qdrant · FastAPI' },
            ].map(p => (
              <div key={p.name} className="pl-3 border-l border-zinc-700 space-y-0.5">
                <div className="text-white font-semibold">{p.name}</div>
                <div className="text-zinc-400 text-xs">{p.desc}</div>
                <div className="text-blue-400 text-xs font-mono">{p.stack}</div>
              </div>
            ))}
            <div className="text-zinc-600 text-xs">→ See full projects section below ↓</div>
          </div>
        );
        break;

      case 'education':
        output = (
          <div className="mt-1 space-y-3">
            <div className="pl-3 border-l border-zinc-700 space-y-0.5">
              <div className="text-white font-semibold">BS Computer Science</div>
              <div className="text-zinc-400 text-xs">Focus: Artificial Intelligence & Machine Learning</div>
              <div className="text-blue-400 text-xs font-mono">Pakistan · 2020–2024</div>
            </div>
            <div className="pl-3 border-l border-zinc-700 space-y-0.5">
              <div className="text-white font-semibold">Certifications</div>
              <div className="text-zinc-400 text-xs">Deep Learning Specialization · Andrew Ng (Coursera)</div>
              <div className="text-zinc-400 text-xs">LLM Engineering · Various Advanced Courses</div>
            </div>
          </div>
        );
        break;

      case 'sudo rm -rf /':
        output = (
          <div className="text-red-500 font-bold animate-pulse mt-1">
            ⚠ PERMISSION DENIED. Nice try, human. 😈
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case '':
        break;

      default:
        output = (
          <div className="text-red-400 mt-1">
            command not found: <span className="font-bold">{trimmed}</span>. Type <span className="text-blue-400">&apos;help&apos;</span> for available commands.
          </div>
        );
    }

    setHistory(prev => [...prev, { command: cmd, output }]);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTyping) return;
    if (input.trim()) {
      setUserHistory(prev => [input, ...prev]);
      setCmdIndex(-1);
    }
    handleCommand(input);
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdIndex === -1) setCmdBuffer(input);
      const nextIndex = Math.min(cmdIndex + 1, userHistory.length - 1);
      setCmdIndex(nextIndex);
      setInput(userHistory[nextIndex] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(cmdIndex - 1, -1);
      setCmdIndex(nextIndex);
      setInput(nextIndex === -1 ? cmdBuffer : userHistory[nextIndex] ?? '');
    }
  };

  return (
    <section id="about" className="py-32 px-6 bg-black relative z-10 flex justify-center">
      <div
        className="w-full max-w-4xl rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 bg-zinc-900 border-b border-zinc-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-xs font-mono text-zinc-500">
            ali@ai-portfolio:~ — bash
          </div>
          <div className="text-[10px] font-mono text-zinc-700">type &apos;help&apos; for commands</div>
        </div>

        {/* Terminal Body */}
        <div
          ref={containerRef}
          className="p-6 font-mono text-sm md:text-base h-[460px] overflow-y-auto cursor-text scrollbar-thin scrollbar-thumb-zinc-800"
        >
          {loading && (
            <div className="text-zinc-500 animate-pulse mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Initializing AI Engine...
            </div>
          )}

          {/* Startup banner (shown once) */}
          {!loading && history.length === 0 && (
            <div className="text-zinc-700 text-xs mb-4 space-y-0.5">
              <div>Ali&apos;s Portfolio OS v2.0.25 — Kernel: NeuralNet 4.2</div>
              <div>Type <span className="text-blue-400">help</span> to see available commands.</div>
            </div>
          )}

          {/* History */}
          {history.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-green-400 font-bold">ali@ai-portfolio</span>
                <span className="text-blue-400">~</span>
                <span className="text-zinc-500">$</span>
                <span>{item.command}</span>
              </div>
              {item.output && <div className="mt-1 text-zinc-300">{item.output}</div>}
            </div>
          ))}

          {/* Current Input */}
          {!loading && (
            <form onSubmit={onSubmit} className="flex items-center gap-2 text-zinc-300">
              <span className="text-green-400 font-bold shrink-0">ali@ai-portfolio</span>
              <span className="text-blue-400 shrink-0">~</span>
              <span className="text-zinc-500 shrink-0">$</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={isTyping}
                  className="w-full bg-transparent outline-none text-white caret-white"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                  aria-label="Terminal input"
                />
                {/* Blinking cursor when empty */}
                {input === '' && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-5 bg-white inline-block ml-0.5 align-middle absolute left-0"
                  />
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
