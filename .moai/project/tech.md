# Fretly 기술 스택

## 기술 스택 개요

```
┌─────────────────────────────────────────────────────────────┐
│                     Fretly Tech Stack                       │
├─────────────────────────────────────────────────────────────┤
│  Frontend        │  React 18.3 + TypeScript                 │
│  Routing         │  React Router 7.1                        │
│  State           │  Zustand 5.0 (localStorage 영속성)        │
│  Styling         │  Tailwind CSS 3.4 + shadcn/ui            │
│  Build           │  Vite 6.0                                │
│  Audio           │  Web Audio API + pitchfinder (YIN)       │
│  Platform        │  Capacitor 8.0 (iOS/Android/Web)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 프레임워크 및 라이브러리

### 코어 프레임워크

#### React 18.3.1

**선택 이유**
- 컴포넌트 기반 UI 개발의 업계 표준
- 풍부한 생태계와 커뮤니티 지원
- Concurrent 렌더링으로 부드러운 UX
- Hooks API로 깔끔한 상태 로직 분리

**활용**
- 함수형 컴포넌트 전용
- Custom Hooks로 비즈니스 로직 캡슐화
- StrictMode 활성화로 잠재적 문제 조기 발견

#### TypeScript 5.6

**선택 이유**
- 타입 안전성으로 런타임 오류 감소
- IDE 자동완성 및 리팩토링 지원
- 코드 문서화 효과
- 대규모 프로젝트 유지보수성 향상

**설정 하이라이트**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 라우팅

#### React Router 7.1.0

**선택 이유**
- React 공식 라우팅 솔루션
- 파일 기반 라우팅 지원
- 중첩 라우트 및 레이아웃 시스템
- 타입 안전한 라우트 정의

**라우트 구조**
| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | HomePage | 메인 메뉴, 설정 |
| `/game` | GamePage | 게임 플레이 |

### 상태 관리

#### Zustand 5.0.2

**선택 이유**
- 최소한의 보일러플레이트
- Redux 대비 80% 코드 감소
- TypeScript 친화적 API
- 빌트인 영속성 미들웨어
- 번들 크기 단 1KB

**Redux vs Zustand 비교**
| 항목 | Redux | Zustand |
|------|-------|---------|
| 보일러플레이트 | 높음 | 낮음 |
| 번들 크기 | ~7KB | ~1KB |
| 학습 곡선 | 가파름 | 완만함 |
| DevTools | 필수 | 선택 |
| 영속성 | 별도 설정 | 내장 |

**영속성 설정**
```typescript
// persist 미들웨어로 localStorage 자동 동기화
create(
  persist(
    (set) => ({ ... }),
    { name: 'fretly-storage' }
  )
)
```

### 스타일링

#### Tailwind CSS 3.4.17

**선택 이유**
- 유틸리티 퍼스트로 빠른 개발
- 일관된 디자인 시스템
- 사용하지 않는 CSS 자동 제거 (PurgeCSS)
- 반응형 디자인 용이

**커스텀 설정**
- 다크 모드 지원 (class 전략)
- 커스텀 컬러 팔레트
- 폰트 시스템 확장

#### shadcn/ui

**선택 이유**
- 복사-붙여넣기 방식의 컴포넌트 라이브러리
- Radix UI 기반의 접근성 준수
- 완전한 커스터마이징 가능
- Tailwind CSS와 완벽 통합

**사용 컴포넌트**
| 컴포넌트 | 용도 |
|----------|------|
| Button | 모드 선택, 액션 버튼 |
| Card | 설정 패널, 정보 카드 |
| Slider | 타이머 시간 조절 |
| Switch | 임시표 토글 |

### 빌드 도구

#### Vite 6.0.3

**선택 이유**
- 네이티브 ESM으로 즉각적인 HMR
- esbuild 기반 초고속 번들링
- 설정 최소화 (Zero-config)
- 플러그인 생태계

**Create React App 대비**
| 항목 | CRA | Vite |
|------|-----|------|
| 콜드 스타트 | 30s+ | <1s |
| HMR | 느림 | 즉각적 |
| 빌드 속도 | 느림 | 10x 빠름 |
| 설정 | 숨겨짐 | 투명함 |

**플러그인**
- `@vitejs/plugin-react` - React Fast Refresh
- `vite-tsconfig-paths` - 경로 별칭 지원

### 오디오 처리

#### Web Audio API

**선택 이유**
- 브라우저 네이티브 오디오 처리
- 저레이턴시 실시간 분석
- 마이크 입력 스트림 접근
- 별도 플러그인 불필요

**활용**
- `AudioContext` - 오디오 처리 컨텍스트
- `MediaStreamSource` - 마이크 입력
- `AnalyserNode` - 주파수 분석

#### pitchfinder 2.3.0

**선택 이유**
- YIN 알고리즘 구현체
- 높은 피치 감지 정확도
- 가벼운 번들 크기
- 순수 JavaScript (WASM 불필요)

**YIN 알고리즘**
- 프랑스 IRCAM 연구소 개발
- 단음(monophonic) 피치 감지에 최적화
- 기타, 바이올린 등 악기 튜닝에 적합
- 실시간 처리 가능한 성능

**정확도**
| 주파수 범위 | 정확도 |
|------------|--------|
| 80-400 Hz (기타) | 98%+ |
| 400-1000 Hz | 95%+ |
| 1000+ Hz | 90%+ |

### 크로스 플랫폼

#### Capacitor 8.0.0

**선택 이유**
- Ionic 팀의 공식 크로스플랫폼 솔루션
- 웹 기술 그대로 네이티브 앱 생성
- 네이티브 API 직접 접근
- Cordova 대비 현대적 아키텍처

**Cordova vs Capacitor**
| 항목 | Cordova | Capacitor |
|------|---------|-----------|
| 아키텍처 | 플러그인 | 네이티브 브릿지 |
| iOS 통합 | CocoaPods | Swift PM |
| 유지보수 | 어려움 | 용이 |
| 웹 뷰 | UIWebView | WKWebView |

**플랫폼 지원**
| 플랫폼 | 패키지 | 버전 |
|--------|--------|------|
| Core | @capacitor/core | 8.0.0 |
| iOS | @capacitor/ios | 8.0.0 |
| Android | @capacitor/android | 8.0.0 |

---

## 개발 환경 요구사항

### 필수 도구

| 도구 | 최소 버전 | 권장 버전 | 용도 |
|------|----------|----------|------|
| Node.js | 18.x | 20.x LTS | 런타임 |
| npm | 9.x | 10.x | 패키지 관리 |
| Git | 2.30 | 최신 | 버전 관리 |

### 플랫폼별 추가 요구사항

**iOS 개발**
| 도구 | 버전 | 비고 |
|------|------|------|
| macOS | 13+ | Ventura 이상 |
| Xcode | 15+ | App Store에서 설치 |
| CocoaPods | 1.14+ | `gem install cocoapods` |

**Android 개발**
| 도구 | 버전 | 비고 |
|------|------|------|
| Android Studio | Hedgehog+ | 공식 사이트에서 설치 |
| JDK | 17+ | Android Studio 포함 |
| Android SDK | 34 | SDK Manager에서 설치 |

### IDE 권장 설정

**VS Code 확장**
- ESLint - 코드 품질
- Prettier - 코드 포맷팅
- Tailwind CSS IntelliSense - 클래스 자동완성
- TypeScript Hero - 임포트 관리

---

## 빌드 및 배포

### 개발 서버

```bash
# 개발 서버 시작 (HMR 활성화)
npm run dev

