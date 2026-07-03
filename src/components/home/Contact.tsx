'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Message } from '@/types';
import { Send, MapPin, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function Contact() {
  const { add } = useSupabase<Message>('messages');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await add({
        ...formData,
        read: false,
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-black relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black opacity-60" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Initialize Connection</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Whether you have a question about AI architectures or want to collaborate on a moonshot project, my inbox is open.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Subject</label>
                <input
                  required
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? 'Transmitting...' : status === 'success' ? 'Transmission Received' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between"
          >
            <div className="space-y-12">
              <div className="flex items-start gap-6 group cursor-pointer" onClick={() => {
                navigator.clipboard.writeText('aliqaiser1123@gmail.com');
                setStatus('idle'); // simple reset
                alert('Email copied to clipboard!'); // or real toast
              }}>
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Direct Channel</h4>
                  <p className="text-zinc-400 flex items-center gap-2">aliqaiser1123@gmail.com <span className="text-xs border border-zinc-800 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</span></p>
                </div>
              </div>

              <div className="flex items-start gap-6 group cursor-pointer" onClick={() => {
                navigator.clipboard.writeText('aliqaiser_discord');
                alert('Discord username copied!');
              }}>
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Discord</h4>
                  <p className="text-zinc-400 flex items-center gap-2">@aliqaiser_discord <span className="text-xs border border-zinc-800 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</span></p>
                </div>
              </div>
            </div>

            <div className="mt-20">
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-6">Social Networks</h4>
              <div className="flex items-center gap-4">
                {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:-translate-y-1 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
