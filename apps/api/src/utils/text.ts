
const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "at", "to", "for", "with",
  "is", "are", "be", "by", "this", "that", "it", "as", "from", "my", "your",
  "i", "we", "you", "near", "looking", "want", "need", "show", "me", "find",
]);

export function tokenize(input: string): string[] {
  return (input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export function tokenOverlap(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  let hits = 0;
  for (const t of new Set(a)) if (setB.has(t)) hits += 1;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : hits / union;
}

export function countMatches(haystack: string, needles: string[]): number {
  const lower = haystack.toLowerCase();
  return needles.reduce((n, w) => (lower.includes(w) ? n + 1 : n), 0);
}
