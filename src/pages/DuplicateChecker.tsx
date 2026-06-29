import { useMemo, useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { JsonEditor } from '../components/JsonEditor';
import { Copy, Check, Trash2 } from 'lucide-react';

const PLACEHOLDER = `[1, 2, 3, 2, 4, 5, 3, 6, 7, 2, 5, 8, 9, 1]`;

interface DuplicateCheckerProps {
  onPageChange: (page: string) => void;
}

type DuplicateEntry = { value: unknown; count: number };

function findDuplicates(arr: unknown[]): {
  total: number;
  extra: number;
  entries: DuplicateEntry[];
} {
  const counts = new Map<unknown, number>();
  for (const item of arr) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  const entries: DuplicateEntry[] = [];
  for (const [value, count] of counts) {
    if (count > 1) {
      entries.push({ value, count });
    }
  }
  entries.sort((a, b) => (b.count as number) - (a.count as number));
  const total = entries.length;
  const extra = entries.reduce((sum, e) => sum + (e.count as number) - 1, 0);
  return { total, extra, entries };
}

export function DuplicateChecker({ onPageChange }: DuplicateCheckerProps) {
  const [input, setInput] = useState(PLACEHOLDER);
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    try {
      const val = JSON.parse(input);
      if (!Array.isArray(val)) return { ok: false as const, error: 'Must be an array' };
      return { ok: true as const, value: val as unknown[] };
    } catch {
      return { ok: false as const, error: 'Invalid JSON' };
    }
  }, [input]);

  const result = useMemo(() => {
    if (!parsed.ok) return { output: '', error: parsed.error };
    if (!parsed.value.length) return { output: '', error: 'Array is empty' };
    const dup = findDuplicates(parsed.value);
    if (dup.total === 0) {
      return { output: '[] /* no duplicates found */', error: null };
    }
    const summary = {
      duplicate_count: dup.total,
      total_extra_occurrences: dup.extra,
      duplicates: dup.entries.map(e => e.value),
      frequencies: Object.fromEntries(
        dup.entries.map(e => [JSON.stringify(e.value), (e as DuplicateEntry).count])
      ),
    };
    return { output: JSON.stringify(summary, null, 2), error: null };
  }, [parsed]);

  const handleCopy = useCallback(() => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result.output]);

  const handleClear = useCallback(() => {
    setInput('');
    setCopied(false);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-green-950 text-green-50">
      <Header page="duplicates" onPageChange={onPageChange} />

      <div className="px-4 py-3 border-b border-green-800 bg-green-900/15 shrink-0">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
          <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
            Duplicate Checker
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!result.output}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
                copied
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-700'
                  : 'text-green-200 bg-green-800 hover:bg-green-700 border border-green-700 disabled:text-green-600 disabled:bg-green-800/50'
              }`}
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" /> Copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!input}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-200 bg-green-800 hover:bg-green-700 rounded-md transition-colors border border-green-700 disabled:text-green-600 disabled:bg-green-800/50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <div className="flex-1 min-h-0 lg:w-1/2">
          <JsonEditor
            label="INPUT — Array"
            value={input}
            onChange={setInput}
            placeholder="Paste your array here..."
          />
        </div>

        <div className="editor-divider" />

        <div className="flex-1 min-h-0 lg:w-1/2">
          <JsonEditor
            label="OUTPUT — Duplicates"
            value={result.output}
            readOnly
            placeholder="Duplicate info will appear here..."
            error={result.error}
          />
        </div>
      </div>
    </div>
  );
}
