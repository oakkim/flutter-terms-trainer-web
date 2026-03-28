window.refactorLabData = {
  choiceLabels: {
    widget: {
      title: "위젯화",
      body: "반복되는 화면 덩어리, 의미 있는 UI 조각, props로 값만 바뀌는 경우",
    },
    function: {
      title: "함수화",
      body: "반복되는 계산, 포맷팅, 검증, 상태 변경, 이벤트 처리 규칙",
    },
    leave: {
      title: "그대로 둠",
      body: "아직 반복도 없고, 나눌수록 오히려 복잡해지는 짧은 코드",
    },
  },
  classificationQuestions: [
    {
      prompt: "아래 코드는 같은 카드 모양을 여러 화면에서 반복해서 쓰는 상황입니다. 가장 먼저 고려할 분리는 무엇일까요?",
      snippet: `Column(
  children: [
    Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(user.name),
          Text(user.role),
        ],
      ),
    ),
    Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(friend.name),
          Text(friend.role),
        ],
      ),
    ),
  ],
)`,
      answer: "widget",
      explanation:
        "같은 모양의 UI 덩어리가 반복되므로 새 위젯으로 빼는 게 가장 자연스럽습니다. 데이터만 바뀌고 화면 구조는 같기 때문입니다.",
    },
    {
      prompt: "점수에 따라 배경색과 안내 문구를 정하는 로직이 여러 버튼에서 재사용됩니다. 어떤 분리가 더 적절할까요?",
      snippet: `final Color color =
  score >= 80 ? Colors.green :
  score >= 50 ? Colors.orange :
  Colors.red;`,
      answer: "function",
      explanation:
        "화면 조각보다 계산 규칙이 핵심이라 함수화가 적합합니다. 같은 판단 로직을 여러 곳에서 재사용하기 쉽습니다.",
    },
    {
      prompt: "한 화면에만 쓰이는 짧은 제목 한 줄입니다. 지금 이 시점에서 가장 좋은 선택은 무엇일까요?",
      snippet: `const Text(
  "오늘의 할 일",
  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
)`,
      answer: "leave",
      explanation:
        "아직 반복도 없고 의미 있는 재사용 단위도 아닙니다. 초보 단계에서는 과한 분해보다 그대로 두는 판단도 중요합니다.",
    },
    {
      prompt: "입력값 검증이 제출 버튼과 자동 검증 둘 다에서 필요합니다. 어떤 분리가 더 적절할까요?",
      snippet: `if (name.trim().isEmpty) {
  return "이름을 입력해 주세요.";
}
return null;`,
      answer: "function",
      explanation:
        "검증은 행동 규칙에 가깝기 때문에 함수로 분리하는 편이 좋습니다. 이후 TextFormField의 validator나 제출 전 검사에도 재사용됩니다.",
    },
    {
      prompt: "온보딩에서 같은 모양의 단계 안내 박스가 아이콘과 문구만 바뀌며 네 번 반복됩니다. 어떤 분리가 더 적절할까요?",
      snippet: `Column(
  children: [
    Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Icon(Icons.person),
          const SizedBox(width: 8),
          Text("이름 입력"),
        ],
      ),
    ),
    Container(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Icon(Icons.cake),
          const SizedBox(width: 8),
          Text("나이 입력"),
        ],
      ),
    ),
  ],
)`,
      answer: "widget",
      explanation:
        "화면 구조가 반복되고 값만 달라지므로 새 위젯으로 추출하는 판단이 맞습니다. 이런 경우 props로 icon, title 같은 값만 바꾸면 됩니다.",
    },
    {
      prompt: "나이를 받아서 '미입력', '7세', '성인' 같은 문자열로 바꾸는 규칙을 여러 카드에서 씁니다. 어떤 분리가 더 적절할까요?",
      snippet: `final label = age == null
  ? "미입력"
  : age >= 20
    ? "성인"
    : "\${age}세";`,
      answer: "function",
      explanation:
        "표현 규칙과 계산이 중심이므로 함수가 더 적합합니다. 화면에서 직접 분기하기보다 formatAgeLabel(age) 같은 함수로 묶는 편이 읽기 쉽습니다.",
    },
    {
      prompt: "설정 화면에서 한 번만 쓰는 Divider 한 줄이 있습니다. 이 시점의 가장 좋은 선택은 무엇일까요?",
      snippet: `const Divider(height: 24)`,
      answer: "leave",
      explanation:
        "짧고 한 번만 쓰이는 조각은 그대로 두는 편이 더 단순합니다. 너무 일찍 위젯화하면 오히려 이름만 늘고 맥락은 흐려질 수 있습니다.",
    },
    {
      prompt: "저장 버튼과 자동 저장 흐름 모두에서 같은 submitProfile() 로직을 호출해야 합니다. 어떤 분리가 더 적절할까요?",
      snippet: `if (formKey.currentState!.validate()) {
  saveProfile(name, age);
  Navigator.pop(context);
}`,
      answer: "function",
      explanation:
        "저장과 이동은 행동 흐름이므로 함수화가 잘 맞습니다. handleSubmit()이나 submitProfile()처럼 이름을 붙여 여러 이벤트에서 재사용하기 좋습니다.",
    },
  ],
  orderingProblems: [
    {
      title: "반복 UI를 새 위젯으로 빼는 순서",
      prompt:
        "결과 카드가 세 번 반복됩니다. 이 반복 UI를 <code>StatCard</code> 위젯으로 뺀다고 가정하고, 아래 단계를 올바른 순서로 맞춰보세요.",
      success:
        "반복을 먼저 찾고, 이름과 props를 정한 뒤, 새 위젯을 만들고 교체하는 흐름을 잘 잡았습니다.",
      retry:
        "초보자에게는 ‘반복 찾기 -> 이름 짓기 -> 전달할 값 찾기 -> 새 위젯 만들기 -> 교체’ 순서를 고정해 두면 판단이 훨씬 쉬워집니다.",
      target: [
        "반복되는 UI 덩어리를 찾는다.",
        "새 위젯 이름을 정한다.",
        "바깥에서 받아야 할 값을 props로 정한다.",
        "새 위젯 클래스를 만든다.",
        "기존 반복 코드를 새 위젯 호출로 교체한다.",
      ],
      initial: [
        "기존 반복 코드를 새 위젯 호출로 교체한다.",
        "새 위젯 이름을 정한다.",
        "바깥에서 받아야 할 값을 props로 정한다.",
        "반복되는 UI 덩어리를 찾는다.",
        "새 위젯 클래스를 만든다.",
      ],
    },
    {
      title: "반복 검증 로직을 함수로 빼는 순서",
      prompt:
        "이름 입력 검증이 제출 버튼과 자동 검증 둘 다에서 반복됩니다. 이를 <code>validateName</code> 함수로 뺀다고 가정하고 순서를 맞춰보세요.",
      success:
        "중복 규칙을 먼저 보고, 함수의 역할과 입력값을 정한 뒤, 구현하고 교체하는 절차를 잘 잡았습니다.",
      retry:
        "함수화는 ‘중복 규칙 찾기 -> 함수 이름/반환값 정하기 -> 받을 값 정하기 -> 함수 만들기 -> 기존 코드를 호출로 바꾸기’ 흐름으로 기억하면 덜 헷갈립니다.",
      target: [
        "반복되는 검증 규칙을 찾는다.",
        "함수 이름과 반환 타입을 정한다.",
        "함수에 전달할 입력값을 정한다.",
        "새 검증 함수를 만든다.",
        "기존 중복 코드를 함수 호출로 교체한다.",
      ],
      initial: [
        "함수에 전달할 입력값을 정한다.",
        "기존 중복 코드를 함수 호출로 교체한다.",
        "반복되는 검증 규칙을 찾는다.",
        "새 검증 함수를 만든다.",
        "함수 이름과 반환 타입을 정한다.",
      ],
    },
  ],
  retrievalQuestions: [
    {
      id: "r1",
      prompt: "프로필 썸네일 + 이름 + 직책 조합이 세 화면에서 거의 똑같이 반복된다.",
      answer: "widget",
      explanation: "같은 화면 덩어리가 반복되므로 새 위젯으로 빼는 게 자연스럽습니다.",
    },
    {
      id: "r2",
      prompt: "나이 입력값이 비었는지, 숫자인지 검사하는 규칙을 여러 제출 흐름에서 쓴다.",
      answer: "function",
      explanation: "검증은 행동 규칙이므로 함수화가 더 잘 맞습니다.",
    },
    {
      id: "r3",
      prompt: "딱 한 번 쓰이는 SizedBox(height: 12) 한 줄이 있다.",
      answer: "leave",
      explanation: "반복도 없고 의미 있는 추출 단위도 아니므로 그대로 두는 편이 낫습니다.",
    },
    {
      id: "r4",
      prompt: "사용자 나이를 받아 '미입력', '7세', '성인'으로 바꾸는 규칙을 여러 화면에서 쓴다.",
      answer: "function",
      explanation: "표현 규칙과 계산을 재사용하므로 함수화가 적합합니다.",
    },
    {
      id: "r5",
      prompt: "아이콘, 제목, 설명으로 이루어진 안내 카드가 값만 바뀌며 네 번 반복된다.",
      answer: "widget",
      explanation: "형태가 같은 UI가 여러 번 반복되는 경우라 위젯화가 잘 맞습니다.",
    },
    {
      id: "r6",
      prompt: "지금 화면에서만 쓰는 const Divider(height: 24) 한 줄이 있다.",
      answer: "leave",
      explanation: "이 단계에서는 과한 분리보다 그대로 두는 게 더 단순합니다.",
    },
  ],
};
