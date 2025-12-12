# Fretly 구현 단계

LLM Agent가 효율적으로 처리할 수 있도록 기능 단위로 분리한 구현 계획입니다.
각 Step은 독립적으로 테스트 가능하며, 이전 Step 완료 후 진행합니다.

---

## Step 1: HomePage UI 완성
**목표:** 설정 화면 UI를 완성하고 Zustand store와 연동

**작업 내용:**
- [x] String 선택 토글 버튼 컴포넌트 구현 (원형 버튼, 디자인 스펙 반영)
- [x] Switch 컴포넌트로 반음 포함 토글 연동
- [x] Slider 컴포넌트로 타이머 설정 연동
- [x] Store actions 연결 (toggleString, setIncludeAccidentals, setTimerDuration)
- [x] Best Streak 표시 연동

**수정 파일:**
- `src/pages/HomePage.tsx`
- `src/components/ui/` (필요시 추가 컴포넌트)

**완료 기준:** 설정 변경 시 store 업데이트, 새로고침 후에도 설정 유지

---

## Step 2: 타이머 시스템 구현
**목표:** 게임에서 사용할 타이머 훅 구현

**작업 내용:**
- [x] `useTimer` 훅 생성 (countdown, pause, reset 기능)
- [x] Progress bar와 연동
- [x] 타임아웃 시 콜백 실행

**수정 파일:**
- `src/hooks/useTimer.ts` (신규)
- `src/hooks/index.ts`

**완료 기준:** 타이머 시작/정지/리셋 동작, 0초 도달 시 콜백 호출

---

## Step 3: Mode B (Image Training) 완전 구현
**목표:** 마이크 없이 동작하는 Image Training 모드 완성

**작업 내용:**
- [x] GamePage에서 Mode B 플로우 구현
  - 문제 출제 → Thinking Time → 정답 공개 → Auto Next
- [x] 타이머 연동 (설정된 시간만큼 대기)
- [x] 정답 공개 후 1.5초 대기 → 자동으로 다음 문제
- [x] "Think..." 상태 UI 표시
- [x] 정답 Fret 번호 표시

**수정 파일:**
- `src/pages/GamePage.tsx`
- `src/lib/constants.ts` (FEEDBACK_DELAY_MS 추가)

**완료 기준:** Mode B 버튼 클릭 → 문제 출제 → 타이머 종료 → 정답 표시 → 자동 다음 문제

---

## Step 4: Pitchfinder 오디오 시스템 통합
**목표:** 실제 피치 감지 로직 구현

**작업 내용:**
- [x] `usePitchDetect` 훅에 Pitchfinder YIN 알고리즘 통합
- [x] 감지된 주파수 → Note 변환 로직 검증
- [x] 옥타브 무관 비교 로직 (Pitch Class 비교)
- [x] 노이즈 필터링 (일정 볼륨 이상만 감지)

**수정 파일:**
- `src/hooks/usePitchDetect.ts`
- `src/lib/constants.ts` (MIN_VOLUME_THRESHOLD, MIN/MAX_FREQUENCY 추가)

**완료 기준:** 마이크 입력 → 실시간 Note 감지 → 콘솔에 출력 확인

---

## Step 5: Mode A (Listening Challenge) 완전 구현
**목표:** 마이크 입력으로 정답을 체크하는 모드 완성

**작업 내용:**
- [x] GamePage에서 Mode A 플로우 구현
  - 문제 출제 → 마이크 리스닝 → 정답 감지 시 다음 문제
  - 타임아웃 시 실패 처리
- [x] 마이크 권한 요청 UI/UX
- [x] "Listening..." 상태 + 마이크 아이콘 애니메이션
- [x] Streak 카운트 로직 연동
- [x] 정답 시 즉시 다음 문제, 오답 시 Next 버튼 표시

**수정 파일:**
- `src/pages/GamePage.tsx`

**완료 기준:** 정확한 음 연주 시 정답 처리, 틀린 음/타임아웃 시 오답 처리

---

## Step 6: 피드백 UX 완성
**목표:** 정답/오답 피드백 효과 구현

**작업 내용:**
- [x] 정답 시 화면 녹색 플래시 (300ms)
- [x] 오답 시 화면 빨간색 틴트 + 살짝 흔들림
- [x] 효과음 재생 로직 (Web Audio API 사용)
  - 정답: "딩동댕" 상승 멜로디
  - 오답: "땡" buzzer 사운드
- [x] `useSoundEffect` 훅 구현

**수정 파일:**
- `src/pages/GamePage.tsx`
- `src/hooks/useSoundEffect.ts` (신규)
- `src/hooks/index.ts`

**완료 기준:** 정답/오답 시 시각적 + 청각적 피드백 동작

---

## Step 7: (선택) Fretboard 시각화
**목표:** 정답 위치를 지판 이미지로 표시

**작업 내용:**
- [ ] SVG 기반 Fretboard 컴포넌트 구현
- [ ] 특정 String + Fret 위치 하이라이트
- [ ] 오답 시 정답 위치 표시에 활용

**수정 파일:**
- `src/components/fretboard/Fretboard.tsx`

**완료 기준:** 지정된 String/Fret 위치가 시각적으로 표시됨

---

## Step 8: 최종 마무리
**목표:** 버그 수정 및 UX 개선

**작업 내용:**
- [x] 모바일 반응형 최종 점검
- [x] Edge case 처리 (줄 1개만 선택, 빠른 연타 방지)
- [x] Wake Lock 동작 확인
- [ ] 화면 전환 애니메이션 (선택)
- [x] 접근성(a11y) 점검 (aria 속성 추가)

**수정 파일:**
- `src/pages/GamePage.tsx` (연타 방지, a11y)
- `src/pages/HomePage.tsx` (a11y)

**완료 기준:** 실제 모바일 기기에서 원활하게 동작

---

## 진행 상태

| Step | 상태 | 비고 |
|------|------|------|
| Step 1 | ✅ 완료 | HomePage UI + Store 연동 |
| Step 2 | ✅ 완료 | useTimer 훅 구현 |
| Step 3 | ✅ 완료 | Image Training 모드 구현 |
| Step 4 | ✅ 완료 | Pitchfinder YIN 통합 |
| Step 5 | ✅ 완료 | Listening Challenge 구현 |
| Step 6 | ✅ 완료 | 피드백 UX (시각/청각) |
| Step 7 | ⬜ 대기 | 선택 사항 |
| Step 8 | ✅ 완료 | 최종 마무리 (a11y, edge case) |

---

## 사용법

각 Step을 진행할 때 다음과 같이 지시하세요:

```
Step 1 진행해줘
```

또는 특정 작업만 요청:

```
Step 1에서 String 선택 토글 버튼만 먼저 구현해줘
```
