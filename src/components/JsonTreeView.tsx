import { useState, useMemo, useCallback, type ReactNode } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonTreeViewProps {
  value: string;
}

export function JsonTreeView({ value }: JsonTreeViewProps) {
  const parsed = useMemo(() => {
    try {
      return { data: JSON.parse(value), error: null };
    } catch {
      return { data: null, error: true };
    }
  }, [value]);

  if (parsed.error) {
    return (
      <div className="p-4 font-mono text-sm text-green-600 italic">
        Invalid JSON — switch to Raw view to fix syntax
      </div>
    );
  }

  return (
    <div className="p-3 font-mono text-sm leading-6 overflow-auto h-full">
      <TreeNode value={parsed.data} depth={0} defaultExpanded />
    </div>
  );
}

interface TreeNodeProps {
  value: unknown;
  depth: number;
  keyName?: string;
  defaultExpanded?: boolean;
  comma?: boolean;
}

function TreeNode({ value, depth, keyName, defaultExpanded, comma }: TreeNodeProps) {
  if (value === null) {
    return (
      <Line depth={depth} keyName={keyName} comma={comma}>
        <span className="text-purple-400">null</span>
      </Line>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <Line depth={depth} keyName={keyName} comma={comma}>
        <span className="text-purple-400">{String(value)}</span>
      </Line>
    );
  }

  if (typeof value === 'number') {
    return (
      <Line depth={depth} keyName={keyName} comma={comma}>
        <span className="text-cyan-400">{String(value)}</span>
      </Line>
    );
  }

  if (typeof value === 'string') {
    return (
      <Line depth={depth} keyName={keyName} comma={comma}>
        <span className="text-pink-400">&quot;{value}&quot;</span>
      </Line>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <Line depth={depth} keyName={keyName} comma={comma}>
          <span className="text-green-300">[]</span>
        </Line>
      );
    }
    return (
      <CollapsibleNode
        depth={depth}
        keyName={keyName}
        comma={comma}
        count={value.length}
        countLabel="items"
        openBracket="["
        closeBracket="]"
        defaultExpanded={depth < 2 || defaultExpanded}
      >
        {value.map((item, i) => (
          <TreeNode
            key={i}
            value={item}
            depth={depth + 1}
            comma={i < value.length - 1}
            defaultExpanded={depth < 1}
          />
        ))}
      </CollapsibleNode>
    );
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <Line depth={depth} keyName={keyName} comma={comma}>
          <span className="text-green-300">{'{}'}</span>
        </Line>
      );
    }
    return (
      <CollapsibleNode
        depth={depth}
        keyName={keyName}
        comma={comma}
        count={entries.length}
        countLabel="keys"
        openBracket="{"
        closeBracket="}"
        defaultExpanded={depth < 2 || defaultExpanded}
      >
        {entries.map(([k, v]) => (
          <TreeNode
            key={k}
            value={v}
            depth={depth + 1}
            keyName={k}
            comma
            defaultExpanded={depth < 1}
          />
        ))}
      </CollapsibleNode>
    );
  }

  return null;
}

interface CollapsibleNodeProps {
  depth: number;
  keyName?: string;
  comma?: boolean;
  count: number;
  countLabel: string;
  openBracket: string;
  closeBracket: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

function CollapsibleNode({
  depth,
  keyName,
  comma,
  count,
  countLabel,
  openBracket,
  closeBracket,
  defaultExpanded,
  children,
}: CollapsibleNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? depth < 2);
  const toggle = useCallback(() => setExpanded((v) => !v), []);
  const hasChildren = count > 0;

  return (
    <div>
      {/* Header line */}
      <div
        className="flex items-start group cursor-pointer hover:bg-green-900/20 rounded-sm -ml-1 pl-1"
        onClick={toggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
      >
        <span
          className="shrink-0 w-4 h-6 flex items-center justify-center text-emerald-400/70 group-hover:text-emerald-300 transition-colors"
          style={{ marginLeft: `${depth * 1.25}rem` }}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )
          ) : (
            <span className="w-3.5" />
          )}
        </span>

        <span className="flex items-baseline gap-1 min-w-0">
          {keyName !== undefined && (
            <span className="text-amber-400 shrink-0">&quot;{keyName}&quot;<span className="text-green-400/70">: </span></span>
          )}

          <span className="text-green-300">{openBracket}</span>

          {!expanded && hasChildren && (
            <span className="text-green-500 text-[11px] ml-1 leading-6">
              {count} {countLabel}
            </span>
          )}

          {!expanded && <span className="text-green-300">{closeBracket}</span>}
          {comma && <span className="text-green-400/50">,</span>}
        </span>
      </div>

      {/* Children */}
      {expanded && (
        <div className="relative">
          {/* Vertical guide line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-green-800/20"
            style={{ left: `${(depth + 1) * 1.25 + 0.5}rem` }}
          />
          {hasChildren ? (
            children
          ) : (
            <div className="flex items-center" style={{ paddingLeft: `${(depth + 1) * 1.25 + 1.25}rem` }}>
              <span className="text-green-300">{closeBracket}</span>
              {comma && <span className="text-green-400/50">,</span>}
            </div>
          )}

          {/* Closing bracket */}
          {hasChildren && (
            <div
              className="flex items-start group cursor-pointer hover:bg-green-900/20 rounded-sm -ml-1 pl-1"
              onClick={toggle}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
            >
              <span
                className="shrink-0 w-4 h-6 flex items-center justify-center text-green-300"
                style={{ marginLeft: `${depth * 1.25}rem` }}
              >
                <ChevronDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />
              </span>
              <span className="text-green-300">{closeBracket}</span>
              {comma && <span className="text-green-400/50">,</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Line({
  depth,
  keyName,
  comma,
  children,
}: {
  depth: number;
  keyName?: string;
  comma?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="flex items-baseline min-w-0 hover:bg-green-900/20 rounded-sm -ml-1 pl-1"
      style={{ paddingLeft: `${depth * 1.25 + 1.25}rem` }}
    >
      <span className="w-3.5 shrink-0" />
      {keyName !== undefined && (
        <span className="text-amber-400 shrink-0">&quot;{keyName}&quot;<span className="text-green-400/70">: </span></span>
      )}
      {children}
      {comma && <span className="text-green-400/50">,</span>}
    </div>
  );
}
