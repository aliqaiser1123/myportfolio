'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Hexagon, 
  FileText, 
  Microscope, 
  Award, 
  FileBadge2, 
  Mail, 
  BarChart3, 
  Settings, 
  UserCircle 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Skills', href: '/admin/skills', icon: Hexagon },
  { name: 'Research Lab', href: '/admin/blog', icon: FileText },
  { name: 'Research', href: '/admin/research', icon: Microscope },
  { name: 'Certificates', href: '/admin/certificates', icon: Award },
  { name: 'Resume', href: '/admin/resume', icon: FileBadge2 },
  { name: 'Messages', href: '/admin/messages', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/admin/profile', icon: UserCircle },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-6">
      <div className="mb-8 px-2 text-lg font-semibold tracking-tight text-white">
        Admin Portal
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              )}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
