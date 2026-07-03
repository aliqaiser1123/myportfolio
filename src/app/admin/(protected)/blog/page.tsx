'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Blog } from '@/types';
import { Button } from '@/components/ui/button';
import { TipTapEditor } from '@/components/admin/TipTapEditor';
import { Plus, Trash2, Save, X } from 'lucide-react';

export default function BlogAdminPage() {
  const { data: posts, loading, add, remove } = useSupabase<Blog>('blog', 'created_at', false);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);

  const handleSave = async () => {
    if (!title) return alert('Title is required');
    
    await add({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      categories: categories.split(',').map(c => c.trim()).filter(Boolean),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      featured,
      content: editorContent,
      published: false,
      readingTime: 0,
      views: 0,
    } as any);
    
    setIsEditing(false);
    setTitle('');
    setDescription('');
    setCategories('');
    setTags('');
    setFeatured(false);
    setEditorContent(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog (Notion-style)</h1>
          <p className="text-zinc-400 mt-1">Write and manage your articles using the rich text editor.</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Post Title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-transparent border-b border-zinc-800 text-3xl font-bold py-2 focus:outline-none focus:border-white transition-colors"
            />
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Post
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Description (SEO / Excerpt)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded p-2 text-sm focus:outline-none focus:border-white"
            />
            <div className="flex items-center gap-2 px-2 bg-zinc-900 border border-zinc-800 rounded">
              <input 
                type="checkbox" 
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm text-zinc-400">Featured Article</label>
            </div>
            <input 
              type="text" 
              placeholder="Categories (comma separated)" 
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded p-2 text-sm focus:outline-none focus:border-white"
            />
            <input 
              type="text" 
              placeholder="Tags (comma separated)" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded p-2 text-sm focus:outline-none focus:border-white"
            />
          </div>

          <TipTapEditor content={editorContent} onChange={setEditorContent} />
        </div>
      ) : (
        <div className="grid gap-4">
          {loading ? (
             <div className="text-zinc-400">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-zinc-500 border border-dashed border-zinc-800 rounded-lg p-12 text-center">
              No blog posts found. Start writing!
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-medium text-lg">{post.title}</h3>
                  <p className="text-sm text-zinc-500">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Button variant="destructive" size="sm" onClick={() => {
                    if(confirm('Delete post?')) remove(post.id);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
