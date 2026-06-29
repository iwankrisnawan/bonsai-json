import { Scissors, List, GitCompare } from 'lucide-react';

interface HeaderProps {
  page: string;
  onPageChange: (page: string) => void;
}

export function Header({ page, onPageChange }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-green-800 bg-green-900/30 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Scissors className="w-4 h-4 text-emerald-400" />
        </div>
        <h1 className="text-base font-semibold text-green-50 tracking-tight">JSONSlice</h1>
      </div>

      <nav className="flex items-center ml-4 gap-0.5">
        <button
          type="button"
          onClick={() => onPageChange('slicer')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            page === 'slicer'
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'text-green-400 hover:text-green-300 hover:bg-green-800/50'
          }`}
        >
          <Scissors className="w-3 h-3 inline mr-1 -mt-0.5" />
          Slicer
        </button>
        <button
          type="button"
          onClick={() => onPageChange('extractor')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            page === 'extractor'
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'text-green-400 hover:text-green-300 hover:bg-green-800/50'
          }`}
        >
          <List className="w-3 h-3 inline mr-1 -mt-0.5" />
          Extractor
        </button>
        <button
          type="button"
          onClick={() => onPageChange('comparator')}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            page === 'comparator'
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'text-green-400 hover:text-green-300 hover:bg-green-800/50'
          }`}
        >
          <GitCompare className="w-3 h-3 inline mr-1 -mt-0.5" />
          Comparator
        </button>
      </nav>

      <div className="ml-auto">
        <span className="text-[10px] uppercase tracking-[0.15em] text-green-500 bg-green-900/60 px-2.5 py-1 rounded-full border border-green-700/50 font-medium">
          Developer Utility
        </span>
      </div>
    </header>
  );
}
