const FORMULA_INJECTION_RE = /^[=+\-@]/;
const BOM = "﻿";

export const stripBom = (text: string) =>
  text.startsWith(BOM) ? text.slice(1) : text;

export const parseCSVLine = (line: string) => {
  const normalized = line.replace(/\r$/, "");
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"' && (inQuotes || current.length === 0)) {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(stripImportPrefix(current.trim()));
      current = "";
    } else {
      current += char;
    }
  }

  values.push(stripImportPrefix(current.trim()));
  return values;
};

// Excel formula-injection guard: when a cell starts with '=', '+', '-', '@',
// some spreadsheet apps execute it. On export prefix with a single quote;
// on import strip that prefix.
const stripImportPrefix = (value: string) =>
  value.startsWith("'") && FORMULA_INJECTION_RE.test(value.slice(1))
    ? value.slice(1)
    : value;

const guardForExport = (value: string) =>
  FORMULA_INJECTION_RE.test(value) ? `'${value}` : value;

export const normalizeHeader = (header: string) =>
  header.trim().toLowerCase().replace(/\s+/g, " ");

export const csvEscape = (value: string | number) => {
  const text = guardForExport(String(value ?? ""));
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
