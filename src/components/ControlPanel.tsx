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
    <div className="px-4 py-3 border-b border-green-800 bg-green-900/15 shrink-0">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
        {/* Max items slider */}
        <div className="flex items-center gap-3">
          <label htmlFor="max-items" className="text-xs font-medium text-green-400 uppercase tracking-wider">
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
          <span className="text-sm font-mono text-green-200 tabular-nums w-3 text-center">
            {maxItems}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShorten}
            disabled={!hasInput}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 disabled:bg-green-800 disabled:text-green-600 text-white rounded-md transition-colors disabled:cursor-not-allowed"
          >
            <Scissors className="w-3.5 h-3.5" />
            Shorten
          </button>

          {/* Auto-shorten toggle */}
          <label className="toggle gap-1.5 text-xs text-green-400 select-none">
            <input
              type="checkbox"
              checked={autoShorten}
              onChange={(e) => onAutoShortenChange(e.target.checked)}
            />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
            Auto
          </label>

          <div className="w-px h-5 bg-green-700/50" />

          <button
            type="button"
            onClick={onCopy}
            disabled={!hasOutput}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed ${
              copied
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-700'
                : 'text-green-200 bg-green-800 hover:bg-green-700 border border-green-700 disabled:text-green-600 disabled:bg-green-800/50'
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-200 bg-green-800 hover:bg-green-700 rounded-md transition-colors border border-green-700 disabled:text-green-600 disabled:bg-green-800/50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
