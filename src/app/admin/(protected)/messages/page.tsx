'use client';

import { useSupabase } from '@/hooks/useSupabase';
import { Message } from '@/types';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminMessagesPage() {
  const { data: messages, loading, remove, update } = useSupabase<Message>('messages', 'created_at', false);

  const handleMarkRead = async (id: string) => {
    await update(id, { read: true } as any);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-zinc-400 mt-1">
          Inbox — {messages.filter(m => !m.read).length} unread
        </p>
      </div>

      {loading ? (
        <div className="text-zinc-500 animate-pulse">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-zinc-600 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-colors ${
                msg.read
                  ? 'border-zinc-800/50 bg-zinc-900/20 opacity-70'
                  : 'border-zinc-700 bg-zinc-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="shrink-0 mt-1">
                    {msg.read ? (
                      <MailOpen size={20} className="text-zinc-600" />
                    ) : (
                      <Mail size={20} className="text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-semibold text-white">{msg.name}</span>
                      <span className="text-zinc-500 text-sm">{msg.email}</span>
                      {!msg.read && (
                        <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-zinc-300 mb-2">{msg.subject}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{msg.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!msg.read && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkRead(msg.id)} className="h-8 text-xs">
                      Mark Read
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" className="h-8" onClick={() => { if (confirm('Delete?')) remove(msg.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
