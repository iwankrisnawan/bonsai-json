import { useCallback, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { ArrayAnnotation } from '../utils/arrayAnnotations';
import { highlightJson } from '../utils/jsonHighlighter';
import { JsonTreeView } from './JsonTreeView';
import { Code, List } from 'lucide-react';

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  error?: string | null;
  label: string;
  annotations?: ArrayAnnotation[];
}

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
  error,
  label,
  annotations,
}: JsonEditorProps) {
  const [viewMode, setViewMode] = useState<'raw' | 'tree'>('raw');
  const canUseTree = useMemo(() => {
    try { JSON.parse(value); return true; }
    catch { return false; }
  }, [value]);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const treeScrollRef = useRef<HTMLDivElement>(null);

  const lines = value ? value.split('\n') : [''];
  const highlighted = value ? highlightJson(value) : '';

  const annotationMap = useMemo(
    () => new Map(annotations?.map((a) => [a.line, a.count]) ?? []),
    [annotations],
  );

  const syncScroll = useCallback((source: HTMLElement) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = source.scrollTop;
    }
    if (highlightRef.current) {
      highlightRef.current.scrollTop = source.scrollTop;
      highlightRef.current.scrollLeft = source.scrollLeft;
    }
  }, []);

  const handleTextareaScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      syncScroll(e.currentTarget);
    },
    [syncScroll],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange],
  );

  const lineNumbers = (
    <div
      ref={lineNumbersRef}
      className="w-10 shrink-0 overflow-hidden border-r border-green-800 bg-green-950 py-4"
    >
      {lines.map((_, i) => {
        const lineNum = i + 1;
        const count = annotationMap.get(lineNum);
        return (
          <div
            key={i}
            className="h-5 flex items-center justify-end gap-1 pr-1.5 font-mono select-none"
          >
            <span className="text-[11px] leading-5 text-green-600 tabular-nums">
              {lineNum}
            </span>
            {count !== undefined && (
              <span className="text-[10px] leading-none px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold tabular-nums shrink-0">
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  const isTree = viewMode === 'tree';

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-green-800 bg-green-900/30 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-green-400">{label}</span>

          {/* View mode toggle */}
          <div className="flex items-center bg-green-900 rounded-md border border-green-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium transition-colors ${
                viewMode === 'raw'
                  ? 'bg-emerald-600/20 text-emerald-400'
                  : 'text-green-500 hover:text-green-300'
              }`}
              title="Raw text view"
            >
              <Code className="w-3 h-3" />
              Raw
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              disabled={!canUseTree}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium transition-colors ${
                viewMode === 'tree'
                  ? 'bg-emerald-600/20 text-emerald-400'
                  : 'text-green-500 hover:text-green-300 disabled:text-green-700 disabled:cursor-not-allowed'
              }`}
              title="Collapsible tree view"
            >
              <List className="w-3 h-3" />
              Tree
            </button>
          </div>
        </div>

        {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
      </div>

      {/* Editor body */}
      <div className="flex-1 min-h-0 flex bg-green-950">
        {isTree ? (
          /* Tree view — full width, no line numbers */
          <div className="flex-1 min-w-0 overflow-auto" ref={treeScrollRef}>
            <JsonTreeView value={value} />
          </div>
        ) : (
          /* Raw text view — with line numbers */
          <>
            {lineNumbers}

            {readOnly ? (
              <div className="flex-1 min-w-0 relative overflow-auto" onScroll={(e) => syncScroll(e.currentTarget)}>
                <pre
                  ref={preRef}
                  className="p-4 font-mono text-sm leading-5 whitespace-pre m-0 text-green-50"
                >
                  {highlighted ? (
                    <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                  ) : (
                    <span className="text-green-700">{placeholder}</span>
                  )}
                </pre>
              </div>
            ) : (
              <div className="flex-1 min-w-0 relative">
                {/* Syntax highlight layer */}
                {highlighted && (
                  <pre
                    ref={highlightRef}
                    className="absolute inset-0 m-0 p-4 font-mono text-sm leading-5 whitespace-pre overflow-hidden pointer-events-none"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                )}

                {/* Input textarea */}
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleChange}
                  onScroll={handleTextareaScroll}
                  placeholder={placeholder}
                  spellCheck={false}
                  className="editor-textarea absolute inset-0 m-0 p-4 font-mono text-sm leading-5 bg-transparent text-transparent caret-green-200 resize-none outline-none whitespace-pre overflow-auto"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
