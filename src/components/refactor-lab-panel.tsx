import { useState, type DragEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  RefreshCw,
  Route,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import {
  refactorLabChoiceLabels,
  refactorLabClassificationQuestions,
  refactorLabOrderingProblems,
  refactorLabRetrievalQuestions,
  refactorLabStages,
  type RefactorLabChoiceKey,
} from "@/data/refactor-lab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  buildRecommendationBody,
  buildRecommendationTitle,
  createInitialRefactorLabState,
  getAnsweredRetrievalCount,
  getCompletionChecks,
  getCompletionScore,
  getRetrievalScore,
  isOrderingCorrect,
  moveItem,
  reorderItems,
  type RefactorLabState,
} from "@/lib/refactor-lab";
import { cn } from "@/lib/utils";

interface RefactorLabPanelProps {
  onBackToSelection: () => void;
}

export function RefactorLabPanel({ onBackToSelection }: RefactorLabPanelProps) {
  const [state, setState] = useState<RefactorLabState>(createInitialRefactorLabState);
  const [draggedOrderIndex, setDraggedOrderIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const stage = refactorLabStages[state.stageIndex];
  const classificationQuestion = refactorLabClassificationQuestions[state.classIndex];
  const orderingProblem = refactorLabOrderingProblems[state.orderIndex];
  const completionChecks = getCompletionChecks(state.completionValues);
  const answeredCount = getAnsweredRetrievalCount(state.retrievalValues);
  const totalCorrectBeforeRetrieval =
    state.classCorrect + state.orderCorrectCount + state.completionCorrect;

  function setStageIndex(nextIndex: number) {
    setDraggedOrderIndex(null);
    setDropTargetIndex(null);
    setState((current) => ({
      ...current,
      stageIndex: nextIndex,
    }));
  }

  function restartLab() {
    setDraggedOrderIndex(null);
    setDropTargetIndex(null);
    setState(createInitialRefactorLabState());
  }

  function handleClassificationSubmit() {
    if (!state.classSelected || state.classSubmitted) {
      return;
    }

    const correct = state.classSelected === classificationQuestion.answer;

    setState((current) => ({
      ...current,
      classSubmitted: true,
      classCorrect: current.classCorrect + (correct ? 1 : 0),
      classificationHistory: [
        ...current.classificationHistory,
        {
          question: classificationQuestion.prompt,
          selected: current.classSelected as RefactorLabChoiceKey,
          answer: classificationQuestion.answer,
          correct,
        },
      ],
    }));
  }

  function handleClassificationNext() {
    if (state.classIndex === refactorLabClassificationQuestions.length - 1) {
      setStageIndex(2);
      return;
    }

    setState((current) => ({
      ...current,
      classIndex: current.classIndex + 1,
      classSelected: "",
      classSubmitted: false,
    }));
  }

  function handleMoveOrderItem(index: number, direction: -1 | 1) {
    if (state.orderChecked) {
      return;
    }

    setState((current) => ({
      ...current,
      orderItems: moveItem(current.orderItems, index, direction),
    }));
  }

  function handleOrderDrop(targetIndex: number) {
    if (state.orderChecked || draggedOrderIndex === null) {
      return;
    }

    setState((current) => ({
      ...current,
      orderItems: reorderItems(current.orderItems, draggedOrderIndex, targetIndex),
    }));
    setDraggedOrderIndex(null);
    setDropTargetIndex(null);
  }

  function handleCheckOrdering() {
    if (state.orderChecked) {
      return;
    }

    const orderCorrect = isOrderingCorrect(state.orderItems, orderingProblem.target);

    setState((current) => ({
      ...current,
      orderChecked: true,
      orderCorrect,
      orderCorrectCount: current.orderCorrectCount + (orderCorrect ? 1 : 0),
    }));
  }

  function handleNextOrdering() {
    if (state.orderIndex === refactorLabOrderingProblems.length - 1) {
      setStageIndex(3);
      return;
    }

    const nextProblem = refactorLabOrderingProblems[state.orderIndex + 1];

    setDraggedOrderIndex(null);
    setDropTargetIndex(null);
    setState((current) => ({
      ...current,
      orderIndex: current.orderIndex + 1,
      orderItems: [...nextProblem.initial],
      orderChecked: false,
      orderCorrect: false,
    }));
  }

  function handleCheckCompletion() {
    if (state.completionSubmitted) {
      return;
    }

    setState((current) => ({
      ...current,
      completionSubmitted: true,
      completionCorrect: getCompletionScore(completionChecks),
    }));
  }

  function handleSubmitRetrieval() {
    if (state.retrievalSubmitted || answeredCount !== refactorLabRetrievalQuestions.length) {
      return;
    }

    setState((current) => ({
      ...current,
      retrievalSubmitted: true,
      retrievalCorrect: getRetrievalScore(current.retrievalValues),
    }));
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white/82 shadow-none backdrop-blur">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">구조화 연습</Badge>
                <Badge variant="outline">5단계 실습</Badge>
                <Badge variant="outline">판단 {refactorLabClassificationQuestions.length}개</Badge>
                <Badge variant="outline">회상 {refactorLabRetrievalQuestions.length}개</Badge>
              </div>
              <CardTitle className="text-2xl">위젯화 / 함수화 학습 랩</CardTitle>
              <CardDescription className="max-w-3xl leading-6">
                반복되는 화면은 위젯으로, 반복되는 계산과 행동은 함수로, 아직 이르다면 그대로 두는
                판단까지 단계별로 연습합니다.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={onBackToSelection}>
                <ArrowLeft className="size-4" />
                게임 선택으로
              </Button>
              <Button type="button" variant="outline" onClick={restartLab}>
                <RefreshCw className="size-4" />
                실습 다시 시작
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 md:grid-cols-4">
            <LabStat label="판단 문제" value={`${refactorLabClassificationQuestions.length}개`} />
            <LabStat label="순서 맞추기" value={`${refactorLabOrderingProblems.length}개`} />
            <LabStat label="빈칸 채우기" value="4개" />
            <LabStat label="회상 문제" value={`${refactorLabRetrievalQuestions.length}개`} />
          </div>

          <div className="space-y-4 rounded-[28px] border border-border/70 bg-background/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {refactorLabStages.map((item, index) => (
                  <Badge
                    key={item.key}
                    variant={index <= state.stageIndex ? "secondary" : "outline"}
                    className="px-3 py-1"
                  >
                    {index + 1}. {item.title}
                  </Badge>
                ))}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {state.stageIndex + 1} / {refactorLabStages.length} 단계
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ff9558_0%,#f97316_55%,#ffcc7a_100%)] transition-all"
                style={{ width: `${((state.stageIndex + 1) / refactorLabStages.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              {stage.title}
            </div>
          </div>

          {stage.key === "example" ? <ExampleStage onStart={() => setStageIndex(1)} /> : null}

          {stage.key === "classification" ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="outline">나눌지 말지 판단하기</Badge>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    이 코드는 위젯화, 함수화, 그대로 둠 중 무엇이 가장 자연스러울까요?
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    모든 문제를 나누는 건 아닙니다. 어떤 문제의 정답은{" "}
                    <strong className="text-slate-950">그대로 둠</strong>일 수도 있습니다.
                  </p>
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {state.classIndex + 1} / {refactorLabClassificationQuestions.length}
                </div>
              </div>

              <Callout tone="warn" title="문제">
                {classificationQuestion.prompt}
              </Callout>

              <CodeBlock>{classificationQuestion.snippet}</CodeBlock>

              <div className="grid gap-3">
                {(
                  Object.entries(refactorLabChoiceLabels) as [
                    RefactorLabChoiceKey,
                    (typeof refactorLabChoiceLabels)[RefactorLabChoiceKey],
                  ][]
                ).map(([choiceKey, choice]) => (
                  <button
                    key={choiceKey}
                    type="button"
                    className={cn(
                      "rounded-3xl border p-4 text-left transition-colors",
                      getChoiceClassName(
                        choiceKey,
                        classificationQuestion.answer,
                        state.classSelected,
                        state.classSubmitted,
                      ),
                    )}
                    onClick={() => {
                      if (state.classSubmitted) {
                        return;
                      }

                      setState((current) => ({
                        ...current,
                        classSelected: choiceKey,
                      }));
                    }}
                  >
                    <div className="font-semibold text-slate-950">{choice.title}</div>
                    <div className="mt-2 text-sm leading-6 text-muted-foreground">
                      {choice.body}
                    </div>
                  </button>
                ))}
              </div>

              {state.classSubmitted ? (
                <Callout
                  tone={state.classSelected === classificationQuestion.answer ? "good" : "bad"}
                  title={
                    state.classSelected === classificationQuestion.answer
                      ? "정답입니다."
                      : "이번 문제는 다시 보는 게 좋아요."
                  }
                >
                  <p>
                    정답:{" "}
                    <strong>{refactorLabChoiceLabels[classificationQuestion.answer].title}</strong>
                  </p>
                  <p>{classificationQuestion.explanation}</p>
                </Callout>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!state.classSelected || state.classSubmitted}
                  onClick={handleClassificationSubmit}
                >
                  정답 확인
                </Button>
                {state.classSubmitted ? (
                  <Button type="button" onClick={handleClassificationNext}>
                    {state.classIndex === refactorLabClassificationQuestions.length - 1
                      ? "다음 단계로"
                      : "다음 문제"}
                    <ArrowRight className="size-4" />
                  </Button>
                ) : null}
              </div>
            </section>
          ) : null}

          {stage.key === "ordering" ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="outline">순서 맞추기</Badge>
                  <h2 className="text-2xl font-semibold tracking-tight">{orderingProblem.title}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    초보자에게는 빈 화면에서 직접 작성시키는 것보다, 올바른 절차를 재구성하게 하는
                    편이 부담이 적고 핵심 흐름을 잡기 쉽습니다.
                  </p>
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {state.orderIndex + 1} / {refactorLabOrderingProblems.length}
                </div>
              </div>

              <Callout tone="warn" title="목표 상황">
                {orderingProblem.prompt}
              </Callout>

              <p className="text-sm leading-6 text-muted-foreground">
                카드를 끌어 놓거나, 아래의 위로/아래로 버튼으로 순서를 바꿔보세요.
              </p>

              <div className="grid gap-3">
                {state.orderItems.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    draggable={!state.orderChecked}
                    className={cn(
                      "flex flex-col gap-3 rounded-3xl border bg-background/80 p-4 transition-colors md:flex-row md:items-center",
                      draggedOrderIndex === index ? "opacity-60" : "",
                      dropTargetIndex === index
                        ? "border-primary/45 bg-primary/8"
                        : "border-border/70",
                    )}
                    onDragEnd={() => {
                      setDraggedOrderIndex(null);
                      setDropTargetIndex(null);
                    }}
                    onDragOver={(event: DragEvent<HTMLDivElement>) => {
                      if (state.orderChecked) {
                        return;
                      }

                      event.preventDefault();
                      setDropTargetIndex(index);
                    }}
                    onDragStart={(event: DragEvent<HTMLDivElement>) => {
                      if (state.orderChecked) {
                        event.preventDefault();
                        return;
                      }

                      setDraggedOrderIndex(index);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onDrop={(event: DragEvent<HTMLDivElement>) => {
                      event.preventDefault();
                      handleOrderDrop(index);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-slate-950">
                        {index + 1}
                      </div>
                      <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-border/80 text-muted-foreground">
                        <GripVertical className="size-4" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 text-sm leading-6 text-slate-900">{item}</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={state.orderChecked}
                        onClick={() => handleMoveOrderItem(index, -1)}
                      >
                        <ArrowUp className="size-4" />
                        위로
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={state.orderChecked}
                        onClick={() => handleMoveOrderItem(index, 1)}
                      >
                        <ArrowDown className="size-4" />
                        아래로
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {state.orderChecked ? (
                <Callout
                  tone={state.orderCorrect ? "good" : "bad"}
                  title={
                    state.orderCorrect ? "순서가 좋습니다." : "순서를 다시 다듬으면 더 좋아집니다."
                  }
                >
                  <p>{state.orderCorrect ? orderingProblem.success : orderingProblem.retry}</p>
                  {!state.orderCorrect ? (
                    <div className="mt-3 rounded-2xl border border-dashed border-border/80 bg-background/80 p-4">
                      <div className="font-semibold text-slate-950">권장 순서</div>
                      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                        {orderingProblem.target.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    </div>
                  ) : null}
                </Callout>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={state.orderChecked}
                  onClick={handleCheckOrdering}
                >
                  순서 확인
                </Button>
                {state.orderChecked ? (
                  <Button type="button" onClick={handleNextOrdering}>
                    {state.orderIndex === refactorLabOrderingProblems.length - 1
                      ? "빈칸 채우기로"
                      : "다음 Parsons 문제"}
                    <ArrowRight className="size-4" />
                  </Button>
                ) : null}
              </div>
            </section>
          ) : null}

          {stage.key === "completion" ? (
            <section className="space-y-4">
              <div className="space-y-1">
                <Badge variant="outline">핵심만 완성하기</Badge>
                <h2 className="text-2xl font-semibold tracking-tight">
                  핵심 빈칸만 채워서 위젯화와 함수화를 마무리합니다
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  처음부터 다 쓰게 하기보다, 구조가 보이는 예제를 조금만 완성하게 하면 부담이 줄고
                  핵심 문법이 더 잘 남습니다.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border border-border/70 bg-background/80 shadow-none">
                  <CardHeader>
                    <CardTitle>위젯화 예제</CardTitle>
                    <CardDescription className="leading-6">
                      반복 카드 UI를 새 위젯으로 뺀다고 생각하고 빈칸을 채워보세요.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CodeBlock>{`class StatCard extends [1] {
  const StatCard({super.key, required this.label});

  final String label;

  @override
  Widget [2](BuildContext context) {
    return Text(label);
  }
}`}</CodeBlock>
                    <div className="grid gap-3">
                      <LabeledInput
                        label="[1] 기반 클래스"
                        value={state.completionValues.widgetExtends}
                        onChange={(value) =>
                          setState((current) => ({
                            ...current,
                            completionValues: {
                              ...current.completionValues,
                              widgetExtends: value,
                            },
                          }))
                        }
                        invalid={state.completionSubmitted && !completionChecks.widgetExtends}
                      />
                      <LabeledInput
                        label="[2] 메서드 이름"
                        value={state.completionValues.widgetBuild}
                        onChange={(value) =>
                          setState((current) => ({
                            ...current,
                            completionValues: {
                              ...current.completionValues,
                              widgetBuild: value,
                            },
                          }))
                        }
                        invalid={state.completionSubmitted && !completionChecks.widgetBuild}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/70 bg-background/80 shadow-none">
                  <CardHeader>
                    <CardTitle>함수화 예제</CardTitle>
                    <CardDescription className="leading-6">
                      점수에 따라 색을 돌려주는 함수를 완성해 보세요. 함수 이름은 꼭 예시와 같지
                      않아도 됩니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CodeBlock>{`[3] [4](int score) {
  if (score >= 80) return Colors.green;
  if (score >= 50) return Colors.orange;
  return Colors.red;
}`}</CodeBlock>
                    <div className="grid gap-3">
                      <LabeledInput
                        label="[3] 반환 타입"
                        value={state.completionValues.functionReturn}
                        onChange={(value) =>
                          setState((current) => ({
                            ...current,
                            completionValues: {
                              ...current.completionValues,
                              functionReturn: value,
                            },
                          }))
                        }
                        invalid={state.completionSubmitted && !completionChecks.functionReturn}
                      />
                      <LabeledInput
                        label="[4] 함수 이름"
                        value={state.completionValues.functionName}
                        onChange={(value) =>
                          setState((current) => ({
                            ...current,
                            completionValues: {
                              ...current.completionValues,
                              functionName: value,
                            },
                          }))
                        }
                        invalid={state.completionSubmitted && !completionChecks.functionName}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {state.completionSubmitted ? (
                <Callout
                  tone={state.completionCorrect === 4 ? "good" : "warn"}
                  title={`완성 결과: ${state.completionCorrect} / 4`}
                >
                  <p>
                    위젯화에서는 <code>StatelessWidget</code>, <code>build</code> 같은 구조를,
                    함수화에서는 반환 타입과 역할이 드러나는 이름을 함께 떠올리는 연습이 중요합니다.
                  </p>
                  <div className="mt-3 grid gap-2">
                    <CompletionReviewChip
                      good={completionChecks.widgetExtends}
                      text={
                        completionChecks.widgetExtends
                          ? "위젯 기반 클래스: 좋아요"
                          : "위젯 기반 클래스: StatelessWidget 권장"
                      }
                    />
                    <CompletionReviewChip
                      good={completionChecks.widgetBuild}
                      text={
                        completionChecks.widgetBuild
                          ? "build 메서드 이름: 좋아요"
                          : "build 메서드 이름: build가 맞습니다"
                      }
                    />
                    <CompletionReviewChip
                      good={completionChecks.functionReturn}
                      text={
                        completionChecks.functionReturn
                          ? "반환 타입: 좋아요"
                          : "반환 타입: Color가 잘 맞습니다"
                      }
                    />
                    <CompletionReviewChip
                      good={completionChecks.functionName}
                      text={
                        completionChecks.functionName
                          ? "함수 이름: 좋아요"
                          : "함수 이름: 역할이 드러나는 이름이면 충분합니다"
                      }
                    />
                  </div>
                </Callout>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={state.completionSubmitted}
                  onClick={handleCheckCompletion}
                >
                  빈칸 확인
                </Button>
                {state.completionSubmitted ? (
                  <Button type="button" onClick={() => setStageIndex(4)}>
                    회상 퀴즈로
                    <ArrowRight className="size-4" />
                  </Button>
                ) : null}
              </div>
            </section>
          ) : null}

          {stage.key === "retrieval" ? (
            <section className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="outline">코드 없이 다시 떠올리기</Badge>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    마지막에는 설명 없이 다시 판단합니다
                  </h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    조금 뒤에 다시 꺼내 보게 하는 회상 연습이 기억을 더 오래 남게 합니다. 이번엔
                    코드 예시보다 상황 설명만 보고 답해보세요.
                  </p>
                </div>
                <div className="text-sm font-semibold text-muted-foreground">
                  {answeredCount} / {refactorLabRetrievalQuestions.length} 답변 완료
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {refactorLabRetrievalQuestions.map((question, index) => (
                  <Card
                    key={question.id}
                    className="border border-border/70 bg-background/80 shadow-none"
                  >
                    <CardHeader>
                      <CardTitle className="text-base leading-7">
                        {index + 1}. {question.prompt}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {(
                          Object.entries(refactorLabChoiceLabels) as [
                            RefactorLabChoiceKey,
                            (typeof refactorLabChoiceLabels)[RefactorLabChoiceKey],
                          ][]
                        ).map(([choiceKey, choice]) => (
                          <Button
                            key={choiceKey}
                            type="button"
                            variant={
                              state.retrievalValues[question.id] === choiceKey
                                ? "secondary"
                                : "outline"
                            }
                            disabled={state.retrievalSubmitted}
                            onClick={() =>
                              setState((current) => ({
                                ...current,
                                retrievalValues: {
                                  ...current.retrievalValues,
                                  [question.id]: choiceKey,
                                },
                              }))
                            }
                          >
                            {choice.title}
                          </Button>
                        ))}
                      </div>

                      {state.retrievalSubmitted ? (
                        <div className="rounded-2xl border border-border/70 bg-muted/25 p-3 text-sm leading-6 text-muted-foreground">
                          <strong className="text-slate-950">
                            {state.retrievalValues[question.id] === question.answer
                              ? "정답"
                              : "오답"}
                          </strong>
                          {" · "}정답은{" "}
                          <strong className="text-slate-950">
                            {refactorLabChoiceLabels[question.answer].title}
                          </strong>
                          입니다.
                          <div className="mt-1">{question.explanation}</div>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {state.retrievalSubmitted ? (
                <>
                  <div className="grid gap-3 md:grid-cols-4">
                    <LabStat
                      label="분류 점수"
                      value={`${state.classCorrect} / ${refactorLabClassificationQuestions.length}`}
                    />
                    <LabStat
                      label="Parsons 점수"
                      value={`${state.orderCorrectCount} / ${refactorLabOrderingProblems.length}`}
                    />
                    <LabStat label="빈칸 점수" value={`${state.completionCorrect} / 4`} />
                    <LabStat
                      label="회상 점수"
                      value={`${state.retrievalCorrect} / ${refactorLabRetrievalQuestions.length}`}
                    />
                  </div>

                  <Card className="border border-border/70 bg-[linear-gradient(135deg,rgba(255,157,91,0.14),rgba(97,146,255,0.1))] shadow-none">
                    <CardHeader>
                      <CardTitle>
                        {buildRecommendationTitle({
                          classificationHistory: state.classificationHistory,
                          classCorrect: state.classCorrect,
                          orderCorrectCount: state.orderCorrectCount,
                          retrievalCorrect: state.retrievalCorrect,
                          totalCorrectBeforeRetrieval,
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-7 text-muted-foreground">
                      {buildRecommendationBody({
                        classificationHistory: state.classificationHistory,
                        totalCorrectBeforeRetrieval,
                        retrievalCorrect: state.retrievalCorrect,
                      })}
                    </CardContent>
                  </Card>
                </>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    answeredCount !== refactorLabRetrievalQuestions.length ||
                    state.retrievalSubmitted
                  }
                  onClick={handleSubmitRetrieval}
                >
                  회상 결과 보기
                </Button>
                {state.retrievalSubmitted ? (
                  <>
                    <Button type="button" onClick={restartLab}>
                      처음부터 다시
                    </Button>
                    <Button type="button" variant="outline" onClick={onBackToSelection}>
                      다른 게임 고르기
                    </Button>
                  </>
                ) : null}
              </div>
            </section>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ExampleStage({ onStart }: { onStart: () => void }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <Badge variant="outline">예시 먼저 보기</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">
            먼저 무엇을 왜 나누는지 보면서 시작합니다
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            초보자에게는 완성 코드를 바로 작성시키기보다, 반복 덩어리와 역할을 먼저 보이게 하는 편이
            더 잘 맞습니다.
          </p>
        </div>
        <Button type="button" onClick={onStart}>
          시작하기
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-border/70 bg-background/80 shadow-none">
          <CardHeader>
            <CardTitle>예시 A: 반복되는 화면 덩어리</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock>{`Column(
  children: [
    Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text("총 문제 수"),
          Text("12"),
        ],
      ),
    ),
    const SizedBox(height: 12),
    Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text("정답 수"),
          Text("8"),
        ],
      ),
    ),
  ],
)`}</CodeBlock>
            <div className="grid gap-3">
              <SubgoalCard
                title="서브골 1. 반복 덩어리 찾기"
                body="텍스트만 다르고 구조가 같은 카드가 두 번 이상 나오면 위젯 후보입니다."
              />
              <SubgoalCard
                title="서브골 2. 바깥에서 받을 값 찾기"
                body="label, value처럼 달라지는 것만 props로 빼면 됩니다."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-background/80 shadow-none">
          <CardHeader>
            <CardTitle>예시 B: 반복되는 계산 규칙</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock>{`Color getLevelColor(int score) {
  if (score >= 80) return Colors.green;
  if (score >= 50) return Colors.orange;
  return Colors.red;
}`}</CodeBlock>
            <div className="grid gap-3">
              <SubgoalCard
                title="서브골 3. 행동과 계산은 함수로"
                body="계산 규칙이 중심이면 위젯보다 함수가 더 적합합니다."
              />
              <SubgoalCard
                title="서브골 4. 너무 일찍 쪼개지 않기"
                body="반복도 없고 의미도 약한 한 줄짜리는 그대로 두는 판단도 배워야 합니다."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3">
        <SubgoalCard
          title="핵심 문장"
          body="화면 조각을 빼면 위젯화, 계산과 행동을 빼면 함수화입니다."
        />
        <SubgoalCard
          title="이 단계의 목표"
          body="아직 코드를 많이 치는 게 아니라, 먼저 어디를 나눌지 눈으로 구분하는 감각을 만드는 데 집중합니다."
        />
        <SubgoalCard
          title="그대로 두는 예시도 있습니다"
          body="const Divider(height: 24)처럼 짧고 한 번만 쓰는 코드는 지금 당장 분리하지 않는 편이 더 읽기 쉽습니다."
        />
      </div>
    </section>
  );
}

function SubgoalCard({ body, title }: { body: string; title: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-white/72 p-4">
      <div className="font-semibold text-slate-950">{title}</div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-4 text-[13px] leading-6 text-slate-100">
      <code>{children}</code>
    </pre>
  );
}

function LabStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function LabeledInput({
  invalid,
  label,
  onChange,
  value,
}: {
  invalid: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <Input
        aria-invalid={invalid}
        className="h-10"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    </label>
  );
}

function CompletionReviewChip({ good, text }: { good: boolean; text: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-3 py-2 text-sm leading-6",
        good
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900",
      )}
    >
      {text}
    </div>
  );
}

function Callout({
  children,
  title,
  tone,
}: {
  children: ReactNode;
  title: string;
  tone: "good" | "warn" | "bad";
}) {
  return (
    <Alert
      className={cn(
        tone === "good" && "border-emerald-200 bg-emerald-50 text-emerald-950",
        tone === "warn" && "border-amber-200 bg-amber-50 text-amber-950",
        tone === "bad" && "border-rose-200 bg-rose-50 text-rose-950",
      )}
    >
      {tone === "good" ? (
        <CheckCircle2 className="size-4" />
      ) : tone === "warn" ? (
        <TriangleAlert className="size-4" />
      ) : (
        <Route className="size-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-2 leading-6 text-inherit">{children}</AlertDescription>
    </Alert>
  );
}

function getChoiceClassName(
  choiceKey: RefactorLabChoiceKey,
  answerKey: RefactorLabChoiceKey,
  selectedKey: RefactorLabChoiceKey | "",
  submitted: boolean,
): string {
  if (!submitted) {
    return selectedKey === choiceKey
      ? "border-primary/45 bg-primary/8"
      : "border-border/70 bg-background/80 hover:bg-background";
  }

  if (choiceKey === answerKey) {
    return "border-emerald-200 bg-emerald-50";
  }

  if (choiceKey === selectedKey && selectedKey !== answerKey) {
    return "border-rose-200 bg-rose-50";
  }

  return "border-border/70 bg-background/80";
}
