import type { AuthoredTermEntry } from "@/types/terms";

export const baseTerms: AuthoredTermEntry[] = [
  {
    id: "base-001",
    term: "StatelessWidget",
    category: "widget",
    quizPrompt:
      "상태를 직접 가지지 않고, 입력값이 같으면 같은 UI를 설명할 때 쓰는 Flutter 기본 위젯 클래스는?",
    description: "상태를 직접 저장하지 않는 불변 위젯의 대표적인 기본 클래스다.",
  },
  {
    id: "base-002",
    term: "StatefulWidget",
    category: "widget",
    quizPrompt:
      "사용자 입력이나 화면 상태 변화에 따라 UI가 다시 바뀌는 위젯을 만들 때 보통 상속하는 클래스는?",
    description: "내부 상태 변화에 따라 다시 그릴 수 있는 위젯을 만들 때 쓰는 기본 클래스다.",
  },
  {
    id: "base-003",
    term: "BuildContext",
    category: "widget",
    quizPrompt:
      "위젯 트리에서 현재 위치 정보를 담고 있고, Theme.of(...) 같은 접근에 쓰는 객체 이름은?",
    description: "위젯이 트리에서 어디에 있는지 나타내며 상위 위젯 정보에 접근할 때 자주 사용한다.",
  },
  {
    id: "base-004",
    term: "setState",
    category: "state",
    quizPrompt: "StatefulWidget의 화면을 다시 그리도록 알릴 때 호출하는 메서드는?",
    description: "State 객체 안에서 상태가 바뀌었음을 알리고 위젯을 다시 빌드하게 만든다.",
  },
  {
    id: "base-005",
    term: "Column",
    category: "layout",
    quizPrompt: "자식 위젯을 세로 방향으로 배치하는 Flutter 레이아웃 위젯은?",
    description: "자식들을 위에서 아래로 쌓는 세로 레이아웃 위젯이다.",
  },
  {
    id: "base-006",
    term: "Row",
    category: "layout",
    quizPrompt: "자식 위젯을 가로 방향으로 배치하는 Flutter 레이아웃 위젯은?",
    description: "자식들을 왼쪽에서 오른쪽으로 배치하는 가로 레이아웃 위젯이다.",
  },
  {
    id: "base-007",
    term: "Expanded",
    category: "layout",
    quizPrompt: "Row나 Column 안에서 남은 공간을 차지하도록 자식을 확장할 때 쓰는 위젯은?",
    description: "Flex 계열 레이아웃에서 남는 공간을 나눠 차지하게 할 때 사용한다.",
  },
  {
    id: "base-008",
    term: "Container",
    category: "style",
    quizPrompt: "배경색, 여백, 크기, 장식까지 한 번에 자주 감싸는 기본 박스형 위젯은?",
    description:
      "크기, 패딩, 배경, 장식 등을 한 번에 다루기 좋아 가장 자주 쓰이는 박스 위젯 중 하나다.",
  },
  {
    id: "base-009",
    term: "decoration",
    category: "style",
    quizPrompt:
      "Container에서 배경, 테두리, 그림자 같은 시각 스타일을 넣을 때 사용하는 속성 이름은?",
    description: "Container에 BoxDecoration 같은 장식 객체를 연결하는 속성이다.",
  },
  {
    id: "base-010",
    term: "BoxDecoration",
    category: "style",
    quizPrompt:
      "Container의 decoration에 넣어 배경색, borderRadius, boxShadow를 설정할 때 대표적으로 쓰는 클래스는?",
    description: "색상, 테두리, 모서리, 그림자, 그라디언트 같은 박스 장식을 정의하는 클래스다.",
  },
  {
    id: "base-011",
    term: "borderRadius",
    category: "style",
    quizPrompt: "모서리를 둥글게 만들 때 BoxDecoration 안에서 사용하는 속성 이름은?",
    description: "박스의 둥근 모서리 정도를 지정할 때 사용하는 속성이다.",
  },
  {
    id: "base-012",
    term: "BoxShadow",
    category: "style",
    quizPrompt: "박스 그림자 효과를 줄 때 BoxDecoration 안에서 사용하는 클래스는?",
    description: "박스에 그림자 깊이와 번짐을 주고 싶을 때 사용하는 클래스다.",
  },
  {
    id: "base-013",
    term: "Navigator",
    category: "navigation",
    quizPrompt: "화면 이동 push/pop 스택을 관리하는 Flutter 내비게이션 객체 이름은?",
    description: "페이지 이동 기록을 스택으로 관리하는 기본 내비게이션 API다.",
  },
  {
    id: "base-014",
    term: "Navigator.push",
    category: "navigation",
    quizPrompt: "새 화면을 현재 화면 위에 쌓아서 이동할 때 가장 기본적으로 호출하는 메서드는?",
    description: "새 페이지를 네비게이션 스택 위에 추가해 앞으로 이동시킨다.",
  },
  {
    id: "base-015",
    term: "Navigator.pop",
    category: "navigation",
    quizPrompt: "현재 화면을 닫고 이전 화면으로 돌아갈 때 호출하는 메서드는?",
    description: "현재 페이지를 스택에서 제거하며 이전 화면으로 돌아간다.",
  },
  {
    id: "base-016",
    term: "MaterialPageRoute",
    category: "navigation",
    quizPrompt:
      "Navigator.push와 함께 머티리얼 스타일의 새 페이지 경로를 만들 때 자주 쓰는 클래스는?",
    description: "머티리얼 전환 애니메이션과 함께 새 페이지 라우트를 만들 때 많이 사용한다.",
  },
  {
    id: "base-017",
    term: "pubspec.yaml",
    category: "project",
    quizPrompt: "패키지 의존성, assets, fonts 설정을 적는 Flutter 프로젝트 핵심 파일 이름은?",
    description: "프로젝트 메타데이터와 패키지 의존성, 에셋 설정을 관리하는 핵심 파일이다.",
  },
  {
    id: "base-018",
    term: "Hot Reload",
    category: "tooling",
    quizPrompt: "앱 상태를 최대한 유지한 채 코드 변경을 빠르게 반영하는 개발 기능 이름은?",
    description: "개발 중 코드를 저장했을 때 전체 재실행 없이 빠르게 UI를 반영해 주는 기능이다.",
  },
];

