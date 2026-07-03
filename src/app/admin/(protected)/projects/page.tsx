'use client';

import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectsAdminPage() {
  const { data: projects, loading, add, update, remove } = useSupabase<Project>('projects', 'order', true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await remove(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const techStackString = (formData.get('techStack') as string) || '';
    const techStack = techStackString.split(',').map(s => s.trim()).filter(Boolean);

    const projectData = {
      title: (formData.get('title') as string) || '',
      description: (formData.get('description') as string) || '',
      imageUrl: (formData.get('imageUrl') as string) || '',
      techStack,
      githubUrl: formData.get('githubUrl') as string || undefined,
      liveUrl: formData.get('liveUrl') as string || undefined,
      featured: formData.get('featured') === 'on',
      order: editingProject ? editingProject.order : projects.length,
    };

    try {
      if (editingProject?.id) {
        await update(editingProject.id, projectData);
      } else {
        await add(projectData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save project', error);
      alert('Failed to save project. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-zinc-400 mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="text-zinc-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-zinc-500 border border-dashed border-zinc-800 rounded-lg p-12 text-center">
          No projects found. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 bg-zinc-800 rounded overflow-hidden relative">
                  {project.imageUrl && (
                    <img src={project.imageUrl} alt={project.title} className="object-cover w-full h-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{project.title || 'Untitled Project'}</h3>
                  <div className="flex gap-2 mt-1">
                    {project.techStack?.map(tech => (
                      <span key={tech} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenEdit(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" className="h-8" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={editingProject?.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editingProject?.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" type="url" defaultValue={editingProject?.imageUrl} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
              <Input id="techStack" name="techStack" defaultValue={editingProject?.techStack?.join(', ')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" type="url" defaultValue={editingProject?.githubUrl} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input id="liveUrl" name="liveUrl" type="url" defaultValue={editingProject?.liveUrl} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" name="featured" defaultChecked={editingProject?.featured} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900" />
              <Label htmlFor="featured">Featured Project</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
