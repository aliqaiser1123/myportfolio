'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Plus, Trash2, Pencil, X, Check, Hexagon } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

const CATEGORIES = [
  'Languages',
  'Frameworks',
  'AI / ML',
  'Cloud & DevOps',
  'Databases',
  'Tools',
];

const DEFAULT_FORM = {
  name: '',
  category: 'Languages',
  proficiency: 80,
  icon: '',
};

export default function SkillsAdminPage() {
  const { data: skills, loading, add, update, remove } = useSupabase<Skill>('skills', 'category');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (skill: Skill) => {
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
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
    if (confirm('Delete this skill?')) await remove(id);
  };

  // Group skills by category for display
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Skills</h1>
          <p className="text-zinc-400 mt-1">
            Manage your tech stack — these power the Tech Orbit on the homepage.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-white text-zinc-900 font-semibold text-sm px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-8 bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">
            {editingId ? 'Edit Skill' : 'New Skill'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Python, PyTorch, Docker"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Category *
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-zinc-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Proficiency */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Proficiency: <span className="text-white font-bold">{form.proficiency}%</span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={form.proficiency}
                onChange={e => setForm({ ...form, proficiency: Number(e.target.value) })}
                className="w-full accent-white"
              />
              <div className="flex justify-between text-xs text-zinc-600 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="flex items-center gap-2 bg-white text-zinc-900 font-semibold text-sm px-5 py-2 rounded-full hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              <Check size={16} />
              {saving ? 'Saving...' : editingId ? 'Update Skill' : 'Save Skill'}
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

      {/* Skills List */}
      {loading ? (
        <div className="text-zinc-500 animate-pulse py-12 text-center">Loading skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-zinc-600 border border-dashed border-zinc-800 rounded-2xl p-16 text-center">
          <Hexagon size={32} className="mx-auto mb-4 text-zinc-700" />
          <p className="font-medium text-zinc-500">No skills yet.</p>
          <p className="text-sm mt-1">Click "Add Skill" to populate your Tech Orbit.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category}>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                {category}
              </h2>
              <div className="grid gap-3">
                {catSkills.map(skill => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 transition-colors"
                  >
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{skill.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{skill.category}</p>
                    </div>

                    {/* Proficiency bar */}
                    <div className="w-40 hidden md:block">
                      <div className="flex justify-between text-xs text-zinc-500 mb-1">
                        <span>Proficiency</span>
                        <span className="text-white">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-zinc-400 to-white rounded-full transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-800 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
