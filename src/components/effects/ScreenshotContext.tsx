'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ScreenshotContextType {
  isScreenshotMode: boolean;
  toggleScreenshotMode: () => void;
}

const ScreenshotContext = createContext<ScreenshotContextType | undefined>(undefined);

export function ScreenshotProvider({ children }: { children: ReactNode }) {
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  const toggleScreenshotMode = () => {
    setIsScreenshotMode(prev => !prev);
    if (!isScreenshotMode) {
      // Hide cursor in screenshot mode completely
      document.body.style.cursor = 'none';
      // Notify user how to exit
      setTimeout(() => alert('Screenshot Mode Active. UI elements hidden. Press ESC or reload to exit.'), 100);
    }
  };

  return (
    <ScreenshotContext.Provider value={{ isScreenshotMode, toggleScreenshotMode }}>
      <div className={isScreenshotMode ? 'screenshot-mode-active' : ''}>
        {children}
      </div>
    </ScreenshotContext.Provider>
  );
}

export function useScreenshotMode() {
  const context = useContext(ScreenshotContext);
  if (!context) throw new Error('useScreenshotMode must be used within ScreenshotProvider');
  return context;
}