export const moduleAExtraTerms: AuthoredTermEntry[] = [
  {
    id: "modulea-extra-001",
    term: "Scaffold",
    category: "screen",
    quizPrompt:
      "appBar, body, floatingActionButton 같은 기본 화면 골격을 잡을 때 가장 자주 쓰는 머티리얼 화면 위젯은?",
    description: "Flutter에서 한 화면의 기본 뼈대를 잡을 때 많이 쓴다.",
  },
  {
    id: "modulea-extra-002",
    term: "SafeArea",
    category: "layout",
    quizPrompt: "노치, 상태바, 홈 인디케이터 영역을 피해 안전하게 UI를 배치할 때 쓰는 위젯은?",
    description: "기기 가장자리의 위험 영역을 피해 콘텐츠를 배치한다.",
  },
  {
    id: "modulea-extra-003",
    term: "Stack",
    category: "layout",
    quizPrompt:
      "배경, 달 이미지, 로고, 버튼처럼 여러 요소를 겹쳐 배치할 때 자주 쓰는 레이아웃 위젯은?",
    description: "자식 위젯을 위아래로 겹쳐 쌓을 때 쓴다.",
  },
  {
    id: "modulea-extra-004",
    term: "Positioned",
    category: "layout",
    quizPrompt: "Stack 안에서 자식의 top, bottom, left, right 위치를 지정할 때 쓰는 위젯은?",
    description: "겹쳐진 레이아웃에서 정확한 위치를 줄 때 사용한다.",
  },
  {
    id: "modulea-extra-005",
    term: "Image.asset",
    category: "asset",
    quizPrompt:
      "assets 폴더에 있는 달, 구름, 로고 같은 이미지를 화면에 표시할 때 자주 쓰는 생성자는?",
    description: "프로젝트에 포함된 로컬 이미지를 불러온다.",
  },
  {
    id: "modulea-extra-006",
    term: "LinearGradient",
    category: "style",
    quizPrompt: "두 개 이상의 색이 자연스럽게 이어지는 배경을 만들 때 쓰는 Flutter 클래스는?",
    description: "그라디언트 배경을 만들 때 자주 사용한다.",
  },
  {
    id: "modulea-extra-007",
    term: "TextField",
    category: "input",
    quizPrompt: "이름이나 나이처럼 사용자가 직접 값을 입력하는 가장 기본적인 Flutter 입력 위젯은?",
    description: "한 줄 또는 여러 줄 텍스트 입력을 받는다.",
  },
  {
    id: "modulea-extra-008",
    term: "TextEditingController",
    category: "input",
    quizPrompt: "TextField의 현재 입력값을 코드에서 읽거나 바꾸고 싶을 때 연결하는 객체는?",
    description: "입력창의 텍스트 상태를 제어한다.",
  },
  {
    id: "modulea-extra-009",
    term: "InputDecoration",
    category: "input",
    quizPrompt:
      "TextField의 placeholder, border, prefixIcon 같은 시각 요소를 설정할 때 쓰는 클래스는?",
    description: "입력창의 꾸밈 정보를 담는 클래스다.",
  },
  {
    id: "modulea-extra-010",
    term: "hintText",
    category: "input",
    quizPrompt:
      "TextField에서 사용자가 입력하기 전에 흐리게 보이는 안내 문구를 넣을 때 사용하는 속성 이름은?",
    description: "placeholder 문자열을 지정하는 데 쓴다.",
  },
  {
    id: "modulea-extra-011",
    term: "maxLength",
    category: "validation",
    quizPrompt: "입력 가능한 글자 수의 최대값을 제한할 때 자주 사용하는 속성 이름은?",
    description: "최대 입력 길이를 제한한다.",
  },
  {
    id: "modulea-extra-012",
    term: "onSubmitted",
    category: "input",
    quizPrompt:
      "사용자가 키보드의 Enter 또는 Done 버튼을 눌렀을 때 호출되는 TextField 콜백 속성은?",
    description: "제출 시점에 동작을 연결할 수 있다.",
  },
  {
    id: "modulea-extra-013",
    term: "TextInputType.number",
    category: "input",
    quizPrompt: "나이 입력처럼 숫자 중심 키보드를 띄우고 싶을 때 keyboardType에 자주 넣는 값은?",
    description: "숫자 입력에 맞는 키보드를 띄운다.",
  },
  {
    id: "modulea-extra-014",
    term: "inputFormatters",
    category: "validation",
    quizPrompt: "TextField에서 허용 문자 규칙을 적용하기 위해 formatter 목록을 넣는 속성 이름은?",
    description: "입력 도중 문자 규칙을 강제할 수 있다.",
  },
  {
    id: "modulea-extra-016",
    term: "TextInputAction.done",
    category: "input",
    quizPrompt: "키보드의 액션 버튼을 완료 형태로 표시하고 싶을 때 자주 쓰는 값은?",
    description: "키보드 우측 하단 액션 라벨을 제어한다.",
  },
  {
    id: "modulea-extra-017",
    term: "Form",
    category: "validation",
    quizPrompt: "여러 입력값을 한 번에 묶어 검증 흐름을 관리할 때 자주 감싸는 Flutter 위젯은?",
    description: "입력 필드들을 하나의 폼으로 관리한다.",
  },
  {
    id: "modulea-extra-018",
    term: "validator",
    category: "validation",
    quizPrompt:
      "입력값이 조건을 만족하는지 검사하는 로직을 넣을 때 FormField 계열에서 사용하는 속성 이름은?",
    description: "유효하지 않으면 오류 문자열을 반환한다.",
  },
  {
    id: "modulea-extra-019",
    term: "IconButton",
    category: "interaction",
    quizPrompt: "이전 화면으로 돌아가는 화살표처럼 아이콘만 있는 버튼을 만들 때 자주 쓰는 위젯은?",
    description: "아이콘 중심 액션 버튼을 만들 때 쓴다.",
  },
  {
    id: "modulea-extra-022",
    term: "CalendarDatePicker",
    category: "dateTime",
    quizPrompt: "달력 UI를 직접 화면에 보여주며 날짜를 선택받을 때 자주 쓰는 Flutter 위젯은?",
    description: "인라인 달력 선택 UI를 만들 때 유용하다.",
  },
  {
    id: "modulea-extra-023",
    term: "DateTime",
    category: "dateTime",
    quizPrompt: "날짜와 시간을 코드에서 표현할 때 쓰는 Dart의 기본 클래스는?",
    description: "년, 월, 일, 시, 분 등의 값을 다룬다.",
  },
  {
    id: "modulea-extra-024",
    term: "ToggleButtons",
    category: "selection",
    quizPrompt:
      "AM / PM처럼 몇 가지 선택지 중 하나를 토글 방식으로 고르게 만들 때 자주 쓰는 위젯은?",
    description: "여러 선택지를 버튼 묶음으로 표현한다.",
  },
  {
    id: "modulea-extra-031",
    term: "resizeToAvoidBottomInset",
    category: "keyboard",
    quizPrompt:
      "Scaffold에서 키보드가 올라올 때 body 전체가 자동으로 밀려 올라가는 동작을 제어하는 속성 이름은?",
    description:
      "Scaffold의 키보드 대응 방식을 제어하는 속성이다. false로 두면 키보드가 올라와도 body가 자동으로 다시 배치되지 않게 할 수 있다.",
  },
  {
    id: "modulea-extra-032",
    term: "autovalidateMode",
    category: "validation",
    quizPrompt:
      "FormField 계열에서 제출 버튼을 누르기 전에도 자동으로 검증을 돌릴지 정하는 속성 이름은?",
    description:
      "입력 필드가 언제 자동 검증될지 정하는 속성이다. 폼 제출 시점 외에도 사용자 입력 과정에서 오류를 보여줄 수 있다.",
  },
  {
    id: "modulea-extra-033",
    term: "AutovalidateMode.onUserInteraction",
    category: "validation",
    quizPrompt:
      "사용자가 필드를 건드린 뒤부터 자동 검증과 오류 표시가 시작되게 할 때 autovalidateMode에 넣는 대표 값은?",
    description:
      "사용자 상호작용 이후부터 validator가 동작하게 만드는 설정값이다. 처음부터 바로 에러를 띄우지 않고, 사용자가 입력을 시작한 뒤 검증을 보여주고 싶을 때 쓴다.",
  },
];

