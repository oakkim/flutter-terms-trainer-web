import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Brain, Keyboard, Shuffle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PracticeMode } from "@/types/terms";

interface ModeSelectorProps {
  categoryCount: number;
  isRandomOrder: boolean;
  mode: PracticeMode;
  onBack: () => void;
  onModeChange: (mode: PracticeMode) => void;
  onRandomOrderChange: (nextValue: boolean) => void;
  onStart: () => void;
  quizCount: number;
  termCount: number;
}

export function ModeSelector({
  categoryCount,
  isRandomOrder,
  mode,
  termCount,
  quizCount,
  onBack,
  onModeChange,
  onRandomOrderChange,
  onStart,
}: ModeSelectorProps) {
  return (
    <Card className="border-0 bg-card/92 shadow-[0_24px_80px_-48px_rgba(33,24,16,0.55)] backdrop-blur">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{termCount}개 고유 용어</Badge>
            <Badge variant="outline">{quizCount}개 퀴즈 프롬프트</Badge>
            <Badge variant="outline">{categoryCount}개 카테고리</Badge>
          </div>
          <Button type="button" variant="ghost" onClick={onBack}>
            <ArrowLeft className="size-4" />
            랜딩으로
          </Button>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl sm:text-3xl">게임 선택하기</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            먼저 어떤 방식으로 연습할지 고른 뒤, 출제 순서를 정하고 게임을 시작하세요.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <ModeOptionCard
            ariaLabel="낱말 연습 선택하기"
            description={`${termCount}개 용어를 철자 그대로 따라 입력하며 정확도와 CPM을 함께 체크합니다.`}
            icon={<Keyboard className="size-4" />}
            isSelected={mode === "wordPractice"}
            onClick={() => onModeChange("wordPractice")}
            title="낱말 연습"
          />
          <ModeOptionCard
            ariaLabel="용어 퀴즈 선택하기"
            description={`${quizCount}개 질문을 보고 정확한 Flutter 용어를 떠올려 답합니다.`}
            icon={<Brain className="size-4" />}
            isSelected={mode === "termQuiz"}
            onClick={() => onModeChange("termQuiz")}
            title="용어 퀴즈"
          />
        </div>

        <div className="space-y-3 rounded-3xl border border-border/70 bg-background/70 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Shuffle className="size-4" />
                출제 순서
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                랜덤 출제를 켜면 이번 게임이 새 순서로 시작됩니다.
              </p>
            </div>
            <Badge variant={isRandomOrder ? "secondary" : "outline"}>
              {isRandomOrder ? "랜덤" : "순차"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              aria-pressed={!isRandomOrder}
              onClick={() => onRandomOrderChange(false)}
              size="lg"
              type="button"
              variant={!isRandomOrder ? "default" : "outline"}
            >
              순서대로
            </Button>
            <Button
              aria-pressed={isRandomOrder}
              onClick={() => onRandomOrderChange(true)}
              size="lg"
              type="button"
              variant={isRandomOrder ? "default" : "outline"}
            >
              랜덤 출제
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-dashed border-border/80 bg-background/60 p-4">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            현재 선택된 모드는{" "}
            <span className="font-semibold text-slate-900">{getModeLabel(mode)}</span>
            이고, 출제 순서는{" "}
            <span className="font-semibold text-slate-900">
              {isRandomOrder ? "랜덤 출제" : "순서대로"}
            </span>
            입니다.
          </p>
          <Button type="button" size="lg" onClick={onStart}>
            이 모드 시작
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModeOptionCard({
  ariaLabel,
  description,
  icon,
  isSelected,
  onClick,
  title,
}: {
  ariaLabel: string;
  description: string;
  icon: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={cn(
        "flex min-h-36 w-full flex-col items-start gap-3 rounded-3xl border px-5 py-5 text-left transition-colors",
        isSelected
          ? "border-primary/45 bg-primary/8 shadow-[0_16px_42px_-34px_rgba(36,24,15,0.55)]"
          : "border-border/70 bg-background/75 hover:bg-background",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      <Badge variant={isSelected ? "secondary" : "outline"}>
        {isSelected ? "선택됨" : "선택하기"}
      </Badge>
    </button>
  );
}

function getModeLabel(mode: PracticeMode): string {
  return mode === "wordPractice" ? "낱말 연습" : "용어 퀴즈";
}
