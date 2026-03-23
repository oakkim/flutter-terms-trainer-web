import type { ReactNode } from "react";
import { ArrowRight, Keyboard, Route, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LandingScreenProps {
  categoryCount: number;
  onContinue: () => void;
  quizCount: number;
  termCount: number;
}

export function LandingScreen({
  categoryCount,
  onContinue,
  quizCount,
  termCount,
}: LandingScreenProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <Badge variant="outline" className="bg-white/70">
          Flutter 용어 타자 스튜디오
        </Badge>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Flutter 용어를 타자처럼 익히고
          <span className="block text-primary">퀴즈로 다시 떠올려 보세요</span>
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          낱말 연습으로 철자와 표기를 손에 익히고, 용어 퀴즈로 개념을 다시 떠올려 보세요. 완전 일치
          채점과 CPM 기록으로 연습 감각도 함께 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <FeatureCard
          description={`${termCount}개 고유 용어를 그대로 따라 입력`}
          icon={<Keyboard className="size-4 text-primary" />}
          title="낱말 연습"
        />
        <FeatureCard
          description={`${quizCount}개 질문으로 용어를 떠올려 답하기`}
          icon={<Route className="size-4 text-primary" />}
          title="용어 퀴즈"
        />
        <FeatureCard
          description={`${categoryCount}개 카테고리 학습 결과를 한 번에 요약`}
          icon={<Share2 className="size-4 text-primary" />}
          title="결과 보기"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="lg" onClick={onContinue}>
          게임 선택하기
          <ArrowRight className="size-4" />
        </Button>
        <p className="text-sm text-muted-foreground">
          바로 시작해서 낱말 연습 또는 용어 퀴즈를 고를 수 있습니다.
        </p>
      </div>
    </section>
  );
}

function FeatureCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/80 p-4 shadow-[0_12px_40px_-32px_rgba(31,23,15,0.55)]">
      <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-900">
        <span>{title}</span>
        {icon}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
