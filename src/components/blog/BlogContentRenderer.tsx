'use client';

import React from 'react';

type TipTapNode = {
  type: string;
  content?: TipTapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
  attrs?: Record<string, any>;
};

function renderNode(node: TipTapNode, index: number): React.ReactNode {
  const children = node.content?.map((child, i) => renderNode(child, i)) ?? null;

  // Apply marks (bold, italic, code, link) to text nodes
  if (node.type === 'text') {
    let element: React.ReactNode = node.text;
    if (node.marks) {
      for (const mark of node.marks) {
        switch (mark.type) {
          case 'bold':
            element = <strong key={index}>{element}</strong>;
            break;
          case 'italic':
            element = <em key={index}>{element}</em>;
            break;
          case 'code':
            element = <code key={index}>{element}</code>;
            break;
          case 'link':
            element = (
              <a key={index} href={mark.attrs?.href} target="_blank" rel="noreferrer">
                {element}
              </a>
            );
            break;
          case 'underline':
            element = <u key={index}>{element}</u>;
            break;
          default:
            break;
        }
      }
    }
    return element;
  }

  switch (node.type) {
    case 'doc':
      return <>{children}</>;
    case 'paragraph':
      return <p key={index}>{children}</p>;
    case 'heading':
      const level = node.attrs?.level ?? 1;
      const HeadingTag = `h${level}` as any;
      return <HeadingTag key={index}>{children}</HeadingTag>;
    case 'bulletList':
      return <ul key={index}>{children}</ul>;
    case 'orderedList':
      return <ol key={index}>{children}</ol>;
    case 'listItem':
      return <li key={index}>{children}</li>;
    case 'blockquote':
      return <blockquote key={index}>{children}</blockquote>;
    case 'codeBlock':
      return (
        <pre key={index}>
          <code className={node.attrs?.language ? `language-${node.attrs.language}` : undefined}>
            {children}
          </code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={index} />;
    case 'image':
      return (
        <img
          key={index}
          src={node.attrs?.src}
          alt={node.attrs?.alt ?? ''}
          className="rounded-xl max-w-full my-6"
        />
      );
    case 'hardBreak':
      return <br key={index} />;
    default:
      return <div key={index}>{children}</div>;
  }
}

interface BlogContentRendererProps {
  content: any;
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  if (!content) {
    return <p className="text-zinc-500">No content available.</p>;
  }

  try {
    const root: TipTapNode = typeof content === 'string' ? JSON.parse(content) : content;
    return <>{renderNode(root, 0)}</>;
  } catch (e) {
    return <p className="text-zinc-500">Content could not be rendered.</p>;
  }
}