export const moduleAAddedTerms2: AuthoredTermEntry[] = [
  {
    id: "modulea-extra-034",
    term: "SvgPicture.asset",
    category: "asset",
    quizPrompt:
      "flutter_svg 패키지에서 asset에 들어 있는 SVG 파일을 화면에 표시할 때 자주 쓰는 생성자는?",
    description:
      "SVG 에셋을 렌더링할 때 사용하는 대표적인 생성자다. PNG/JPG 같은 일반 비트맵 이미지와는 다르게 flutter_svg 패키지가 필요하다.",
  },
  {
    id: "modulea-extra-035",
    term: "Image",
    category: "asset",
    quizPrompt: "PNG, JPG 같은 이미지를 화면에 표시할 때 쓰는 Flutter 기본 이미지 위젯 클래스는?",
    description: "Flutter에서 이미지를 보여줄 때 사용하는 기본 위젯 클래스다.",
  },
  {
    id: "modulea-extra-036",
    term: "Image.asset",
    category: "asset",
    quizPrompt: "assets 폴더에 있는 로컬 이미지를 가장 간단하게 바로 표시할 때 자주 쓰는 생성자는?",
    description: "프로젝트에 포함된 asset 이미지를 빠르게 보여줄 때 자주 사용한다.",
  },
  {
    id: "modulea-extra-037",
    term: "AssetImage",
    category: "asset",
    quizPrompt:
      "Image(image: ...) 형태로 로컬 asset 이미지를 공급할 때 사용하는 이미지 provider 클래스는?",
    description: "asset 경로를 기반으로 이미지를 불러오는 ImageProvider 클래스다.",
  },
  {
    id: "modulea-extra-038",
    term: "width",
    category: "size",
    quizPrompt: "위젯이나 이미지의 가로 크기를 지정할 때 사용하는 가장 기본적인 속성 이름은?",
    description: "가로 길이를 지정할 때 사용하는 기본 속성 이름이다.",
  },
  {
    id: "modulea-extra-039",
    term: "height",
    category: "size",
    quizPrompt: "위젯이나 이미지의 세로 크기를 지정할 때 사용하는 가장 기본적인 속성 이름은?",
    description: "세로 길이를 지정할 때 사용하는 기본 속성 이름이다.",
  },
];

