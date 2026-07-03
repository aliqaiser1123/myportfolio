'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabase } from '@/hooks/useSupabase';
import { Skill } from '@/types';
import { Hexagon, X, BrainCircuit } from 'lucide-react';

export function HexagonNetwork() {
  const { data: skills, loading } = useSupabase<Skill>('skills');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  if (loading) return <div className="py-32 text-center text-zinc-500">Loading neural network...</div>;

  return (
    <section id="skills" className="py-40 relative bg-black overflow-hidden flex flex-col items-center">
      <div className="text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Tech Orbit</h2>
        <p className="text-zinc-400">Core competencies orbiting the central AI engine.</p>
      </div>

      <div className="relative w-full max-w-5xl mx-auto min-h-[600px] flex items-center justify-center">
        {/* Orbital Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="absolute w-[300px] h-[300px] rounded-full border border-zinc-500" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-zinc-600 border-dashed" />
          <div className="absolute w-[700px] h-[700px] rounded-full border border-zinc-700" />
        </div>

        {/* Central Core */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute z-20 flex items-center justify-center w-32 h-32 rounded-full bg-zinc-950 border border-zinc-700 shadow-[0_0_60px_rgba(255,255,255,0.15)]"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BrainCircuit size={48} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Orbiting Nodes */}
        <div className="relative w-full h-full flex items-center justify-center">
          {(() => {
            const layerCounts = [4, 8, 12, 16];
            const layerAssignments = skills.map((_, index) => {
              let passed = 0;
              for (let l = 0; l < layerCounts.length; l++) {
                if (index < passed + layerCounts[l]) {
                  return { layer: l, indexInLayer: index - passed };
                }
                passed += layerCounts[l];
              }
              return { layer: 3, indexInLayer: index - passed };
            });

            const itemsPerLayer = [0, 0, 0, 0];
            layerAssignments.forEach(a => itemsPerLayer[a.layer]++);

            return skills.map((skill, i) => {
              const { layer, indexInLayer } = layerAssignments[i];
              const actualItemsInLayer = itemsPerLayer[layer];
              
              const radius = layer === 0 ? 150 : layer === 1 ? 250 : 350;
              const angle = (indexInLayer / actualItemsInLayer) * Math.PI * 2;
              const startRotation = (angle * 180) / Math.PI;

              const duration = 20 + layer * 15;
              const direction = layer % 2 === 0 ? 1 : -1;

              return (
                <motion.div
                  key={skill.id}
                  className="absolute origin-center pointer-events-none"
                  style={{ width: radius * 2, height: radius * 2 }}
                  initial={{ rotate: startRotation }}
                  animate={{ rotate: startRotation + (direction * 360) }}
                  transition={{ duration, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.div
                    className="absolute cursor-pointer group z-30 pointer-events-auto"
                    style={{
                      left: '50%',
                      top: 0,
                      transform: 'translate(-50%, -50%)',
                    }}
                    whileHover={{ scale: 1.2, zIndex: 50 }}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <motion.div
                      initial={{ rotate: -startRotation }}
                      animate={{ rotate: -startRotation - (direction * 360) }}
                      transition={{ duration, repeat: Infinity, ease: 'linear' }}
                      className="flex flex-col items-center justify-center"
                    >
                      <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl flex flex-col items-center justify-center group-hover:border-white transition-colors group-hover:bg-zinc-800">
                        <Hexagon size={20} className="text-zinc-400 group-hover:text-white mb-1" />
                      </div>
                      <span className="absolute top-16 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 group-hover:text-white transition-colors text-center w-24 truncate whitespace-nowrap bg-black/50 px-1 rounded">
                        {skill.name}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            });
          })()}
        </div>
      </div>

      {/* Selected Skill Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <Hexagon size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedSkill.name}</h3>
                  <p className="text-zinc-400">{selectedSkill.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Proficiency</span>
                    <span className="text-white font-mono">{selectedSkill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSkill.proficiency}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-zinc-500 to-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
