import { describe, expect, test } from "vitest";

import { buildResultShareText } from "@/lib/result-share";

describe("result-share", () => {
  test("includes cpm only for word practice results", () => {
    const shareText = buildResultShareText({
      cpm: 312,
      isRandomOrder: true,
      mode: "wordPractice",
      summary: {
        total: 10,
        correct: 7,
        wrong: 3,
        currentStreak: 0,
        bestStreak: 4,
      },
    });

    expect(shareText).toContain("모드: 낱말 연습");
    expect(shareText).toContain("출제 순서: 랜덤 출제");
    expect(shareText).toContain("최종 CPM: 312");
  });

  test("omits cpm for quiz results", () => {
    const shareText = buildResultShareText({
      isRandomOrder: false,
      mode: "termQuiz",
      summary: {
        total: 8,
        correct: 6,
        wrong: 2,
        currentStreak: 0,
        bestStreak: 5,
      },
    });

    expect(shareText).toContain("모드: 용어 퀴즈");
    expect(shareText).not.toContain("최종 CPM");
  });
});
