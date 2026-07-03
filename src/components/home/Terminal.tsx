'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type CommandHistory = {
  command: string;
  output: React.ReactNode;
};

const COMMANDS = [
  { cmd: 'whoami', desc: 'Display identity & role' },
  { cmd: 'cat resume.md', desc: 'Read professional summary' },
  { cmd: 'ls', desc: 'List workspace files' },
  { cmd: 'skills', desc: 'Show tech stack & expertise' },
  { cmd: 'contact', desc: 'Get contact information' },
  { cmd: 'projects', desc: 'List featured projects' },
  { cmd: 'education', desc: 'Academic background' },
  { cmd: 'matrix', desc: 'Enter the Matrix' },
  { cmd: 'sudo rm -rf /', desc: 'Nuke everything (try it 😈)' },
  { cmd: 'clear', desc: 'Clear terminal screen' },
];


const HELP_OUTPUT = (
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
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*";

const MatrixRain = () => {
  const columns = 30;

  return (
    <div className="relative overflow-hidden rounded-md bg-black border border-zinc-800 h-80 mt-2">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black z-10" />

      <div className="absolute inset-0 flex justify-between px-1">
        {Array.from({ length: columns }).map((_, i) => {
          const text = Array.from({ length: 45 })
            .map(
              () =>
                MATRIX_CHARS[
                Math.floor(Math.random() * MATRIX_CHARS.length)
                ]
            )
            .join("\n");

          return (
            <div
              key={i}
              className="matrix-column text-[11px] leading-[10px]"
              style={{
                animationDuration: `${4 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-green-400 text-xs font-mono tracking-widest">
        ACCESSING THE MATRIX...
      </div>
    </div>
  );
};
export function Terminal() {
  // Boot with `help` pre-shown — recruiters immediately see available commands
  const [history, setHistory] = useState<CommandHistory[]>([
    { command: 'help', output: HELP_OUTPUT },
  ]);
  const [input, setInput] = useState('');
  const [isTyping] = useState(false);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [cmdBuffer, setCmdBuffer] = useState('');
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        output = HELP_OUTPUT;
        break;

      case 'whoami':
        output = (
          <div className="space-y-1.5 mt-1">
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Name:</span>
              <span className="text-white font-bold">Muhammad Ali</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Role:</span>
              <span className="text-zinc-200">AI Student · Computer Vision · LLM · Information Retrieval</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Location:</span>
              <span className="text-zinc-300">Pakistan 🇵🇰</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Phone:</span>
              <span className="text-green-400">+923106643436</span>
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
              {`I am an AI student focused on exploring emerging technologies, intelligent
systems, and space innovation. I enjoy building AI-powered applications,
learning cutting-edge technologies, and turning ambitious ideas into
impactful solutions.

Vision: "Driven to build intelligent technologies that empower humanity,
accelerate innovation, and shape the future through Artificial Intelligence."`}
            </p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="mt-1 space-y-3">
            {[
              { cat: 'Languages', items: ['Python', 'C++', 'SQL'] },
              { cat: 'AI / ML', items: ['PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'Neural Networks'] },
              { cat: 'LLM & RAG', items: ['RAG', 'LangChain', 'ChromaDB'] },
              { cat: 'Backend', items: ['FastAPI', 'REST APIs', 'Firebase', 'Firestore'] },
              { cat: 'Tools', items: ['Git', 'GitHub', 'Streamlit', 'Antigravity', 'VS Code'] },
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
              <span className="text-blue-400 font-semibold w-20 shrink-0">Email:</span>
              <span className="text-green-400">aliqaiser1123@gmail.com</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Phone:</span>
              <span className="text-green-400">+923106643436</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">GitHub:</span>
              <span className="text-zinc-300">github.com/aliqaiser1123</span>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-400 font-semibold w-20 shrink-0">Location:</span>
              <span className="text-zinc-300">Pakistan 🇵🇰</span>
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="mt-1 space-y-3">
            {[
              {
                name: 'Brain Tumor Classifier',
                desc: 'MRI tumor classification using deep learning and Grad-CAM explainability.',
                stack: 'PyTorch · Computer Vision · Grad-CAM',
              },
              {
                name: 'Siesmoguard AI',
                desc: 'AI-powered earthquake prediction platform with intelligent alerts.',
                stack: 'Python · ML · FastAPI',
              },
              {
                name: 'Quran Semantics Engine',
                desc: 'Semantic search system using information retrieval and NLP.',
                stack: 'NLP · RAG · ChromaDB · LangChain',
              },
              {
                name: 'Islamic RAG Agent',
                desc: 'Evidence-based AI assistant powered by RAG and LLMs.',
                stack: 'LangChain · ChromaDB · FastAPI',
              },
              {
                name: 'Pak Burger Website',
                desc: 'Modern food ordering platform with live order management.',
                stack: 'Next.js · Firebase · Firestore',
              },
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
              <div className="text-white font-semibold">BS Artificial Intelligence</div>
              <div className="text-zinc-400 text-xs">Air University · Expected 2028</div>
              <div className="text-zinc-400 text-xs">
                Hands-on experience in Computer Vision, Machine &amp; Deep Learning,
                Information Retrieval, and Large Language Models (LLMs).
              </div>
              <div className="text-blue-400 text-xs font-mono">Pakistan · 2024–2028</div>
            </div>
            <div className="pl-3 border-l border-zinc-700 space-y-0.5">
              <div className="text-white font-semibold">Highlights</div>
              <div className="text-zinc-400 text-xs">Built 5+ AI &amp; Full-Stack Projects</div>
              <div className="text-zinc-400 text-xs">Developed production-ready AI applications</div>
              <div className="text-zinc-400 text-xs">Hands-on experience in Computer Vision &amp; LLMs</div>
              <div className="text-zinc-400 text-xs">Strong grip on Information Retrieval &amp; RAG</div>
            </div>
          </div>
        );
        break;
      case 'matrix':
        output = <MatrixRain />;
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
        </div>
      </div>
    </section>
  );
}
