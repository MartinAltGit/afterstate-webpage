export type MeasurementTable = {
  units?: string;
  headers: string[];
  rows: string[][];
};

function asString(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Parse `custom.measurements` (JSON metafield or plain text) into a table
 * when the shape is recognizable; otherwise return null so callers can
 * render the raw string.
 */
export function parseMeasurementTable(raw: string | null | undefined): MeasurementTable | null {
  if (!raw?.trim()) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (Array.isArray(parsed) && parsed.length > 0 && isRecord(parsed[0])) {
    const keys = Array.from(
      new Set(parsed.flatMap((row) => (isRecord(row) ? Object.keys(row) : []))),
    );
    if (!keys.length) return null;
    return {
      headers: keys,
      rows: parsed.map((row) =>
        keys.map((key) => (isRecord(row) ? asString(row[key]) : '')),
      ),
    };
  }

  if (!isRecord(parsed)) return null;

  const units = typeof parsed.units === 'string' ? parsed.units : undefined;
  const columns = parsed.columns ?? parsed.headers;

  if (Array.isArray(columns) && parsed.rows) {
    const headers = columns.map(asString);
    if (Array.isArray(parsed.rows)) {
      return {
        units,
        headers,
        rows: parsed.rows.map((row) => {
          if (Array.isArray(row)) return row.map(asString);
          if (isRecord(row)) return headers.map((h) => asString(row[h]));
          return [asString(row)];
        }),
      };
    }
    if (isRecord(parsed.rows)) {
      const sizeHeader = typeof parsed.sizeLabel === 'string' ? parsed.sizeLabel : 'Size';
      return {
        units,
        headers: [sizeHeader, ...headers],
        rows: Object.entries(parsed.rows).map(([size, values]) => {
          const rest = Array.isArray(values)
            ? values.map(asString)
            : isRecord(values)
              ? headers.map((h) => asString(values[h]))
              : [asString(values)];
          return [size, ...rest];
        }),
      };
    }
  }

  const nested = Object.entries(parsed).filter(([, value]) => isRecord(value));
  if (nested.length && nested.length === Object.keys(parsed).length) {
    const headers = Array.from(
      new Set(nested.flatMap(([, value]) => Object.keys(value as Record<string, unknown>))),
    );
    return {
      units,
      headers: ['Size', ...headers],
      rows: nested.map(([size, value]) => [
        size,
        ...headers.map((h) => asString((value as Record<string, unknown>)[h])),
      ]),
    };
  }

  return null;
}

export function splitMultiline(text: string | null | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
