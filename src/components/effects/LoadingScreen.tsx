'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [20, 45, 70, 90, 100];
    let i = 0;
    const interval = setInterval(() => {
      setProgress(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setLoading(false), 400);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="text-5xl font-black tracking-tighter text-white mb-2">MUHAMMAD ALI</div>
            <div className="text-xs text-zinc-600 uppercase tracking-[0.4em]">AI Engineer</div>
          </motion.div>

          <div className="mt-16 w-48">
            <div className="h-[1px] bg-zinc-900 w-full overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-white"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            <div className="text-right text-xs text-zinc-700 font-mono mt-2">{progress}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
