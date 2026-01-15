# Fretly 프로젝트 구조

## 디렉토리 트리

```
fretly/
├── src/                          # 소스 코드 루트
│   ├── app/                      # 앱 진입점 및 라우팅
│   │   ├── App.tsx              # 메인 앱 컴포넌트
│   │   └── Router.tsx           # React Router 설정
│   │
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── HomePage.tsx         # 홈/메뉴 페이지
│   │   └── GamePage.tsx         # 게임 플레이 페이지
│   │
│   ├── components/               # UI 컴포넌트
│   │   ├── ui/                  # 기본 UI 컴포넌트 (shadcn/ui)
│   │   │   ├── button.tsx      # 버튼 컴포넌트
│   │   │   ├── card.tsx        # 카드 컴포넌트
│   │   │   ├── slider.tsx      # 슬라이더 컴포넌트
│   │   │   └── switch.tsx      # 스위치 컴포넌트
│   │   │
│   │   └── fretboard/           # 지판 시각화 컴포넌트
│   │       └── Fretboard.tsx    # 기타 지판 렌더링
│   │
│   ├── hooks/                    # 커스텀 React 훅
│   │   ├── useAudio.ts          # 오디오 재생 관리
│   │   ├── usePitchDetect.ts    # 피치 감지 (YIN 알고리즘)
│   │   ├── useGameLogic.ts      # 게임 로직 관리
│   │   ├── useTimer.ts          # 타이머 기능
│   │   ├── useSoundEffect.ts    # 효과음 재생
│   │   └── useWakeLock.ts       # 화면 꺼짐 방지
│   │
│   ├── store/                    # 상태 관리
│   │   └── useGameStore.ts      # Zustand 스토어
│   │
│   ├── lib/                      # 유틸리티 및 상수
│   │   ├── music-theory.ts      # 음악 이론 로직
│   │   ├── constants.ts         # 앱 상수 정의
│   │   └── utils.ts             # 일반 유틸리티
│   │
│   ├── types/                    # TypeScript 타입 정의
│   │   └── index.ts             # 공통 타입 내보내기
│   │
│   └── main.tsx                  # 앱 진입점
│
├── public/                       # 정적 파일
│   └── sounds/                  # 효과음 파일
│
├── android/                      # Android 네이티브 프로젝트
├── ios/                          # iOS 네이티브 프로젝트
│
├── .moai/                        # MoAI-ADK 프로젝트 설정
│   ├── config/                  # 설정 파일
│   ├── project/                 # 프로젝트 문서
│   └── specs/                   # SPEC 문서
│
├── capacitor.config.ts           # Capacitor 설정
├── vite.config.ts               # Vite 빌드 설정
├── tailwind.config.js           # Tailwind CSS 설정
├── tsconfig.json                # TypeScript 설정
└── package.json                 # 프로젝트 의존성
```

---

## 주요 디렉토리 설명

### src/app/ - 앱 진입점

앱의 최상위 구조를 담당합니다.

| 파일 | 역할 |
|------|------|
| `App.tsx` | 앱 전체를 감싸는 최상위 컴포넌트, 글로벌 레이아웃 |
| `Router.tsx` | React Router 설정, 페이지 라우팅 정의 |

**라우팅 구조**
- `/` - HomePage (메인 메뉴)
- `/game` - GamePage (게임 플레이)

### src/pages/ - 페이지 컴포넌트

라우트에 매핑되는 페이지 단위 컴포넌트입니다.

| 파일 | 역할 |
|------|------|
| `HomePage.tsx` | 메인 메뉴, 모드 선택, 설정 접근 |
| `GamePage.tsx` | 실제 게임 플레이 화면, 지판 표시 |

### src/components/ - UI 컴포넌트

재사용 가능한 UI 컴포넌트를 포함합니다.

**ui/ 디렉토리**

shadcn/ui 기반의 기본 UI 컴포넌트입니다.

| 컴포넌트 | 용도 |
|----------|------|
| `button.tsx` | 버튼 (Primary, Secondary, Ghost 등) |
| `card.tsx` | 카드 레이아웃 |
| `slider.tsx` | 타이머 설정용 슬라이더 |
| `switch.tsx` | 임시표 토글 스위치 |

**fretboard/ 디렉토리**

기타 지판 시각화를 담당합니다.

| 컴포넌트 | 용도 |
|----------|------|
| `Fretboard.tsx` | 기타 지판 SVG 렌더링, 음계 위치 표시 |

### src/hooks/ - 커스텀 훅

비즈니스 로직과 기능을 캡슐화한 React 훅입니다.

