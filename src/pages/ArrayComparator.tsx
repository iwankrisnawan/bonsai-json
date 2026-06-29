import { useMemo, useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { JsonEditor } from '../components/JsonEditor';
import { Copy, Check, ArrowLeftRight, Trash2 } from 'lucide-react';

const PLACEHOLDER_A = `[1, 4, 6, 7]`;
const PLACEHOLDER_B = `[1, 6, 7, 9]`;

interface ArrayComparatorProps {
  onPageChange: (page: string) => void;
}

function diff(a: unknown[], b: unknown[]): unknown[] {
  return a.filter(item => !b.includes(item));
}

function parseArray(input: string): { value: unknown[]; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) {
      return { value: [], error: 'Must be an array' };
    }
    return { value: parsed, error: null };
  } catch {
    return { value: [], error: 'Invalid JSON' };
  }
}

export function ArrayComparator({ onPageChange }: ArrayComparatorProps) {
  const [inputA, setInputA] = useState(PLACEHOLDER_A);
  const [inputB, setInputB] = useState(PLACEHOLDER_B);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const parsedA = useMemo(() => parseArray(inputA), [inputA]);
  const parsedB = useMemo(() => parseArray(inputB), [inputB]);

  const resultBmiss = useMemo(() => {
    if (parsedA.error || parsedB.error) return '';
    if (!parsedA.value.length && !parsedB.value.length) return '';
    const diffed = diff(parsedA.value, parsedB.value);
    return diffed.length ? JSON.stringify(diffed, null, 2) : '[] /* no diff */';
  }, [parsedA, parsedB]);

  const resultAmiss = useMemo(() => {
    if (parsedA.error || parsedB.error) return '';
    if (!parsedA.value.length && !parsedB.value.length) return '';
    const diffed = diff(parsedB.value, parsedA.value);
    return diffed.length ? JSON.stringify(diffed, null, 2) : '[] /* no diff */';
  }, [parsedA, parsedB]);

  const handleSwap = useCallback(() => {
    const tmp = inputA;
    setInputA(inputB);
    setInputB(tmp);
  }, [inputA, inputB]);

  const handleCopyA = useCallback(() => {
    if (!resultAmiss) return;
    navigator.clipboard.writeText(resultAmiss).then(() => {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    });
  }, [resultAmiss]);

  const handleCopyB = useCallback(() => {
    if (!resultBmiss) return;
    navigator.clipboard.writeText(resultBmiss).then(() => {
      setCopiedB(true);
      setTimeout(() => setCopiedB(false), 2000);
    });
  }, [resultBmiss]);

  const handleClear = useCallback(() => {
    setInputA('');
    setInputB('');
    setCopiedA(false);
    setCopiedB(false);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-green-950 text-green-50">
      <Header page="comparator" onPageChange={onPageChange} />

      <div className="px-4 py-3 border-b border-green-800 bg-green-900/15 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
            Array Comparator
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSwap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-200 bg-green-800 hover:bg-green-700 rounded-md transition-colors border border-green-700"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap
            </button>

            <div className="w-px h-5 bg-green-700/50" />

            <button
              type="button"
              onClick={handleCopyB}
              disabled={!resultBmiss}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
                copiedB
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-700'
                  : 'text-green-200 bg-green-800 hover:bg-green-700 border border-green-700 disabled:text-green-600 disabled:bg-green-800/50'
              }`}
            >
              {copiedB ? (
                <><Check className="w-3.5 h-3.5" /> B miss copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy B miss</>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyA}
              disabled={!resultAmiss}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
                copiedA
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-700'
                  : 'text-green-200 bg-green-800 hover:bg-green-700 border border-green-700 disabled:text-green-600 disabled:bg-green-800/50'
              }`}
            >
              {copiedA ? (
                <><Check className="w-3.5 h-3.5" /> A miss copied!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy A miss</>
              )}
            </button>

            <div className="w-px h-5 bg-green-700/50" />

            <button
              type="button"
              onClick={handleClear}
              disabled={!inputA && !inputB}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-200 bg-green-800 hover:bg-green-700 rounded-md transition-colors border border-green-700 disabled:text-green-600 disabled:bg-green-800/50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Input row */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          <div className="flex-1 min-h-0 lg:w-1/2">
            <JsonEditor
              label="ARRAY A"
              value={inputA}
              onChange={setInputA}
              placeholder="[1, 4, 6, 7]"
            />
          </div>
          <div className="editor-divider" />
          <div className="flex-1 min-h-0 lg:w-1/2">
            <JsonEditor
              label="ARRAY B"
              value={inputB}
              onChange={setInputB}
              placeholder="[1, 6, 7, 9]"
            />
          </div>
        </div>

        {/* Result row */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row border-t border-green-800">
          <div className="flex-1 min-h-0 lg:w-1/2">
            <JsonEditor
              label="B MISS (items in A but not in B)"
              value={resultBmiss}
              readOnly
              placeholder="Differences will appear here..."
              error={parsedA.error || parsedB.error}
            />
          </div>
          <div className="editor-divider" />
          <div className="flex-1 min-h-0 lg:w-1/2">
            <JsonEditor
              label="A MISS (items in B but not in A)"
              value={resultAmiss}
              readOnly
              placeholder="Differences will appear here..."
              error={parsedA.error || parsedB.error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
