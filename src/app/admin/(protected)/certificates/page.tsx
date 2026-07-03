'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Plus, Trash2, Pencil, X, Check, Award } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  imageUrl?: string;
  order: number;
}

const DEFAULT_FORM = {
  title: '',
  issuer: '',
  date: '',
  url: '',
  imageUrl: '',
  order: 0,
};

export default function CertificatesAdminPage() {
  const { data: certificates, loading, add, update, remove } = useSupabase<Certificate>('certificates', 'order', true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cert: Certificate) => {
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date || '',
      url: cert.url || '',
      imageUrl: cert.imageUrl || '',
      order: cert.order || 0,
    });
    setEditingId(cert.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await update(editingId, form);
      } else {
        await add(form as any);
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certificate?')) await remove(id);
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Certificates</h1>
          <p className="text-zinc-400 mt-1">
            Manage your certifications and achievements.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-white text-zinc-900 font-semibold text-sm px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-8 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">
            {editingId ? 'Edit Certificate' : 'New Certificate'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Title *</label>
              <input
                type="text"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Issuer *</label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services"
                value={form.issuer}
                onChange={e => setForm({ ...form, issuer: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Date</label>
              <input
                type="text"
                placeholder="e.g. 2023"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">URL (Credential Link)</label>
              <input
                type="text"
                placeholder="https://..."
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim() || !form.issuer.trim()}
              className="flex items-center gap-2 bg-white text-zinc-900 font-semibold text-sm px-5 py-2 rounded-full hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              <Check size={16} />
              {saving ? 'Saving...' : editingId ? 'Update Certificate' : 'Save Certificate'}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm px-5 py-2 rounded-full border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-zinc-500 animate-pulse py-12 text-center">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="text-zinc-600 border border-dashed border-zinc-800 rounded-2xl p-16 text-center">
          <Award size={32} className="mx-auto mb-4 text-zinc-700" />
          <p className="font-medium text-zinc-500">No certificates yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {certificates.map(cert => (
            <div
              key={cert.id}
              className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{cert.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{cert.issuer} {cert.date && `• ${cert.date}`}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-800 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
