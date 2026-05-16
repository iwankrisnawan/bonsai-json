export interface ArrayAnnotation {
  line: number;
  count: number;
}

export function extractArrayAnnotations(json: string): ArrayAnnotation[] {
  const annotations: ArrayAnnotation[] = [];
  let i = 0;
  let line = 1;

  function advance(): void {
    while (i < json.length && /\s/.test(json[i])) {
      if (json[i] === '\n') line++;
      i++;
    }
  }

  function skipString(): void {
    i++;
    while (i < json.length) {
      if (json[i] === '\\') { i += 2; continue; }
      if (json[i] === '"') { i++; return; }
      if (json[i] === '\n') { line++; i++; return; }
      i++;
    }
  }

  function walkPrimitive(): void {
    while (i < json.length && !/[\s,}\]\]]/.test(json[i])) {
      if (json[i] === '\n') line++;
      i++;
    }
  }

  function walkObject(): void {
    i++;
    advance();
    while (i < json.length && json[i] !== '}') {
      if (json[i] === '"') skipString(); // key
      advance();
      if (json[i] === ':') i++;
      advance();
      walkValue(); // value — may contain nested arrays
      advance();
      if (json[i] === ',') { i++; advance(); }
    }
    i++;
  }

  function walkArray(): void {
    const startLine = line;
    i++;
    advance();

    let items = 0;
    while (i < json.length && json[i] !== ']') {
      if (json[i] === ',') { i++; advance(); continue; }
      items++;
      walkValue(); // recursive — handles any value type
      advance();
    }
    i++;

    if (items > 0) {
      annotations.push({ line: startLine, count: items });
    }
  }

  function walkValue(): void {
    advance();
    if (i >= json.length) return;

    if (json[i] === '"') { skipString(); return; }
    if (json[i] === '{') { walkObject(); return; }
    if (json[i] === '[') { walkArray(); return; }
    walkPrimitive();
  }

  while (i < json.length) {
    walkValue();
    advance();
    if (i < json.length && json[i] === ',') i++;
  }

  return annotations;
}
