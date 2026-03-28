export type PracticeMode = "wordPractice" | "termQuiz" | "refactorLab";

export interface AuthoredTermEntry {
  id: string;
  term: string;
  category: string;
  quizPrompt: string;
  description: string;
}

export interface TermEntry {
  id: string;
  term: string;
  category: string;
  description: string;
  quizPrompts: string[];
}

export interface QuizItem {
  id: string;
  term: string;
  category: string;
  description: string;
  prompt: string;
}

export interface SessionSummary {
  total: number;
  correct: number;
  wrong: number;
  currentStreak: number;
  bestStreak: number;
}

export interface WordPracticeState {
  items: TermEntry[];
  currentIndex: number;
  inputValue: string;
  hadMistype: boolean;
  typedCharacters: number;
  startedAtMs: number | null;
  completedAtMs: number | null;
  completed: boolean;
  summary: SessionSummary;
}

export type QuizResult = "correct" | "incorrect" | null;

export interface QuizState {
  items: QuizItem[];
  currentIndex: number;
  inputValue: string;
  revealed: boolean;
  lastResult: QuizResult;
  completed: boolean;
  summary: SessionSummary;
}

export interface TermCatalog {
  authoredEntries: AuthoredTermEntry[];
  terms: TermEntry[];
  quizItems: QuizItem[];
}
