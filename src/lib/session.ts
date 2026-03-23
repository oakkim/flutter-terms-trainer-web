import type {
  QuizItem,
  QuizState,
  SessionSummary,
  TermEntry,
  WordPracticeState,
} from "@/types/terms";

export type TypingStatus = "idle" | "prefix" | "mismatch" | "exact";

export function createSummary(total: number): SessionSummary {
  return {
    total,
    correct: 0,
    wrong: 0,
    currentStreak: 0,
    bestStreak: 0,
  };
}

export function getSolvedCount(summary: SessionSummary): number {
  return summary.correct + summary.wrong;
}

export function getProgressPercent(summary: SessionSummary): number {
  if (summary.total === 0) {
    return 100;
  }

  return Math.round((getSolvedCount(summary) / summary.total) * 100);
}

export function getTypingStatus(term: string, value: string): TypingStatus {
  if (value.length === 0) {
    return "idle";
  }

  if (value === term) {
    return "exact";
  }

  if (term.startsWith(value)) {
    return "prefix";
  }

  return "mismatch";
}

export function createWordPracticeState(items: TermEntry[]): WordPracticeState {
  return {
    items,
    currentIndex: 0,
    inputValue: "",
    hadMistype: false,
    typedCharacters: 0,
    startedAtMs: null,
    completedAtMs: null,
    completed: items.length === 0,
    summary: createSummary(items.length),
  };
}

export function getCurrentWordItem(state: WordPracticeState): TermEntry | null {
  if (state.completed) {
    return null;
  }

  return state.items[state.currentIndex] ?? null;
}

export function updateWordPracticeState(
  state: WordPracticeState,
  inputValue: string,
  timestampMs: number = Date.now(),
): WordPracticeState {
  if (state.completed) {
    return state;
  }

  const currentItem = getCurrentWordItem(state);

  if (!currentItem) {
    return {
      ...state,
      completed: true,
    };
  }

  const typingStatus = getTypingStatus(currentItem.term, inputValue);
  const hadMistype = state.hadMistype || typingStatus === "mismatch";
  const insertedCharacters = Math.max(0, inputValue.length - state.inputValue.length);
  const startedAtMs = state.startedAtMs ?? (insertedCharacters > 0 ? timestampMs : null);
  const typedCharacters = state.typedCharacters + insertedCharacters;

  if (typingStatus !== "exact") {
    return {
      ...state,
      inputValue,
      hadMistype,
      typedCharacters,
      startedAtMs,
    };
  }

  const solvedWithMistype = hadMistype;
  const nextSummary = solvedWithMistype
    ? {
        ...state.summary,
        wrong: state.summary.wrong + 1,
        currentStreak: 0,
      }
    : {
        ...state.summary,
        correct: state.summary.correct + 1,
        currentStreak: state.summary.currentStreak + 1,
        bestStreak: Math.max(state.summary.bestStreak, state.summary.currentStreak + 1),
      };

  const nextIndex = state.currentIndex + 1;

  return {
    ...state,
    currentIndex: nextIndex,
    inputValue: "",
    hadMistype: false,
    typedCharacters,
    startedAtMs,
    completedAtMs: nextIndex >= state.items.length ? timestampMs : null,
    completed: nextIndex >= state.items.length,
    summary: nextSummary,
  };
}

export function getWordPracticeElapsedMs(
  state: WordPracticeState,
  nowMs: number = Date.now(),
): number {
  if (state.startedAtMs === null) {
    return 0;
  }

  const endMs = state.completedAtMs ?? nowMs;

  return Math.max(0, endMs - state.startedAtMs);
}

export function getWordPracticeCpm(state: WordPracticeState, nowMs: number = Date.now()): number {
  const elapsedMs = getWordPracticeElapsedMs(state, nowMs);

  if (elapsedMs === 0 || state.typedCharacters === 0) {
    return 0;
  }

  return Math.round(state.typedCharacters / (elapsedMs / 60000));
}

export function createQuizState(items: QuizItem[]): QuizState {
  return {
    items,
    currentIndex: 0,
    inputValue: "",
    revealed: false,
    lastResult: null,
    completed: items.length === 0,
    summary: createSummary(items.length),
  };
}

export function getCurrentQuizItem(state: QuizState): QuizItem | null {
  if (state.completed) {
    return null;
  }

  return state.items[state.currentIndex] ?? null;
}

export function updateQuizInput(state: QuizState, inputValue: string): QuizState {
  if (state.completed || state.revealed) {
    return state;
  }

  return {
    ...state,
    inputValue,
  };
}

export function submitQuizAnswer(state: QuizState): QuizState {
  if (state.completed || state.revealed) {
    return state;
  }

  const currentItem = getCurrentQuizItem(state);

  if (!currentItem) {
    return {
      ...state,
      completed: true,
      revealed: true,
    };
  }

  const isCorrect = state.inputValue === currentItem.term;
  const nextSummary = isCorrect
    ? {
        ...state.summary,
        correct: state.summary.correct + 1,
        currentStreak: state.summary.currentStreak + 1,
        bestStreak: Math.max(state.summary.bestStreak, state.summary.currentStreak + 1),
      }
    : {
        ...state.summary,
        wrong: state.summary.wrong + 1,
        currentStreak: 0,
      };

  const isLastItem = state.currentIndex === state.items.length - 1;

  return {
    ...state,
    completed: isLastItem,
    revealed: true,
    lastResult: isCorrect ? "correct" : "incorrect",
    summary: nextSummary,
  };
}

export function advanceQuizState(state: QuizState): QuizState {
  if (!state.revealed || state.completed) {
    return state;
  }

  const nextIndex = state.currentIndex + 1;

  return {
    ...state,
    currentIndex: nextIndex,
    inputValue: "",
    revealed: false,
    lastResult: null,
  };
}
