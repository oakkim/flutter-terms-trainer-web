import type { ReactNode } from "react";
import { RotateCcw, Sparkles, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SessionSummary } from "@/types/terms";

interface SummaryCardProps {
  title: string;
  subtitle: string;
  summary: SessionSummary;
  onRestart: () => void;
  extraMetrics?: SummaryMetricData[];
  note?: string;
  restartLabel?: string;
}

interface SummaryMetricData {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function SummaryCard({
  title,
  subtitle,
  summary,
  onRestart,
  extraMetrics = [],
  note,
  restartLabel = "다시 시작",
}: SummaryCardProps) {
  const metrics: SummaryMetricData[] = [
    { label: "전체 문항", value: String(summary.total) },
    { label: "정확 처리", value: String(summary.correct) },
    { label: "실수 포함 완료", value: String(summary.wrong) },
    {
      icon: <Trophy className="size-4 text-primary" />,
      label: "최고 스트릭",
      value: `${summary.bestStreak}`,
    },
    ...extraMetrics,
  ];

  return (
    <Card className="border-0 bg-card/92 shadow-[0_24px_80px_-48px_rgba(33,24,16,0.55)] backdrop-blur">
      <CardHeader className="gap-4">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="size-5" />
          <span className="text-sm font-semibold">학습 완료</span>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6">{subtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          "grid gap-3 sm:grid-cols-2",
          metrics.length > 4 ? "xl:grid-cols-5" : "xl:grid-cols-4",
        )}
      >
        {metrics.map((metric) => (
          <SummaryMetric
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <p className="text-sm leading-6 text-muted-foreground">
          {note ??
            "완전 일치 규칙으로 채점되므로 대소문자, 점, 메서드 표기까지 그대로 익히는 데 초점을 둡니다."}
        </p>
        <Button type="button" variant="outline" onClick={onRestart}>
          <RotateCcw className="size-4" />
          {restartLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

function SummaryMetric({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
