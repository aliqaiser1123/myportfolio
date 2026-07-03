'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/components/effects/SettingsContext';
import {
  Cpu, Zap, Eye, TerminalSquare, MousePointer2, Save,
  Volume2, VolumeX, Layers, Sparkles, Globe, Shield,
  Palette, Activity, Crosshair, ScanLine, RefreshCw,
  CheckCircle2, Monitor
} from 'lucide-react';

// ─── Reusable toggle component ────────────────────────────────────────────────
function Toggle({ checked, onChange, color = 'blue' }: { checked: boolean; onChange: () => void; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/50 border-blue-400',
    purple: 'bg-purple-500/50 border-purple-400',
    green: 'bg-green-500/50 border-green-400',
    red: 'bg-red-500/50 border-red-400',
    yellow: 'bg-yellow-500/50 border-yellow-400',
    cyan: 'bg-cyan-500/50 border-cyan-400',
  };
  const thumbColors: Record<string, string> = {
    blue: 'bg-blue-300', purple: 'bg-purple-300', green: 'bg-green-300',
    red: 'bg-red-300', yellow: 'bg-yellow-300', cyan: 'bg-cyan-300',
  };

  return (
    <button
      onClick={onChange}
      className={`w-14 h-7 rounded-full transition-all relative flex items-center px-1 border ${
        checked ? colors[color] : 'bg-zinc-800 border-zinc-700'
      }`}
    >
      <motion.div
        layout
        className={`w-5 h-5 rounded-full shadow-lg ${checked ? thumbColors[color] : 'bg-zinc-500'}`}
        animate={{ x: checked ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      />
    </button>
  );
}

// ─── Reusable slider ──────────────────────────────────────────────────────────
function NeonSlider({
  value, onChange, min = 0, max = 100, color = '#3b82f6', label, lowLabel, highLabel
}: {
  value: number; onChange: (v: number) => void; min?: number; max?: number;
  color?: string; label?: string; lowLabel?: string; highLabel?: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        {label && <span className="text-sm text-zinc-400">{label}</span>}
        <span className="text-2xl font-mono font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min} max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, #27272a ${((value - min) / (max - min)) * 100}%, #27272a 100%)`,
          }}
        />
      </div>
      {(lowLabel || highLabel) && (
        <div className="flex justify-between text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function SettingCard({
  children, glow, className = ''
}: { children: React.ReactNode; glow?: string; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-xl overflow-hidden group ${className}`}
    >
      {glow && (
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl"
          style={{ background: glow }}
        />
      )}
      {children}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { aesthetics, updateAesthetics, dbSettings, updateDbSettings, dbLoading } = useSettings();
  const [localAesthetics, setLocalAesthetics] = useState(aesthetics);
  const [localDb, setLocalDb] = useState(dbSettings);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync when context loads
  useEffect(() => { setLocalAesthetics(aesthetics); }, [aesthetics]);
  useEffect(() => { setLocalDb(dbSettings); }, [dbSettings]);

  const patchAesthetics = <K extends keyof typeof localAesthetics>(key: K, value: typeof localAesthetics[K]) => {
    setLocalAesthetics(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    updateAesthetics(localAesthetics);  // saves to localStorage instantly
    await updateDbSettings(localDb);    // saves to Supabase
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const ACCENT_COLORS = [
    { label: 'Neural Blue', value: '#3b82f6' },
    { label: 'Quantum Purple', value: '#a855f7' },
    { label: 'Matrix Green', value: '#22c55e' },
    { label: 'Plasma Cyan', value: '#06b6d4' },
    { label: 'Solar Orange', value: '#f97316' },
    { label: 'Neon Pink', value: '#ec4899' },
  ];

  return (
    <div className="min-h-full p-6 md:p-10 space-y-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-800/60 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500 flex items-center gap-3">
            <Cpu className="text-blue-400 shrink-0" size={32} />
            Neural Core Configuration
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mt-2">
            System Aesthetics & Environment Control
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="relative shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all overflow-hidden
            bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-green-400">
                <CheckCircle2 size={16} /> SYNCED
              </motion.span>
            ) : saving ? (
              <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin" /> SYNCING...
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Save size={16} /> SYNC CORE
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Section: Visual Engine ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-5">
          <Sparkles size={18} className="text-purple-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em]">Visual Engine</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Cyber Mode */}
          <SettingCard glow="#a855f7">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Eye size={16} className="text-purple-400" /> Cyberpunk Mode
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Deep neon aesthetics across the interface</p>
              </div>
              <Toggle checked={localAesthetics.cyberMode} onChange={() => patchAesthetics('cyberMode', !localAesthetics.cyberMode)} color="purple" />
            </div>
            <AnimatePresence>
              {localAesthetics.cyberMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] font-mono text-purple-400/70 bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20 mt-2"
                >
                  ◈ CYBER PROTOCOL ACTIVE
                </motion.div>
              )}
            </AnimatePresence>
          </SettingCard>

          {/* Scanlines */}
          <SettingCard glow="#06b6d4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <ScanLine size={16} className="text-cyan-400" /> CRT Scanlines
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Retro CRT monitor scanline overlay</p>
              </div>
              <Toggle checked={localAesthetics.scanlines} onChange={() => patchAesthetics('scanlines', !localAesthetics.scanlines)} color="cyan" />
            </div>
            <div className="h-8 rounded-lg overflow-hidden border border-zinc-700/50">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`h-[1px] w-full ${localAesthetics.scanlines ? 'bg-cyan-500/20' : 'bg-zinc-800/50'} transition-colors`} style={{ marginTop: 3 }} />
              ))}
            </div>
          </SettingCard>

          {/* Glitch Effects */}
          <SettingCard glow="#ef4444">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-red-400" /> Glitch Effects
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Random micro-glitches on UI elements</p>
              </div>
              <Toggle checked={localAesthetics.glitchEffects} onChange={() => patchAesthetics('glitchEffects', !localAesthetics.glitchEffects)} color="red" />
            </div>
          </SettingCard>

          {/* Background Particles */}
          <SettingCard glow="#3b82f6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Layers size={16} className="text-blue-400" /> Background Particles
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Floating ambient particle system</p>
              </div>
              <Toggle checked={localAesthetics.backgroundParticles} onChange={() => patchAesthetics('backgroundParticles', !localAesthetics.backgroundParticles)} color="blue" />
            </div>
          </SettingCard>

          {/* Reduced Motion */}
          <SettingCard glow="#22c55e">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Monitor size={16} className="text-green-400" /> Reduce Motion
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Minimize animations for performance</p>
              </div>
              <Toggle checked={localAesthetics.reducedMotion} onChange={() => patchAesthetics('reducedMotion', !localAesthetics.reducedMotion)} color="green" />
            </div>
          </SettingCard>

          {/* Terminal Sound */}
          <SettingCard glow="#f97316">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  {localAesthetics.terminalSoundEnabled ? <Volume2 size={16} className="text-orange-400" /> : <VolumeX size={16} className="text-zinc-500" />}
                  Terminal Sound
                </h3>
                <p className="text-zinc-500 text-xs mt-1">Keystroke audio for the terminal</p>
              </div>
              <Toggle checked={localAesthetics.terminalSoundEnabled} onChange={() => patchAesthetics('terminalSoundEnabled', !localAesthetics.terminalSoundEnabled)} color="yellow" />
            </div>
          </SettingCard>

        </div>
      </section>

      {/* ── Section: Accent Color ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-5">
          <Palette size={18} className="text-pink-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em]">Accent Color</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <SettingCard className="col-span-full">
          <p className="text-zinc-500 text-xs mb-5">Primary accent used across UI highlights, glows, and interactive elements.</p>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
                onClick={() => patchAesthetics('accentColor', value)}
                className={`relative w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 ${
                  localAesthetics.accentColor === value ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ background: value, boxShadow: localAesthetics.accentColor === value ? `0 0 20px ${value}80` : 'none' }}
              >
                {localAesthetics.accentColor === value && (
                  <motion.div layoutId="accent-check" className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-white drop-shadow" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-zinc-700" style={{ background: localAesthetics.accentColor }} />
            <span className="font-mono text-sm text-zinc-400">{localAesthetics.accentColor}</span>
            <div className="h-1 flex-1 rounded-full" style={{ background: `linear-gradient(to right, ${localAesthetics.accentColor}40, ${localAesthetics.accentColor})` }} />
          </div>
        </SettingCard>
      </section>

      {/* ── Section: Performance Sliders ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-5">
          <Zap size={18} className="text-yellow-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em]">Intensity Controls</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <SettingCard glow="#3b82f6" className="lg:col-span-1">
            <h3 className="font-bold text-white flex items-center gap-2 mb-1">
              <Crosshair size={16} className="text-blue-400" /> Neural Network Intensity
            </h3>
            <p className="text-zinc-500 text-xs mb-5">Density of the background node graph connections.</p>
            <NeonSlider
              value={localAesthetics.neuralNetworkIntensity}
              onChange={v => patchAesthetics('neuralNetworkIntensity', v)}
              color="#3b82f6"
              lowLabel="Minimal"
              highLabel="Overload"
            />
          </SettingCard>

          <SettingCard glow="#22c55e" className="lg:col-span-1">
            <h3 className="font-bold text-white flex items-center gap-2 mb-1">
              <TerminalSquare size={16} className="text-green-400" /> Matrix Rain Density
            </h3>
            <p className="text-zinc-500 text-xs mb-5">Active columns in the Easter Egg Matrix effect.</p>
            <NeonSlider
              value={localAesthetics.matrixRainDensity}
              onChange={v => patchAesthetics('matrixRainDensity', v)}
              min={10} max={150}
              color="#22c55e"
              lowLabel="Sparse"
              highLabel="Heavy Rain"
            />
          </SettingCard>

        </div>
      </section>

      {/* ── Section: Cursor Evolution ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-5">
          <MousePointer2 size={18} className="text-blue-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em]">Cursor Evolution</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <SettingCard>
          <p className="text-zinc-500 text-xs mb-5">Modify the visual tracking style of the custom cursor.</p>
          <div className="grid grid-cols-3 gap-3">
            {(['none', 'glow', 'particles'] as const).map(style => (
              <button
                key={style}
                onClick={() => patchAesthetics('cursorTrailStyle', style)}
                className={`relative py-4 px-3 rounded-xl border font-medium text-sm transition-all text-center ${
                  localAesthetics.cursorTrailStyle === style
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                {localAesthetics.cursorTrailStyle === style && (
                  <motion.div layoutId="cursor-indicator" className="absolute inset-0 rounded-xl bg-blue-500/10" />
                )}
                <span className="relative z-10 capitalize">{style}</span>
              </button>
            ))}
          </div>
        </SettingCard>
      </section>

      {/* ── Section: Site Settings ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-5">
          <Globe size={18} className="text-green-400" />
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-[0.15em]">Site Settings</h2>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SettingCard>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Site Name</label>
            {dbLoading ? (
              <div className="h-10 bg-zinc-800 rounded-xl animate-pulse" />
            ) : (
              <input
                type="text"
                value={localDb.siteName || ''}
                onChange={e => setLocalDb(p => ({ ...p, siteName: e.target.value }))}
                placeholder="Muhammad Ali Portfolio"
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            )}
          </SettingCard>

          <SettingCard>
            <div className="flex items-start justify-between mb-3">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Maintenance Mode</label>
                <p className="text-zinc-600 text-xs">Take the site offline for visitors</p>
              </div>
              <Toggle
                checked={!!localDb.maintenanceMode}
                onChange={() => setLocalDb(p => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
                color="red"
              />
            </div>
            <AnimatePresence>
              {localDb.maintenanceMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] font-mono text-red-400/70 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20 mt-2"
                >
                  <Shield size={10} className="inline mr-1" />
                  SITE OFFLINE — VISITORS WILL SEE MAINTENANCE PAGE
                </motion.div>
              )}
            </AnimatePresence>
          </SettingCard>
        </div>
      </section>

      {/* ── Save Banner ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 font-bold px-6 py-3 rounded-2xl backdrop-blur-xl shadow-2xl"
          >
            <CheckCircle2 size={18} />
            Neural Core synchronized successfully
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
