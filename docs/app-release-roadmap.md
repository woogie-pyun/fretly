# Fretly 모바일 앱 출시 로드맵

## 현재 상태
- ✅ 웹앱 개발 완료
- ❌ Capacitor 미설정
- ❌ 앱 아이콘/스플래시 없음
- ❌ PWA manifest 없음

## 목표
- **플랫폼:** Android + iOS 동시 출시
- **앱 아이콘:** 제작 필요

---

## Phase 1: Capacitor 초기 설정

### Step 1.1: 패키지 설치
```bash
npm install @capacitor/core
npm install -D @capacitor/cli
```

### Step 1.2: Capacitor 초기화
```bash
npx cap init "Fretly" "com.fretly.app" --web-dir=dist
```
- `capacitor.config.ts` 파일 생성됨

### Step 1.3: 플랫폼 추가
```bash
# Android
npm install @capacitor/android
npx cap add android

# iOS (Mac 필요)
npm install @capacitor/ios
npx cap add ios
```

---

## Phase 2: 앱 자산 준비

### Step 2.1: 앱 아이콘 생성
필요한 아이콘 크기:
- Android: 48, 72, 96, 144, 192px (mipmap 폴더)
- iOS: 20, 29, 40, 60, 76, 83.5, 1024px
- 권장: 1024x1024 원본 → 자동 리사이즈 도구 사용

**도구 추천:**
- https://www.appicon.co/ (무료, 웹 기반)
- `@capacitor/assets` 플러그인

### Step 2.2: 스플래시 스크린
- Android: 다양한 density (mdpi~xxxhdpi)
- iOS: LaunchScreen.storyboard 또는 이미지

### Step 2.3: PWA Manifest (선택)
```json
// public/manifest.json
{
  "name": "Fretly - Guitar Fretboard Trainer",
  "short_name": "Fretly",
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "display": "standalone",
  "icons": [...]
}
```

---

## Phase 3: 네이티브 기능 설정 (필요시)

### 마이크 권한 (이미 사용 중)
```bash
npm install @capacitor/microphone
```

Android `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

iOS `Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>기타 소리를 인식하기 위해 마이크가 필요합니다</string>
```

---

## Phase 4: 빌드 및 테스트

### Step 4.1: 웹 빌드
```bash
npm run build
```

### Step 4.2: 네이티브 프로젝트 동기화
```bash
npx cap sync
```

### Step 4.3: 네이티브 IDE에서 열기
```bash
# Android Studio
npx cap open android

# Xcode (Mac only)
npx cap open ios
```

### Step 4.4: 디바이스 테스트
- Android: USB 디버깅 또는 에뮬레이터
- iOS: Xcode 시뮬레이터 또는 실제 기기 (Apple Developer 계정 필요)

---

## Phase 5: 스토어 출시 준비

### Android (Google Play Store)

**필요 사항:**
1. Google Play Developer 계정 ($25 일회성)
2. 서명된 APK 또는 AAB 파일
3. 스토어 자산:
   - 앱 아이콘 (512x512)
   - Feature Graphic (1024x500)
   - 스크린샷 (최소 2장)
   - 앱 설명 (한국어/영어)

**빌드 명령:**
```bash
# Android Studio에서
Build > Generate Signed Bundle / APK > Android App Bundle
```

**출시 과정:**
1. Google Play Console 접속
2. 앱 만들기
3. 스토어 등록정보 작성
4. AAB 업로드
5. 검토 제출 (보통 1-3일)

### iOS (App Store)

**필요 사항:**
1. Apple Developer Program 가입 ($99/년)
2. Mac + Xcode
3. App Store Connect 접근
4. 스토어 자산:
   - 앱 아이콘 (1024x1024)
   - 스크린샷 (6.7", 6.5", 5.5" 등)
   - 앱 설명

**출시 과정:**
1. Xcode에서 Archive 빌드
2. App Store Connect에 업로드
3. 메타데이터 작성
4. 검토 제출 (보통 1-7일)

---

## 예상 비용

| 항목 | 비용 |
|------|------|
| Google Play Developer | $25 (일회성) |
| Apple Developer Program | $99/년 |
| **합계** | $124 (첫해) |

---

## 권장 작업 순서 (Android + iOS 동시)

### 사전 준비 (수동)
1. **앱 아이콘 원본 준비** - 1024x1024 PNG 이미지 필요
   - 직접 디자인 또는 AI 도구 (Midjourney, DALL-E 등)
   - https://www.appicon.co/ 로 다양한 크기 자동 생성

2. **개발자 계정 등록**
   - Google Play: $25 일회성 → https://play.google.com/console
   - Apple Developer: $99/년 → https://developer.apple.com

### 구현 단계 (Claude가 도와줄 수 있음)
3. **Capacitor 초기 설정** (Phase 1)
4. **앱 아이콘/스플래시 적용** (Phase 2)
5. **마이크 권한 설정** (Phase 3)
6. **빌드 및 로컬 테스트** (Phase 4)

### 출시 단계 (수동)
7. **Android Studio에서 AAB 빌드 → Play Store 업로드**
8. **Xcode에서 Archive → App Store 업로드**

---

## package.json 스크립트 추가 (권장)

```json
"scripts": {
  "cap:build": "npm run build && npx cap sync",
  "cap:android": "npx cap open android",
  "cap:ios": "npx cap open ios"
}
```
