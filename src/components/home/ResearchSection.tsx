'use client';

import { motion } from 'framer-motion';
import { useSupabase } from '@/hooks/useSupabase';
import { Research } from '@/types';
import { ExternalLink, Calendar } from 'lucide-react';

export function ResearchSection() {
  const { data: publications, loading } = useSupabase<Research>('research', 'publication_date', false);

  return (
    <section id="research" className="py-32 px-6 bg-black relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Research</h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Exploring the frontier of AI and publishing findings to advance the field.
          </p>
        </div>

        {loading ? (
          <div className="text-zinc-500 animate-pulse">Loading publications...</div>
        ) : publications.length === 0 ? (
          <div className="text-zinc-600 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
            No research publications found. Add them through the admin dashboard.
          </div>
        ) : (
          <div className="relative border-l border-zinc-800/0 pl-8 space-y-12 ml-4">
            {/* Animated SVG Line */}
            <div className="absolute left-[-1px] top-4 bottom-4 w-[2px] bg-zinc-900 rounded-full overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-white via-zinc-500 to-zinc-900 origin-top h-full"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            {publications.map((pub, i) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[45px] top-1 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-700 group-hover:border-white group-hover:bg-white transition-all duration-300" />

                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-300 hover:bg-zinc-900/60">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
                    <Calendar size={14} />
                    <span>{new Date((pub as any).publication_date as string).getFullYear()}</span>
                    <span className="text-zinc-700">·</span>
                    <span className="text-zinc-400">{(pub as any).conference_or_journal}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-zinc-100">
                    {pub.title}
                  </h3>

                  <p className="text-zinc-500 text-sm mb-4">
                    {pub.authors.join(', ')}
                  </p>

                  {pub.abstract && (
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {pub.abstract}
                    </p>
                  )}

                  {pub.paperUrl && (
                    <a
                      href={pub.paperUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors border border-zinc-700 px-4 py-2 rounded-full hover:border-zinc-500"
                    >
                      <ExternalLink size={14} /> Read Paper
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
