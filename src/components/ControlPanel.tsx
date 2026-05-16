import { Scissors, Copy, Check, Trash2 } from 'lucide-react';

interface ControlPanelProps {
  maxItems: number;
  onMaxItemsChange: (value: number) => void;
  onShorten: () => void;
  onCopy: () => void;
  onClear: () => void;
  copied: boolean;
  autoShorten: boolean;
  onAutoShortenChange: (value: boolean) => void;
  hasInput: boolean;
  hasOutput: boolean;
}

export function ControlPanel({
  maxItems,
  onMaxItemsChange,
  onShorten,
  onCopy,
  onClear,
  copied,
  autoShorten,
  onAutoShortenChange,
  hasInput,
  hasOutput,
}: ControlPanelProps) {
  return (
    <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/20 shrink-0">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
        {/* Max items slider */}
        <div className="flex items-center gap-3">
          <label htmlFor="max-items" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Max Items
          </label>
          <input
            id="max-items"
            type="range"
            min={1}
            max={5}
            step={1}
            value={maxItems}
            onChange={(e) => onMaxItemsChange(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm font-mono text-zinc-200 tabular-nums w-3 text-center">
            {maxItems}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShorten}
            disabled={!hasInput}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-md transition-colors disabled:cursor-not-allowed"
          >
            <Scissors className="w-3.5 h-3.5" />
            Shorten
          </button>

          {/* Auto-shorten toggle */}
          <label className="toggle gap-1.5 text-xs text-zinc-400 select-none">
            <input
              type="checkbox"
              checked={autoShorten}
              onChange={(e) => onAutoShortenChange(e.target.checked)}
            />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
            Auto
          </label>

          <div className="w-px h-5 bg-zinc-800" />

          <button
            type="button"
            onClick={onCopy}
            disabled={!hasOutput}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
              copied
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-800'
                : 'text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 disabled:text-zinc-600 disabled:bg-zinc-800/50'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!hasInput && !hasOutput}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700 disabled:text-zinc-600 disabled:bg-zinc-800/50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
