# Project Specification: Guitar Fret Trainer

## 1. Project Overview
* **Project Name:** Guitar Fret Trainer
* **Description:** 기타 지판(Fretboard)의 음계 위치를 암기하기 위한 웹 기반 트레이닝 도구. 사용자의 기타 소리를 마이크로 인식하여 정답을 체크하거나(Interactive), 소리 없이 눈으로 학습하는 모드(Image Training)를 제공한다.
* **Platform:** Mobile-first Web App (Responsive) -> Capacitor를 통해 Android/iOS 배포 예정.
* **Architecture:** Serverless (Client-side logic only).

## 2. Tech Stack & Versions
LLM은 아래 지정된 버전과 라이브러리를 엄격히 준수하여 코드를 생성해야 한다.

| Category | Technology | Version / Note |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Latest LTS |
| **Framework** | **React** | **v18+** (Functional Components, Hooks only) |
| **Build Tool** | **Vite** | Latest |
| **Language** | **TypeScript** | **v5+** (Strict Mode) |
| **Styling** | **Tailwind CSS** | **v3.4+** |
| **UI Components** | **shadcn/ui** | Radix UI based (Copy-paste component architecture) |
| **Icons** | Lucide React | Latest |
| **State Mngt** | **Zustand** | **v4+** (Use `persist` middleware for localStorage) |
| **Audio Logic** | **Pitchfinder** | Use `YIN` algorithm |
| **Deployment** | Vercel / Capacitor | Static hosting & Native wrapper |

## 3. Directory Structure
`src/` 폴더 내부는 아래 구조를 따른다. Feature-based가 아닌 Layered Architecture를 지향한다.
상세 파일들은 예시를 위한 것이고 폴더 구조만 이대로 따르면 된다.

```text
src/
├── app/                  # App entry, router setup, providers
├── assets/               # Static assets (images, sounds)
├── components/           # Shared UI components
│   ├── ui/               # shadcn/ui components (Button, Card, Slider, etc.)
│   ├── layout/           # Header, Footer, PageWrapper
│   └── fretboard/        # Guitar Fretboard visualizer components (SVG based)
├── hooks/                # Custom React Hooks (Business Logic)
│   ├── useAudio.ts       # AudioContext & Microphone permission handling
│   ├── usePitchDetect.ts # Pitchfinder integration & Note resolution
│   └── useGameLogic.ts   # Quiz generation & scoring logic
├── lib/                  # Utilities & Pure Functions
│   ├── utils.ts          # Tailwind class merger (clsx, tw-merge)
│   ├── music-theory.ts   # Frequency <-> Note conversion, Fret mapping data
│   └── constants.ts      # Game configurations (String frequencies, Colors)
├── pages/                # Page Components (Views)
│   ├── HomePage.tsx      # Settings & Mode Selection
│   ├── GamePage.tsx      # Active Game Interface
│   └── ResultPage.tsx    # Session Summary (Optional)
├── store/                # Global State Management
│   └── useGameStore.ts   # Zustand store for Settings & Game State
└── types/                # TypeScript Interfaces
    └── index.ts          # Shared types (Note, GameMode, Settings)
```
