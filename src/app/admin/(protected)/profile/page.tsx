'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function ProfileAdminPage() {
  const { data: profiles, loading, update, add } = useSupabase<Profile>('profile');
  const [formData, setFormData] = useState<Partial<Profile>>({
    fullName: '',
    headline: '',
    bio: '',
    avatarUrl: '',
    location: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load existing profile if it exists
  useEffect(() => {
    if (profiles.length > 0) {
      setFormData(profiles[0]);
    }
  }, [profiles]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (profiles.length > 0) {
        await update(profiles[0].id, formData);
      } else {
        await add(formData as any);
      }
      alert('Profile saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-400">Loading profile data...</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your public information and bio.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Full Name</label>
          <input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Headline</label>
          <input
            type="text"
            value={formData.headline || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. AI Engineer | Building the Future"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={5}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
