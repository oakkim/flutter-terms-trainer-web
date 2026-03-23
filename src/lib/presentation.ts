const categoryLabels: Record<string, string> = {
  app: "앱",
  asset: "에셋",
  dateTime: "날짜·시간",
  input: "입력",
  interaction: "상호작용",
  keyboard: "키보드",
  layout: "레이아웃",
  navigation: "네비게이션",
  project: "프로젝트",
  screen: "화면",
  selection: "선택",
  size: "크기",
  state: "상태",
  style: "스타일",
  theme: "테마",
  tooling: "도구",
  validation: "검증",
  widget: "위젯",
};

export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}
