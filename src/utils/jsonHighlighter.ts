const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>]/g, (ch) => HTML_ENTITIES[ch] ?? ch);
}

export function highlightJson(json: string): string {
  const escaped = escapeHtml(json);

  return escaped.replace(
    /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(\b-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?\b)/g,
    (_match, key, colon, str, bool, num) => {
      if (key) return `<span class="json-key">${key}</span>${colon}`;
      if (str) return `<span class="json-string">${str}</span>`;
      if (bool) return `<span class="json-boolean">${bool}</span>`;
      if (num) return `<span class="json-number">${num}</span>`;
      return _match;
    },
  );
}
