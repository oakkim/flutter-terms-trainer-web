import { describe, expect, test } from "vitest";

import {
  advanceQuizState,
  createQuizState,
  createWordPracticeState,
  getProgressPercent,
  getTypingStatus,
  getWordPracticeCpm,
  submitQuizAnswer,
  updateQuizInput,
  updateWordPracticeState,
} from "@/lib/session";
import type { QuizItem, TermEntry } from "@/types/terms";

const wordItems: TermEntry[] = [
  {
    id: "term-1",
    term: "Navigator.push",
    category: "navigation",
    description: "설명",
    quizPrompts: ["질문"],
  },
  {
    id: "term-2",
    term: "BoxDecoration",
    category: "style",
    description: "설명",
    quizPrompts: ["질문"],
  },
];

const quizItems: QuizItem[] = [
  {
    id: "quiz-1",
    term: "Navigator.pop",
    category: "navigation",
    description: "설명",
    prompt: "현재 화면을 닫고 이전 화면으로 돌아갈 때 호출하는 메서드는?",
  },
  {
    id: "quiz-2",
    term: "Container",
    category: "style",
    description: "설명",
    prompt: "배경색과 여백을 자주 감싸는 기본 박스형 위젯은?",
  },
];

describe("word practice session logic", () => {
  test("counts a clean exact answer as correct and advances automatically", () => {
    let state = createWordPracticeState(wordItems);

    state = updateWordPracticeState(state, "Navigator.push");

    expect(state.currentIndex).toBe(1);
    expect(state.inputValue).toBe("");
    expect(state.summary.correct).toBe(1);
    expect(state.summary.wrong).toBe(0);
    expect(state.summary.bestStreak).toBe(1);
  });

  test("records a mistyped item as wrong after later correction", () => {
    let state = createWordPracticeState(wordItems);

    state = updateWordPracticeState(state, "Navigator.puz");
    state = updateWordPracticeState(state, "Navigator.push");

    expect(state.currentIndex).toBe(1);
    expect(state.summary.correct).toBe(0);
    expect(state.summary.wrong).toBe(1);
    expect(state.summary.currentStreak).toBe(0);
  });

  test("recognizes idle, prefix, mismatch, and exact typing states", () => {
    expect(getTypingStatus("Container", "")).toBe("idle");
    expect(getTypingStatus("Container", "Con")).toBe("prefix");
    expect(getTypingStatus("Container", "Cone")).toBe("mismatch");
    expect(getTypingStatus("Container", "Container")).toBe("exact");
  });

  test("returns full progress when there is no work to solve", () => {
    const state = createWordPracticeState([]);

    expect(state.completed).toBe(true);
    expect(getProgressPercent(state.summary)).toBe(100);
  });

  test("tracks typed characters and computes CPM from the first keystroke", () => {
    let state = createWordPracticeState([
      {
        id: "term-3",
        term: "Hi",
        category: "widget",
        description: "설명",
        quizPrompts: ["질문"],
      },
    ]);

    state = updateWordPracticeState(state, "H", 1_000);
    state = updateWordPracticeState(state, "Hi", 4_000);

    expect(state.startedAtMs).toBe(1_000);
    expect(state.completedAtMs).toBe(4_000);
    expect(state.typedCharacters).toBe(2);
    expect(getWordPracticeCpm(state, 4_000)).toBe(40);
  });
});

describe("quiz session logic", () => {
  test("submits a correct answer, then advances to the next item", () => {
    let state = createQuizState(quizItems);

    state = updateQuizInput(state, "Navigator.pop");
    state = submitQuizAnswer(state);

    expect(state.lastResult).toBe("correct");
    expect(state.revealed).toBe(true);
    expect(state.summary.correct).toBe(1);

    state = advanceQuizState(state);

    expect(state.currentIndex).toBe(1);
    expect(state.revealed).toBe(false);
    expect(state.inputValue).toBe("");
  });

  test("marks an incorrect answer wrong and completes on the last item", () => {
    let state = createQuizState([{ ...quizItems[0] }]);

    state = updateQuizInput(state, "Navigator.push");
    state = submitQuizAnswer(state);

    expect(state.lastResult).toBe("incorrect");
    expect(state.summary.wrong).toBe(1);
    expect(state.completed).toBe(true);
  });

  test("keeps quiz input unchanged after reveal and ignores invalid advance calls", () => {
    let state = createQuizState(quizItems);

    state = updateQuizInput(state, "Navigator.pop");
    state = submitQuizAnswer(state);

    expect(updateQuizInput(state, "changed")).toEqual(state);
    expect(advanceQuizState(createQuizState([]))).toEqual(createQuizState([]));
  });
});
