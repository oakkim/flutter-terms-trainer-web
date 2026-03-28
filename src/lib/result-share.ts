import type { PracticeMode, SessionSummary } from "@/types/terms";

interface ResultSharePayload {
  cpm?: number;
  isRandomOrder: boolean;
  mode: PracticeMode;
  summary: SessionSummary;
}

export function buildResultShareText({
  cpm,
  isRandomOrder,
  mode,
  summary,
}: ResultSharePayload): string {
  const modeLabel =
    mode === "wordPractice" ? "낱말 연습" : mode === "termQuiz" ? "용어 퀴즈" : "구조화 연습";
  const lines = [
    "Flutter 타이핑 스튜디오 결과",
    `모드: ${modeLabel}`,
    `출제 순서: ${isRandomOrder ? "랜덤 출제" : "순서대로"}`,
    `정확 처리: ${summary.correct} / ${summary.total}`,
    `실수 포함 완료: ${summary.wrong}`,
    `최고 스트릭: ${summary.bestStreak}`,
  ];

  if (mode === "wordPractice" && cpm !== undefined) {
    lines.push(`최종 CPM: ${cpm}`);
  }

  return lines.join("\n");
}

export async function copyResultShareText(text: string): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    throw new Error("Clipboard API is not available.");
  }

  await navigator.clipboard.writeText(text);
}
