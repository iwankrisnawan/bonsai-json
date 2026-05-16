import { Scissors } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Scissors className="w-4 h-4 text-indigo-400" />
        </div>
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">JSONSlice</h1>
      </div>
      <p className="text-sm text-zinc-500 hidden sm:block">
        Truncate large JSON arrays while preserving structure
      </p>
      <div className="ml-auto">
        <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800 font-medium">
          Developer Utility
        </span>
      </div>
    </header>
  );
}
