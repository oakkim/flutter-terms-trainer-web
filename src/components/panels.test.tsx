import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { QuizPanel } from "@/components/quiz-panel";
import { SummaryCard } from "@/components/summary-card";
import { TypingPanel } from "@/components/typing-panel";
import type { QuizState, WordPracticeState } from "@/types/terms";

const wordState: WordPracticeState = {
  items: [
    {
      id: "term-1",
      term: "Navigator.push",
      category: "navigation",
      description: "설명",
      quizPrompts: ["질문"],
    },
  ],
  currentIndex: 0,
  inputValue: "",
  hadMistype: false,
  typedCharacters: 0,
  startedAtMs: null,
  completedAtMs: null,
  completed: false,
  summary: {
    total: 1,
    correct: 0,
    wrong: 0,
    currentStreak: 0,
    bestStreak: 0,
  },
};

const quizState: QuizState = {
  items: [
    {
      id: "quiz-1",
      term: "BoxDecoration",
      category: "style",
      description: "설명",
      prompt: "Container의 decoration에 자주 넣는 장식 클래스는?",
    },
  ],
  currentIndex: 0,
  inputValue: "",
  revealed: false,
  lastResult: null,
  completed: false,
  summary: {
    total: 1,
    correct: 0,
    wrong: 0,
    currentStreak: 0,
    bestStreak: 0,
  },
};

describe("custom panels", () => {
  test("renders summary card and calls restart", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(
      <SummaryCard
        title="요약"
        subtitle="설명"
        summary={{
          total: 4,
          correct: 3,
          wrong: 1,
          currentStreak: 0,
          bestStreak: 2,
        }}
        onRestart={onRestart}
      />,
    );

    await user.click(screen.getByRole("button", { name: "다시 시작" }));

    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(screen.getByText("실수 포함 완료")).toBeVisible();
  });

  test("shows mismatch guidance and disappears after completion", () => {
    const mismatchState: WordPracticeState = {
      ...wordState,
      inputValue: "Navigator.pop",
      hadMistype: true,
      startedAtMs: 1_000,
      typedCharacters: 13,
    };

    const { container, rerender } = render(
      <TypingPanel state={mismatchState} onInputChange={() => {}} onRestart={() => {}} />,
    );

    expect(screen.getByText("정확 일치 규칙")).toBeVisible();
    expect(screen.getByText(/틀린 문자를 지우고 다시 맞춰 입력해 보세요/)).toBeVisible();

    rerender(
      <TypingPanel
        state={{
          ...mismatchState,
          inputValue: "Navigator.p",
        }}
        onInputChange={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByText("입력을 다시 맞췄습니다")).toBeVisible();

    rerender(
      <TypingPanel
        state={{
          ...wordState,
          currentIndex: 1,
          completed: true,
          startedAtMs: 1_000,
          completedAtMs: 4_000,
          typedCharacters: 14,
          summary: {
            total: 1,
            correct: 1,
            wrong: 0,
            currentStreak: 1,
            bestStreak: 1,
          },
        }}
        onInputChange={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("shows quiz feedback for both idle and correct states", () => {
    const { rerender } = render(
      <QuizPanel
        state={quizState}
        onInputChange={() => {}}
        onSubmit={() => {}}
        onNext={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByText("채점 규칙")).toBeVisible();

    rerender(
      <QuizPanel
        state={{
          ...quizState,
          inputValue: "BoxDecoration",
          revealed: true,
          lastResult: "correct",
          summary: {
            total: 1,
            correct: 1,
            wrong: 0,
            currentStreak: 1,
            bestStreak: 1,
          },
        }}
        onInputChange={() => {}}
        onSubmit={() => {}}
        onNext={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(screen.getByText("정답입니다")).toBeVisible();
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeVisible();
  });

  test("focuses interactive controls without scrolling the page", () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, "focus").mockImplementation(() => {});

    const { rerender } = render(
      <TypingPanel state={wordState} onInputChange={() => {}} onRestart={() => {}} />,
    );

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });

    rerender(
      <QuizPanel
        state={quizState}
        onInputChange={() => {}}
        onSubmit={() => {}}
        onNext={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });

    rerender(
      <QuizPanel
        state={{
          ...quizState,
          inputValue: "BoxDecoration",
          revealed: true,
          lastResult: "correct",
          summary: {
            total: 1,
            correct: 1,
            wrong: 0,
            currentStreak: 1,
            bestStreak: 1,
          },
        }}
        onInputChange={() => {}}
        onSubmit={() => {}}
        onNext={() => {}}
        onRestart={() => {}}
      />,
    );

    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });
});
