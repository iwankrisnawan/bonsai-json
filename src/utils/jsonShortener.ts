export function shortenJson(data: unknown, maxItems: number): unknown {
  if (Array.isArray(data)) {
    return data.slice(0, maxItems).map((item) => shortenJson(item, maxItems));
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = shortenJson(value, maxItems);
    }
    return result;
  }

  return data;
}

export function tryShortenJson(
  jsonString: string,
  maxItems: number,
): { ok: true; value: string } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const shortened = shortenJson(parsed, maxItems);
    return { ok: true as const, value: JSON.stringify(shortened, null, 2) };
  } catch {
    return { ok: false as const, error: 'Invalid JSON syntax' };
  }
}
