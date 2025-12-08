# Product Requirements Document (PRD): Fretly

## 1. Project Overview
* **Project Name:** Fretly
* **Description:** 기타 지판(Fretboard)의 음계 위치를 암기하기 위한 웹 기반 트레이닝 도구. 사용자의 기타 소리를 인식하여 정답을 체크하거나, 소리 없이 눈으로 학습하는 모드를 제공한다.

* **Target User:** 기타 입문자 및 지판 암기가 필요한 연주자
* **Key Constraint:**
    * **Serverless:** 별도의 백엔드 서버 없이 브라우저 내에서 모든 로직 처리.
    * **Audio Input:** Web Audio API를 활용한 마이크 입력 및 피치 감지(Pitch Detection).

## 2. Core Features (Game Modes)

### Mode A: Listening Challenge (Interactive)
* **개요:** 앱이 제시한 문제를 보고 사용자가 실제 기타를 연주하면, 소리를 분석하여 정답 여부를 판별하는 모드.
* **Flow:**
    1. 문제 제시 (예: "3번줄 - C")
    2. 마이크 리스닝 활성화 (Visual Feedback: 마이크 아이콘 애니메이션)
    3. 사용자 연주 -> Pitch 분석
    4. **정답:** "딩동댕" 효과음 + 화면 녹색 점멸 -> 점수 획득 -> 즉시 다음 문제
    5. **실패/Time Over:** "땡" 효과음 -> 정답 위치(Fret 번호) 표시 -> [다음] 버튼 터치 시 이동

### Mode B: Image Training (Auto-Flow)
* **개요:** 악기 없이 눈으로 위치를 떠올리고, 일정 시간 후 정답을 확인하며 반복 학습하는 모드.
* **Flow:**
    1. 문제 제시 (예: "6번줄 - G")
    2. **Thinking Time:** 설정된 시간(예: 3초) 동안 대기 (타이머 바 감소)
    3. **Reveal:** 시간이 되면 정답 위치(Fret 번호)와 지판 이미지를 표시.
    4. **Auto Next:** 정답 표시 후 잠시(예: 1.5초) 대기했다가 자동으로 다음 문제로 넘어감.
* **특징:** 채점 로직 없음. 마이크 권한 불필요.

## 3. UI/UX Requirements

### 3.1. Main Screen (Settings & Start)
사용자는 학습 범위와 난이도를 설정하고 시작한다. 설정 값은 `localStorage`에 저장되어야 한다.

1.  **String Selection (Checkboxes):**
    * 1번줄 ~ 6번줄 (Default: All Checked)
    * 사용자가 원하는 줄만 선택하여 연습 가능.
2.  **Note Filter (Toggle/Checkbox):**
    * **"반음(#/b) 포함"** (Default: OFF)
    * OFF일 경우: Natural Notes (C, D, E, F, G, A, B)만 출제.
    * ON일 경우: Sharps/Flats를 포함한 12음계 모두 출제.
3.  **Timer Setting (Slider):**
    * 문제당 제한 시간 (Range: 2s ~ 15s / Default: 5s)
4.  **Mode Start Buttons:**
    * [Start Listening Challenge 🎤]
    * [Start Image Training 👁️]
5.  **Stats:** 하단에 'Listening Challenge'의 최고 연속 정답 기록(Best Streak) 표시.

### 3.2. Game Screen
* **Top:**
    * Current Streak (현재 연속 정답 수 - Mode A only)
    * Time Progress Bar (남은 시간 시각화)
* **Center:**
    * **Quiz Text:** 매우 큰 폰트로 표시 (예: **5번줄 F#**)
    * **Feedback Area:**
        * 대기 중: "Listening..." (Mode A) / "Think..." (Mode B)
        * 결과 화면: 정답 Fret 번호 표시 (예: **"9번 프렛"**).
* **Bottom:**
    * [Stop / Main Menu] 버튼 (작게 배치)

### 3.3. Result Logic (Feedback)
* **Correct:** 화면 전체가 부드러운 초록색으로 깜빡임. 긍정적 효과음.
* **Incorrect:** 화면 전체가 붉은색 틴트. 부정적 효과음. 정답 위치를 시각적으로 명확히 강조.

## 4. Technical Specifications & Logic

### 4.1. Random Question Generator
* **Input:** 활성화된 줄(Strings), 반음 포함 여부(Accidentals).
* **Process:**
    1.  선택된 줄 중에서 하나를 랜덤 선택.
    2.  선택된 줄의 0~12 프렛 사이 음계 중 하나를 랜덤 선택.
        * *Condition:* '반음 포함'이 OFF면 #/b이 붙은 음은 제외.
    3.  **No Repeat:** 직전 문제와 동일한 문제(같은 줄 & 같은 음)는 나오지 않도록 필터링.

### 4.2. Audio Processing (Mode A)
* **Library Suggestion:** `Pitchfinder` or similar lightweight JS library.
* **Tolerance:**
    * 기타 튜닝 오차를 고려하여 Target Frequency ±N Hz 범위 인정.
    * **Octave Insensitive:** 옥타브가 달라도 Note Name(Pitch Class)이 같으면 정답 처리. (예: 낮은 E와 높은 E 모두 정답)
* **Sampler Rate:** 모바일 브라우저 호환성을 위해 표준 AudioContext 설정 준수.

### 4.3. Data Persistence (Local Storage)
* **Key:** `guitar_trainer_settings`
    * Selected Strings (Array)
    * Include Accidentals (Boolean)
    * Timer Duration (Number)
* **Key:** `guitar_trainer_best_streak`
    * Max Score (Number)

### 4.4. Additional Requirements
* **Wake Lock:** 연습 중 화면이 꺼지지 않도록 `Navigator.wakeLock` API 사용 (지원 브라우저의 경우).
* **Responsive Design:** 모바일 세로 모드(Portrait)에 최적화.