'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Youtube } from '@tiptap/extension-youtube';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { MathExtension } from '@/components/admin/TipTapMathExtension';
import { common, createLowlight } from 'lowlight';
import { useEffect } from 'react';

const lowlight = createLowlight(common);

interface ArticleRendererProps {
  content: any;
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-8 border border-zinc-800 shadow-2xl',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400 transition-colors underline-offset-4',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'block bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-sm overflow-x-auto my-8 shadow-inner',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl my-8 border border-zinc-800 shadow-2xl',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-zinc-800 my-8 table-auto bg-zinc-900/20 rounded-xl overflow-hidden',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-zinc-800 bg-zinc-900 p-4 text-left font-bold text-zinc-200',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-zinc-800 p-4 text-zinc-300',
        },
      }),
      MathExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-400 prose-img:rounded-xl prose-hr:border-zinc-800 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return <div className="animate-pulse flex space-x-4">
      <div className="flex-1 space-y-6 py-1">
        <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-zinc-800 rounded"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
        </div>
      </div>
    </div>;
  }

  return <EditorContent editor={editor} />;
}
