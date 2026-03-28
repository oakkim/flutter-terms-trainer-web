import { Copy, Home, RotateCcw, Share2 } from "lucide-react";

import { SummaryCard } from "@/components/summary-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PracticeMode, SessionSummary } from "@/types/terms";

interface ResultScreenProps {
  cpm?: number;
  isRandomOrder: boolean;
  mode: PracticeMode;
  onBackHome: () => void;
  onChooseAnotherGame: () => void;
  onReplay: () => void;
  onShare: () => void;
  shareFeedback: "idle" | "success" | "error";
  shareText: string;
  summary: SessionSummary;
}

export function ResultScreen({
  cpm,
  isRandomOrder,
  mode,
  onBackHome,
  onChooseAnotherGame,
  onReplay,
  onShare,
  shareFeedback,
  shareText,
  summary,
}: ResultScreenProps) {
  const modeLabel =
    mode === "wordPractice" ? "낱말 연습" : mode === "termQuiz" ? "용어 퀴즈" : "구조화 연습";
  const subtitle =
    mode === "wordPractice"
      ? "타이핑 속도와 정확도를 함께 확인하고, 같은 모드로 다시 도전하거나 다른 게임을 선택할 수 있습니다."
      : mode === "termQuiz"
        ? "질문 기반 회상 연습 결과를 확인하고, 공유 문구를 복사해 기록을 남길 수 있습니다."
        : "구조화 연습 결과를 확인하고, 다음 학습 흐름을 이어갈 수 있습니다.";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
      <SummaryCard
        title={`${modeLabel} 결과`}
        subtitle={subtitle}
        summary={summary}
        onRestart={onReplay}
        restartLabel="같은 게임 다시하기"
        extraMetrics={cpm === undefined ? [] : [{ label: "최종 CPM", value: `${cpm}` }]}
        note={`출제 순서: ${isRandomOrder ? "랜덤 출제" : "순서대로"} · 정답은 항상 완전 일치 규칙으로 채점됩니다.`}
      />

      <Card className="border-0 bg-card/92 shadow-[0_24px_80px_-48px_rgba(33,24,16,0.55)] backdrop-blur">
        <CardHeader className="gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Share2 className="size-4" />
            <span className="text-sm font-semibold">결과 보기 / 공유하기</span>
          </div>
          <CardTitle>공유 문구 미리보기</CardTitle>
          <CardDescription className="leading-6">
            학습 결과를 복사해서 메신저나 노트에 바로 붙여 넣을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
            <pre className="font-sans text-sm leading-6 whitespace-pre-wrap text-slate-700">
              {shareText}
            </pre>
          </div>

          {shareFeedback === "success" ? (
            <Alert>
              <Share2 className="size-4" />
              <AlertTitle>공유 문구를 복사했습니다</AlertTitle>
              <AlertDescription>원하는 곳에 바로 붙여 넣어 기록을 남기면 됩니다.</AlertDescription>
            </Alert>
          ) : null}

          {shareFeedback === "error" ? (
            <Alert variant="destructive">
              <Share2 className="size-4" />
              <AlertTitle>공유 문구 복사에 실패했습니다</AlertTitle>
              <AlertDescription>
                브라우저 권한 상태를 확인한 뒤 다시 시도해 주세요.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-3">
            <Button type="button" size="lg" onClick={onShare}>
              <Copy className="size-4" />
              공유 문구 복사
            </Button>
            <Button type="button" variant="outline" onClick={onChooseAnotherGame}>
              <RotateCcw className="size-4" />
              다른 게임 고르기
            </Button>
            <Button type="button" variant="ghost" onClick={onBackHome}>
              <Home className="size-4" />
              처음 화면으로
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
