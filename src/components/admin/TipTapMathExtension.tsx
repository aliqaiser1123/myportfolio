import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useState, useRef, useEffect } from 'react';

const MathComponent = (props: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [equation, setEquation] = useState(props.node.attrs.equation || '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !isEditing) {
      try {
        katex.render(equation || 'E = mc^2', containerRef.current, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [equation, isEditing]);

  const updateEquation = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEquation(e.target.value);
    props.updateAttributes({ equation: e.target.value });
  };

  return (
    <NodeViewWrapper className="math-block my-4">
      <div 
        className={`p-4 rounded-lg border transition-colors ${isEditing ? 'border-blue-500 bg-zinc-900' : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'}`}
        onClick={() => setIsEditing(true)}
      >
        {!isEditing ? (
          <div ref={containerRef} className="cursor-pointer overflow-x-auto text-center" />
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full bg-zinc-950 text-white font-mono text-sm p-3 rounded border border-zinc-700 focus:outline-none focus:border-blue-500 min-h-[80px]"
              value={equation}
              onChange={updateEquation}
              placeholder="Enter LaTeX equation..."
              autoFocus
              onBlur={() => setIsEditing(false)}
            />
            <div className="text-xs text-zinc-500 flex justify-between">
              <span>Press outside to save and render</span>
              <a href="https://katex.org/docs/supported.html" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">KaTeX Reference</a>
            </div>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const MathExtension = Node.create({
  name: 'mathBlock',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      equation: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'math-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MathComponent);
  },

  addCommands() {
    return {
      setMathBlock: () => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
        });
      },
    } as any;
  },
});
