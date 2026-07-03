'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Research } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminResearchPage() {
  const { data: publications, loading, add, remove } = useSupabase<Research>('research', 'publication_date', false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: '',
    authors: '',
    conference_or_journal: '',
    publication_date: '',
    paper_url: '',
    abstract: '',
  });

  const handleAdd = async () => {
    if (!form.title || !form.conference_or_journal) return;
    await add({
      title: form.title,
      authors: form.authors.split(',').map((a) => a.trim()),
      conference_or_journal: form.conference_or_journal,
      publication_date: form.publication_date,
      paper_url: form.paper_url || undefined,
      abstract: form.abstract || undefined,
    } as any);
    setAdding(false);
    setForm({ title: '', authors: '', conference_or_journal: '', publication_date: '', paper_url: '', abstract: '' });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research</h1>
          <p className="text-zinc-400 mt-1">Manage your publications and academic work.</p>
        </div>
        <Button onClick={() => setAdding(!adding)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Publication
        </Button>
      </div>

      {adding && (
        <div className="mb-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-4">
          <h3 className="font-semibold text-white mb-4">New Publication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600" />
            <input placeholder="Authors (comma separated)" value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600" />
            <input placeholder="Conference / Journal *" value={form.conference_or_journal} onChange={(e) => setForm({ ...form, conference_or_journal: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600" />
            <input type="date" value={form.publication_date} onChange={(e) => setForm({ ...form, publication_date: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600" />
            <input placeholder="Paper URL (optional)" value={form.paper_url} onChange={(e) => setForm({ ...form, paper_url: e.target.value })} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 col-span-full" />
          </div>
          <textarea placeholder="Abstract (optional)" rows={4} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none" />
          <div className="flex gap-3">
            <Button onClick={handleAdd}>Save Publication</Button>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-zinc-500 animate-pulse">Loading...</div>
      ) : (
        <div className="space-y-4">
          {publications.map((pub) => (
            <div key={pub.id} className="flex items-start justify-between p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:bg-zinc-900/60 transition-colors">
              <div>
                <h3 className="font-medium text-lg text-white">{pub.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">{Array.isArray(pub.authors) ? pub.authors.join(', ') : pub.authors}</p>
                <p className="text-sm text-zinc-500 mt-1">{(pub as any).conference_or_journal}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button variant="destructive" size="sm" onClick={() => { if (confirm('Delete?')) remove(pub.id); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
