import {
  refactorLabOrderingProblems,
  refactorLabRetrievalQuestions,
  type RefactorLabChoiceKey,
} from "@/data/refactor-lab";

export interface RefactorLabClassificationHistoryItem {
  question: string;
  selected: RefactorLabChoiceKey;
  answer: RefactorLabChoiceKey;
  correct: boolean;
}

export interface RefactorLabCompletionValues {
  widgetExtends: string;
  widgetBuild: string;
  functionName: string;
  functionReturn: string;
}

export type RefactorLabRetrievalValues = Record<string, RefactorLabChoiceKey | "">;

export interface RefactorLabState {
  stageIndex: number;
  classIndex: number;
  classSelected: RefactorLabChoiceKey | "";
  classSubmitted: boolean;
  classCorrect: number;
  classificationHistory: RefactorLabClassificationHistoryItem[];
  orderIndex: number;
  orderItems: string[];
  orderChecked: boolean;
  orderCorrect: boolean;
  orderCorrectCount: number;
  completionSubmitted: boolean;
  completionCorrect: number;
  completionValues: RefactorLabCompletionValues;
  retrievalSubmitted: boolean;
  retrievalValues: RefactorLabRetrievalValues;
  retrievalCorrect: number;
}

export interface RefactorLabCompletionChecks {
  widgetExtends: boolean;
  widgetBuild: boolean;
  functionName: boolean;
  functionReturn: boolean;
}

interface RecommendationPayload {
  classificationHistory: RefactorLabClassificationHistoryItem[];
  classCorrect: number;
  orderCorrectCount: number;
  retrievalCorrect: number;
  totalCorrectBeforeRetrieval: number;
}

export function createInitialRefactorLabState(): RefactorLabState {
  const retrievalValues = Object.fromEntries(
    refactorLabRetrievalQuestions.map((question) => [question.id, ""]),
  ) as RefactorLabRetrievalValues;

  return {
    stageIndex: 0,
    classIndex: 0,
    classSelected: "",
    classSubmitted: false,
    classCorrect: 0,
    classificationHistory: [],
    orderIndex: 0,
    orderItems: [...refactorLabOrderingProblems[0].initial],
    orderChecked: false,
    orderCorrect: false,
    orderCorrectCount: 0,
    completionSubmitted: false,
    completionCorrect: 0,
    completionValues: {
      widgetExtends: "",
      widgetBuild: "",
      functionName: "",
      functionReturn: "",
    },
    retrievalSubmitted: false,
    retrievalValues,
    retrievalCorrect: 0,
  };
}

export function normalizeRefactorText(value: string): string {
  return value.trim();
}

export function getCompletionChecks(
  values: RefactorLabCompletionValues,
): RefactorLabCompletionChecks {
  const functionName = normalizeRefactorText(values.functionName);

  return {
    widgetExtends: normalizeRefactorText(values.widgetExtends) === "StatelessWidget",
    widgetBuild: normalizeRefactorText(values.widgetBuild) === "build",
    functionReturn: normalizeRefactorText(values.functionReturn) === "Color",
    functionName:
      /^[A-Za-z_][A-Za-z0-9_]*$/.test(functionName) &&
      functionName.length >= 3 &&
      !["build", "widget", "color"].includes(functionName.toLowerCase()),
  };
}

export function getCompletionScore(checks: RefactorLabCompletionChecks): number {
  return Object.values(checks).filter(Boolean).length;
}

export function isOrderingCorrect(items: readonly string[], target: readonly string[]): boolean {
  return items.every((item, index) => item === target[index]);
}

export function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): T[] {
  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return [...items];
  }

  const nextItems = [...items];
  const current = nextItems[index];
  nextItems[index] = nextItems[nextIndex];
  nextItems[nextIndex] = current;
  return nextItems;
}

export function reorderItems<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return [...items];
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function getAnsweredRetrievalCount(values: RefactorLabRetrievalValues): number {
  return Object.values(values).filter((value) => normalizeRefactorText(value).length > 0).length;
}

export function getRetrievalScore(
  values: RefactorLabRetrievalValues,
  answers = refactorLabRetrievalQuestions,
): number {
  let score = 0;

  for (const question of answers) {
    if (values[question.id] === question.answer) {
      score += 1;
    }
  }

  return score;
}

export function buildRecommendationTitle({
  classificationHistory,
  classCorrect,
  orderCorrectCount,
  retrievalCorrect,
}: RecommendationPayload): string {
  if (
    retrievalCorrect === refactorLabRetrievalQuestions.length &&
    classCorrect >= 6 &&
    orderCorrectCount === refactorLabOrderingProblems.length
  ) {
    return "판단 기준이 꽤 잘 잡혀 있습니다";
  }

  const widgetMistakes = classificationHistory.filter(
    (item) => item.answer === "widget" && !item.correct,
  ).length;
  const functionMistakes = classificationHistory.filter(
    (item) => item.answer === "function" && !item.correct,
  ).length;

  if (widgetMistakes > functionMistakes) {
    return "다음엔 위젯화 판단을 조금 더 연습하면 좋겠습니다";
  }

  if (functionMistakes > widgetMistakes) {
    return "다음엔 함수화 판단을 조금 더 연습하면 좋겠습니다";
  }

  return "한 번 더 돌리면 감각이 더 또렷해질 것 같습니다";
}

export function buildRecommendationBody({
  classificationHistory,
  retrievalCorrect,
  functionMistakes,
  totalCorrectBeforeRetrieval,
  widgetMistakes,
}: {
  classificationHistory: RefactorLabClassificationHistoryItem[];
  retrievalCorrect: number;
  functionMistakes?: number;
  totalCorrectBeforeRetrieval: number;
  widgetMistakes?: number;
}): string {
  const resolvedWidgetMistakes =
    widgetMistakes ??
    classificationHistory.filter((item) => item.answer === "widget" && !item.correct).length;
  const resolvedFunctionMistakes =
    functionMistakes ??
    classificationHistory.filter((item) => item.answer === "function" && !item.correct).length;

  if (
    retrievalCorrect === refactorLabRetrievalQuestions.length &&
    totalCorrectBeforeRetrieval >= 11
  ) {
    return "반복되는 UI와 반복되는 계산을 구분하는 기준이 안정적입니다. 다음 단계에서는 실제 Flutter 예제를 조금 더 길게 보여주고, 직접 props 이름을 정하는 문제로 넘어가도 좋습니다.";
  }

  if (resolvedWidgetMistakes > resolvedFunctionMistakes) {
    return "반복되는 카드, 리스트 아이템, 프로필 조각처럼 화면에서 모양이 반복되는 예제를 더 많이 보면 좋습니다. 다음 버전에서는 같은 UI 덩어리에 어떤 props가 필요한지 고르는 문제를 추가하면 효과가 클 것 같습니다.";
  }

  if (resolvedFunctionMistakes > resolvedWidgetMistakes) {
    return "검증, 포맷팅, 색상 계산, 제출 처리처럼 행동과 규칙을 함수로 빼는 연습을 더 하는 편이 좋습니다. 다음 버전에서는 validator, formatAge, getScoreColor 류의 짧은 규칙 분리를 더 넣는 게 잘 맞습니다.";
  }

  return "아직은 ‘위젯으로 뺄까, 함수로 뺄까, 그냥 둘까’를 비교하는 문제가 가장 도움이 됩니다. 실제 앱에 넣는다면 문제를 짧게 쪼개고, 마지막에 같은 패턴을 다시 묻는 복습 라운드를 붙이는 방식이 좋습니다.";
}