# 접속: http://localhost:5173
```

### 프로덕션 빌드

```bash
# 웹 빌드
npm run build

# 출력: dist/
```

### 모바일 빌드

```bash
# iOS/Android 동기화
npm run cap:build    # build + cap sync

# iOS 열기
npm run cap:ios      # npx cap open ios

# Android 열기
npm run cap:android  # npx cap open android
```

### 빌드 스크립트

| 스크립트 | 명령어 | 설명 |
|----------|--------|------|
| `dev` | `vite` | 개발 서버 |
| `build` | `tsc -b && vite build` | 프로덕션 빌드 |
| `preview` | `vite preview` | 빌드 결과 미리보기 |
| `lint` | `eslint .` | 코드 린팅 |
| `cap:build` | `npm run build && npx cap sync` | 모바일 빌드 |
| `cap:ios` | `npx cap open ios` | Xcode 열기 |
| `cap:android` | `npx cap open android` | Android Studio 열기 |

---

## 성능 최적화

### 번들 최적화

**코드 스플리팅**
- React.lazy()로 페이지 단위 분할
- 동적 임포트로 필요 시 로드

**트리 쉐이킹**
- Vite의 ESM 기반 자동 제거
- lodash-es 등 ESM 버전 사용

### 런타임 최적화

**React 최적화**
- useMemo, useCallback 적절히 사용
- React.memo로 불필요한 리렌더링 방지

**오디오 최적화**
- AudioWorklet 고려 (추후)
- 샘플링 레이트 최적화

---

## 의존성 목록

### 프로덕션 의존성

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.0",
  "zustand": "^5.0.2",
  "pitchfinder": "^2.3.0",
  "lucide-react": "^0.468.0",
  "@capacitor/core": "^8.0.0",
  "@capacitor/android": "^8.0.0",
  "@capacitor/ios": "^8.0.0"
}
```

### 개발 의존성

```json
{
  "typescript": "~5.6.2",
  "vite": "^6.0.3",
  "@vitejs/plugin-react": "^4.3.4",
  "tailwindcss": "^3.4.17",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.49",
  "@types/react": "^18.3.17",
  "@types/react-dom": "^18.3.5",
  "eslint": "^9.17.0"
}
```

---

## 보안 고려사항

### 권한

| 권한 | 플랫폼 | 용도 |
|------|--------|------|
| Microphone | iOS, Android, Web | 피치 감지 |
| Wake Lock | Web | 화면 꺼짐 방지 |

### 데이터 저장

- 로컬 스토리지만 사용 (서버 통신 없음)
- 개인정보 수집 없음
- 오프라인 완전 지원

---

## 향후 기술 고려사항

### 검토 중인 기술

| 기술 | 목적 | 우선순위 |
|------|------|----------|
| AudioWorklet | 오디오 처리 성능 | 중간 |
| WebAssembly | 피치 감지 속도 | 낮음 |
| Service Worker | 오프라인 지원 강화 | 높음 |
| IndexedDB | 학습 기록 저장 | 중간 |

---

*기술 스택에 대한 제안이나 질문은 이슈로 등록해주세요.*
