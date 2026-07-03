'use client';

import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useState, MouseEvent } from 'react';

const roles = [
  "AI Engineer",
  "Computer Vision",
  "Information Retrieval",
  "LLM Engineering"
];

export function Hero() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacityText = useTransform(scrollY, [0, 500], [0.8, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    mouseX.set(x * 50);
    mouseY.set(y * 50);
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Glow following mouse - abstracted for performance */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black opacity-60" />

      {/* Huge Background Typography */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none w-full"
      >
        <h1 className="text-[12vw] md:text-[10vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent whitespace-nowrap">
          MUHAMMAD ALI
        </h1>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center pt-20 px-4 w-full max-w-7xl mx-auto">

        {/* Glowing Floating Avatar */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ x: mouseX, y: mouseY }}
          className="relative w-64 h-64 md:w-80 md:h-80 mb-12"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-[100px] animate-pulse" />

          {/* Image placeholder - requires actual background removed PNG */}
          <div className="absolute inset-0 rounded-full border border-white/10 bg-zinc-900/80 backdrop-blur-sm overflow-hidden flex items-center justify-center">
            <img src="/avatar.png" alt="Ali Qaiser" className="object-cover w-full h-full" />
          </div>
        </motion.div>

        {/* Animated Role Switcher */}
        <div className="text-center w-full max-w-4xl mx-auto">
          <p className="text-zinc-400 tracking-widest text-sm uppercase mb-4">Hello, I am Ali and I specialize in</p>
          <div className="h-24 md:h-28 overflow-hidden relative w-full flex items-center justify-center">
            {roles.map((role, index) => (
              <motion.h2
                key={role}
                initial={{ y: 50, opacity: 0 }}
                animate={{
                  y: currentRole === index ? 0 : currentRole > index ? -50 : 50,
                  opacity: currentRole === index ? 1 : 0
                }}
                transition={{ duration: 0.5, ease: "anticipate" }}
                className="absolute text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white whitespace-nowrap"
              >
                {role}
              </motion.h2>
            ))}
          </div>
        </div>

      </div>

      {/* Neural Particles placeholder - absolute bottom layer */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />
    </section>
  );
}
