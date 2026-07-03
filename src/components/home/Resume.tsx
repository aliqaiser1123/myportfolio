'use client';

import { useSupabase } from '@/hooks/useSupabase';
import { Resume as ResumeType } from '@/types';
import { Download, FileText } from 'lucide-react';

export function Resume() {
  const { data: resumes, loading } = useSupabase<ResumeType>('resume', 'last_updated', false);
  const resume = resumes[0];

  return (
    <section id="resume" className="py-32 px-6 bg-zinc-950 relative z-10 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Curriculum Vitae</h2>
            <p className="text-zinc-400 text-lg">
              A comprehensive overview of my academic background and professional experience.
            </p>
          </div>
          {resume?.pdfUrl && (
            <a
              href={resume.pdfUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors shrink-0"
            >
              <Download size={18} /> Download PDF
            </a>
          )}
        </div>

        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
              <FileText size={48} />
              <p>Loading document...</p>
            </div>
          ) : resume?.pdfUrl ? (
            <object
              data={resume.pdfUrl}
              type="application/pdf"
              className="w-full h-full min-h-[800px]"
            >
              <div className="flex flex-col items-center gap-4 text-zinc-400 p-8 text-center">
                <FileText size={48} />
                <p>It appears your browser doesn't support embedded PDFs.</p>
                <a href={resume.pdfUrl} className="text-blue-400 hover:underline">Click here to view it directly.</a>
              </div>
            </object>
          ) : (
            <div className="flex flex-col items-center gap-4 text-zinc-600">
              <FileText size={48} />
              <p>No resume uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
