import { useEffect, useRef } from "react";
import { AlertCircle, ArrowRight, CircleHelp, Lightbulb } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { focusWithoutScroll } from "@/lib/focus";
import { getCategoryLabel } from "@/lib/presentation";
import { getCurrentQuizItem, getProgressPercent, getSolvedCount } from "@/lib/session";
import type { QuizState } from "@/types/terms";

interface QuizPanelProps {
  state: QuizState;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
}

export function QuizPanel({ state, onInputChange, onSubmit, onNext, onRestart }: QuizPanelProps) {
  const currentItem = getCurrentQuizItem(state);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!currentItem) {
      return;
    }

    if (state.revealed) {
      focusWithoutScroll(nextButtonRef.current);
      return;
    }

    focusWithoutScroll(inputRef.current);
  }, [currentItem, state.revealed]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || state.revealed || state.inputValue.length === 0) {
      return;
    }

    if (event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    onSubmit();
  }

  if (!currentItem) {
    return null;
  }

  const solvedCount = getSolvedCount(state.summary);

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
          <span className="font-medium">용어 퀴즈 진행도</span>
          <span className="text-muted-foreground">{getProgressPercent(state.summary)}%</span>
        </div>
        <Progress value={getProgressPercent(state.summary)} aria-label="용어 퀴즈 진행도" />
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(244,247,255,0.92),rgba(253,242,234,0.92))] p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CircleHelp className="size-4" />
            퀴즈 질문
          </div>
          <CardTitle className="mt-4 text-xl leading-8 sm:text-2xl">{currentItem.prompt}</CardTitle>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="term-quiz-input">
            정답 용어 입력
          </label>
          <Input
            id="term-quiz-input"
            aria-label="용어 퀴즈 입력"
            className="h-13 rounded-2xl bg-background/80 font-mono text-base"
            disabled={state.revealed}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="정답 용어를 정확히 입력"
            ref={inputRef}
            value={state.inputValue}
          />
        </div>

        {state.revealed ? (
          <QuizFeedback
            description={currentItem.description}
            isCorrect={state.lastResult === "correct"}
            term={currentItem.term}
          />
        ) : (
          <Alert>
            <Lightbulb className="size-4" />
            <AlertTitle>채점 규칙</AlertTitle>
            <AlertDescription>
              질문을 보고 정답 용어를 정확한 표기 그대로 입력한 뒤 제출하세요.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-3">
          <MiniStat label="정답" value={`${state.summary.correct}`} />
          <MiniStat label="오답" value={`${state.summary.wrong}`} />
          <MiniStat label="최고 스트릭" value={`${state.summary.bestStreak}`} />
        </div>

        {state.revealed ? (
          <Button
            type="button"
            className="sm:min-w-32"
            disabled={state.completed}
            onClick={onNext}
            ref={nextButtonRef}
          >
            다음 문제
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="sm:min-w-32"
            disabled={state.inputValue.length === 0}
            onClick={onSubmit}
          >
            제출
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function QuizFeedback({
  isCorrect,
  description,
  term,
}: {
  isCorrect: boolean;
  description: string;
  term: string;
}) {
  if (isCorrect) {
    return (
      <Alert>
        <Lightbulb className="size-4" />
        <AlertTitle>정답입니다</AlertTitle>
        <AlertDescription>
          <span className="font-mono font-semibold">{term}</span>
          <span className="ml-2 text-muted-foreground">{description}</span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>오답입니다</AlertTitle>
      <AlertDescription>
        정답은 <span className="font-mono font-semibold">{term}</span> 입니다.
        <span className="ml-2">{description}</span>
      </AlertDescription>
    </Alert>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
