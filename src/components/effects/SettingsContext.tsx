'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Settings } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

export type CursorStyle = 'none' | 'glow' | 'particles';

export type AestheticSettings = {
  cyberMode: boolean;
  matrixRainDensity: number;
  cursorTrailStyle: CursorStyle;
  neuralNetworkIntensity: number;
  reducedMotion: boolean;
  scanlines: boolean;
  glitchEffects: boolean;
  terminalSoundEnabled: boolean;
  accentColor: string;
  backgroundParticles: boolean;
};

type DbSettings = Partial<Pick<Settings, 'siteName' | 'siteDescription' | 'maintenanceMode'>>;

type SettingsContextType = {
  // Aesthetic settings (localStorage)
  aesthetics: AestheticSettings;
  updateAesthetics: (s: Partial<AestheticSettings>) => void;
  // DB settings (Supabase)
  dbSettings: DbSettings;
  updateDbSettings: (s: DbSettings) => Promise<void>;
  dbLoading: boolean;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_AESTHETICS: AestheticSettings = {
  cyberMode: false,
  matrixRainDensity: 50,
  cursorTrailStyle: 'glow',
  neuralNetworkIntensity: 60,
  reducedMotion: false,
  scanlines: false,
  glitchEffects: true,
  terminalSoundEnabled: false,
  accentColor: '#3b82f6',
  backgroundParticles: true,
};

const STORAGE_KEY = 'portfolio_aesthetics_v1';

// ─── Context ──────────────────────────────────────────────────────────────────

const SettingsContext = createContext<SettingsContextType>({
  aesthetics: DEFAULT_AESTHETICS,
  updateAesthetics: () => {},
  dbSettings: {},
  updateDbSettings: async () => {},
  dbLoading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data, loading: dbLoading, update, add } = useSupabase<Settings>('settings');
  const [dbId, setDbId] = useState<string | null>(null);
  const [dbSettings, setDbSettings] = useState<DbSettings>({});
  const [aesthetics, setAesthetics] = useState<AestheticSettings>(DEFAULT_AESTHETICS);

  // Load aesthetics from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAesthetics({ ...DEFAULT_AESTHETICS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  // Load DB settings from Supabase
  useEffect(() => {
    if (!dbLoading && data && data.length > 0) {
      const row = data[0] as any;
      setDbSettings({
        siteName: row.siteName ?? row.site_name ?? '',
        siteDescription: row.siteDescription ?? row.site_description ?? '',
        maintenanceMode: row.maintenanceMode ?? row.maintenance_mode ?? false,
      });
      setDbId(row.id);
    }
  }, [data, dbLoading]);

  const updateAesthetics = (partial: Partial<AestheticSettings>) => {
    setAesthetics(prev => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {/* ignore */}
      return next;
    });
  };

  const updateDbSettings = async (newSettings: DbSettings) => {
    const updated = { ...dbSettings, ...newSettings };
    setDbSettings(updated);
    try {
      if (dbId) {
        await update(dbId, updated as any);
      } else {
        const id = await add(updated as any);
        setDbId(id);
      }
    } catch (err) {
      console.error('Failed to update DB settings:', err);
    }
  };

  return (
    <SettingsContext.Provider value={{ aesthetics, updateAesthetics, dbSettings, updateDbSettings, dbLoading }}>
      <div
        className={[
          aesthetics.cyberMode ? 'cyber-mode-active' : '',
          aesthetics.scanlines ? 'scanlines-active' : '',
          aesthetics.reducedMotion ? 'reduced-motion-active' : '',
        ].join(' ').trim()}
        style={{ '--accent': aesthetics.accentColor } as React.CSSProperties}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
