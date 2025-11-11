const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "from",
  "this",
  "have",
  "your",
  "about",
  "their",
  "into",
  "they",
  "which",
  "will",
  "where",
  "when",
  "what",
  "whose",
  "while",
  "using",
  "being",
  "also",
  "them",
  "than",
  "over",
  "were",
  "within",
  "across",
  "every",
  "other",
]);

export function cleanText(raw: string | undefined | null): string {
  if (!raw) {
    return "";
  }
  return raw.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

export function normalizeUrl(input: string): string {
  if (!input) {
    throw new Error("URL is required");
  }
  try {
    const hasProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(input);
    const url = new URL(hasProtocol ? input : `https://${input}`);
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid URL provided: ${input}`);
  }
}

export function extractTopKeywords(text: string, max = 15): string[] {
  if (!text) {
    return [];
  }

  const counts = new Map<string, number>();
  const tokens = cleanText(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/);

  for (const token of tokens) {
    if (!token || token.length < 3) continue;
    if (STOP_WORDS.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

export function collapseWhitespaceAndTruncate(text: string, maxLength = 12000): string {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  return `${cleaned.slice(0, maxLength)}…`;
}

export function extractJsonFromText(content: string): string | null {
  if (!content) {
    return null;
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : null;
}

export function safeParseJson<T>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export function toAbsoluteUrl(base: string, href?: string | null): string | null {
  if (!href || href.startsWith("javascript:") || href.startsWith("tel:")) {
    return null;
  }

  try {
    if (href.startsWith("#")) {
      return null;
    }
    const absolute = new URL(href, base);
    return absolute.toString();
  } catch {
    return null;
  }
}

export function dedupePreserveOrder<T>(items: Iterable<T>): T[] {
  const seen = new Set<T>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    result.push(item);
  }
  return result;
}

