import { useMemo, useState, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { JsonEditor } from '../components/JsonEditor';
import { Copy, Check, Trash2 } from 'lucide-react';

const PLACEHOLDER = `[
  { "code": "BBCA", "name": "Bank Central Asia", "sector": "Finance", "price": 10250 },
  { "code": "BBRI", "name": "Bank Rakyat Indonesia", "sector": "Finance", "price": 4850 },
  { "code": "TLKM", "name": "Telkom Indonesia", "sector": "Telecom", "price": 3980 },
  { "code": "ASII", "name": "Astra International", "sector": "Automotive", "price": 5875 },
  { "code": "UNVR", "name": "Unilever Indonesia", "sector": "Consumer", "price": 4120 },
  { "code": "GOTO", "name": "GoTo Gojek Tokopedia", "sector": "Technology", "price": 162 }
]`;

interface ArrayExtractorProps {
  onPageChange: (page: string) => void;
}

export function ArrayExtractor({ onPageChange }: ArrayExtractorProps) {
  const [input, setInput] = useState(PLACEHOLDER);
  const [selectedKey, setSelectedKey] = useState<string>('code');
  const [copied, setCopied] = useState(false);

  const detectedKeys = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed) || parsed.length === 0) return [];
      const keys = new Set<string>();
      for (const item of parsed) {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(k => keys.add(k));
        }
      }
      return [...keys];
    } catch {
      return [];
    }
  }, [input]);

  useEffect(() => {
    if (detectedKeys.length > 0 && !detectedKeys.includes(selectedKey)) {
      setSelectedKey(detectedKeys[0]);
    }
  }, [detectedKeys, selectedKey]);

  const { output, error } = useMemo(() => {
    if (!selectedKey) return { output: '', error: null };
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        return { output: '', error: 'Input must be an array' };
      }
      const extracted = parsed.map((item: unknown, i: number) => {
        if (typeof item !== 'object' || item === null) {
          throw new Error(`Item at index ${i} is not an object`);
        }
        if (!(selectedKey in item)) {
          throw new Error(`Key "${selectedKey}" not found in item at index ${i}`);
        }
        return (item as Record<string, unknown>)[selectedKey];
      });
      return { output: JSON.stringify(extracted, null, 2), error: null };
    } catch (e) {
      return { output: '', error: e instanceof Error ? e.message : 'Invalid JSON' };
    }
  }, [input, selectedKey]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setSelectedKey('');
    setCopied(false);
  }, []);

  return (
    <div className="h-dvh flex flex-col bg-green-950 text-green-50">
      <Header page="extractor" onPageChange={onPageChange} />

      <div className="px-4 py-3 border-b border-green-800 bg-green-900/15 shrink-0">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
          <div className="flex items-center gap-3">
            <label htmlFor="key-select" className="text-xs font-medium text-green-400 uppercase tracking-wider">
              Extract Key
            </label>
            <select
              id="key-select"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              disabled={detectedKeys.length === 0}
              className="bg-green-900 text-green-200 text-sm border border-green-700 rounded-md px-2.5 py-1.5 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {detectedKeys.length === 0 && (
                <option value="">—</option>
              )}
              {detectedKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!output}
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
              disabled={!input && !output}
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
            label="INPUT — Array of Objects"
            value={input}
            onChange={setInput}
            placeholder="Paste your array of objects here..."
          />
        </div>

        <div className="editor-divider" />

        <div className="flex-1 min-h-0 lg:w-1/2">
          <JsonEditor
            label={`OUTPUT — ${selectedKey || '...'}`}
            value={output}
            readOnly
            placeholder="Extracted values will appear here..."
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
