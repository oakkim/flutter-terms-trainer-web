import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import { RefactorLabPanel } from "@/components/refactor-lab-panel";

const classificationAnswers = [
  "위젯화",
  "함수화",
  "그대로 둠",
  "함수화",
  "위젯화",
  "함수화",
  "그대로 둠",
  "함수화",
] as const;

const retrievalAnswers = [
  ["프로필 썸네일 + 이름 + 직책 조합이 세 화면에서 거의 똑같이 반복된다.", "위젯화"],
  ["나이 입력값이 비었는지, 숫자인지 검사하는 규칙을 여러 제출 흐름에서 쓴다.", "함수화"],
  ["딱 한 번 쓰이는 SizedBox(height: 12) 한 줄이 있다.", "그대로 둠"],
  ["사용자 나이를 받아 '미입력', '7세', '성인'으로 바꾸는 규칙을 여러 화면에서 쓴다.", "함수화"],
  ["아이콘, 제목, 설명으로 이루어진 안내 카드가 값만 바뀌며 네 번 반복된다.", "위젯화"],
  ["지금 화면에서만 쓰는 const Divider(height: 24) 한 줄이 있다.", "그대로 둠"],
] as const;

function escapePattern(value: string) {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function startsWithLabel(label: string) {
  return new RegExp(`^${escapePattern(label)}`);
}

describe("RefactorLabPanel", () => {
  test("advances from the example stage into classification and shows feedback", async () => {
    const user = userEvent.setup();

    render(<RefactorLabPanel onBackToSelection={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "시작하기" }));
    await user.click(screen.getByRole("button", { name: startsWithLabel("위젯화") }));
    await user.click(screen.getByRole("button", { name: "정답 확인" }));

    expect(screen.getByText("정답입니다.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "다음 문제" }));

    expect(
      screen.getByText(
        "점수에 따라 배경색과 안내 문구를 정하는 로직이 여러 버튼에서 재사용됩니다. 어떤 분리가 더 적절할까요?",
      ),
    ).toBeVisible();
  });

  test("completes the native refactor lab flow and can restart", async () => {
    const user = userEvent.setup();

    render(<RefactorLabPanel onBackToSelection={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "시작하기" }));

    for (const answer of classificationAnswers) {
      await user.click(screen.getByRole("button", { name: startsWithLabel(answer) }));
      await user.click(screen.getByRole("button", { name: "정답 확인" }));
      await user.click(screen.getByRole("button", { name: /다음/ }));
    }

    expect(screen.getByText("반복 UI를 새 위젯으로 빼는 순서")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "순서 확인" }));

    expect(screen.getByText("권장 순서")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "다음 Parsons 문제" }));
    await user.click(screen.getByRole("button", { name: "순서 확인" }));
    await user.click(screen.getByRole("button", { name: "빈칸 채우기로" }));

    await user.type(screen.getByLabelText("[1] 기반 클래스"), "StatelessWidget");
    await user.type(screen.getByLabelText("[2] 메서드 이름"), "build");
    await user.type(screen.getByLabelText("[3] 반환 타입"), "Color");
    await user.type(screen.getByLabelText("[4] 함수 이름"), "getScoreColor");
    await user.click(screen.getByRole("button", { name: "빈칸 확인" }));

    expect(screen.getByText("완성 결과: 4 / 4")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "회상 퀴즈로" }));

    for (const [prompt, answer] of retrievalAnswers) {
      const heading = screen.getByText(new RegExp(escapePattern(prompt)), {
        selector: "[data-slot='card-title']",
      });
      const card = heading.closest("div[data-slot='card']");

      expect(card).not.toBeNull();
      await user.click(within(card as HTMLElement).getByRole("button", { name: answer }));
    }

    await user.click(screen.getByRole("button", { name: "회상 결과 보기" }));

    expect(screen.getByText("회상 점수")).toBeVisible();
    expect(screen.getByText("한 번 더 돌리면 감각이 더 또렷해질 것 같습니다")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "처음부터 다시" }));

    expect(screen.getByText("먼저 무엇을 왜 나누는지 보면서 시작합니다")).toBeVisible();
  });
});
