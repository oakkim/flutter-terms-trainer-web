import { describe, expect, test } from "vitest";

import {
  buildRecommendationBody,
  buildRecommendationTitle,
  createInitialRefactorLabState,
  getAnsweredRetrievalCount,
  getCompletionChecks,
  getCompletionScore,
  getRetrievalScore,
  isOrderingCorrect,
  moveItem,
  reorderItems,
} from "@/lib/refactor-lab";

describe("refactor-lab helpers", () => {
  test("creates the initial state with the first ordering problem and empty retrieval answers", () => {
    const state = createInitialRefactorLabState();

    expect(state.stageIndex).toBe(0);
    expect(state.orderItems[0]).toBe("기존 반복 코드를 새 위젯 호출로 교체한다.");
    expect(Object.values(state.retrievalValues).every((value) => value === "")).toBe(true);
  });

  test("validates completion answers with a flexible function name rule", () => {
    const checks = getCompletionChecks({
      widgetExtends: "StatelessWidget",
      widgetBuild: "build",
      functionName: "getScoreColor",
      functionReturn: "Color",
    });

    expect(checks).toEqual({
      widgetExtends: true,
      widgetBuild: true,
      functionName: true,
      functionReturn: true,
    });
    expect(getCompletionScore(checks)).toBe(4);
  });

  test("rejects invalid completion answers", () => {
    const checks = getCompletionChecks({
      widgetExtends: "StatefulWidget",
      widgetBuild: "render",
      functionName: "build",
      functionReturn: "String",
    });

    expect(checks.widgetExtends).toBe(false);
    expect(checks.widgetBuild).toBe(false);
    expect(checks.functionName).toBe(false);
    expect(checks.functionReturn).toBe(false);
    expect(getCompletionScore(checks)).toBe(0);
  });

  test("moves and reorders Parsons items safely", () => {
    const items = ["a", "b", "c"];

    expect(moveItem(items, 0, -1)).toEqual(["a", "b", "c"]);
    expect(moveItem(items, 0, 1)).toEqual(["b", "a", "c"]);
    expect(reorderItems(items, 2, 0)).toEqual(["c", "a", "b"]);
    expect(reorderItems(items, 1, 1)).toEqual(["a", "b", "c"]);
  });

  test("scores retrieval answers and counts only answered items", () => {
    const values = {
      r1: "widget",
      r2: "function",
      r3: "",
      r4: "function",
      r5: "leave",
      r6: "leave",
    } as const;

    expect(getAnsweredRetrievalCount(values)).toBe(5);
    expect(getRetrievalScore(values)).toBe(4);
  });

  test("detects whether Parsons ordering is correct", () => {
    expect(isOrderingCorrect(["a", "b"], ["a", "b"])).toBe(true);
    expect(isOrderingCorrect(["b", "a"], ["a", "b"])).toBe(false);
  });

  test("builds recommendation text for strong performance", () => {
    const title = buildRecommendationTitle({
      classificationHistory: [],
      classCorrect: 6,
      orderCorrectCount: 2,
      retrievalCorrect: 6,
      totalCorrectBeforeRetrieval: 12,
    });
    const body = buildRecommendationBody({
      classificationHistory: [],
      retrievalCorrect: 6,
      totalCorrectBeforeRetrieval: 12,
    });

    expect(title).toBe("판단 기준이 꽤 잘 잡혀 있습니다");
    expect(body).toContain("기준이 안정적입니다");
  });

  test("builds recommendation text for widget-heavy or function-heavy mistakes", () => {
    const widgetTitle = buildRecommendationTitle({
      classificationHistory: [
        { question: "q1", selected: "function", answer: "widget", correct: false },
        { question: "q2", selected: "leave", answer: "widget", correct: false },
      ],
      classCorrect: 3,
      orderCorrectCount: 0,
      retrievalCorrect: 2,
      totalCorrectBeforeRetrieval: 3,
    });
    const functionBody = buildRecommendationBody({
      classificationHistory: [
        { question: "q1", selected: "widget", answer: "function", correct: false },
        { question: "q2", selected: "leave", answer: "function", correct: false },
      ],
      retrievalCorrect: 1,
      totalCorrectBeforeRetrieval: 4,
    });

    expect(widgetTitle).toBe("다음엔 위젯화 판단을 조금 더 연습하면 좋겠습니다");
    expect(functionBody).toContain("행동과 규칙을 함수로 빼는 연습");
  });
});
