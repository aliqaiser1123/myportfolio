'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSupabase } from '@/hooks/useSupabase';
import { Project } from '@/types';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

function TiltCard({ project }: { project: Project }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        perspective: 1000
      }}
      className="relative w-full h-[350px] group cursor-pointer"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full h-full rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
      >
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-zinc-800 opacity-50 group-hover:opacity-70 transition-opacity duration-500"
          style={{ transform: "translateZ(0px)" }}
        >
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
            />
          )}
        </div>

        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
          style={{ transform: "translateZ(10px)" }}
        />

        {/* Content Layer (Pushed forward in 3D space) */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-end"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            {project.techStack.map(tech => (
              <span key={tech} className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono bg-white/10 backdrop-blur-md rounded-full text-zinc-300 border border-white/5">
                {tech}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4 max-w-md">
            {project.description}
          </p>

          <div className="flex items-center gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors">
                <FaGithub size={18} /> Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white hover:text-zinc-300 transition-colors">
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeaturedProjects() {
  const { data: projects, loading } = useSupabase<Project>('projects');

  const featured = projects.filter(p => p.featured) || projects.slice(0, 3); // Fallback to first 3 if none featured

  return (
    <section id="projects" className="py-32 px-6 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Featured Work</h2>
          <p className="text-zinc-400 max-w-2xl text-lg">
            A selection of my most impactful projects, combining deep learning research with scalable engineering.
          </p>
        </div>

        {loading ? (
          <div className="text-zinc-500 animate-pulse">Loading architectures...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featured.map((project, i) => (
              <TiltCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
