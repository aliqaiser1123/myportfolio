'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const spotX = useMotionValue(-100);
  const spotY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const slowSpringConfig = { damping: 40, stiffness: 100 };
  const slowSpringX = useSpring(spotX, slowSpringConfig);
  const slowSpringY = useSpring(spotY, slowSpringConfig);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
      spotX.set(e.clientX - 200);
      spotY.set(e.clientY - 200);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <>
      {/* Custom dot cursor */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-3 h-3 rounded-full bg-white mix-blend-difference"
      />

      {/* Large spotlight glow */}
      <motion.div
        className="fixed top-0 left-0 z-[9990] pointer-events-none w-[400px] h-[400px] rounded-full"
        style={{
          x: slowSpringX,
          y: slowSpringY,
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
