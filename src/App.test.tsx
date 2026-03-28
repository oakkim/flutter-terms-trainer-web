import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import App from "@/App";
import * as resultShare from "@/lib/result-share";
import { createTermCatalog } from "@/lib/term-data";
import type { AuthoredTermEntry } from "@/types/terms";

let clipboardWriteTextMock: ReturnType<typeof vi.fn>;

function createMiniCatalog(entries: AuthoredTermEntry[]) {
  return createTermCatalog([entries]);
}

describe("App", () => {
  beforeEach(() => {
    clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: clipboardWriteTextMock,
      },
    });
  });

  test("starts on the landing screen by default", () => {
    render(<App />);

    expect(screen.getByText("Flutter 용어를 타자처럼 익히고")).toBeVisible();
    expect(screen.getByRole("button", { name: "게임 선택하기" })).toBeVisible();
  });

  test("opens the refactor lab mode from selection", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "게임 선택하기" }));
    await user.click(screen.getByRole("button", { name: "위젯화 함수화 연습 선택하기" }));
    await user.click(screen.getByRole("button", { name: "이 모드 시작" }));

    expect(screen.getByText("위젯화 / 함수화 학습 랩")).toBeVisible();
    expect(screen.getByRole("button", { name: "시작하기" })).toBeVisible();
  });

  test("moves from landing to selection and then to word practice results", async () => {
    const user = userEvent.setup();
    const catalog = createMiniCatalog([
      {
        id: "mini-1",
        term: "StatelessWidget",
        category: "widget",
        quizPrompt: "상태를 직접 가지지 않는 위젯 클래스는?",
        description: "설명",
      },
    ]);

    render(<App catalog={catalog} />);

    await user.click(screen.getByRole("button", { name: "게임 선택하기" }));
    await user.click(screen.getByRole("button", { name: "이 모드 시작" }));
    await user.type(screen.getByLabelText("낱말 연습 입력"), "StatelessWidget");

    expect(await screen.findByText("낱말 연습 결과")).toBeVisible();
    expect(screen.getByText("공유 문구 미리보기")).toBeVisible();
  });

  test("reveals quiz feedback and the correct answer after a wrong submission", async () => {
    const user = userEvent.setup();
    const catalog = createMiniCatalog([
      {
        id: "mini-1",
        term: "Navigator.push",
        category: "navigation",
        quizPrompt: "새 화면을 현재 화면 위에 쌓는 기본 메서드는?",
        description: "설명",
      },
      {
        id: "mini-2",
        term: "BoxDecoration",
        category: "style",
        quizPrompt: "Container의 decoration에 자주 넣는 장식 클래스는?",
        description: "설명",
      },
    ]);

    render(<App catalog={catalog} />);

    await user.click(screen.getByRole("button", { name: "게임 선택하기" }));
    await user.click(screen.getByRole("button", { name: "용어 퀴즈 선택하기" }));
    await user.click(screen.getByRole("button", { name: "이 모드 시작" }));
    await user.type(screen.getByLabelText("용어 퀴즈 입력"), "Navigator.pop");
    await user.click(screen.getByRole("button", { name: "제출" }));

    expect(screen.getByText("오답입니다")).toBeVisible();
    expect(screen.getByText(/Navigator\.push/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    expect(screen.getByText("Container의 decoration에 자주 넣는 장식 클래스는?")).toBeVisible();
  });

  test("submits with Enter and advances with a second Enter in quiz mode", async () => {
    const user = userEvent.setup();
    const catalog = createMiniCatalog([
      {
        id: "mini-1",
        term: "Navigator.push",
        category: "navigation",
        quizPrompt: "새 화면을 현재 화면 위에 쌓는 기본 메서드는?",
        description: "설명",
      },
      {
        id: "mini-2",
        term: "BoxDecoration",
        category: "style",
        quizPrompt: "Container의 decoration에 자주 넣는 장식 클래스는?",
        description: "설명",
      },
    ]);

    render(<App catalog={catalog} />);

    await user.click(screen.getByRole("button", { name: "게임 선택하기" }));
    await user.click(screen.getByRole("button", { name: "용어 퀴즈 선택하기" }));
    await user.click(screen.getByRole("button", { name: "이 모드 시작" }));
    await user.type(screen.getByLabelText("용어 퀴즈 입력"), "Navigator.pop");
    await user.keyboard("{Enter}");

    const nextButton = screen.getByRole("button", { name: "다음 문제" });

    expect(screen.getByText("오답입니다")).toBeVisible();
    expect(nextButton).toHaveFocus();

    await user.keyboard("{Enter}");

    expect(screen.getByText("Container의 decoration에 자주 넣는 장식 클래스는?")).toBeVisible();
  });

  test("starts quiz mode with shuffled order when random mode is enabled", async () => {
    const user = userEvent.setup();
    const catalog = createMiniCatalog([
      {
        id: "mini-1",
        term: "Alpha",
        category: "widget",
        quizPrompt: "첫 번째 질문",
        description: "설명",
      },
      {
        id: "mini-2",
        term: "Beta",
        category: "widget",
        quizPrompt: "두 번째 질문",
        description: "설명",
      },
      {
        id: "mini-3",
        term: "Gamma",
        category: "widget",
        quizPrompt: "세 번째 질문",
        description: "설명",
      },
    ]);

    render(<App catalog={catalog} shuffleItems={(items) => [...items].reverse()} />);

    await user.click(screen.getByRole("button", { name: "게임 선택하기" }));
    await user.click(screen.getByRole("button", { name: "용어 퀴즈 선택하기" }));
    await user.click(screen.getByRole("button", { name: "랜덤 출제" }));
    await user.click(screen.getByRole("button", { name: "이 모드 시작" }));

    expect(screen.getByText("세 번째 질문")).toBeVisible();
  });

  test("copies the share text on the results screen", async () => {
    const user = userEvent.setup();
    const shareSpy = vi.spyOn(resultShare, "copyResultShareText").mockResolvedValue(undefined);
    const catalog = createMiniCatalog([
      {
        id: "mini-1",
        term: "StatelessWidget",
        category: "widget",
        quizPrompt: "상태를 직접 가지지 않는 위젯 클래스는?",
        description: "설명",
      },
    ]);

    render(<App catalog={catalog} />);

    await user.click(screen.getByRole("button", { name: "게임 선택하기" }));
    await user.click(screen.getByRole("button", { name: "이 모드 시작" }));
    await user.type(screen.getByLabelText("낱말 연습 입력"), "StatelessWidget");
    await user.click(screen.getByRole("button", { name: "공유 문구 복사" }));

    expect(shareSpy).toHaveBeenCalledWith(expect.stringContaining("Flutter 타이핑 스튜디오 결과"));
    expect(screen.getByText("공유 문구를 복사했습니다")).toBeVisible();
  });
});
