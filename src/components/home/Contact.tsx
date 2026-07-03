'use client';

import { useState } from 'react';
import { Send, MapPin, Mail, MessageSquare } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send');
      
      setStatus('success');
      setFormData({ name: '', email: '', whatsapp: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-black relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-600 mb-6"
          >
            INITIALIZE CONNECTION
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Whether you have a question about AI architectures, want to collaborate on a moonshot project, or just want to say hi—my inbox is always open.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col justify-between h-full space-y-12"
          >
            <div className="space-y-10">
              <div 
                className="group flex flex-col gap-4 cursor-pointer p-6 rounded-3xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 hover:border-white/10 transition-all backdrop-blur-sm"
                onClick={() => {
                  navigator.clipboard.writeText('aliqaiser1123@gmail.com');
                  alert('Email copied to clipboard!');
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-green-400 group-hover:scale-110 transition-all">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Direct Channel</h4>
                  <p className="text-zinc-400 font-mono text-sm">aliqaiser1123@gmail.com</p>
                </div>
              </div>

              <div 
                className="group flex flex-col gap-4 cursor-pointer p-6 rounded-3xl bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 hover:border-white/10 transition-all backdrop-blur-sm"
                onClick={() => {
                  navigator.clipboard.writeText('aliqaiser_discord');
                  alert('Discord username copied!');
                }}
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Discord Protocol</h4>
                  <p className="text-zinc-400 font-mono text-sm">@aliqaiser_discord</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">Neural Networks</h4>
              <div className="flex items-center gap-6">
                {[
                  { Icon: FaGithub, href: 'https://github.com/aliqaiser1123', color: 'hover:text-white' },
                  { Icon: FaLinkedin, href: 'https://linkedin.com/in/aliqaiser', color: 'hover:text-blue-400' },
                  { Icon: FaTwitter, href: '#', color: 'hover:text-sky-400' },
                ].map(({ Icon, href, color }, i) => (
                  <a 
                    key={i} 
                    href={href} 
                    target="_blank"
                    rel="noreferrer"
                    className={`text-zinc-500 transition-all hover:-translate-y-2 ${color}`}
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-zinc-950/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 group-focus-within:text-green-400 transition-colors">Identification</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 group-focus-within:text-green-400 transition-colors">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 group-focus-within:text-green-400 transition-colors">WhatsApp No.</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-green-500 transition-colors">
                      <FaWhatsapp size={18} />
                    </div>
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pr-4 pl-12 text-white focus:outline-none focus:border-green-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 group-focus-within:text-green-400 transition-colors">Subject</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 group-focus-within:text-green-400 transition-colors">Payload</label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-zinc-900/80 transition-all placeholder:text-zinc-700 resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full relative overflow-hidden group flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      TRANSMIT <Send size={16} />
                    </motion.div>
                  )}
                  {status === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      TRANSMITTING
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-green-600">
                      TRANSMISSION SUCCESSFUL
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-600">
                      TRANSMISSION FAILED
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