export const mainBranchRecommendedTerms: AuthoredTermEntry[] = [
  {
    id: "main-extra-001",
    term: "runApp",
    category: "app",
    quizPrompt:
      "Flutter 앱 실행을 시작하면서 루트 위젯을 화면에 붙일 때 main()에서 호출하는 함수는?",
    description: "Flutter 앱의 시작점에서 루트 위젯을 실행할 때 쓰는 함수다.",
  },
  {
    id: "main-extra-002",
    term: "MaterialApp",
    category: "app",
    quizPrompt: "title, theme, home 같은 앱 전역 설정을 감싸는 대표적인 머티리얼 앱 위젯은?",
    description: "Flutter 앱의 전체 뼈대와 테마, 시작 화면을 설정할 때 자주 쓴다.",
  },
  {
    id: "main-extra-003",
    term: "ThemeData",
    category: "theme",
    quizPrompt: "MaterialApp의 theme에 넣어서 앱 전반의 테마를 설정할 때 사용하는 클래스는?",
    description: "색상, 폰트, 머티리얼 스타일 같은 앱 전역 테마를 담는다.",
  },
  {
    id: "main-extra-004",
    term: "ColorScheme.fromSeed",
    category: "theme",
    quizPrompt:
      "seedColor 하나를 기준으로 머티리얼 색상 체계를 만들어낼 때 자주 쓰는 팩토리 생성자는?",
    description: "시드 컬러를 바탕으로 ColorScheme을 손쉽게 생성한다.",
  },
  {
    id: "main-extra-005",
    term: "useMaterial3",
    category: "theme",
    quizPrompt: "ThemeData에서 Material Design 3 스타일을 사용할지 정하는 속성 이름은?",
    description: "머티리얼 3 디자인 시스템 사용 여부를 제어한다.",
  },
  {
    id: "main-extra-006",
    term: "Positioned.fill",
    category: "layout",
    quizPrompt:
      "Stack 안에서 자식을 가능한 영역 전체에 꽉 차게 배치할 때 쓰는 Positioned 생성자는?",
    description: "Stack 내부 자식을 부모 영역 전체에 채우고 싶을 때 사용하는 생성자다.",
  },
  {
    id: "main-extra-007",
    term: "TextFormField",
    category: "input",
    quizPrompt: "validator, autovalidateMode 같은 폼 검증 흐름과 함께 자주 쓰는 입력 위젯은?",
    description: "Form 검증과 함께 쓰기 좋은 텍스트 입력 위젯이다.",
  },
  {
    id: "main-extra-008",
    term: "OutlineInputBorder",
    category: "input",
    quizPrompt:
      "TextFormField나 TextField의 테두리를 외곽선 형태로 만들 때 사용하는 border 클래스는?",
    description: "입력창에 외곽선 테두리를 줄 때 자주 사용하는 InputBorder 구현체다.",
  },
  {
    id: "main-extra-009",
    term: "EdgeInsets.fromLTRB",
    category: "layout",
    quizPrompt: "left, top, right, bottom 값을 각각 지정해서 패딩이나 마진을 줄 때 쓰는 생성자는?",
    description: "네 방향 값을 각각 따로 지정하는 EdgeInsets 생성자다.",
  },
  {
    id: "main-extra-010",
    term: "onFieldSubmitted",
    category: "input",
    quizPrompt: "TextFormField에서 사용자가 입력 완료 후 제출했을 때 호출되는 콜백 속성은?",
    description: "TextFormField에서 엔터나 완료 액션 시점을 처리할 때 쓰는 콜백 속성이다.",
  },
  {
    id: "main-extra-011",
    term: "GestureDetector",
    category: "interaction",
    quizPrompt: "기본 버튼 위젯 대신 임의의 위젯에 탭 제스처를 붙이고 싶을 때 자주 감싸는 위젯은?",
    description: "탭, 드래그 같은 제스처를 감지하기 위해 사용하는 위젯이다.",
  },
  {
    id: "main-extra-012",
    term: "Transform.flip",
    category: "style",
    quizPrompt: "위젯을 좌우 또는 상하로 뒤집어서 표시하고 싶을 때 쓰는 Transform 생성자는?",
    description: "아이콘이나 이미지를 반전해서 보여줄 때 편하게 쓸 수 있는 Transform 생성자다.",
  },
];

export const authoredTermSets = [
  baseTerms,
  moduleAExtraTerms,
  moduleAAddedTerms2,
  mainBranchRecommendedTerms,
];