| 훅 | 기능 | 의존성 |
|----|------|--------|
| `useAudio.ts` | 오디오 재생/정지 | Web Audio API |
| `usePitchDetect.ts` | 실시간 피치 감지 | pitchfinder (YIN) |
| `useGameLogic.ts` | 게임 상태, 정답 체크 | useGameStore |
| `useTimer.ts` | 카운트다운 타이머 | - |
| `useSoundEffect.ts` | 정답/오답 효과음 | Web Audio API |
| `useWakeLock.ts` | 화면 꺼짐 방지 | Screen Wake Lock API |

**훅 의존성 다이어그램**

```
useGameLogic
    ├── useGameStore (상태)
    ├── usePitchDetect (Listening Mode)
    ├── useTimer (Image Mode)
    └── useSoundEffect (피드백)
```

### src/store/ - 상태 관리

Zustand 기반의 전역 상태 관리입니다.

| 스토어 | 역할 |
|--------|------|
| `useGameStore.ts` | 게임 설정, 점수, 현재 상태 |

**상태 구조**
```typescript
interface GameState {
  // 설정
  selectedStrings: number[];      // 선택된 줄 (1-6)
  includeAccidentals: boolean;    // 임시표 포함 여부
  timerDuration: number;          // 타이머 시간 (초)

  // 게임 상태
  currentNote: Note | null;       // 현재 문제
  streak: number;                 // 연속 정답
  bestStreak: number;             // 최고 기록
  gameMode: 'listening' | 'image'; // 게임 모드
}
```

**영속성**

- localStorage를 통한 설정 및 최고 기록 자동 저장
- 앱 재시작 시 설정 복원

### src/lib/ - 유틸리티

핵심 로직과 상수를 포함합니다.

| 파일 | 내용 |
|------|------|
| `music-theory.ts` | 음계 계산, 프렛 위치, 주파수 변환 |
| `constants.ts` | 튜닝, 프렛 수, 음계 이름 등 상수 |
| `utils.ts` | cn() 등 일반 유틸리티 함수 |

**music-theory.ts 주요 함수**
- `getNoteAtFret(string, fret)` - 특정 위치의 음계 반환
- `getFrequency(note)` - 음계의 주파수 계산
- `getAllNotes()` - 선택된 줄의 모든 음계 생성

### src/types/ - 타입 정의

TypeScript 타입과 인터페이스를 정의합니다.

```typescript
// 주요 타입 예시
interface Note {
  name: string;        // 'C', 'D#' 등
  octave: number;      // 옥타브 번호
  string: number;      // 줄 번호 (1-6)
  fret: number;        // 프렛 번호 (0-12)
  frequency: number;   // 주파수 (Hz)
}

type GameMode = 'listening' | 'image';
```

---

## 플랫폼별 디렉토리

### android/

Capacitor가 생성한 Android 네이티브 프로젝트입니다.

- Gradle 빌드 시스템
- AndroidManifest.xml (권한 설정)
- 마이크 권한 필요 (Listening Mode)

### ios/

Capacitor가 생성한 iOS 네이티브 프로젝트입니다.

- Xcode 프로젝트 파일
- Info.plist (권한 설정)
- 마이크 권한 필요 (Listening Mode)

---

## 설정 파일

### 빌드 설정

| 파일 | 역할 |
|------|------|
| `vite.config.ts` | Vite 빌드 설정, 플러그인, 경로 별칭 |
| `tsconfig.json` | TypeScript 컴파일러 설정 |
| `tailwind.config.js` | Tailwind CSS 테마, 확장 |

### 플랫폼 설정

| 파일 | 역할 |
|------|------|
| `capacitor.config.ts` | Capacitor 앱 ID, 플러그인 설정 |

### 프로젝트 메타

| 파일 | 역할 |
|------|------|
| `package.json` | 의존성, 스크립트, 메타데이터 |
| `.gitignore` | Git 제외 파일 목록 |

---

## 모듈 구성 원칙

### 1. 기능별 분리

```
hooks/          → 비즈니스 로직
components/     → UI 표현
store/          → 상태 관리
lib/            → 유틸리티
```

### 2. 단방향 의존성

```
pages → components → hooks → store → lib
         ↓
        types
```

### 3. 재사용성 계층

| 계층 | 범위 | 예시 |
|------|------|------|
| **lib/** | 앱 전체 | music-theory, constants |
| **hooks/** | 기능 단위 | useTimer, usePitchDetect |
| **components/ui/** | UI 전체 | Button, Card |
| **components/** | 도메인 | Fretboard |
| **pages/** | 라우트 | HomePage, GamePage |

---

## 파일 네이밍 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `Fretboard.tsx` |
| 훅 | camelCase (use 접두사) | `useGameLogic.ts` |
| 유틸리티 | kebab-case | `music-theory.ts` |
| 타입 | PascalCase (내부) | `types/index.ts` |
| 상수 | SCREAMING_SNAKE_CASE (내부) | `constants.ts` |

---

*구조에 대한 질문이나 개선 제안은 이슈로 등록해주세요.*
