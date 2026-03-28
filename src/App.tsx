import { useEffect, useState } from "react";
import { Flag, Gamepad2, Share2, Sparkles } from "lucide-react";

import { LandingScreen } from "@/components/landing-screen";
import { ModeSelector } from "@/components/mode-selector";
import { QuizPanel } from "@/components/quiz-panel";
import { RefactorLabPanel } from "@/components/refactor-lab-panel";
import { ResultScreen } from "@/components/result-screen";
import { TypingPanel } from "@/components/typing-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shuffleArray } from "@/lib/order";
import { buildResultShareText, copyResultShareText } from "@/lib/result-share";
import { termCatalog } from "@/lib/term-data";
import {
  advanceQuizState,
  createQuizState,
  createWordPracticeState,
  getProgressPercent,
  getSolvedCount,
  getWordPracticeCpm,
  submitQuizAnswer,
  updateQuizInput,
  updateWordPracticeState,
} from "@/lib/session";
import type { PracticeMode, TermCatalog } from "@/types/terms";

type ShuffleItemsFn = <T>(items: readonly T[]) => T[];
type AppStage = "landing" | "selection" | "gameplay" | "results";

interface AppProps {
  catalog?: TermCatalog;
  shuffleItems?: ShuffleItemsFn;
}

function App({ catalog = termCatalog, shuffleItems = shuffleArray }: AppProps) {
  const categoryCount = new Set(catalog.terms.map((term) => term.category)).size;
  const [stage, setStage] = useState<AppStage>("landing");
  const [mode, setMode] = useState<PracticeMode>("wordPractice");
  const [isRandomOrder, setIsRandomOrder] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<"idle" | "success" | "error">("idle");
  const [wordPracticeState, setWordPracticeState] = useState(() =>
    createWordPracticeState(orderItems(catalog.terms, false, shuffleItems)),
  );
  const [quizState, setQuizState] = useState(() =>
    createQuizState(orderItems(catalog.quizItems, false, shuffleItems)),
  );
  const isRefactorLab = mode === "refactorLab";

  useEffect(() => {
    setStage("landing");
    setMode("wordPractice");
    setIsRandomOrder(false);
    setShareFeedback("idle");
    setWordPracticeState(createWordPracticeState(orderItems(catalog.terms, false, shuffleItems)));
    setQuizState(createQuizState(orderItems(catalog.quizItems, false, shuffleItems)));
  }, [catalog, shuffleItems]);

  const activeSummary = mode === "wordPractice" ? wordPracticeState.summary : quizState.summary;
  const gameplayTitle =
    mode === "wordPractice"
      ? "낱말 연습 진행"
      : mode === "termQuiz"
        ? "용어 퀴즈 진행"
        : "구조화 연습 진행";
  const gameplayDescription =
    mode === "wordPractice"
      ? "보이는 용어를 그대로 입력하며 정확도와 CPM에 집중합니다."
      : mode === "termQuiz"
        ? "질문을 보고 정답 용어를 떠올려 완전 일치로 제출합니다."
        : "위젯화, 함수화, 그대로 두기 판단을 단계적으로 익힙니다.";
  const shareText = isRefactorLab
    ? ""
    : buildResultShareText({
        cpm: mode === "wordPractice" ? getWordPracticeCpm(wordPracticeState) : undefined,
        isRandomOrder,
        mode,
        summary: activeSummary,
      });

  function createNextWordPracticeState() {
    return createWordPracticeState(orderItems(catalog.terms, isRandomOrder, shuffleItems));
  }

  function createNextQuizState() {
    return createQuizState(orderItems(catalog.quizItems, isRandomOrder, shuffleItems));
  }

  function handleOpenSelection() {
    setShareFeedback("idle");
    setStage("selection");
  }

  function handleReturnHome() {
    setShareFeedback("idle");
    setStage("landing");
  }

  function handleStartGame() {
    setShareFeedback("idle");

    if (mode === "wordPractice") {
      setWordPracticeState(createNextWordPracticeState());
    } else if (mode === "termQuiz") {
      setQuizState(createNextQuizState());
    }

    setStage("gameplay");
  }

  function handleReplayCurrentGame() {
    setShareFeedback("idle");

    if (mode === "wordPractice") {
      setWordPracticeState(createNextWordPracticeState());
    } else if (mode === "termQuiz") {
      setQuizState(createNextQuizState());
    }

    setStage("gameplay");
  }

  async function handleShareResult() {
    try {
      await copyResultShareText(shareText);
      setShareFeedback("success");
    } catch {
      setShareFeedback("error");
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8ee_0%,#fffdf8_45%,#fff6ef_100%)] text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-border/60 bg-[radial-gradient(circle_at_top_left,rgba(255,173,124,0.22),transparent_33%),radial-gradient(circle_at_top_right,rgba(111,159,255,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,249,243,0.88))] p-6 shadow-[0_36px_120px_-60px_rgba(52,36,22,0.45)] sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,135,66,0.18),transparent_60%)]" />

          <div className="relative z-10 space-y-6">
            <StageProgress stage={stage} />

            {stage === "landing" ? (
              <LandingScreen
                categoryCount={categoryCount}
                onContinue={handleOpenSelection}
                quizCount={catalog.quizItems.length}
                termCount={catalog.terms.length}
              />
            ) : null}

            {stage === "selection" ? (
              <ModeSelector
                categoryCount={categoryCount}
                isRandomOrder={isRandomOrder}
                mode={mode}
                onBack={handleReturnHome}
                onModeChange={setMode}
                onRandomOrderChange={setIsRandomOrder}
                onStart={handleStartGame}
                quizCount={catalog.quizItems.length}
                termCount={catalog.terms.length}
              />
            ) : null}

            {stage === "gameplay" ? (
              isRefactorLab ? (
                <RefactorLabPanel onBackToSelection={handleOpenSelection} />
              ) : (
                <div className="space-y-6">
                  <Card className="border-0 bg-white/78 shadow-none backdrop-blur">
                    <CardHeader className="gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                              {mode === "wordPractice" ? "낱말 연습" : "용어 퀴즈"}
                            </Badge>
                            <Badge variant={isRandomOrder ? "secondary" : "outline"}>
                              {isRandomOrder ? "랜덤 출제" : "순서대로"}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl">{gameplayTitle}</CardTitle>
                          <CardDescription className="leading-6">
                            {gameplayDescription}
                          </CardDescription>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="ghost" onClick={handleOpenSelection}>
                            게임 선택으로
                          </Button>
                          <Button type="button" variant="outline" onClick={handleReplayCurrentGame}>
                            같은 게임 다시 시작
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                      <StatusTile
                        label="해결된 문항"
                        value={`${getSolvedCount(activeSummary)} / ${activeSummary.total}`}
                      />
                      <StatusTile label="진행률" value={`${getProgressPercent(activeSummary)}%`} />
                      <StatusTile label="최고 스트릭" value={`${activeSummary.bestStreak}`} />
                      <StatusTile
                        label={mode === "wordPractice" ? "실시간 CPM" : "현재 스트릭"}
                        value={
                          mode === "wordPractice"
                            ? `${getWordPracticeCpm(wordPracticeState)}`
                            : `${activeSummary.currentStreak}`
                        }
                      />
                    </CardContent>
                  </Card>

                  {mode === "wordPractice" ? (
                    <TypingPanel
                      onInputChange={(value) =>
                        setWordPracticeState((current) => {
                          const nextState = updateWordPracticeState(current, value);

                          if (nextState.completed) {
                            setStage("results");
                            setShareFeedback("idle");
                          }

                          return nextState;
                        })
                      }
                      onRestart={handleReplayCurrentGame}
                      state={wordPracticeState}
                    />
                  ) : (
                    <QuizPanel
                      onInputChange={(value) =>
                        setQuizState((current) => updateQuizInput(current, value))
                      }
                      onNext={() => setQuizState((current) => advanceQuizState(current))}
                      onRestart={handleReplayCurrentGame}
                      onSubmit={() =>
                        setQuizState((current) => {
                          const nextState = submitQuizAnswer(current);

                          if (nextState.completed) {
                            setStage("results");
                            setShareFeedback("idle");
                          }

                          return nextState;
                        })
                      }
                      state={quizState}
                    />
                  )}
                </div>
              )
            ) : null}

            {stage === "results" ? (
              <ResultScreen
                cpm={mode === "wordPractice" ? getWordPracticeCpm(wordPracticeState) : undefined}
                isRandomOrder={isRandomOrder}
                mode={mode}
                onBackHome={handleReturnHome}
                onChooseAnotherGame={handleOpenSelection}
                onReplay={handleReplayCurrentGame}
                onShare={() => {
                  void handleShareResult();
                }}
                shareFeedback={shareFeedback}
                shareText={shareText}
                summary={activeSummary}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function orderItems<T>(
  items: readonly T[],
  isRandomOrder: boolean,
  shuffleItems: ShuffleItemsFn,
): T[] {
  return isRandomOrder ? shuffleItems(items) : [...items];
}

function StageProgress({ stage }: { stage: AppStage }) {
  const steps = [
    {
      icon: <Sparkles className="size-4" />,
      id: "landing",
      label: "랜딩",
    },
    {
      icon: <Gamepad2 className="size-4" />,
      id: "selection",
      label: "게임 선택",
    },
    {
      icon: <Flag className="size-4" />,
      id: "gameplay",
      label: "게임 진행",
    },
    {
      icon: <Share2 className="size-4" />,
      id: "results",
      label: "결과 보기",
    },
  ] as const;
  const currentIndex = steps.findIndex((step) => step.id === stage);

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
            index <= currentIndex
              ? "border-primary/35 bg-primary/8 text-slate-950"
              : "border-border/70 bg-background/70 text-muted-foreground"
          }`}
        >
          {step.icon}
          <span className="font-medium">{step.label}</span>
        </div>
      ))}
    </div>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

export default App;
