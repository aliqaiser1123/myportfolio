'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export function EasterEgg() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [devModeActive, setDevModeActive] = useState(false);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    // Console ASCII Art
    const ascii = `
   █████╗ ██╗    ██████╗  █████╗ ██╗███████╗███████╗██████╗ 
  ██╔══██╗██║    ██╔══██╗██╔══██╗██║██╔════╝██╔════╝██╔══██╗
  ███████║██║    ██████╔╝███████║██║███████╗█████╗  ██████╔╝
  ██╔══██║██║    ██╔═══╝ ██╔══██║██║╚════██║██╔══╝  ██╔══██╗
  ██║  ██║███████╗██║    ██║  ██║██║███████║███████╗██║  ██║
  ╚═╝  ╚═╝╚══════╝╚═╝    ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
  
  Welcome to the Developer Console.
  Looking for secrets? Try the Konami Code.
    `;
    console.log('%c' + ascii, 'color: #00ff00; font-family: monospace; font-weight: bold;');
    console.log('%cAI Engineer Portfolio | aliqaiser.dev', 'background: #222; color: #bada55; padding: 4px;');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndex]) {
        if (konamiIndex === KONAMI_CODE.length - 1) {
          setDevModeActive(true);
          setKonamiIndex(0);
        } else {
          setKonamiIndex((prev) => prev + 1);
        }
      } else {
        setKonamiIndex(0);
      }

      if (e.key === 'Escape' && devModeActive) {
        setDevModeActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, devModeActive]);

  // FPS Monitor when dev mode is active
  useEffect(() => {
    if (!devModeActive) return;
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const calculateFps = () => {
      const now = performance.now();
      frameCount++;
      if (now >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(calculateFps);
    };

    animationFrameId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animationFrameId);
  }, [devModeActive]);

  return (
    <AnimatePresence>
      {devModeActive && (
        <>
          {/* Matrix Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9900] pointer-events-none bg-black/20 mix-blend-color-burn"
            style={{
              backgroundImage: 'radial-gradient(circle, transparent 20%, #000 150%)'
            }}
          />
          
          {/* Performance Monitor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-green-500/30 text-green-500 font-mono text-xs p-3 rounded-lg shadow-2xl backdrop-blur-xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/30 font-bold">
              <Terminal size={14} />
              <span>DEV_MODE::ACTIVE</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="opacity-70">FPS:</span>
                <span>{fps}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="opacity-70">LATENCY:</span>
                <span>{'<1ms'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="opacity-70">ENGINE:</span>
                <span>REACT_19</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
