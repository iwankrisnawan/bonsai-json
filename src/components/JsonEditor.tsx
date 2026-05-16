import { useCallback, useMemo, useRef, type ChangeEvent } from "react";
import type { ArrayAnnotation } from "../utils/arrayAnnotations";
import { highlightJson } from "../utils/jsonHighlighter";

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
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const lines = value ? value.split("\n") : [""];
  const highlighted = value ? highlightJson(value) : "";

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
      className="w-10 shrink-0 overflow-hidden border-r border-zinc-800 bg-zinc-950 py-4"
    >
      {lines.map((_, i) => {
        const lineNum = i + 1;
        const count = annotationMap.get(lineNum);
        return (
          <div
            key={i}
            className="h-5 flex items-center justify-end gap-1 pr-1.5 font-mono select-none"
          >
            {count !== undefined && (
              <span className="text-[10px] leading-none px-1 py-0.5 rounded bg-indigo-500/15 text-indigo-400 font-semibold tabular-nums shrink-0">
                {count}
              </span>
            )}
            <span className="text-[11px] leading-5 text-zinc-600 tabular-nums">
              {lineNum}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
        <span className="text-xs font-medium text-zinc-400">{label}</span>
        {error && (
          <span className="text-xs text-red-400 font-medium">{error}</span>
        )}
      </div>

      {/* Editor body */}
      <div className="flex-1 min-h-0 flex bg-zinc-950">
        {lineNumbers}

        {readOnly ? (
          <div
            className="flex-1 min-w-0 relative overflow-auto"
            onScroll={(e) => syncScroll(e.currentTarget)}
          >
            <pre
              ref={preRef}
              className="p-4 font-mono text-sm leading-5 whitespace-pre-wrap break-all m-0"
            >
              {highlighted ? (
                <code dangerouslySetInnerHTML={{ __html: highlighted }} />
              ) : (
                <span className="text-zinc-600">{placeholder}</span>
              )}
            </pre>
          </div>
        ) : (
          <div className="flex-1 min-w-0 relative">
            {/* Syntax highlight layer */}
            <pre
              ref={highlightRef}
              className="absolute inset-0 m-0 p-4 font-mono text-sm leading-5 whitespace-pre-wrap break-all overflow-hidden pointer-events-none"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />

            {/* Input textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onScroll={handleTextareaScroll}
              placeholder={placeholder}
              spellCheck={false}
              className="editor-textarea absolute inset-0 m-0 p-4 font-mono text-sm leading-5 bg-transparent text-transparent caret-zinc-100 resize-none outline-none whitespace-pre-wrap break-all overflow-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
