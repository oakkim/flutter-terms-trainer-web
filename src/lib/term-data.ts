import { authoredTermSets } from "@/data/seed-terms";
import type { AuthoredTermEntry, QuizItem, TermCatalog, TermEntry } from "@/types/terms";

export const FORBIDDEN_TERMS = new Set(["Future", "Stream"]);

export function validateAuthoredTerms(entries: AuthoredTermEntry[]): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const entry of entries) {
    const fields = [
      ["id", entry.id],
      ["term", entry.term],
      ["category", entry.category],
      ["quizPrompt", entry.quizPrompt],
      ["description", entry.description],
    ] as const;

    for (const [fieldName, value] of fields) {
      if (value.trim().length === 0) {
        errors.push(`${entry.id || "<missing-id>"} has an empty ${fieldName}.`);
      }
    }

    if (seenIds.has(entry.id)) {
      errors.push(`Duplicate authored id: ${entry.id}`);
    } else {
      seenIds.add(entry.id);
    }

    if (FORBIDDEN_TERMS.has(entry.term)) {
      errors.push(`Forbidden async term included: ${entry.term}`);
    }
  }

  return errors;
}

export function assertValidAuthoredTerms(entries: AuthoredTermEntry[]): void {
  const errors = validateAuthoredTerms(entries);

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

function mergeDescription(current: string, next: string): string {
  return next.length > current.length ? next : current;
}

export function normalizeTerms(entries: AuthoredTermEntry[]): TermEntry[] {
  assertValidAuthoredTerms(entries);

  const normalized = new Map<string, TermEntry>();

  for (const entry of entries) {
    const existing = normalized.get(entry.term);

    if (!existing) {
      normalized.set(entry.term, {
        id: entry.id,
        term: entry.term,
        category: entry.category,
        description: entry.description,
        quizPrompts: [entry.quizPrompt],
      });
      continue;
    }

    if (!existing.quizPrompts.includes(entry.quizPrompt)) {
      existing.quizPrompts.push(entry.quizPrompt);
    }

    existing.description = mergeDescription(existing.description, entry.description);
  }

  return Array.from(normalized.values());
}

export function flattenQuizItems(terms: TermEntry[]): QuizItem[] {
  return terms.flatMap((term) =>
    term.quizPrompts.map((prompt, index) => ({
      id: `${term.id}-quiz-${index + 1}`,
      term: term.term,
      category: term.category,
      description: term.description,
      prompt,
    })),
  );
}

export function createTermCatalog(termSets: AuthoredTermEntry[][] = authoredTermSets): TermCatalog {
  const authoredEntries = termSets.flat();
  const terms = normalizeTerms(authoredEntries);
  const quizItems = flattenQuizItems(terms);

  return {
    authoredEntries,
    terms,
    quizItems,
  };
}

export const termCatalog = createTermCatalog();
