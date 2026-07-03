'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function AdminResumePage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    setUploading(true);
    setDone(false);
    setError(null);
    setProgress(10);

    try {
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resume')
        .upload('resume.pdf', file, { upsert: true });

      if (uploadError) throw uploadError;

      setProgress(70);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resume')
        .getPublicUrl('resume.pdf');

      const pdfUrl = urlData.publicUrl;

      // Save URL to database
      const { error: dbError } = await supabase
        .from('resume')
        .upsert({ pdf_url: pdfUrl, last_updated: new Date().toISOString() });

      if (dbError) throw dbError;

      setProgress(100);
      setDone(true);
    } catch (err: any) {
      setError('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <p className="text-zinc-400 mt-1">Upload a new PDF resume. It will instantly update on the public portfolio.</p>
        <p className="text-xs text-zinc-600 mt-2">Note: Create a public <code className="bg-zinc-900 px-1 rounded">resume</code> bucket in Supabase Storage first.</p>
      </div>

      <label className="block cursor-pointer group">
        <div className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
          uploading ? 'border-zinc-700 bg-zinc-900/30' : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900/20 hover:bg-zinc-900/40'
        }`}>
          {done ? (
            <div className="flex flex-col items-center gap-4 text-green-400">
              <CheckCircle size={48} />
              <p className="text-lg font-medium">Resume updated successfully!</p>
              <p className="text-sm text-zinc-400">Changes are now live on the public site.</p>
            </div>
          ) : uploading ? (
            <div className="flex flex-col items-center gap-4 text-zinc-300">
              <FileText size={48} className="animate-pulse" />
              <p className="text-lg font-medium">Uploading to Supabase Storage...</p>
              <div className="w-full max-w-xs bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-zinc-500 font-mono">{progress}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-zinc-500 group-hover:text-zinc-300 transition-colors">
              <Upload size={48} />
              <div>
                <p className="text-lg font-medium">Click to upload PDF</p>
                <p className="text-sm mt-1">Maximum file size: 10MB</p>
              </div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {error && (
        <p className="text-red-400 text-sm mt-4 bg-red-400/10 px-4 py-3 rounded-lg">{error}</p>
      )}
    </div>
  );
}
