import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, PencilLine } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { focusWithoutScroll } from "@/lib/focus";
import { getCategoryLabel } from "@/lib/presentation";
import {
  getCurrentWordItem,
  getProgressPercent,
  getSolvedCount,
  getTypingStatus,
  getWordPracticeCpm,
  getWordPracticeElapsedMs,
  type TypingStatus,
} from "@/lib/session";
import { cn } from "@/lib/utils";
import type { WordPracticeState } from "@/types/terms";

interface TypingPanelProps {
  state: WordPracticeState;
  onInputChange: (value: string) => void;
  onRestart: () => void;
}

export function TypingPanel({ state, onInputChange, onRestart }: TypingPanelProps) {
  const currentItem = getCurrentWordItem(state);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!currentItem) {
      return;
    }

    focusWithoutScroll(inputRef.current);
  }, [currentItem]);

  useEffect(() => {
    setNowMs(Date.now());

    if (state.startedAtMs === null || state.completed) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [state.completed, state.startedAtMs]);

  if (!currentItem) {
    return null;
  }

  const typingStatus = getTypingStatus(currentItem.term, state.inputValue);
  const solvedCount = getSolvedCount(state.summary);
  const currentCpm = getWordPracticeCpm(state, nowMs);
  const elapsedMs = getWordPracticeElapsedMs(state, nowMs);

  return (
    <Card className="border-0 bg-card/92 shadow-[0_24px_80px_-48px_rgba(33,24,16,0.55)] backdrop-blur">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{getCategoryLabel(currentItem.category)}</Badge>
            <Badge variant="outline">
              {solvedCount + 1} / {state.summary.total}
            </Badge>
          </div>
          <Button type="button" variant="outline" onClick={onRestart}>
            처음부터
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">낱말 연습 진행도</span>
          <span className="text-muted-foreground">{getProgressPercent(state.summary)}%</span>
        </div>
        <Progress value={getProgressPercent(state.summary)} aria-label="낱말 연습 진행도" />
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(255,248,235,0.94),rgba(250,239,232,0.86))] p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <PencilLine className="size-4" />
            목표 용어
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 px-4 py-5 font-mono text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            {currentItem.term}
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            점, 대문자, 메서드 표기까지 정확히 동일해야 다음 용어로 넘어갑니다.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="word-practice-input">
            용어를 그대로 입력하세요
          </label>
          <Input
            id="word-practice-input"
            aria-label="낱말 연습 입력"
            className={cn(
              "h-13 rounded-2xl bg-background/80 font-mono text-base",
              inputToneClassName(typingStatus),
            )}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="예: Navigator.push"
            ref={inputRef}
            value={state.inputValue}
          />
        </div>

        <TypingStatusAlert hadMistype={state.hadMistype} status={typingStatus} />
      </CardContent>

      <CardFooter className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="정확 입력" value={`${state.summary.correct}`} />
        <MiniStat label="실수 후 완료" value={`${state.summary.wrong}`} />
        <MiniStat label="현재 스트릭" value={`${state.summary.currentStreak}`} />
        <MiniStat label="실시간 CPM" value={`${currentCpm}`} helper={formatDuration(elapsedMs)} />
      </CardFooter>
    </Card>
  );
}

function TypingStatusAlert({ hadMistype, status }: { hadMistype: boolean; status: TypingStatus }) {
  if (status === "mismatch") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>정확 일치 규칙</AlertTitle>
        <AlertDescription>
          현재 입력이 목표 문자열과 다릅니다. 틀린 문자를 지우고 다시 맞춰 입력해 보세요.
        </AlertDescription>
      </Alert>
    );
  }

  if (hadMistype) {
    return (
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertTitle>입력을 다시 맞췄습니다</AlertTitle>
        <AlertDescription>
          지금 입력은 목표 문자열 흐름과 맞습니다. 계속 입력하면 됩니다.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "exact") {
    return (
      <Alert>
        <CheckCircle2 className="size-4" />
        <AlertTitle>정답 처리 중</AlertTitle>
        <AlertDescription>정확히 일치했습니다. 다음 용어로 자동 이동합니다.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <CheckCircle2 className="size-4" />
      <AlertTitle>현재 규칙</AlertTitle>
      <AlertDescription>
        앞에서부터 철자가 맞게 들어오면 그대로 유지되고, 한 글자라도 다르면 실수로 기록됩니다.
      </AlertDescription>
    </Alert>
  );
}

function MiniStat({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
      {helper ? <div className="mt-1 text-xs text-muted-foreground">{helper}</div> : null}
    </div>
  );
}

function inputToneClassName(status: TypingStatus): string {
  if (status === "mismatch") {
    return "border-destructive/70 ring-3 ring-destructive/10";
  }

  if (status === "exact") {
    return "border-primary/60 ring-3 ring-primary/10";
  }

  return "border-border/70";
}

function formatDuration(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}
